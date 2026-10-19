/**
 * Remote image map. Keys are asset ids, values are absolute image URLs.
 *
 * The app renders hand-drawn vector jewellery (see components/jewel/JewelArt)
 * whenever a key has no URL, so everything works offline. Once images from
 * https://www.indriya.com are available, add them here, e.g.
 *
 *   'product:ring-01': 'https://www.indriya.com/path/to/ring-01.jpg',
 *   'banner:bridal':   'https://www.indriya.com/path/to/bridal-hero.jpg',
 *   'collection:festive': '...'
 *
 * No other code change is needed.
 */
export const remoteAssets: Record<string, string | undefined> = {};

export const assetUrl = (key: string): string | undefined => remoteAssets[key];
