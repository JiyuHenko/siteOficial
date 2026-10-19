import { test, expect } from '@playwright/test';

const origin = 'http://127.0.0.1:4173';
const routes = ['/', '/solucoes.html', '/clientes/index.html', '/products/jade.html', '/sobre.html', '/contato.html'];

test('home: conteúdo, links, imagens e WhatsApp', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(origin + '/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.v4-service')).toHaveCount(4);
  await expect(page.locator('.v4-case')).toHaveCount(4);
  await expect(page.locator('.v4-product')).toHaveCount(3);
  await expect(page.locator('a[data-wa]').first()).toHaveAttribute('href', /wa\.me\/5511923734039/);
  expect(errors).toEqual([]);
});

for (const width of [390, 768, 1440]) {
  test('home: sem scroll horizontal em ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(origin + '/');
    await expect(page.locator('.v4-hero h1')).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth
    }));
    if (dimensions.content > dimensions.viewport + 2) {
      const culprits = await page.evaluate(() => [...document.querySelectorAll('*')].filter(el => {
        const box=el.getBoundingClientRect();
        const cs=getComputedStyle(el);
        return box.right > innerWidth+2 && cs.position !== 'fixed' && box.width>0;
      }).slice(0,30).map(el => ({tag:el.tagName,cls:el.className?.toString().slice(0,90),bounds:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)})));
      console.log('OVERFLOW DIAGNOSIS', width, JSON.stringify(culprits));
    }
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 2);
    await page.screenshot({ path: 'test-results/home-' + width + '.png', fullPage: true, animations: 'disabled' });
  });
}

test('menu móvel: abrir, navegar, Escape e aria-expanded', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/');
  const button = page.getByRole('button', { name: 'Abrir menu' });
  await button.click();
  await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.mobile-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.mobile-nav')).toBeHidden();
});

test('reduced motion: sem conteúdo escondido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(origin + '/');
  await expect(page.locator('.v4-manifesto h2')).toBeVisible();
  await expect(page.locator('.v4-close h2')).toBeVisible();
});

test('rotas públicas principais carregam HTML sem erros de JS', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const route of routes) {
    const response = await page.goto(origin + route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
