import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const runtimeExt=new Set(['.html','.css','.js','.mjs','.json','.xml','.py']);
const assetRe=/\.(?:png|jpe?g|webp|gif|svg|ico|woff2?|ttf|mp4|webm)$/i;
const skipDirs=new Set(['.git','node_modules']);

function walk(dir='.'){
  const out=[];
  for(const ent of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){
    if(skipDirs.has(ent.name)) continue;
    const rel=path.posix.join(dir==='.'?'':dir,ent.name);
    if(ent.isDirectory()) out.push(...walk(rel)); else out.push(rel);
  }
  return out;
}

const files=walk();
const fileSet=new Set(files);

function normalize(fromFile,raw){
  let s=raw.trim().replace(/[?#].*$/,'');
  if(!s||s.startsWith('data:')||s.startsWith('blob:')||s.startsWith('//')) return null;
  if(/^https?:\/\//i.test(s)){
    try{
      const u=new URL(s);
      if(!['custommind.com.br','www.custommind.com.br'].includes(u.hostname)) return null;
      s=u.pathname;
    }catch{return null;}
  }
  if(s.startsWith('/')) return s.slice(1);
  const parts=path.posix.normalize(path.posix.join(path.posix.dirname(fromFile),s)).split('/');
  const clean=[];
  for(const part of parts){
    if(!part||part==='.') continue;
    if(part==='..'){ if(clean.length) clean.pop(); }
    else clean.push(part);
  }
  return clean.join('/');
}

const refs=new Set();
const refRe=/(?:url\(\s*['"]?|["'`])([^"'`()\s<>]+\.(?:png|jpe?g|webp|gif|svg|ico|woff2?|ttf|mp4|webm)(?:[?#][^"'`()\s<>]*)?)/ig;
for(const f of files){
  if(!runtimeExt.has(path.extname(f).toLowerCase())) continue;
  let text='';
  try{text=fs.readFileSync(path.join(root,f),'utf8');}catch{continue;}
  for(const match of text.matchAll(refRe)){
    const resolved=normalize(f,match[1]);
    if(resolved&&fileSet.has(resolved)&&assetRe.test(resolved)) refs.add(resolved);
  }
}

const scopes=['assets/img/','configurator/assets/img/'];
const orphan=files.filter(f=>assetRe.test(f)&&scopes.some(s=>f.startsWith(s))&&!refs.has(f));
if(orphan.length){
  console.error(`Unused runtime assets detected (${orphan.length}):`);
  orphan.forEach(f=>console.error(` - ${f}`));
  process.exit(1);
}

const forbidden=[
  'assets/css/custommind-v2.css','assets/css/extensions.css','assets/css/modern.css','assets/css/site.css','assets/css/styles.css',
  'assets/js/helpers.js','assets/js/modern.js','assets/js/site.js','meta.json','manifest.json'
].filter(f=>fileSet.has(f));
if(forbidden.length){
  console.error('Legacy files reintroduced:');
  forbidden.forEach(f=>console.error(` - ${f}`));
  process.exit(1);
}

console.log('Asset audit OK — no runtime-orphan images or legacy bundles detected.');
