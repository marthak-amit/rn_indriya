import { useRouter } from 'expo-router';
import { useCallback } from 'react';

/** Back that still works on a cold deep link (no history) by falling back to Home. */
export function useGoBack(): () => void {
  const router = useRouter();
  return useCallback(() => (router.canGoBack() ? router.back() : router.replace('/')), [router]);
}
