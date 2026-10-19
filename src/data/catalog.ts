/**
 * Catalog assembly.
 *
 * Structure (categories + collections) follows the public Indriya site. Products come from
 * `generated/indriya.json` when the sync script has captured them from www.indriya.com;
 * otherwise a clearly-marked PLACEHOLDER set is used so the app is always fully usable.
 */
import type { Banner, Catalog, Category, Collection, GemType, ImageRef, JewelShape, MetalTone, Product } from '@/features/catalog/types';
import generated from './generated/indriya.json';
import { generatedImages } from './generated/images';

export const categories: Category[] = [
  { id: 'necklaces', name: 'Necklaces', tagline: 'Drape in light', shape: 'necklace' },
  { id: 'earrings', name: 'Earrings', tagline: 'Frame your face', shape: 'earrings' },
  { id: 'bangles', name: 'Bangles', tagline: 'Stack your story', shape: 'bangle' },
  { id: 'rings', name: 'Rings', tagline: 'Promise, worn daily', shape: 'ring' },
  { id: 'mangalsutra', name: 'Mangalsutra', tagline: 'Tradition, reimagined', shape: 'mangalsutra' },
  { id: 'pendants', name: 'Pendants', tagline: 'Close to the heart', shape: 'pendant' },
  { id: 'bracelets', name: 'Bracelets', tagline: 'A touch of sparkle', shape: 'bangle' },
  { id: 'chains', name: 'Chains', tagline: 'Gold, simply worn', shape: 'necklace' },
];

// Collections mirror the site's own navigation: Diamond, Gold, Daily Wear, Wedding, plus Aasmaniyat.
export const collections: Collection[] = [
  { id: 'aasmaniyat', name: 'Aasmaniyat', tagline: 'Celestial diamond jewellery', description: 'Certified diamond jewellery inspired by the sky, for modern and bridal wear.', tone: 'white', gem: 'diamond', shape: 'earrings' },
  { id: 'diamond', name: 'Diamond', tagline: 'Certified natural diamonds', description: 'Earrings, necklaces, rings and bangles set with certified natural diamonds.', tone: 'rose', gem: 'diamond', shape: 'ring' },
  { id: 'gold', name: 'Gold', tagline: 'BIS hallmarked gold', description: 'Gold jewellery in 22KT, 18KT and 14KT, BIS hallmarked.', tone: 'yellow', gem: 'none', shape: 'bangle' },
  { id: 'wedding', name: 'Wedding', tagline: 'Bridal & wedding jewellery', description: 'Statement pieces for the day you remember forever.', tone: 'yellow', gem: 'ruby', shape: 'necklace' },
  { id: 'daily', name: 'Daily Wear', tagline: 'Light, everyday designs', description: 'Lightweight designs made to be worn every day.', tone: 'rose', gem: 'diamond', shape: 'pendant' },
];

const placeholderBanners: Banner[] = [
  { id: 'b1', eyebrow: 'Aasmaniyat', title: 'Diamonds written\nin the sky', subtitle: 'Certified celestial diamond jewellery', cta: 'Explore Aasmaniyat', target: { collection: 'aasmaniyat' }, tone: 'white', gem: 'diamond', shape: 'earrings', gradient: ['#011B45', '#0B47A3'] },
  { id: 'b2', eyebrow: 'Bridal 2026', title: 'Saptapadma,\nseven steps in gold', subtitle: 'The bridal collection', cta: 'Shop bridal', target: { collection: 'wedding' }, tone: 'yellow', gem: 'ruby', shape: 'necklace', gradient: ['#022E71', '#1B5CC0'] },
  { id: 'b3', eyebrow: 'Temple', title: 'Heritage in\n22KT gold', subtitle: 'Temple jewellery, Anantara line', cta: 'Discover temple', target: { collection: 'gold' }, tone: 'yellow', gem: 'none', shape: 'bangle', gradient: ['#0A1F44', '#2E4F86'] },
];

// ---------------------------------------------------------------------------
// PLACEHOLDER products (used until real data is synced)
// ---------------------------------------------------------------------------
type Row = [id: string, name: string, cat: string, col: string, shape: JewelShape, tone: MetalTone, gem: GemType, metal: string, grams: number, price: number, rating: number, reviews: number, flags: string];

