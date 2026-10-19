import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, fonts, radius } from '@/theme';

export function StoreBanner() {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text variant="overline" color="goldLight">Visit us</Text>
        <Text color="white" style={{ fontFamily: fonts.displayBold, fontSize: 28, lineHeight: 32 }}>See it. Feel it.{'\n'}Wear it.</Text>
        <Text variant="body" style={{ color: 'rgba(255,255,255,0.78)' }}>Find an Indriya showroom near you and explore the collection in person.</Text>
        <Button label="Find a store" variant="gold" icon="location-outline" onPress={() => router.push('/stores')} style={{ alignSelf: 'flex-start', marginTop: 6 }} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20 },
  card: { borderRadius: radius.xl, padding: 24, gap: 8 },
});
