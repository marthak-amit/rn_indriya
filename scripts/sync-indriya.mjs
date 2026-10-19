#!/usr/bin/env node
/**
 * Captures real content from https://www.indriya.com with a headless browser:
 *   - product tiles (name, price, link, image) for each category / collection page
 *   - hero banners and collection images
 *   - the live theme (CSS variables, computed colours, fonts) and the logo
 *   - reference screenshots in docs/reference/
 * and writes:
 *   src/data/generated/indriya.json   (data)
 *   src/data/generated/images.ts      (require() map of the downloaded images)
 *   assets/indriya/**                 (images)
 *
 * Run:  npm i --no-save playwright && npx playwright install chromium && node scripts/sync-indriya.mjs
 * (also runs in CI: .github/workflows/sync-indriya.yml)
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ORIGIN = process.env.INDRIYA_ORIGIN || 'https://www.indriya.com';
const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const ASSETS = path.join(ROOT, 'assets/indriya');
const GEN = path.join(ROOT, 'src/data/generated');
const REF = path.join(ROOT, 'docs/reference');
const MAX_PAGES = Number(process.env.MAX_PAGES || 16);
const MAX_PER_PAGE = Number(process.env.MAX_PER_PAGE || 14);
const MAX_PRODUCTS = Number(process.env.MAX_PRODUCTS || 150);
const CONCURRENCY = Number(process.env.CONCURRENCY || 4);

const log = (...a) => console.log('[sync]', ...a);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'item';
const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 6);

const SEED_PATHS = [
  '/jewellery/neckwear', '/jewellery/earrings', '/jewellery/bangles', '/jewellery/rings', '/jewellery/mangalsutras',
  '/jewellery/pendants', '/jewellery/bracelets',
  '/aasmaniyat', '/jewellery/diamond-jewellery', '/jewellery/bridal-wear', '/jewellery/daily-wear', '/jewellery/gold-jewellery',
  '/jewellery/18k-gold-jewellery',
];
const COLLECTION_BY_PATH = [
  [/aasmaniyat/i, 'aasmaniyat'], [/diamond/i, 'diamond'], [/bridal|wedding|engagement/i, 'wedding'], [/daily-wear/i, 'daily'], [/gold-jewellery/i, 'gold'],
];
const categoryFromText = (t) => {
  if (/mangal\s?sutra/i.test(t)) return 'mangalsutra';
  if (/ear\s?ring|jhumk|\bstud|bali|chandbali|drop|danglers?|hoop/i.test(t)) return 'earrings';
  if (/bracelet/i.test(t)) return 'bracelets';
  if (/bangle|kada|cuff/i.test(t)) return 'bangles';
  if (/pendant/i.test(t)) return 'pendants';
  if (/\bchains?\b/i.test(t)) return 'chains';
  if (/necklace|neckwear|haar|choker|\bset\b/i.test(t)) return 'necklaces';
  if (/\bring\b|band|solitaire/i.test(t)) return 'rings';
  return null;
};

async function download(ctx, url, dir, base) {
  try {
    const res = await ctx.request.get(url, { timeout: 30000, headers: { referer: ORIGIN + '/' } });
    if (!res.ok()) return null;
    const type = (res.headers()['content-type'] || '').toLowerCase();
    if (!type.startsWith('image/') || type.includes('svg')) return null;
    const body = await res.body();
    if (body.length < 4000) return null;
    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
    await mkdir(path.join(ASSETS, dir), { recursive: true });
    const rel = `${dir}/${base}.${ext}`;
    await writeFile(path.join(ASSETS, rel), body);
    return rel;
  } catch (e) {
    log('download failed', url, e.message.split('\n')[0]);
    return null;
  }
}

async function autoScroll(page) {
  for (let i = 0; i < 14; i++) {
    await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 0.8)));
    await page.waitForTimeout(450);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

/** Runs inside the page: returns image tiles with nearby name/price/link. */
function extractTiles() {
  const abs = (u) => { try { return new URL(u, location.href).href; } catch { return null; } };
  const bestFromSrcset = (img) => {
    const set = img.getAttribute('srcset') || img.getAttribute('data-srcset');
    if (!set) return null;
    const parts = set.split(',').map((s) => s.trim().split(/\s+/)).map(([u, w]) => ({ u, w: parseInt(w || '0', 10) || 0 }));
    parts.sort((a, b) => b.w - a.w);
    return parts[0]?.u || null;
  };
  const out = [];
  for (const img of document.images) {
    const r = img.getBoundingClientRect();
    if (r.width < 110 || r.height < 110) continue;
    let src = img.currentSrc || img.src || img.getAttribute('data-src') || bestFromSrcset(img);
    const big = bestFromSrcset(img);
    if (big) src = big;
    if (!src || src.startsWith('data:')) continue;
    const alt = (img.alt || '').trim();
    if (/logo|icon|banner-bg|sprite/i.test(alt + src)) continue;
    const a = img.closest('a[href]');
    const box = img.closest('li, article, [class*="card" i], [class*="product" i], [class*="tile" i], [class*="item" i]') || a || img.parentElement?.parentElement;
    const text = (box?.innerText || '').replace(/\s+/g, ' ').trim();
    const prices = [...text.matchAll(/(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d+)?)/gi)].map((m) => Math.round(parseFloat(m[1].replace(/,/g, '')))).filter((n) => n > 500);
    const heading = box?.querySelector('h1,h2,h3,h4,h5,[class*="name" i],[class*="title" i]')?.textContent?.trim();
    out.push({
      src: abs(src), alt, href: a ? abs(a.getAttribute('href')) : null,
      name: (alt.length > 3 ? alt : heading) || text.split(/₹|Rs/)[0].trim().slice(0, 90),
      prices: [...new Set(prices)].sort((x, y) => x - y), w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top + scrollY),
    });
  }
  return out;
}

