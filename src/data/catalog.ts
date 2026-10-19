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
];

export const collections: Collection[] = [
  { id: 'aasmaniyat', name: 'Aasmaniyat', tagline: 'Celestial certified diamonds', description: 'Diamond jewellery inspired by the sky, for modern and bridal wear.', tone: 'white', gem: 'diamond', shape: 'earrings' },
  { id: 'diamonds', name: 'Indriya Diamonds', tagline: 'Certified natural diamonds', description: 'Earrings, necklaces, rings and bangles set with certified natural diamonds.', tone: 'rose', gem: 'diamond', shape: 'ring' },
  { id: 'temple', name: 'Temple Jewellery', tagline: '22KT gold heritage', description: 'Timeless temple designs in 22KT gold, from the Anantara line.', tone: 'yellow', gem: 'ruby', shape: 'necklace' },
  { id: 'bridal', name: 'Saptapadma Bridal', tagline: 'Bridal collection 2026', description: 'Statement bridal pieces for the day you remember forever.', tone: 'yellow', gem: 'emerald', shape: 'bangle' },
];

const placeholderBanners: Banner[] = [
  { id: 'b1', eyebrow: 'Aasmaniyat', title: 'Diamonds written\nin the sky', subtitle: 'Certified celestial diamond jewellery', cta: 'Explore Aasmaniyat', target: { collection: 'aasmaniyat' }, tone: 'white', gem: 'diamond', shape: 'earrings', gradient: ['#011B45', '#0B47A3'] },
  { id: 'b2', eyebrow: 'Bridal 2026', title: 'Saptapadma,\nseven steps in gold', subtitle: 'The bridal collection', cta: 'Shop bridal', target: { collection: 'bridal' }, tone: 'yellow', gem: 'ruby', shape: 'necklace', gradient: ['#022E71', '#1B5CC0'] },
  { id: 'b3', eyebrow: 'Temple', title: 'Heritage in\n22KT gold', subtitle: 'Temple jewellery, Anantara line', cta: 'Discover temple', target: { collection: 'temple' }, tone: 'yellow', gem: 'none', shape: 'bangle', gradient: ['#0A1F44', '#2E4F86'] },
];

// ---------------------------------------------------------------------------
// PLACEHOLDER products (used until real data is synced)
// ---------------------------------------------------------------------------
type Row = [id: string, name: string, cat: string, col: string, shape: JewelShape, tone: MetalTone, gem: GemType, metal: string, grams: number, price: number, rating: number, reviews: number, flags: string];

