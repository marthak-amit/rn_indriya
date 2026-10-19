import { CormorantGaramond_500Medium, CormorantGaramond_500Medium_Italic, CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond';
import { Jost_300Light, Jost_400Regular, Jost_500Medium, Jost_600SemiBold } from '@expo-google-fonts/jost';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from '@/components/ui/Toaster';
import { AnimatedSplash } from '@/features/ui/AnimatedSplash';
import { useGetCatalogQuery } from '@/services/api/indriyaApi';
import { persistor, store } from '@/store';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** Warms the catalog cache as early as possible so Home renders from cache after the intro. */
function CatalogPrefetch() {
  useGetCatalogQuery();
  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_500Medium, CormorantGaramond_500Medium_Italic, CormorantGaramond_600SemiBold,
    Jost_300Light, Jost_400Regular, Jost_500Medium, Jost_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <CatalogPrefetch />
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' }}>
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen name="product/[id]" options={{ animation: 'fade_from_bottom' }} />
              <Stack.Screen name="search" options={{ animation: 'fade' }} />
              <Stack.Screen name="auth" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="order-success/[id]" options={{ gestureEnabled: false, animation: 'fade' }} />
            </Stack>
            <Toaster />
            <AnimatedSplash />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.background } });