/** Runs inside the page: theme signals. */
function extractTheme() {
  const cs = (el) => (el ? getComputedStyle(el) : null);
  const vars = {};
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of rules || []) {
      if (rule.selectorText && /:root|html|body/.test(rule.selectorText)) {
        for (const name of rule.style) if (name.startsWith('--') && /#|rgb|hsl/i.test(rule.style.getPropertyValue(name))) vars[name] = rule.style.getPropertyValue(name).trim();
      }
    }
  }
  const freq = (arr) => Object.entries(arr.reduce((m, v) => ((m[v] = (m[v] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const bg = [], fg = [], btn = [], link = [];
  for (const el of document.querySelectorAll('header, nav, footer, button, a, h1, h2, h3, p, section, div')) {
    const s = cs(el); if (!s) continue;
    if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') (el.tagName === 'BUTTON' || /btn|button/i.test(el.className) ? btn : bg).push(s.backgroundColor);
    if (/^H[1-3]$|^P$|^A$/.test(el.tagName)) (el.tagName === 'A' ? link : fg).push(s.color);
  }
  const fonts = {};
  for (const sel of ['body', 'h1', 'h2', 'h3', 'button', 'nav a']) { const el = document.querySelector(sel); if (el) fonts[sel] = cs(el).fontFamily; }
  return {
    themeColor: document.querySelector('meta[name="theme-color"]')?.content || null,
    cssVars: vars, bodyBg: cs(document.body).backgroundColor, bodyColor: cs(document.body).color,
    headerBg: cs(document.querySelector('header'))?.backgroundColor || null,
    topBackgrounds: freq(bg), topButtonBackgrounds: freq(btn), topTextColors: freq(fg), topLinkColors: freq(link), fonts,
    fontFaces: [...document.fonts].map((f) => `${f.family} ${f.weight}`).slice(0, 20),
    title: document.title,
  };
}

async function main() {
  await rm(ASSETS, { recursive: true, force: true });
  await mkdir(ASSETS, { recursive: true }); await mkdir(GEN, { recursive: true }); await mkdir(REF, { recursive: true });
  const browser = await chromium.launch({ args: ['--no-sandbox'], executablePath: process.env.CHROMIUM_PATH || undefined });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'en-IN',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  });
  const page = await ctx.newPage();
  const report = { origin: ORIGIN, pages: [], errors: [] };

  // ---- home: theme, logo, hero banners, links
  log('home');
  await page.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((e) => report.errors.push('home: ' + e.message));
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(REF, 'home-top.png') });
  const theme = await page.evaluate(extractTheme).catch((e) => ({ error: e.message }));
  await autoScroll(page);
  await page.screenshot({ path: path.join(REF, 'home-full.png'), fullPage: true }).catch(() => {});
  const homeTiles = await page.evaluate(extractTiles).catch(() => []);
  const html = await page.content();
  await writeFile(path.join(REF, 'home.html'), html.slice(0, 600000));

  const logoSrc = await page.evaluate(() => {
    const el = document.querySelector('header img[src*="logo" i], header a[href="/"] img, a[href="/"] img[alt*="indriya" i], img[alt*="indriya" i][src*="logo" i]');
    return el ? el.currentSrc || el.src : null;
  }).catch(() => null);
  let logo = logoSrc ? await download(ctx, logoSrc, 'brand', 'logo') : null;
  if (!logo) {
    try {
      await mkdir(path.join(ASSETS, 'brand'), { recursive: true });
      const box = await page.evaluate(() => {
        const el = document.querySelector('header a[href="/"], a[href="/"]');
        const r = el?.getBoundingClientRect();
        return r && r.width > 40 && r.height > 15 && r.top < 120 ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
      });
      const clip = box || { x: 28, y: 12, width: 148, height: 50 };
      await page.screenshot({ path: path.join(ASSETS, 'brand/logo.png'), clip });
      logo = 'brand/logo.png';
    } catch (e) { report.errors.push('logo: ' + e.message.split('\n')[0]); }
  }

  const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.href, text: (a.textContent || '').trim().slice(0, 40) }))).catch(() => []);
  const sameOrigin = links.filter((l) => l.href.startsWith(ORIGIN) && !/#|\.(pdf|jpg|png)$|\/(login|cart|account|blog|store|stores|policy|terms|contact)/i.test(l.href)).map((l) => l.href.split('?')[0].replace(/\/$/, ''));
  const interesting = [...new Set(sameOrigin)].filter((u) => /necklace|earring|bangle|ring|mangalsutra|jewellery|collection|diamond|gold|temple|aasmaniyat|bridal|wedding|engagement/i.test(u));
  const queue = [...new Set([...SEED_PATHS.map((p) => ORIGIN + p), ...interesting])].slice(0, MAX_PAGES + SEED_PATHS.length);
  report.discoveredLinks = interesting.slice(0, 60);

  const banners = [];
  for (const t of homeTiles.filter((t) => t.w >= 600 && t.h >= 220).sort((a, b) => a.top - b.top).slice(0, 4)) {
    const rel = await download(ctx, t.src, 'banners', `banner-${banners.length + 1}`);
    if (rel) banners.push({ id: `b${banners.length + 1}`, title: t.alt || t.name, href: t.href, image: rel });
  }

  // ---- listing pages
  const products = new Map();
  const collections = {};
  let visited = 0;
  for (const url of queue) {
    if (visited >= MAX_PAGES || products.size >= MAX_PRODUCTS) break;
    log('page', url);
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(1500);
      const status = resp?.status() ?? 0;
      if (status >= 400) { report.pages.push({ url, status, tiles: 0 }); continue; }
      visited++;
      await autoScroll(page);
      const tiles = (await page.evaluate(extractTiles)).filter((t) => t.href && t.href !== url && t.name && /\/jewellery-products\//.test(t.href));
      const pathName = new URL(url).pathname;
      const col = COLLECTION_BY_PATH.find(([re]) => re.test(pathName))?.[1] ?? null;
      const pageCat = categoryFromText(pathName);
      const og = await page.evaluate(() => { const c = document.querySelector('meta[property="og:image"]')?.content; try { return c ? new URL(c, location.href).href : null; } catch { return null; } });
      if (col && og && !collections[col]) { const rel = await download(ctx, og, 'collections', col); if (rel) collections[col] = { id: col, image: rel }; }
      if (visited <= 4) await page.screenshot({ path: path.join(REF, `page-${visited}-${slug(pathName)}.png`) }).catch(() => {});
      let kept = 0;
      for (const t of tiles) {
        const key = t.href;
        if (products.has(key)) { const ex = products.get(key); if (col && !ex.collection) ex.collection = col; continue; }
        if (kept >= MAX_PER_PAGE || products.size >= MAX_PRODUCTS) continue; // cap new additions only; tagging above is uncapped
        const category = pageCat || categoryFromText(`${t.name} ${t.href}`) || categoryFromText(t.name);
        if (!category) continue;
        const id = `${slug(t.name).slice(0, 30)}-${hash(key)}`;
        const rel = await download(ctx, t.src, 'products', id);
        if (!rel) continue;
        const [price, mrp] = t.prices.length > 1 ? [t.prices[0], t.prices[t.prices.length - 1]] : [t.prices[0] ?? null, null];
        products.set(key, { id, name: t.name.replace(/\s+/g, ' ').slice(0, 90), price, mrp, category, collection: col, href: t.href, image: rel });
        kept++;
      }
      report.pages.push({ url, status, tiles: tiles.length, kept });
    } catch (e) {
      report.errors.push(`${url}: ${e.message.split('\n')[0]}`);
    }
  }
  // ---- product detail pages (parallel workers): price, description, specs, gallery
  const queuePdp = [...products.values()].slice(0, Number(process.env.MAX_PDP || 150));
  let pdpIndex = 0;
  const worker = async (n) => {
    const wp = await ctx.newPage();
    while (true) {
      const i = pdpIndex++;
      if (i >= queuePdp.length) break;
      const prod = queuePdp[i];
      try {
        await wp.goto(prod.href, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await wp.waitForSelector('h1', { timeout: 15000 }).catch(() => {});
        // Price and gallery render asynchronously; wait for a rupee amount instead of a fixed delay.
        await wp.waitForFunction(() => /₹\s*[\d,]{4,}/.test(document.body.innerText), null, { timeout: 15000 }).catch(() => {});
        await wp.waitForTimeout(1200);
        const d = await wp.evaluate(() => {
          const main = document.querySelector('main') || document.body;
          const text = main.innerText.replace(/[ \t]+/g, ' ');
          const prices = [...text.matchAll(/(?:₹|Rs\.?)\s*([\d,]{3,}(?:\.\d+)?)/g)].map((m) => Math.round(parseFloat(m[1].replace(/,/g, '')))).filter((v) => v > 500);
          const specs = {};
          for (const m of text.matchAll(/(Gold Weight|Net Weight|Gross Weight|Purity|Karat|Metal|Diamond Weight|Stone Weight|Gold Purity|Diamond Clarity|Diamond Colour|Collection|Size|Width|Height)\s*[:\n]\s*([^\n]{1,40})/gi)) specs[m[1].trim()] = m[2].trim();
          const desc = document.querySelector('meta[name="description"]')?.content || '';
          const title = document.querySelector('h1')?.textContent?.trim() || '';
          const longDesc = [...document.querySelectorAll('p, div')].filter((e) => e.children.length < 3).map((e) => e.textContent.trim().replace(/\s*Read More\s*$/i, '')).filter((t) => t.length > 80 && t.length < 900 && !/agree to be contacted|T&C|Privacy Policy|cookies/i.test(t) && title && t.toLowerCase().includes(title.toLowerCase().split(' ')[0]))[0] || '';
          const imgs = [...document.images].filter((im) => { const r = im.getBoundingClientRect(); return r.width > 160 && r.height > 160 && r.top + scrollY < 1300; }).map((im) => im.currentSrc || im.src).filter((u) => u && !u.startsWith('data:'));
          return { prices: [...new Set(prices)].sort((a, b) => a - b), specs, desc, longDesc, imgs: [...new Set(imgs)], title: document.querySelector('h1')?.textContent?.trim() || null, code: text.match(/\b[A-Z]{3,}\d{2}-[A-Z0-9]{5,}\b/)?.[0] || null, head: text.slice(0, 1200) };
        });
        if (i < 2) { await wp.screenshot({ path: path.join(REF, `pdp-${i + 1}.png`) }).catch(() => {}); await writeFile(path.join(REF, `pdp-${i + 1}.txt`), d.head); }
        if (!d.prices.length && !prod._retried) { prod._retried = true; queuePdp.push(prod); }
        if (d.prices.length) { prod.price = d.prices[0]; prod.mrp = d.prices.length > 1 ? d.prices[d.prices.length - 1] : null; }
        if (d.title && d.title.length > 3) prod.name = d.title.slice(0, 90);
        prod.description = d.desc ? d.desc.slice(0, 400) : null;
        prod.longDescription = d.longDesc ? d.longDesc.slice(0, 700) : null;
        prod.code = d.code;
        prod.specs = d.specs;
        if (d.prices.length) delete prod._retried;
        const extra = [];
        for (const u of d.imgs.slice(0, 6)) {
          if (extra.length >= 3) break;
          const rel = await download(ctx, u, 'products', `${prod.id}-${extra.length + 2}`);
          if (rel) extra.push(rel);
        }
        prod.extraImages = extra;
      } catch (e) { report.errors.push(`pdp ${prod.href}: ${e.message.split('\n')[0]}`); }
    }
    await wp.close();
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, n) => worker(n)));
  await browser.close();

  // ---- write outputs
  const list = [...products.values()];
  for (const p of list) delete p._retried;
  const imageKeys = [...new Set([...(logo ? [logo] : []), ...banners.map((b) => b.image), ...Object.values(collections).map((c) => c.image), ...list.flatMap((p) => [p.image, ...(p.extraImages || [])])])];
  const data = { fetchedAt: new Date().toISOString(), source: ORIGIN, theme, logo, banners, collections: Object.values(collections), products: list };
  await writeFile(path.join(GEN, 'indriya.json'), JSON.stringify(data, null, 2) + '\n');
  const ts = `// Generated by scripts/sync-indriya.mjs — do not edit.\nexport const generatedImages: Record<string, number> = {\n${imageKeys.map((k) => `  '${k}': require('../../../assets/indriya/${k}'),`).join('\n')}\n};\n`;
  await writeFile(path.join(GEN, 'images.ts'), ts);
  await writeFile(path.join(REF, 'sync-report.json'), JSON.stringify({ ...report, counts: { products: list.length, banners: banners.length, collections: Object.keys(collections).length, images: imageKeys.length } }, null, 2));
  log(`done: ${list.length} products, ${banners.length} banners, ${Object.keys(collections).length} collections, ${imageKeys.length} images; errors: ${report.errors.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
