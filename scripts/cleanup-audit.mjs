import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules']);
const runtimeExt = new Set(['.html','.css','.js','.mjs','.json','.xml','.py']);
const docExt = new Set(['.md','.txt','.yml','.yaml']);
const assetExt = new Set(['.png','.jpg','.jpeg','.webp','.gif','.svg','.ico','.woff','.woff2','.ttf','.mp4','.webm']);
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

const files = walk();
function loadText(exts) {
  const map=new Map();
  for (const f of files) {
    if (auditFiles.has(f) || !exts.has(path.extname(f).toLowerCase())) continue;
    try { map.set(f, fs.readFileSync(path.join(root,f),'utf8')); } catch {}
  }
  return map;
}
const runtimeTexts=loadText(runtimeExt);
const docsTexts=loadText(docExt);

function findRef(asset, texts) {
  const base = path.posix.basename(asset);
  const needles = new Set([
    asset,
    asset.replace(/^assets\//,''),
    asset.replace(/^configurator\//,''),
    asset.replace(/^demo\//,''),
    base
  ]);
  for (const [file, text] of texts) {
    if (file === asset) continue;
    for (const n of needles) if (n && text.includes(n)) return {file, needle:n};
  }
  return null;
}

const assets = files.filter(f => assetExt.has(path.extname(f).toLowerCase()));
const runtimeOrphan=[];
const runtimeUsed=[];
for (const a of assets) {
  const runtimeRef=findRef(a,runtimeTexts);
  const docRef=findRef(a,docsTexts);
  const size=fs.statSync(path.join(root,a)).size;
  (runtimeRef ? runtimeUsed : runtimeOrphan).push({path:a,size,runtimeRef,docRef});
}

const hashes=new Map();
for (const a of assets) {
  const h=crypto.createHash('sha1').update(fs.readFileSync(path.join(root,a))).digest('hex');
  if(!hashes.has(h)) hashes.set(h,[]);
  hashes.get(h).push(a);
}
const duplicates=[...hashes.values()].filter(v=>v.length>1);

console.log('\n=== RUNTIME-ORPHAN ASSETS ===');
for(const x of runtimeOrphan.sort((a,b)=>b.size-a.size)) console.log(`${String(x.size).padStart(10)}  ${x.path}${x.docRef?`  [docs-only: ${x.docRef.file}]`:''}`);
console.log(`TOTAL RUNTIME-ORPHAN: ${runtimeOrphan.length} files / ${runtimeOrphan.reduce((s,x)=>s+x.size,0)} bytes`);

console.log('\n=== DUPLICATE BINARY CONTENT ===');
for(const g of duplicates) console.log(g.join('  ==  '));

console.log('\n=== LARGEST RUNTIME-USED ASSETS ===');
for(const x of runtimeUsed.sort((a,b)=>b.size-a.size).slice(0,40)) console.log(`${String(x.size).padStart(10)}  ${x.path}  <- ${x.runtimeRef.file}`);

console.log('\n=== LEGACY / MAINTENANCE CANDIDATES (runtime refs only) ===');
for (const f of ['assets/css/custommind-v2.css','assets/css/extensions.css','assets/css/modern.css','assets/css/site.css','assets/css/styles.css','assets/js/helpers.js','assets/js/modern.js','assets/js/site.js','meta.json','manifest.json','README-ATUALIZACAO.md','REDESIGN-EXPERIMENT.md','configurator/config.py','configurator/teste.html','configurator/theme.css']) {
  if(!fs.existsSync(path.join(root,f))) continue;
  const base=path.posix.basename(f);
  const refs=[];
  for(const [tf,t] of runtimeTexts) if(tf!==f && (t.includes(f)||t.includes(base))) refs.push(tf);
  console.log(`${f}: ${refs.length ? 'REFERENCED by '+refs.join(', ') : 'NO RUNTIME REFERENCES'}`);
}

console.log('\n=== CONFIGURATOR NESTED TEMPLATE EXTERNAL REFERENCES ===');
for(const f of files.filter(f=>f.startsWith('configurator/templates/templates/') && runtimeExt.has(path.extname(f)))) {
  const base=path.posix.basename(f);
  const refs=[];
  for(const [tf,t] of runtimeTexts) {
    if(tf===f || tf.startsWith('configurator/templates/templates/')) continue;
    if(t.includes(f)||t.includes('templates/templates/'+base)||t.includes(base)) refs.push(tf);
  }
  console.log(`${f}: ${refs.length?refs.join(', '):'NO EXTERNAL RUNTIME REFERENCES'}`);
}