const rows: Row[] = [
  ['ring-01', 'Aarna Solitaire Ring', 'rings', 'diamond', 'ring', 'white', 'diamond', '18K White Gold', 3.2, 48900, 4.8, 214, 'b'],
  ['ring-02', 'Meher Halo Ring', 'rings', 'wedding', 'ring', 'yellow', 'ruby', '22K Yellow Gold', 4.6, 62500, 4.7, 96, 'n'],
  ['ring-03', 'Ira Twist Band', 'rings', 'aasmaniyat', 'ring', 'rose', 'diamond', '18K Rose Gold', 2.4, 28900, 4.6, 158, ''],
  ['ring-04', 'Vanya Emerald Ring', 'rings', 'gold', 'ring', 'yellow', 'emerald', '22K Yellow Gold', 5.1, 54300, 4.5, 61, 'n'],
  ['ring-05', 'Tara Classic Solitaire', 'rings', 'diamond', 'ring', 'yellow', 'diamond', '18K Yellow Gold', 3.8, 71200, 4.9, 302, 'b'],
  ['neck-01', 'Rivaah Bridal Necklace', 'necklaces', 'wedding', 'necklace', 'yellow', 'ruby', '22K Yellow Gold', 38.5, 312000, 4.9, 77, 'b'],
  ['neck-02', 'Mirai Diamond Chain', 'necklaces', 'aasmaniyat', 'necklace', 'rose', 'diamond', '18K Rose Gold', 6.2, 58400, 4.6, 133, ''],
  ['neck-03', 'Kalindi Temple Choker', 'necklaces', 'gold', 'necklace', 'yellow', 'emerald', '22K Yellow Gold', 24.1, 198000, 4.7, 45, 'n'],
  ['neck-04', 'Noor Pearl Strand', 'necklaces', 'aasmaniyat', 'necklace', 'white', 'pearl', '18K White Gold', 9.4, 76800, 4.5, 88, ''],
  ['neck-05', 'Saanvi Sapphire Collar', 'necklaces', 'diamond', 'necklace', 'white', 'sapphire', '18K White Gold', 11.0, 134500, 4.8, 52, 'n'],
  ['ear-01', 'Zara Drop Earrings', 'earrings', 'aasmaniyat', 'earrings', 'rose', 'diamond', '18K Rose Gold', 3.9, 36700, 4.7, 189, 'b'],
  ['ear-02', 'Jhumka Royale', 'earrings', 'gold', 'earrings', 'yellow', 'ruby', '22K Yellow Gold', 12.6, 94200, 4.8, 140, 'b'],
  ['ear-03', 'Lumi Studs', 'earrings', 'diamond', 'earrings', 'white', 'diamond', '18K White Gold', 1.8, 24900, 4.9, 410, ''],
  ['ear-04', 'Anaya Chandbali', 'earrings', 'wedding', 'earrings', 'yellow', 'emerald', '22K Yellow Gold', 14.8, 118000, 4.6, 67, 'n'],
  ['ear-05', 'Sia Pearl Danglers', 'earrings', 'aasmaniyat', 'earrings', 'rose', 'pearl', '14K Rose Gold', 3.1, 19800, 4.4, 73, ''],
  ['bang-01', 'Kanika Gold Bangle', 'bangles', 'gold', 'bangle', 'yellow', 'none', '22K Yellow Gold', 16.4, 112000, 4.8, 220, 'b'],
  ['bang-02', 'Eshna Diamond Bangle', 'bangles', 'diamond', 'bangle', 'white', 'diamond', '18K White Gold', 9.7, 145800, 4.7, 59, 'n'],
  ['bang-03', 'Rukmini Kada', 'bangles', 'wedding', 'bangle', 'yellow', 'ruby', '22K Yellow Gold', 28.2, 205000, 4.9, 84, ''],
  ['bang-04', 'Dhara Slim Bangle', 'bangles', 'aasmaniyat', 'bangle', 'rose', 'none', '14K Rose Gold', 5.3, 31200, 4.5, 117, ''],
  ['bang-05', 'Mauli Emerald Bangle', 'bangles', 'gold', 'bangle', 'yellow', 'emerald', '22K Yellow Gold', 19.0, 158000, 4.6, 38, 'n'],
  ['mang-01', 'Aasha Heart Mangalsutra', 'mangalsutra', 'aasmaniyat', 'mangalsutra', 'rose', 'diamond', '18K Rose Gold', 5.1, 41500, 4.8, 276, 'b'],
  ['mang-02', 'Surya Temple Mangalsutra', 'mangalsutra', 'gold', 'mangalsutra', 'yellow', 'ruby', '22K Yellow Gold', 9.4, 79800, 4.6, 64, ''],
  ['mang-03', 'Tarini Solitaire Mangalsutra', 'mangalsutra', 'diamond', 'mangalsutra', 'white', 'diamond', '18K White Gold', 4.9, 53600, 4.7, 91, 'n'],
  ['mang-04', 'Om Gold Mangalsutra', 'mangalsutra', 'wedding', 'mangalsutra', 'yellow', 'none', '22K Yellow Gold', 8.3, 66400, 4.9, 335, 'b'],
  ['mang-05', 'Ishani Pearl Mangalsutra', 'mangalsutra', 'aasmaniyat', 'mangalsutra', 'white', 'pearl', '14K White Gold', 4.1, 34900, 4.4, 49, ''],
];

