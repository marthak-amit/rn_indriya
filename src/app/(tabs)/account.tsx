import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { Reveal } from '@/components/ui/Reveal';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { logout } from '@/features/auth/authSlice';
import { brand } from '@/config/brand';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, fonts, radius, shadow } from '@/theme';

type Row = { icon: keyof typeof Ionicons.glyphMap; label: string; hint?: string; onPress: () => void };

export default function AccountScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const orders = useAppSelector((s) => s.orders.list.length);
  const wish = useAppSelector((s) => s.wishlist.ids.length);
  const go = (href: Href) => () => router.push(href);

  const rows: Row[] = [
    { icon: 'receipt-outline', label: 'My orders', hint: orders ? `${orders}` : undefined, onPress: go('/orders') },
    { icon: 'heart-outline', label: 'Wishlist', hint: wish ? `${wish}` : undefined, onPress: go('/wishlist') },
    { icon: 'location-outline', label: 'Store locator', onPress: go('/stores') },
    { icon: 'mail-outline', label: 'Contact us', onPress: () => Linking.openURL(`mailto:${brand.supportEmail}`) },
    { icon: 'globe-outline', label: 'Visit indriya.com', onPress: () => Linking.openURL(brand.website) },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.center}>
          <Reveal>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.avatar}><Text color="white" style={{ fontFamily: fonts.displayBold, fontSize: 28 }}>{user ? user.name.charAt(0).toUpperCase() : '✦'}</Text></View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text color="white" style={{ fontFamily: fonts.displayBold, fontSize: 24, lineHeight: 28 }}>{user ? user.name : 'Welcome'}</Text>
                <Text variant="caption" style={{ color: 'rgba(255,255,255,0.78)' }}>{user ? user.email : 'Sign in for a personalised experience'}</Text>
              </View>
              {!user ? <Button label="Sign in" variant="gold" onPress={() => router.push('/auth')} /> : null}
            </LinearGradient>
          </Reveal>

          <View style={[styles.list, shadow.soft]}>
            {rows.map((r, i) => (
              <Reveal key={r.label} index={i + 1} kind="fade">
                <PressableScale onPress={r.onPress} haptic pressedScale={0.985} style={[styles.row, i > 0 && styles.rowBorder]} accessibilityLabel={r.label}>
                  <View style={styles.rowIcon}><Ionicons name={r.icon} size={20} color={colors.primary} /></View>
                  <Text variant="subheading" style={{ flex: 1 }}>{r.label}</Text>
                  {r.hint ? <Text variant="caption" color="muted">{r.hint}</Text> : null}
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </PressableScale>
              </Reveal>
            ))}
          </View>

          {user ? <Button label="Sign out" variant="secondary" onPress={() => dispatch(logout())} style={{ marginTop: 8 }} /> : null}
          <Text variant="caption" color="muted" align="center" style={{ marginTop: 12 }}>Indriya · Version 1.0.0</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 140 },
  center: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 16, gap: 16 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, borderRadius: radius.xl },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.goldLight },
  list: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, height: 62 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  rowIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});
