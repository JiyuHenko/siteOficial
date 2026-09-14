from pathlib import Path
import hashlib
import re
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

DEAD_TEXT = [
    'assets/css/custommind-v2.css',
    'assets/css/extensions.css',
    'assets/css/modern.css',
    'assets/css/site.css',
    'assets/css/styles.css',
    'assets/js/helpers.js',
    'assets/js/modern.js',
    'assets/js/site.js',
    'meta.json',
    'manifest.json',
    'README-ATUALIZACAO.md',
    'REDESIGN-EXPERIMENT.md',
]

CONVERT = [
    ('assets/img/Facecustommind.webp', 'assets/img/Facecustommind.webp'),
    ('assets/img/jade-inicio.webp', 'assets/img/jade-inicio.webp'),
    ('assets/img/jade-chat.webp', 'assets/img/jade-chat.webp'),
    ('assets/img/zuri-inicio.webp', 'assets/img/zuri-inicio.webp'),
    ('assets/img/zuri-chat.webp', 'assets/img/zuri-chat.webp'),
]

TEXT_EXT = {'.html','.css','.js','.mjs','.json','.md','.txt','.xml','.yml','.yaml','.py'}
RUNTIME_EXT = {'.html','.css','.js','.mjs','.json','.xml','.py'}
ASSET_EXT = {'.png','.jpg','.jpeg','.webp','.gif','.svg','.ico','.woff','.woff2','.ttf','.mp4','.webm'}
SKIP_DIRS = {'.git','node_modules'}


def files():
    for p in ROOT.rglob('*'):
        if not p.is_file():
            continue
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        yield p


def rel(p):
    return p.relative_to(ROOT).as_posix()


def delete(path):
    p = ROOT / path
    if p.exists():
        p.unlink()
        print('DELETE', path)


def replace_text(old, new):
    for p in list(files()):
        if p.suffix.lower() not in TEXT_EXT:
            continue
        try:
            text = p.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue
        if old not in text:
            continue
        p.write_text(text.replace(old, new), encoding='utf-8')
        print('REF', rel(p), old, '->', new)


def convert_webp(src_s, dst_s):
    src, dst = ROOT / src_s, ROOT / dst_s
    if not src.exists():
        return
    with Image.open(src) as im:
        if im.mode not in ('RGB','RGBA'):
            im = im.convert('RGBA' if 'transparency' in im.info else 'RGB')
        im.save(dst, 'WEBP', lossless=True, method=6)
    print('WEBP', src_s, src.stat().st_size, '->', dst_s, dst.stat().st_size)
    replace_text(src_s, dst_s)
    replace_text(Path(src_s).name, Path(dst_s).name)
    src.unlink()


def normalize_ref(from_file, raw):
    s = re.sub(r'[?#].*$', '', raw.strip())
    if not s or s.startswith(('data:', 'blob:', '//')):
        return None
    if re.match(r'^https?://', s, re.I):
        m = re.match(r'^https?://(?:www\.)?custommind\.com\.br/(.*)$', s, re.I)
        if not m:
            return None
        return m.group(1)
    if s.startswith('/'):
        return s[1:]
    base = Path(from_file).parent
    joined = (base / s).as_posix()
    parts=[]
    for part in joined.split('/'):
        if part in ('','.'): continue
        if part == '..':
            if parts: parts.pop()
        else: parts.append(part)
    return '/'.join(parts)


def runtime_asset_refs():
    all_files = {rel(p) for p in files()}
    refs = set()
    rx = re.compile(r'''(?:url\(\s*['\"]?|[\"'`])([^\"'`()\s<>]+\.(?:png|jpe?g|webp|gif|svg|ico|woff2?|ttf|mp4|webm)(?:[?#][^\"'`()\s<>]*)?)''', re.I)
    for p in files():
        if p.suffix.lower() not in RUNTIME_EXT:
            continue
        rp = rel(p)
        try: text=p.read_text(encoding='utf-8')
        except UnicodeDecodeError: continue
        for raw in rx.findall(text):
            resolved=normalize_ref(rp, raw)
            if resolved in all_files:
                refs.add(resolved)
    return refs


def delete_runtime_orphan_images():
    refs = runtime_asset_refs()
    scopes = ('assets/img/', 'configurator/assets/img/')
    candidates=[]
    for p in files():
        rp=rel(p)
        if p.suffix.lower() in ASSET_EXT and rp.startswith(scopes) and rp not in refs:
            candidates.append((rp,p.stat().st_size))
    for rp,size in sorted(candidates, key=lambda x:x[1], reverse=True):
        delete(rp)
    print('ORPHAN_ASSETS_REMOVED', len(candidates), sum(s for _,s in candidates))


def remove_empty_dirs():
    dirs=sorted([p for p in ROOT.rglob('*') if p.is_dir()], key=lambda p: len(p.parts), reverse=True)
    for d in dirs:
        if any(part in SKIP_DIRS for part in d.parts): continue
        try: d.rmdir()
        except OSError: pass


def write_assets_readme():
    p=ROOT/'assets/ASSETS-README.md'
    p.write_text('''# Assets do site\n\nA pasta `assets/` contém somente arquivos usados pelas superfícies atuais do site ou pelo harness de qualidade.\n\n## Regras de manutenção\n- Prefira WebP para imagens raster exibidas no site.\n- PNG/JPG ficam apenas quando o formato é necessário (favicon, QR Code ou imagem social/OG).\n- Não mantenha cópias com nomes diferentes do mesmo arquivo.\n- Antes de adicionar um asset, confirme a referência no HTML/CSS/JS que o consome.\n- O CI executa uma auditoria de assets para evitar novos arquivos fantasma.\n\nOs originais históricos continuam recuperáveis pelo Git; não precisam permanecer na árvore de produção.\n''', encoding='utf-8')


def main():
    for p in DEAD_TEXT: delete(p)

    # The configurator/demo used a ~1 MB PNG. The existing official WebP is ~20 KB.
    replace_text('assets/img/logo.webp', 'assets/img/logo.webp')

    for src,dst in CONVERT:
        convert_webp(src,dst)

    # Once dead CSS/JS and old manifest are gone, remove every unreferenced visual
    # from runtime asset folders. Source/template trees are intentionally preserved.
    delete_runtime_orphan_images()
    remove_empty_dirs()
    write_assets_readme()

if __name__ == '__main__':
    main()
