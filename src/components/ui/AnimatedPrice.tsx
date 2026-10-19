import { useCountUp } from '@/hooks/useCountUp';
import { formatINR } from '@/utils/format';
import { Text, type TextProps } from './Text';

export function AnimatedPrice({ value, ...rest }: { value: number } & Omit<TextProps, 'children'>) {
  const v = useCountUp(value, 550);
  return <Text {...rest}>{formatINR(v)}</Text>;
}
