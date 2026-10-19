import { Ionicons } from '@expo/vector-icons';
import { useGoBack } from '@/hooks/useGoBack';
import { useMemo, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { Reveal } from '@/components/ui/Reveal';
import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { useGetStoresQuery } from '@/services/api/indriyaApi';
import { colors, radius, shadow } from '@/theme';

export default function StoresScreen() {
  const goBack = useGoBack();
  const { data, isLoading } = useGetStoresQuery();
  const [city, setCity] = useState<string | null>(null);
  const cities = useMemo(() => Array.from(new Set((data ?? []).map((s) => s.city))), [data]);
  const shown = (data ?? []).filter((s) => !city || s.city === city);

  const directions = (address: string) => {
    const q = encodeURIComponent(address);
    Linking.openURL(Platform.OS === 'ios' ? `http://maps.apple.com/?q=${q}` : `https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton name="chevron-back" label="Back" onPress={goBack} />
        <Text variant="heading" style={{ flex: 1, textAlign: 'center' }}>Find a store</Text>
        <View style={{ width: 42 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.center}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ flexGrow: 0, flexShrink: 0 }}>
            <Chip label="All cities" selected={!city} onPress={() => setCity(null)} />
            {cities.map((c) => <Chip key={c} label={c} selected={city === c} onPress={() => setCity(c)} />)}
          </ScrollView>
          {isLoading ? (
            [0, 1, 2].map((i) => <Skeleton key={i} height={140} radius={18} />)
          ) : (
            <Animated.View layout={LinearTransition} style={{ gap: 14 }}>
              {shown.map((s, i) => (
                <Reveal key={s.id} index={i}>
                  <Animated.View entering={FadeIn} layout={LinearTransition} style={[styles.card, shadow.soft]}>
                    <View style={styles.cardHead}>
                      <View style={styles.pin}><Ionicons name="storefront-outline" size={20} color={colors.primary} /></View>
                      <View style={{ flex: 1 }}>
                        <Text variant="subheading">{s.name}</Text>
                        <Text variant="caption" color="muted">{s.address}</Text>
                      </View>
                    </View>
                    <View style={styles.meta}>
                      <Ionicons name="time-outline" size={16} color={colors.gold} />
                      <Text variant="caption" color="inkSoft">Open daily · {s.hours}</Text>
                    </View>
                    <View style={styles.actions}>
                      <Button label="Call" variant="secondary" icon="call-outline" onPress={() => Linking.openURL(`tel:${s.phone.replace(/\s/g, '')}`)} style={{ flex: 1, minHeight: 42 }} />
                      <Button label="Directions" icon="navigate-outline" onPress={() => directions(s.address)} style={{ flex: 1, minHeight: 42 }} />
                    </View>
                  </Animated.View>
                </Reveal>
              ))}
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6 },
  content: { paddingBottom: 40 },
  center: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 16, gap: 14 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 12 },
  cardHead: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  pin: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 10 },
});
