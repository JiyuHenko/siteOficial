import fs from 'node:fs';
import path from 'node:path';

export function checkSiteDesignManifest(projectRoot, config) {
  const issues = [];
  const design = config.design || {};
  if (!design.requireManifest) {
    return { name: 'site-design-manifest', issues };
  }

  const rel = design.manifest || '.harness/context/SITE_DESIGN.json';
  const file = path.join(projectRoot, rel);
  if (!fs.existsSync(file)) {
    issues.push({
      check: 'site-design-manifest',
      severity: 'ERROR',
      file: rel,
      message: 'Manifesto visual obrigatório não encontrado.'
    });
    return { name: 'site-design-manifest', issues };
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    issues.push({
      check: 'site-design-manifest',
      severity: 'ERROR',
      file: rel,
      message: 'SITE_DESIGN.json não é JSON válido.',
      detail: error.message
    });
    return { name: 'site-design-manifest', issues };
  }

  for (const key of ['brand', 'pageGoal', 'primaryCta', 'visualThesis', 'signature', 'motion']) {
    if (!data[key] || (typeof data[key] === 'string' && !data[key].trim())) {
      issues.push({
        check: 'site-design-manifest',
        severity: 'ERROR',
        file: rel,
        message: `Campo obrigatório ausente: ${key}`
      });
    }
  }

  if (!data.signature?.patternId || !data.signature?.reason) {
    issues.push({
      check: 'site-design-manifest',
      severity: 'ERROR',
      file: rel,
      message: 'A assinatura deve declarar patternId e reason.'
    });
  }

  const max = Number.isInteger(design.maxSupportingMotionPatterns)
    ? design.maxSupportingMotionPatterns
    : 3;
  const supporting = Array.isArray(data.supportingPatterns) ? data.supportingPatterns : [];
  if (supporting.length > max) {
    issues.push({
      check: 'site-design-manifest',
      severity: 'ERROR',
      file: rel,
      message: `Motion budget excedido: ${supporting.length} supporting patterns; máximo ${max}.`
    });
  }

  if (design.requireReducedMotionStrategy && !data.motion?.reducedMotion) {
    issues.push({
      check: 'site-design-manifest',
      severity: 'ERROR',
      file: rel,
      message: 'Estratégia de reduced motion é obrigatória.'
    });
  }

  if (!data.motion?.mobileFallback) {
    issues.push({
      check: 'site-design-manifest',
      severity: 'WARN',
      file: rel,
      message: 'Nenhum fallback mobile foi declarado para motion/assinatura.'
    });
  }

  const assetPolicy = data.assetPreservation || {};
  const requiredRefs = Array.isArray(assetPolicy.requiredReferences) ? assetPolicy.requiredReferences : [];
  if (requiredRefs.length) {
    const htmlFiles = [];
    const walk = dir => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        const relPath = path.relative(projectRoot, abs).replace(/\\/g, '/');
        if (relPath.startsWith('.git/') || relPath.startsWith('.harness/reports/')) continue;
        if (entry.isDirectory()) walk(abs);
        else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(abs);
      }
    };
    walk(projectRoot);
    const corpus = htmlFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
    for (const ref of requiredRefs) {
      if (!corpus.includes(ref)) {
        issues.push({
          check: 'site-design-manifest',
          severity: 'ERROR',
          file: rel,
          message: `Asset real obrigatório deixou de ser referenciado: ${ref}`
        });
      }
    }
  }

  return { name: 'site-design-manifest', issues };
}
