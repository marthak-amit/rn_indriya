import { useWindowDimensions } from 'react-native';

export const MAX_CONTENT_WIDTH = 1100;

/** Responsive grid metrics shared by list screens (phones → tablets → web). */
export function useLayoutMetrics(horizontalPadding = 16, gap = 12) {
  const { width: screenWidth, height } = useWindowDimensions();
  const width = Math.min(screenWidth, MAX_CONTENT_WIDTH);
  const columns = width < 600 ? 2 : width < 900 ? 3 : 4;
  const cardWidth = Math.floor((width - horizontalPadding * 2 - gap * (columns - 1)) / columns);
  return { screenWidth, width, height, columns, cardWidth, gap, horizontalPadding };
}
