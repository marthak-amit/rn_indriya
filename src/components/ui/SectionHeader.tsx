import { StyleSheet, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export interface SectionHeaderProps {
  overline?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ overline, title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        {overline ? <Text variant="overline" color="gold">{overline}</Text> : null}
        <Text variant="heading">{title}</Text>
      </View>
      {actionLabel ? (
        <PressableScale onPress={onAction} haptic>
          <Text variant="bodyStrong" color="primary">{actionLabel}</Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, paddingHorizontal: 20, marginBottom: 14 } });
