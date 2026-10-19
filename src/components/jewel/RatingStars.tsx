import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { colors } from '@/theme';
import { Text } from '@/components/ui/Text';

export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Ionicons name="star" size={13} color={colors.gold} />
      <Text variant="caption" color="inkSoft" style={{ fontFamily: 'Jost_500Medium' }}>{rating.toFixed(1)}</Text>
      {count !== undefined ? <Text variant="caption" color="muted">({count})</Text> : null}
    </View>
  );
}
