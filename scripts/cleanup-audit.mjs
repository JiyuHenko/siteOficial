import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules']);
const textExt = new Set(['.html','.css','.js','.mjs','.json','.md','.txt','.xml','.yml','.yaml','.py']);
const assetExt = new Set(['.png','.jpg','.jpeg','.webp','.gif','.svg','.ico','.woff','.woff2','.ttf','.mp4','.webm']);

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
const texts = new Map();
for (const f of files) {
  if (!textExt.has(path.extname(f).toLowerCase())) continue;
  try { texts.set(f, fs.readFileSync(path.join(root,f),'utf8')); } catch {}
}

function referenced(asset) {
  const base = path.posix.basename(asset);
  const noExt = base.replace(/\.[^.]+$/,'');
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
const orphan = [];
const used = [];
for (const a of assets) {
  const ref = referenced(a);
  const size = fs.statSync(path.join(root,a)).size;
  (ref ? used : orphan).push({path:a,size,ref});
}

const hashes = new Map();
for (const a of assets) {
  const buf = fs.readFileSync(path.join(root,a));
  const h = crypto.createHash('sha1').update(buf).digest('hex');
  if (!hashes.has(h)) hashes.set(h,[]);
  hashes.get(h).push(a);
}
const duplicates = [...hashes.values()].filter(v=>v.length>1);

console.log('\n=== ORPHAN ASSETS (no textual reference found) ===');
for (const x of orphan.sort((a,b)=>b.size-a.size)) console.log(`${String(x.size).padStart(10)}  ${x.path}`);
console.log(`TOTAL ORPHAN: ${orphan.length} files / ${orphan.reduce((s,x)=>s+x.size,0)} bytes`);

console.log('\n=== DUPLICATE BINARY CONTENT ===');
for (const g of duplicates) console.log(g.join('  ==  '));

console.log('\n=== LARGEST ASSETS ===');
for (const x of [...orphan,...used].sort((a,b)=>b.size-a.size).slice(0,40)) console.log(`${String(x.size).padStart(10)}  ${x.path}${x.ref ? `  <- ${x.ref.file}` : '  [ORPHAN]'}`);

console.log('\n=== TOP-LEVEL LEGACY CANDIDATES ===');
for (const f of ['assets/css/custommind-v2.css','assets/css/extensions.css','assets/css/modern.css','assets/css/site.css','assets/css/styles.css','assets/js/helpers.js','assets/js/modern.js','assets/js/site.js','meta.json','manifest.json','README-ATUALIZACAO.md','REDESIGN-EXPERIMENT.md','configurator/config.py','configurator/teste.html','configurator/theme.css']) {
  if (!fs.existsSync(path.join(root,f))) continue;
  const base = path.posix.basename(f);
  const refs=[];
  for (const [tf,t] of texts) if (tf !== f && (t.includes(f) || t.includes(base))) refs.push(tf);
  console.log(`${f}: ${refs.length ? 'REFERENCED by '+refs.join(', ') : 'NO REFERENCES'}`);
}
