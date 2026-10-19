/**
 * PLACEHOLDER CATALOG — illustrative demo data, not the real Indriya range.
 * Replace via the API layer (services/api) with live data; types stay the same.
 */
import { assetUrl } from '@/config/remoteAssets';
import type { Banner, Catalog, Category, Collection, GemType, JewelShape, MetalTone, Product } from '@/features/catalog/types';

export const categories: Category[] = [
  { id: 'rings', name: 'Rings', tagline: 'Promise, worn daily', shape: 'ring' },
  { id: 'necklaces', name: 'Necklaces', tagline: 'Drape in light', shape: 'necklace' },
  { id: 'earrings', name: 'Earrings', tagline: 'Frame your face', shape: 'earrings' },
  { id: 'bangles', name: 'Bangles', tagline: 'Stack your story', shape: 'bangle' },
  { id: 'pendants', name: 'Pendants', tagline: 'Close to the heart', shape: 'pendant' },
];

export const collections: Collection[] = [
  { id: 'everyday', name: 'Everyday Elegance', tagline: 'Light, wearable, effortless', description: 'Featherlight pieces designed to move with you from desk to dinner.', tone: 'rose', gem: 'diamond', shape: 'pendant' },
  { id: 'bridal', name: 'Bridal Radiance', tagline: 'For the day you remember forever', description: 'Statement pieces with generous sparkle for life’s grandest ceremonies.', tone: 'yellow', gem: 'ruby', shape: 'necklace' },
  { id: 'festive', name: 'Festive Glow', tagline: 'Celebrate in gold', description: 'Warm, traditional silhouettes reimagined for every festival.', tone: 'yellow', gem: 'emerald', shape: 'bangle' },
  { id: 'solitaire', name: 'Solitaire Stories', tagline: 'One stone, endless meaning', description: 'Timeless solitaires set to catch every glance.', tone: 'white', gem: 'diamond', shape: 'ring' },
];

export const banners: Banner[] = [
  { id: 'b1', eyebrow: 'New season', title: 'Light that\nlives on you', subtitle: 'Discover the Everyday Elegance edit', cta: 'Explore the edit', target: { collection: 'everyday' }, tone: 'rose', gem: 'diamond', shape: 'pendant', gradient: ['#5B1A2B', '#8A3248'] },
  { id: 'b2', eyebrow: 'Wedding season', title: 'Bridal pieces,\nbeautifully bold', subtitle: 'Necklaces and sets for the big day', cta: 'Shop bridal', target: { collection: 'bridal' }, tone: 'yellow', gem: 'ruby', shape: 'necklace', gradient: ['#2F1A12', '#6B3E1E'] },
  { id: 'b3', eyebrow: 'Solitaires', title: 'One stone.\nEvery emotion.', subtitle: 'Rings made to be remembered', cta: 'Find your ring', target: { category: 'rings' }, tone: 'white', gem: 'diamond', shape: 'ring', gradient: ['#1E2A3A', '#3F5774'] },
];

type Row = [id: string, name: string, cat: string, col: string, shape: JewelShape, tone: MetalTone, gem: GemType, metal: string, grams: number, price: number, rating: number, reviews: number, flags: string];

