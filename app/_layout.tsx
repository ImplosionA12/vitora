import { Stack, useRouter, useSegments, useNavigationContainerRef } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Colors } from '../constants/colors';
import { AuthProvider, useAuth } from '../context/auth';

function AuthGuard() {
  const { isLoggedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    const unsubscribe = navigationRef?.addListener('state', () => setNavReady(true));
    return () => unsubscribe?.();
  }, [navigationRef]);

  useEffect(() => {
    if (!navReady) return;
    const inTabs = segments[0] === '(tabs)';
    if (!isLoggedIn && inTabs) {
      router.replace('/login');
    }
  }, [isLoggedIn, segments, navReady]);

  return null;
}

function RootLayoutInner() {
  const inner = (
    <>
      <StatusBar style="light" />
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webBg}>
        <View style={styles.phone}>{inner}</View>
      </View>
    );
  }

  return inner;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  webBg: {
    // @ts-ignore
    width: '100vw',
    height: '100vh',
    backgroundColor: '#06060e',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  phone: {
    width: 375,
    // @ts-ignore
    height: '90vh',
    maxHeight: 812,
    backgroundColor: Colors.bg,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    // @ts-ignore
    boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(123,79,212,0.12)',
  },
});