const gemName: Record<GemType, string> = { diamond: 'certified diamonds', ruby: 'rubies', emerald: 'emeralds', sapphire: 'sapphires', pearl: 'pearls', none: 'a polished finish' };

const placeholderProducts: Product[] = rows.map(([id, name, cat, col, shape, tone, gem, metal, grams, price, rating, reviewCount, flags]) => ({
  id, name, categoryId: cat, collectionId: col, shape, tone, gem, metal,
  weightGrams: grams, price, mrp: Math.round((price * 1.12) / 100) * 100, rating, reviewCount,
  description: `${name} is crafted in ${metal} with ${gemName[gem]}, finished by hand for a luminous, lasting shine.`,
  highlights: [metal, `${grams} g approx. gold weight`, gem === 'none' ? 'Hand-polished finish' : `Set with ${gemName[gem]}`, 'BIS hallmarked gold'],
  sizes: shape === 'ring' ? ['10', '12', '14', '16', '18'] : shape === 'bangle' ? ['2.2', '2.4', '2.6', '2.8'] : undefined,
  tags: [cat, col, tone, gem].filter((t) => t !== 'none'),
  isNew: flags.includes('n'), isBestseller: flags.includes('b'),
  images: [],
}));

// ---------------------------------------------------------------------------
// Real data captured from indriya.com (see scripts/sync-indriya.mjs)
// ---------------------------------------------------------------------------
interface GeneratedProduct { id: string; name: string; price?: number | null; mrp?: number | null; category: string; collection?: string | null; href?: string; image?: string | null; extraImages?: string[]; description?: string | null; longDescription?: string | null; specs?: Record<string, string>; code?: string | null }
interface GeneratedBanner { id: string; title?: string; href?: string; image?: string | null }
interface GeneratedFile { logo?: string | null; products: GeneratedProduct[]; banners: GeneratedBanner[]; collections: { id: string; image?: string | null }[] }

const img = (key?: string | null): ImageRef | undefined => (key ? generatedImages[key] : undefined);
const detectTone = (t: string): MetalTone => (/rose|pink/i.test(t) ? 'rose' : /white|platinum|silver/i.test(t) ? 'white' : 'yellow');
const detectGem = (t: string): GemType =>
  /diamond|solitaire/i.test(t) ? 'diamond' : /ruby|polki/i.test(t) ? 'ruby' : /emerald/i.test(t) ? 'emerald' : /sapphire/i.test(t) ? 'sapphire' : /pearl/i.test(t) ? 'pearl' : 'none';
const shapeFor = (cat: string): JewelShape => categories.find((c) => c.id === cat)?.shape ?? 'pendant';

