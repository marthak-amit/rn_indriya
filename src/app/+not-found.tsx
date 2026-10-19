import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';

export default function NotFound() {
  const router = useRouter();
  return (
    <Screen>
      <EmptyState icon="compass-outline" title="Page not found" message="The page you’re looking for has moved or doesn’t exist." actionLabel="Go home" onAction={() => router.replace('/')} />
    </Screen>
  );
}