const rows: Row[] = [
  ['ring-01', 'Aarna Solitaire Ring', 'rings', 'solitaire', 'ring', 'white', 'diamond', '18K White Gold', 3.2, 48900, 4.8, 214, 'b'],
  ['ring-02', 'Meher Halo Ring', 'rings', 'bridal', 'ring', 'yellow', 'ruby', '22K Yellow Gold', 4.6, 62500, 4.7, 96, 'n'],
  ['ring-03', 'Ira Twist Band', 'rings', 'everyday', 'ring', 'rose', 'diamond', '18K Rose Gold', 2.4, 28900, 4.6, 158, ''],
  ['ring-04', 'Vanya Emerald Ring', 'rings', 'festive', 'ring', 'yellow', 'emerald', '22K Yellow Gold', 5.1, 54300, 4.5, 61, 'n'],
  ['ring-05', 'Tara Classic Solitaire', 'rings', 'solitaire', 'ring', 'yellow', 'diamond', '18K Yellow Gold', 3.8, 71200, 4.9, 302, 'b'],
  ['neck-01', 'Rivaah Bridal Necklace', 'necklaces', 'bridal', 'necklace', 'yellow', 'ruby', '22K Yellow Gold', 38.5, 312000, 4.9, 77, 'b'],
  ['neck-02', 'Mirai Diamond Chain', 'necklaces', 'everyday', 'necklace', 'rose', 'diamond', '18K Rose Gold', 6.2, 58400, 4.6, 133, ''],
  ['neck-03', 'Kalindi Emerald Choker', 'necklaces', 'festive', 'necklace', 'yellow', 'emerald', '22K Yellow Gold', 24.1, 198000, 4.7, 45, 'n'],
  ['neck-04', 'Noor Pearl Strand', 'necklaces', 'everyday', 'necklace', 'white', 'pearl', '18K White Gold', 9.4, 76800, 4.5, 88, ''],
  ['neck-05', 'Saanvi Sapphire Collar', 'necklaces', 'solitaire', 'necklace', 'white', 'sapphire', '18K White Gold', 11.0, 134500, 4.8, 52, 'n'],
  ['ear-01', 'Zara Drop Earrings', 'earrings', 'everyday', 'earrings', 'rose', 'diamond', '18K Rose Gold', 3.9, 36700, 4.7, 189, 'b'],
  ['ear-02', 'Jhumka Royale', 'earrings', 'festive', 'earrings', 'yellow', 'ruby', '22K Yellow Gold', 12.6, 94200, 4.8, 140, 'b'],
  ['ear-03', 'Lumi Studs', 'earrings', 'solitaire', 'earrings', 'white', 'diamond', '18K White Gold', 1.8, 24900, 4.9, 410, ''],
  ['ear-04', 'Anaya Chandbali', 'earrings', 'bridal', 'earrings', 'yellow', 'emerald', '22K Yellow Gold', 14.8, 118000, 4.6, 67, 'n'],
  ['ear-05', 'Sia Pearl Danglers', 'earrings', 'everyday', 'earrings', 'rose', 'pearl', '14K Rose Gold', 3.1, 19800, 4.4, 73, ''],
  ['bang-01', 'Kanika Gold Bangle', 'bangles', 'festive', 'bangle', 'yellow', 'none', '22K Yellow Gold', 16.4, 112000, 4.8, 220, 'b'],
  ['bang-02', 'Eshna Diamond Bangle', 'bangles', 'solitaire', 'bangle', 'white', 'diamond', '18K White Gold', 9.7, 145800, 4.7, 59, 'n'],
  ['bang-03', 'Rukmini Kada', 'bangles', 'bridal', 'bangle', 'yellow', 'ruby', '22K Yellow Gold', 28.2, 205000, 4.9, 84, ''],
  ['bang-04', 'Dhara Slim Bangle', 'bangles', 'everyday', 'bangle', 'rose', 'none', '14K Rose Gold', 5.3, 31200, 4.5, 117, ''],
  ['bang-05', 'Mauli Emerald Bangle', 'bangles', 'festive', 'bangle', 'yellow', 'emerald', '22K Yellow Gold', 19.0, 158000, 4.6, 38, 'n'],
  ['pend-01', 'Aasha Heart Pendant', 'pendants', 'everyday', 'pendant', 'rose', 'diamond', '18K Rose Gold', 2.1, 21500, 4.8, 276, 'b'],
  ['pend-02', 'Surya Ruby Pendant', 'pendants', 'bridal', 'pendant', 'yellow', 'ruby', '22K Yellow Gold', 4.4, 39800, 4.6, 64, ''],
  ['pend-03', 'Tarini Sapphire Drop', 'pendants', 'solitaire', 'pendant', 'white', 'sapphire', '18K White Gold', 2.9, 33600, 4.7, 91, 'n'],
  ['pend-04', 'Om Pendant', 'pendants', 'festive', 'pendant', 'yellow', 'none', '22K Yellow Gold', 3.3, 26400, 4.9, 335, 'b'],
  ['pend-05', 'Ishani Pearl Pendant', 'pendants', 'everyday', 'pendant', 'white', 'pearl', '14K White Gold', 1.9, 14900, 4.4, 49, ''],
];

const gemName: Record<GemType, string> = { diamond: 'diamonds', ruby: 'rubies', emerald: 'emeralds', sapphire: 'sapphires', pearl: 'pearls', none: 'a polished finish' };

const buildProduct = ([id, name, cat, col, shape, tone, gem, metal, grams, price, rating, reviewCount, flags]: Row): Product => {
  const url = assetUrl(`product:${id}`);
  return {
    id, name, categoryId: cat, collectionId: col, shape, tone, gem, metal,
    weightGrams: grams, price, mrp: Math.round((price * 1.12) / 100) * 100, rating, reviewCount,
    description: `${name} is crafted in ${metal} with ${gemName[gem]}, finished by hand for a luminous, lasting shine.`,
    highlights: [metal, `${grams} g approx. gold weight`, gem === 'none' ? 'Hand-polished finish' : `Set with ${gemName[gem]}`, 'Certified hallmark', 'Free insured shipping'],
    sizes: shape === 'ring' ? ['10', '12', '14', '16', '18'] : shape === 'bangle' ? ['2.2', '2.4', '2.6', '2.8'] : undefined,
    tags: [cat, col, tone, gem].filter((t) => t !== 'none'),
    isNew: flags.includes('n'), isBestseller: flags.includes('b'),
    imageUrls: url ? [url] : [],
  };
};

export const products: Product[] = rows.map(buildProduct);

const withBannerImages = banners.map((b) => ({ ...b, imageUrl: assetUrl(`banner:${b.id}`) }));
const withCollectionImages: Collection[] = collections.map((c) => ({ ...c, imageUrl: assetUrl(`collection:${c.id}`) }));

export const catalogSeed: Catalog = { categories, collections: withCollectionImages, products, banners: withBannerImages };
