import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';

export interface ScreenProps extends ViewProps {
  edges?: ('top' | 'bottom')[];
  style?: StyleProp<ViewStyle>;
}

/** Background + safe-area padding. Scroll content handles its own insets. */
export function Screen({ edges = ['top'], style, ...rest }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      {...rest}
      style={[styles.root, { paddingTop: edges.includes('top') ? insets.top : 0, paddingBottom: edges.includes('bottom') ? insets.bottom : 0 }, style]}
    />
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.background } });