const rows: Row[] = [
  ['ring-01', 'Aarna Solitaire Ring', 'rings', 'diamonds', 'ring', 'white', 'diamond', '18K White Gold', 3.2, 48900, 4.8, 214, 'b'],
  ['ring-02', 'Meher Halo Ring', 'rings', 'bridal', 'ring', 'yellow', 'ruby', '22K Yellow Gold', 4.6, 62500, 4.7, 96, 'n'],
  ['ring-03', 'Ira Twist Band', 'rings', 'aasmaniyat', 'ring', 'rose', 'diamond', '18K Rose Gold', 2.4, 28900, 4.6, 158, ''],
  ['ring-04', 'Vanya Emerald Ring', 'rings', 'temple', 'ring', 'yellow', 'emerald', '22K Yellow Gold', 5.1, 54300, 4.5, 61, 'n'],
  ['ring-05', 'Tara Classic Solitaire', 'rings', 'diamonds', 'ring', 'yellow', 'diamond', '18K Yellow Gold', 3.8, 71200, 4.9, 302, 'b'],
  ['neck-01', 'Rivaah Bridal Necklace', 'necklaces', 'bridal', 'necklace', 'yellow', 'ruby', '22K Yellow Gold', 38.5, 312000, 4.9, 77, 'b'],
  ['neck-02', 'Mirai Diamond Chain', 'necklaces', 'aasmaniyat', 'necklace', 'rose', 'diamond', '18K Rose Gold', 6.2, 58400, 4.6, 133, ''],
  ['neck-03', 'Kalindi Temple Choker', 'necklaces', 'temple', 'necklace', 'yellow', 'emerald', '22K Yellow Gold', 24.1, 198000, 4.7, 45, 'n'],
  ['neck-04', 'Noor Pearl Strand', 'necklaces', 'aasmaniyat', 'necklace', 'white', 'pearl', '18K White Gold', 9.4, 76800, 4.5, 88, ''],
  ['neck-05', 'Saanvi Sapphire Collar', 'necklaces', 'diamonds', 'necklace', 'white', 'sapphire', '18K White Gold', 11.0, 134500, 4.8, 52, 'n'],
  ['ear-01', 'Zara Drop Earrings', 'earrings', 'aasmaniyat', 'earrings', 'rose', 'diamond', '18K Rose Gold', 3.9, 36700, 4.7, 189, 'b'],
  ['ear-02', 'Jhumka Royale', 'earrings', 'temple', 'earrings', 'yellow', 'ruby', '22K Yellow Gold', 12.6, 94200, 4.8, 140, 'b'],
  ['ear-03', 'Lumi Studs', 'earrings', 'diamonds', 'earrings', 'white', 'diamond', '18K White Gold', 1.8, 24900, 4.9, 410, ''],
  ['ear-04', 'Anaya Chandbali', 'earrings', 'bridal', 'earrings', 'yellow', 'emerald', '22K Yellow Gold', 14.8, 118000, 4.6, 67, 'n'],
  ['ear-05', 'Sia Pearl Danglers', 'earrings', 'aasmaniyat', 'earrings', 'rose', 'pearl', '14K Rose Gold', 3.1, 19800, 4.4, 73, ''],
  ['bang-01', 'Kanika Gold Bangle', 'bangles', 'temple', 'bangle', 'yellow', 'none', '22K Yellow Gold', 16.4, 112000, 4.8, 220, 'b'],
  ['bang-02', 'Eshna Diamond Bangle', 'bangles', 'diamonds', 'bangle', 'white', 'diamond', '18K White Gold', 9.7, 145800, 4.7, 59, 'n'],
  ['bang-03', 'Rukmini Kada', 'bangles', 'bridal', 'bangle', 'yellow', 'ruby', '22K Yellow Gold', 28.2, 205000, 4.9, 84, ''],
  ['bang-04', 'Dhara Slim Bangle', 'bangles', 'aasmaniyat', 'bangle', 'rose', 'none', '14K Rose Gold', 5.3, 31200, 4.5, 117, ''],
  ['bang-05', 'Mauli Emerald Bangle', 'bangles', 'temple', 'bangle', 'yellow', 'emerald', '22K Yellow Gold', 19.0, 158000, 4.6, 38, 'n'],
  ['mang-01', 'Aasha Heart Mangalsutra', 'mangalsutra', 'aasmaniyat', 'mangalsutra', 'rose', 'diamond', '18K Rose Gold', 5.1, 41500, 4.8, 276, 'b'],
  ['mang-02', 'Surya Temple Mangalsutra', 'mangalsutra', 'temple', 'mangalsutra', 'yellow', 'ruby', '22K Yellow Gold', 9.4, 79800, 4.6, 64, ''],
  ['mang-03', 'Tarini Solitaire Mangalsutra', 'mangalsutra', 'diamonds', 'mangalsutra', 'white', 'diamond', '18K White Gold', 4.9, 53600, 4.7, 91, 'n'],
  ['mang-04', 'Om Gold Mangalsutra', 'mangalsutra', 'bridal', 'mangalsutra', 'yellow', 'none', '22K Yellow Gold', 8.3, 66400, 4.9, 335, 'b'],
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
interface GeneratedProduct { id: string; name: string; price?: number | null; mrp?: number | null; category: string; collection?: string | null; href?: string; image?: string | null; extraImages?: string[] }
interface GeneratedBanner { id: string; title?: string; subtitle?: string; href?: string; image?: string | null }
interface GeneratedFile { products: GeneratedProduct[]; banners: GeneratedBanner[]; collections: { id: string; image?: string | null }[] }

const img = (key?: string | null): ImageRef | undefined => (key ? generatedImages[key] : undefined);
const detectTone = (t: string): MetalTone => (/rose/i.test(t) ? 'rose' : /white|platinum|silver/i.test(t) ? 'white' : 'yellow');
const detectGem = (t: string): GemType =>
  /diamond|solitaire/i.test(t) ? 'diamond' : /ruby|polki/i.test(t) ? 'ruby' : /emerald/i.test(t) ? 'emerald' : /sapphire/i.test(t) ? 'sapphire' : /pearl/i.test(t) ? 'pearl' : 'none';
const detectMetal = (t: string): string => {
  const k = t.match(/\b(14|18|22|24)\s?(?:k|kt|karat)\b/i);
  const tone = detectTone(t);
  return `${k ? `${k[1]}K ` : ''}${tone === 'rose' ? 'Rose' : tone === 'white' ? 'White' : 'Yellow'} Gold`;
};
const shapeFor = (cat: string): JewelShape => categories.find((c) => c.id === cat)?.shape ?? 'pendant';

const fromGenerated = (g: GeneratedProduct, i: number): Product => {
  const text = `${g.name} ${g.href ?? ''}`;
  const gem = detectGem(text);
  const shape = shapeFor(g.category);
  const price = g.price ?? 0;
  return {
    id: g.id, name: g.name, categoryId: g.category, collectionId: g.collection ?? '', shape, tone: detectTone(text), gem,
    metal: detectMetal(text), price, mrp: g.mrp && g.mrp > price ? g.mrp : price,
    description: `${g.name} from the Indriya collection.`,
    highlights: [detectMetal(text), gem === 'none' ? 'Hand-finished' : `Set with ${gemName[gem]}`, 'BIS hallmarked gold', 'Certified natural diamonds where applicable'],
    sizes: shape === 'ring' ? ['10', '12', '14', '16', '18'] : shape === 'bangle' ? ['2.2', '2.4', '2.6', '2.8'] : undefined,
    tags: [g.category, g.collection ?? '', detectTone(text), gem].filter((t) => t && t !== 'none'),
    isNew: i % 7 === 0, isBestseller: i % 5 === 0,
    images: [g.image, ...(g.extraImages ?? [])].map(img).filter((x): x is ImageRef => x !== undefined),
    href: g.href,
  };
};

const gen = generated as unknown as GeneratedFile;
const realProducts = gen.products.filter((p) => p.price && img(p.image)).map(fromGenerated);
export const isLiveCatalog = realProducts.length >= 8;

const banners: Banner[] = placeholderBanners.map((b, i) => ({ ...b, image: img(gen.banners[i]?.image) }));
const withCollectionImages: Collection[] = collections.map((c) => ({ ...c, image: img(gen.collections.find((x) => x.id === c.id)?.image) }));

export const products: Product[] = isLiveCatalog ? realProducts : placeholderProducts;
export const catalogSeed: Catalog = { categories, collections: withCollectionImages, products, banners };