const fromGenerated = (g: GeneratedProduct): Product => {
  const text = `${g.name} ${g.description ?? ''}`;
  const gem = detectGem(text);
  const shape = shapeFor(g.category);
  const price = g.price ?? 0;
  // "Explore Devi Padma Gold Necklace in 22KT Yellow Gold, weighing 67.130000 g Gross wt. ..."
  const metalMatch = g.description?.match(/in (\d{2}KT [A-Za-z ]+?Gold)/i);
  const metal = (metalMatch?.[1] ?? 'Gold').replace(/KT/i, 'K').replace(/Pink/i, 'Rose');
  const weight = g.description?.match(/weighing ([\d.]+) ?g/i);
  const weightGrams = weight ? Math.round(parseFloat(weight[1]) * 100) / 100 : undefined;
  const specs = g.specs ?? {};
  // Meta text ends with the site's own promises, e.g. "✔Attractive Offers ✔Lifetime Exchange ✔100% Certified".
  const promises = [...(g.description ?? '').matchAll(/✔\s*([^✔]+)/g)].map((m) => m[1].trim()).filter(Boolean);
  const longText = (g.longDescription ?? '').replace(/opens in a new tab/gi, ' ').replace(/\s+/g, ' ').trim();
  // Only trust scraped copy that reads like a real description (not just the product title / UI text).
  const cleanLong = longText.length > g.name.length + 60 && !/agree to be contacted|T&C|Privacy Policy/i.test(longText) ? longText : undefined;
  return {
    id: g.id, name: g.name, categoryId: g.category, collectionId: g.collection ?? '', shape, tone: detectTone(`${metal} ${text}`), gem,
    metal, weightGrams, price, mrp: g.mrp && g.mrp > price ? g.mrp : price,
    description: cleanLong || `${g.name} in ${metal}${weightGrams ? `, ${weightGrams} g gross weight` : ''}.`,
    highlights: [
      metal,
      ...(weightGrams ? [`${weightGrams} g gross weight`] : []),
      ...Object.entries(specs).map(([k, v]) => `${k}: ${v}`),
      gem === 'diamond' ? 'Certified natural diamonds' : gem === 'none' ? 'Hand-finished' : `Set with ${gemName[gem]}`,
      'BIS hallmarked gold',
      ...promises,
    ],
    sizes: shape === 'ring' ? ['10', '12', '14', '16', '18'] : g.category === 'bangles' ? ['2.2', '2.4', '2.6', '2.8'] : undefined,
    tags: [g.category, g.collection ?? '', detectTone(metal), gem].filter((t) => t && t !== 'none'),
    images: [g.image, ...(g.extraImages ?? [])].map(img).filter((x): x is ImageRef => x !== undefined),
    specs, code: g.code ?? undefined, href: g.href,
  };
};

const gen = generated as unknown as GeneratedFile;
const realProducts = gen.products.filter((p) => p.price && img(p.image)).map(fromGenerated);
export const isLiveCatalog = realProducts.length >= 8;
export const brandLogo: ImageRef | undefined = img(gen.logo);

// Banner copy mirrors the text printed on the site's own banners (matched by link).
const bannerMeta = (b: GeneratedBanner): Omit<Banner, 'id' | 'image'> => {
  const href = b.href ?? '';
  const base = { tone: 'white' as MetalTone, gem: 'diamond' as GemType, shape: 'earrings' as JewelShape, gradient: ['#011B45', '#0B47A3'] as [string, string], imageHasText: true };
  if (/diamond/i.test(href)) return { ...base, eyebrow: 'Indriya Diamonds', title: 'The highest sparkle, chosen for you', subtitle: 'Certified natural diamonds', cta: 'Explore diamonds', target: { collection: 'diamond' } };
  if (/igp\./i.test(href)) return { ...base, eyebrow: 'Golden Programs', title: 'Own your dream jewellery', subtitle: 'Flexible monthly payments and attractive discounts', cta: 'Start saving today', target: {}, externalUrl: href };
  if (/gold-exchange/i.test(href)) return { ...base, eyebrow: 'Gold exchange', title: '0% deduction on old gold exchange', subtitle: 'On any karat*', cta: 'Know more', target: {}, externalUrl: href };
  return { ...base, eyebrow: 'Festive edit', title: 'A festival of love', subtitle: 'Celebrated in 37,000+ designs', cta: 'Shop jewellery', target: {} };
};
const liveBanners: Banner[] = gen.banners.filter((b) => img(b.image)).map((b) => ({ id: b.id, image: img(b.image), ...bannerMeta(b) }));
const banners: Banner[] = isLiveCatalog && liveBanners.length ? liveBanners : placeholderBanners;

export const products: Product[] = isLiveCatalog ? realProducts : placeholderProducts;
// Collection tiles use a real product photo from the collection (or the site's own collection image).
const withCollectionImages: Collection[] = collections.map((c) => ({
  ...c,
  image: img(gen.collections.find((x) => x.id === c.id)?.image) ?? (isLiveCatalog ? products.find((p) => p.collectionId === c.id)?.images[0] : undefined),
}));
export const catalogSeed: Catalog = { categories, collections: withCollectionImages, products, banners };
