import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Reveal } from '@/components/ui/Reveal';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme';

type Icon = keyof typeof Ionicons.glyphMap;
const ITEMS: { icon: Icon; title: string; body: string }[] = [
  { icon: 'ribbon-outline', title: 'BIS Hallmark', body: 'Hallmarked gold' },
  { icon: 'diamond-outline', title: 'Certified diamonds', body: 'Natural & certified' },
  { icon: 'shield-checkmark-outline', title: 'Aditya Birla Group', body: 'Trust & reliability' },
  { icon: 'lock-closed-outline', title: 'Secure checkout', body: 'Safe, encrypted payments' },
];

export function TrustStrip() {
  return (
    <View style={styles.grid}>
      {ITEMS.map((it, i) => (
        <Reveal key={it.title} index={i} kind="zoom" style={styles.cell}>
          <View style={styles.icon}><Ionicons name={it.icon} size={22} color={colors.primary} /></View>
          <Text variant="bodyStrong" align="center" style={{ fontSize: 14 }}>{it.title}</Text>
          <Text variant="caption" color="muted" align="center">{it.body}</Text>
        </Reveal>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  cell: { width: '50%', padding: 8, alignItems: 'center', gap: 3 },
  icon: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
});
