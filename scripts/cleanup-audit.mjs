import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules']);
const runtimeExt = new Set(['.html','.css','.js','.mjs','.json','.xml','.py']);
const assetExtRe = /\.(?:png|jpe?g|webp|gif|svg|ico|woff2?|ttf|mp4|webm)$/i;
const auditFiles = new Set(['scripts/cleanup-audit.mjs','.github/workflows/cleanup-audit.yml']);

function walk(dir='.') {
  const out=[];
  for (const ent of fs.readdirSync(path.join(root,dir), {withFileTypes:true})) {
    if (skipDirs.has(ent.name)) continue;
    const rel = path.posix.join(dir === '.' ? '' : dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(rel)); else out.push(rel);
  }
  return out;
}
const files=walk();
const fileSet=new Set(files);
const runtimeTexts=new Map();
for(const f of files){
  if(auditFiles.has(f)||!runtimeExt.has(path.extname(f).toLowerCase())) continue;
  try{runtimeTexts.set(f,fs.readFileSync(path.join(root,f),'utf8'));}catch{}
}

function normalizeRef(fromFile, raw){
  let s=raw.trim().replace(/[?#].*$/,'');
  if(!s||s.startsWith('data:')||s.startsWith('blob:')) return null;
  if(/^https?:\/\//i.test(s)){
    try{
      const u=new URL(s);
      if(!['www.custommind.com.br','custommind.com.br'].includes(u.hostname)) return null;
      s=u.pathname;
    }catch{return null;}
  }
  if(s.startsWith('//')) return null;
  if(s.startsWith('/')) s=s.slice(1);
  else s=path.posix.normalize(path.posix.join(path.posix.dirname(fromFile),s));
  while(s.startsWith('../')) s=s.slice(3);
  return s;
}

const exactRefs=new Map();
const candidateRe=/(?:url\(\s*['"]?|["'`])([^"'`()\s<>]+\.(?:png|jpe?g|webp|gif|svg|ico|woff2?|ttf|mp4|webm)(?:[?#][^"'`()\s<>]*)?)/ig;
for(const [f,text] of runtimeTexts){
  for(const m of text.matchAll(candidateRe)){
    const resolved=normalizeRef(f,m[1]);
    if(!resolved||!fileSet.has(resolved)||!assetExtRe.test(resolved)) continue;
    if(!exactRefs.has(resolved)) exactRefs.set(resolved,[]);
    exactRefs.get(resolved).push(f);
  }
}

const assets=files.filter(f=>assetExtRe.test(f));
const orphan=[]; const used=[];
for(const a of assets){
  const size=fs.statSync(path.join(root,a)).size;
  const refs=exactRefs.get(a)||[];
  (refs.length?used:orphan).push({path:a,size,refs});
}

const hashes=new Map();
for(const a of assets){
  const h=crypto.createHash('sha1').update(fs.readFileSync(path.join(root,a))).digest('hex');
  if(!hashes.has(h)) hashes.set(h,[]);
  hashes.get(h).push(a);
}
const duplicates=[...hashes.values()].filter(v=>v.length>1);

console.log('\n=== EXACT RUNTIME-ORPHAN ASSETS ===');
for(const x of orphan.sort((a,b)=>b.size-a.size)) console.log(`${String(x.size).padStart(10)}  ${x.path}`);
console.log(`TOTAL EXACT ORPHAN: ${orphan.length} files / ${orphan.reduce((s,x)=>s+x.size,0)} bytes`);

console.log('\n=== DUPLICATE BINARY CONTENT ===');
for(const g of duplicates) console.log(g.join('  ==  '));

console.log('\n=== LARGEST EXACT RUNTIME-USED ASSETS ===');
for(const x of used.sort((a,b)=>b.size-a.size).slice(0,50)) console.log(`${String(x.size).padStart(10)}  ${x.path}  <- ${[...new Set(x.refs)].join(', ')}`);

console.log('\n=== LEGACY / MAINTENANCE CANDIDATES (exact textual refs) ===');
for (const f of ['assets/css/custommind-v2.css','assets/css/extensions.css','assets/css/modern.css','assets/css/site.css','assets/css/styles.css','assets/js/helpers.js','assets/js/modern.js','assets/js/site.js','meta.json','manifest.json','README-ATUALIZACAO.md','REDESIGN-EXPERIMENT.md','configurator/config.py','configurator/teste.html']) {
  if(!fs.existsSync(path.join(root,f))) continue;
  const refs=[];
  for(const [tf,t] of runtimeTexts) if(tf!==f && (t.includes(f)||t.includes(path.posix.basename(f)))) refs.push(tf);
  console.log(`${f}: ${refs.length ? 'REFERENCED by '+refs.join(', ') : 'NO RUNTIME REFERENCES'}`);
}

console.log('\n=== CONFIGURATOR NESTED TEMPLATE EXTERNAL REFERENCES ===');
for(const f of files.filter(f=>f.startsWith('configurator/templates/templates/') && runtimeExt.has(path.extname(f)))){
  const relFromConfigurator=f.replace(/^configurator\//,'');
  const refs=[];
  for(const [tf,t] of runtimeTexts){
    if(tf===f||tf.startsWith('configurator/templates/templates/')) continue;
    if(t.includes(f)||t.includes(relFromConfigurator)||t.includes('templates/templates/'+path.posix.basename(f))) refs.push(tf);
  }
  console.log(`${f}: ${refs.length?refs.join(', '):'NO EXTERNAL RUNTIME REFERENCES'}`);
}
