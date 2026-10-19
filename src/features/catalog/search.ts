import type { Product } from './types';

const norm = (s: string) => s.toLowerCase().trim();

/** Token-AND search across name, category, collection, metal, gem and tags. */
export const searchProducts = (products: Product[], query: string): Product[] => {
  const tokens = norm(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  return products.filter((p) => {
    const haystack = norm([p.name, p.categoryId, p.collectionId, p.metal, p.gem, ...p.tags].join(' '));
    return tokens.every((t) => haystack.includes(t));
  });
};
