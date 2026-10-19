import { View } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';

export function HomeSkeleton() {
  return (
    <View style={{ gap: 24 }}>
      <Skeleton height={560} radius={0} />
      <View style={{ flexDirection: 'row', gap: 18, paddingHorizontal: 20 }}>
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} width={84} height={84} radius={42} />)}
      </View>
      <View style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 20 }}>
        {[0, 1].map((i) => <Skeleton key={i} width={172} height={260} radius={18} />)}
      </View>
    </View>
  );
}
