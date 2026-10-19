/** Indian digit grouping (12,34,567) without relying on Intl availability. */
export const formatINR = (value: number): string => {
  const n = Math.round(value);
  const s = Math.abs(n).toString();
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
  return `${n < 0 ? '-' : ''}₹${grouped}`;
};

export const discountPercent = (price: number, mrp: number): number =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);

export const pluralize = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;

export const uid = (prefix = 'id'): string => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
