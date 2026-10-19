export type MetalTone = 'yellow' | 'rose' | 'white';
export type GemType = 'diamond' | 'ruby' | 'emerald' | 'sapphire' | 'pearl' | 'none';
export type JewelShape = 'ring' | 'necklace' | 'earrings' | 'bangle' | 'pendant' | 'mangalsutra';

/** A bundled asset (`require(...)` id) or a remote image. */
export type ImageRef = number | { uri: string };

export interface Category {
  id: string;
  name: string;
  tagline: string;
  shape: JewelShape;
}

export interface Collection {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tone: MetalTone;
  gem: GemType;
  shape: JewelShape;
  image?: ImageRef;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  collectionId: string;
  price: number;
  mrp: number;
  metal: string; // e.g. "18K Rose Gold"
  tone: MetalTone;
  gem: GemType;
  shape: JewelShape;
  weightGrams?: number;
  rating?: number;
  reviewCount?: number;
  description: string;
  highlights: string[];
  sizes?: string[];
  tags: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  images: ImageRef[];
  /** Canonical product page on indriya.com, when known. */
  href?: string;
}

export interface Banner {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  target: { category?: string; collection?: string };
  tone: MetalTone;
  gem: GemType;
  shape: JewelShape;
  gradient: [string, string];
  image?: ImageRef;
}

export interface Catalog {
  categories: Category[];
  collections: Collection[];
  products: Product[];
  banners: Banner[];
}

export type SortKey = 'featured' | 'priceAsc' | 'priceDesc' | 'rating' | 'newest';

export interface Filters {
  categoryId: string | null;
  collectionId: string | null;
  metals: MetalTone[];
  priceMax: number | null;
  sort: SortKey;
  query: string;
}
