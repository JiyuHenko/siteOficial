#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSiteDesignManifest } from './checks/check-site-design-manifest.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const config = JSON.parse(fs.readFileSync(path.join(here, 'harness.config.json'), 'utf8'));
const command = process.argv[2] || 'check';
const issues = [];
const pages = [];
const GOOGLE_SITE_VERIFICATION = 'NEz9dTqFfmKUW9phnLos_7ghhMrkU8Zp_B1kF7SUyKY';
const push = (severity, file, message) => issues.push({ severity, file, message });
const rel = file => path.relative(root, file).replaceAll('\\', '/');

const siteContentPath = path.join(root, config.seo?.contentSource || '.harness/site/site-content.json');
let siteData = null;
try { siteData = JSON.parse(fs.readFileSync(siteContentPath, 'utf8')); }
catch { siteData = null; }

function publicFileForPath(urlPath) {
  if (urlPath === '/') return 'index.html';
  if (urlPath.endsWith('/')) return `${urlPath.slice(1)}index.html`;
  return urlPath.slice(1);
}

const publicFiles = new Set((siteData?.pages || []).map(entry => publicFileForPath(entry.path)));
publicFiles.add('404.html');

function ignored(file) {
  const absolute = path.resolve(file);
  return config.ignore.some(entry => {
    const ignoredPath = path.resolve(root, entry);
    return absolute === ignoredPath || absolute.startsWith(`${ignoredPath}${path.sep}`);
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (ignored(file)) continue;
    if (entry.isDirectory()) walk(file);
    else if (file.endsWith('.html') && publicFiles.has(rel(file))) checkHtml(file);
  }
}

function attrValue(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}=["']([^"']*)["']`, 'i'));
  return match?.[1] ?? null;
}

function metaContent(source, key, value) {
  for (const match of source.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if ((attrValue(tag, key) || '').toLowerCase() === value.toLowerCase()) return attrValue(tag, 'content');
  }
  return null;
}

function canonicalOf(source) {
  for (const match of source.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    const relValue = (attrValue(tag, 'rel') || '').toLowerCase().split(/\s+/);
    if (relValue.includes('canonical')) return attrValue(tag, 'href');
  }
  return null;
}

function resolveLocalReference(fromFile, raw) {
  const clean = raw.split(/[?#]/)[0];
  if (!clean) return null;
  let target;
  if (clean.startsWith('/')) target = path.resolve(root, `.${clean}`);
  else target = path.resolve(path.dirname(fromFile), clean);
  if (clean.endsWith('/')) target = path.join(target, 'index.html');
  return target;
}

function checkHtml(file) {
  const relative = rel(file);
  const source = fs.readFileSync(file, 'utf8');
  const quality = config.quality || {};

  if (quality.requireLang && !/<html[^>]+lang=["'][^"']+["']/i.test(source)) push('ERROR', relative, 'HTML sem atributo lang.');
  if (quality.requireViewport && metaContent(source, 'name', 'viewport') === null) push('ERROR', relative, 'Viewport ausente.');
  if (quality.requireDescription && metaContent(source, 'name', 'description') === null) push('ERROR', relative, 'Meta description ausente.');

  const canonical = canonicalOf(source);
  if (quality.requireCanonical && !canonical) push('ERROR', relative, 'Canonical ausente.');
  if (canonical && !canonical.startsWith(config.canonicalDomain)) push('ERROR', relative, `Canonical fora do domínio oficial: ${canonical}`);

  const h1Count = (source.match(/<h1\b/gi) || []).length;
  if (quality.requireSingleH1 && h1Count !== 1) push('ERROR', relative, `Esperado 1 H1; encontrado ${h1Count}.`);

  if (relative === 'index.html' && !source.includes(`name="google-site-verification" content="${GOOGLE_SITE_VERIFICATION}"`) && !source.includes(`content="${GOOGLE_SITE_VERIFICATION}" name="google-site-verification"`)) {
    push('ERROR', relative, 'Verificação do Google Search Console ausente ou alterada.');
  }

  const ogOptional = new Set(quality.allowMissingOgImage || []);
  if (quality.requireOgImage && !ogOptional.has(relative) && metaContent(source, 'property', 'og:image') === null) push('ERROR', relative, 'og:image ausente.');

  if (quality.requireImageAlt) {
    for (const match of source.matchAll(/<img\b[^>]*>/gi)) {
      if (attrValue(match[0], 'alt') === null) push('ERROR', relative, `Imagem sem atributo alt: ${match[0].slice(0, 120)}`);
    }
  }

  if (quality.validateStructuredData) {
    for (const match of source.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try { JSON.parse(match[1]); }
      catch (error) { push('ERROR', relative, `JSON-LD inválido: ${error.message}`); }
    }
  }

  if (quality.validateLocalReferences) {
    for (const match of source.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
      const url = match[1];
      if (!url || url.startsWith('#') || url.startsWith('//') || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(url)) continue;
      const target = resolveLocalReference(file, url);
      if (target && !fs.existsSync(target)) push('ERROR', relative, `Referência local quebrada: ${url}`);
    }
  }

  pages.push({ file: relative, canonical });
}

function checkCanonicalUniqueness() {
  const seen = new Map();
  for (const page of pages) {
    if (!page.canonical || page.file === '404.html') continue;
    const previous = seen.get(page.canonical);
    if (previous && previous !== page.file) push('ERROR', page.file, `Canonical duplicado com ${previous}: ${page.canonical}`);
    else seen.set(page.canonical, page.file);
  }
}

function checkSeoSurfaces() {
  const seo = config.seo || {};
  if (!siteData) {
    push('ERROR', rel(siteContentPath), 'Fonte central de SEO ausente ou inválida.');
    return;
  }

  const canonicalMap = new Map(pages.map(page => [page.file, page.canonical]));
  const expectedUrls = [];
  for (const entry of siteData.pages || []) {
    const expectedUrl = entry.path === '/' ? `${config.canonicalDomain}/` : `${config.canonicalDomain}${entry.path}`;
    expectedUrls.push(expectedUrl);
    const file = publicFileForPath(entry.path);
    const diskPath = path.join(root, file);
    if (!fs.existsSync(diskPath)) push('ERROR', rel(siteContentPath), `Página declarada não existe: ${entry.path}`);
    else if (canonicalMap.get(file) !== expectedUrl) push('ERROR', file, `Canonical não corresponde à fonte central: esperado ${expectedUrl}`);
  }

  const sitemapPath = path.join(root, seo.sitemap || 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) push('ERROR', rel(sitemapPath), 'sitemap.xml ausente.');
  else {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const actualUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    const duplicates = actualUrls.filter((url, index) => actualUrls.indexOf(url) !== index);
    if (duplicates.length) push('ERROR', rel(sitemapPath), `URLs duplicadas: ${[...new Set(duplicates)].join(', ')}`);
    const expected = [...expectedUrls].sort();
    const actual = [...actualUrls].sort();
    if (expected.length !== actual.length || expected.some((url, index) => url !== actual[index])) push('ERROR', rel(sitemapPath), 'Cobertura do sitemap diverge da fonte central de páginas públicas.');
  }

  const llmsPath = path.join(root, seo.llms || 'llms.txt');
  if (!fs.existsSync(llmsPath)) push('ERROR', rel(llmsPath), 'llms.txt ausente.');
  else {
    const llms = fs.readFileSync(llmsPath, 'utf8');
    for (const item of [...(siteData.solutions || []), ...(siteData.clients || [])]) {
      const url = `${config.canonicalDomain}${item.url}`;
      if (!llms.includes(url)) push('ERROR', rel(llmsPath), `URL pública ausente do llms.txt: ${url}`);
    }
    if (siteData.updatedAt && !llms.includes(`Última atualização: ${siteData.updatedAt}.`)) push('ERROR', rel(llmsPath), 'Data de atualização não corresponde à fonte central.');
  }

  const robotsPath = path.join(root, seo.robots || 'robots.txt');
  if (!fs.existsSync(robotsPath)) push('ERROR', rel(robotsPath), 'robots.txt ausente.');
  else {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    if (!/User-agent:\s*\*/i.test(robots)) push('ERROR', rel(robotsPath), 'User-agent global ausente.');
    if (!robots.includes(`${config.canonicalDomain}/sitemap.xml`)) push('ERROR', rel(robotsPath), 'Referência ao sitemap oficial ausente.');
  }
}

function checkCssEntry() {
  const cssFile = path.join(root, 'assets/css/custommind-site-v3.css');
  if (!fs.existsSync(cssFile)) return;
  const source = fs.readFileSync(cssFile, 'utf8');
  const imports = [...source.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/gi)].map(m => m[1]);
  const limit = config.performance?.warnCssImportsAbove ?? Infinity;
  if (imports.length > limit) push('WARN', rel(cssFile), `${imports.length} @imports detectados; considerar bundle de produção.`);
  for (const imported of imports) {
    const clean = imported.split(/[?#]/)[0];
    if (/^(https?:|data:)/i.test(clean)) continue;
    const target = path.resolve(path.dirname(cssFile), clean);
    if (!fs.existsSync(target)) push('ERROR', rel(cssFile), `Import CSS quebrado: ${imported}`);
  }
}

function checkAssetSizes(dir = path.join(root, 'assets/img')) {
  if (!fs.existsSync(dir)) return;
  const pngLimit = config.performance?.warnPngBytesAbove ?? Infinity;
  const rasterLimit = config.performance?.warnRasterBytesAbove ?? Infinity;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) checkAssetSizes(file);
    else {
      const ext = path.extname(file).toLowerCase();
      const size = fs.statSync(file).size;
      if (ext === '.png' && size > pngLimit) push('WARN', rel(file), `PNG grande (${Math.round(size / 1024)} KB); avaliar WebP/AVIF.`);
      else if (['.jpg', '.jpeg', '.webp'].includes(ext) && size > rasterLimit) push('WARN', rel(file), `Imagem raster grande (${Math.round(size / 1024)} KB).`);
    }
  }
}

function run() {
  issues.push(...checkSiteDesignManifest(root, config).issues);
  walk(root);
  checkCanonicalUniqueness();
  checkSeoSurfaces();
  checkCssEntry();
  checkAssetSizes();

  const errors = issues.filter(x => x.severity === 'ERROR').length;
  const warns = issues.filter(x => x.severity === 'WARN').length;
  console.log(`\nCustom Mind Site Harness ${config.version}\n`);
  for (const issue of issues) console.log(`${issue.severity.padEnd(5)} ${issue.file || ''} — ${issue.message}`);
  console.log(`\n${errors ? 'BLOCKED' : 'READY'} — ${errors} errors, ${warns} warnings\n`);
  process.exitCode = errors ? 1 : 0;
}

if (command === 'doctor') {
  console.log('OK Node', process.version);
  console.log(fs.existsSync(path.join(here, 'site', 'SITE_DESIGN.json')) ? 'OK SITE_DESIGN.json' : 'MISSING SITE_DESIGN.json');
  console.log(fs.existsSync(siteContentPath) ? 'OK site-content.json' : 'MISSING site-content.json');
} else run();
