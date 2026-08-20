#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSiteDesignManifest } from './checks/check-site-design-manifest.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const config=JSON.parse(fs.readFileSync(path.join(here,'harness.config.json'),'utf8'));
const command=process.argv[2]||'check';
const issues=[];
const push=(severity,file,message)=>issues.push({severity,file,message});
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(config.ignore.some(x=>path.resolve(root,x)===path.resolve(dir,e.name)))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.html'))checkHtml(p)}}
function checkHtml(file){const rel=path.relative(root,file).replaceAll('\\','/');const s=fs.readFileSync(file,'utf8');if(!/<html[^>]+lang=["'][^"']+["']/i.test(s))push('ERROR',rel,'HTML sem atributo lang.');if(!/<meta[^>]+name=["']viewport["']/i.test(s))push('ERROR',rel,'Viewport ausente.');if(!/<meta[^>]+name=["']description["']/i.test(s))push('ERROR',rel,'Meta description ausente.');if(!/<link[^>]+rel=["']canonical["']/i.test(s))push('ERROR',rel,'Canonical ausente.');const h1=(s.match(/<h1\b/gi)||[]).length;if(h1!==1)push('ERROR',rel,`Esperado 1 H1; encontrado ${h1}.`);for(const m of s.matchAll(/(?:href|src)=["']([^"']+)["']/gi)){const u=m[1];if(!u||u.startsWith('#')||u.startsWith('http:')||u.startsWith('https:')||u.startsWith('mailto:')||u.startsWith('tel:')||u.startsWith('data:'))continue;const clean=u.split(/[?#]/)[0];if(clean.startsWith('/'))continue;const target=path.resolve(path.dirname(file),clean);if(!fs.existsSync(target))push('ERROR',rel,`Referência local quebrada: ${u}`)}}
function run(){const design=checkSiteDesignManifest(root,config);issues.push(...design.issues);walk(root);const errors=issues.filter(x=>x.severity==='ERROR').length;const warns=issues.filter(x=>x.severity==='WARN').length;console.log(`\nCustom Mind Site Harness ${config.version}\n`);for(const x of issues)console.log(`${x.severity.padEnd(5)} ${x.file||''} — ${x.message}`);console.log(`\n${errors?'BLOCKED':'READY'} — ${errors} errors, ${warns} warnings\n`);process.exitCode=errors?1:0}
if(command==='doctor'){console.log('OK Node',process.version);console.log(fs.existsSync(path.join(here,'site','SITE_DESIGN.json'))?'OK SITE_DESIGN.json':'MISSING SITE_DESIGN.json')}else run();
