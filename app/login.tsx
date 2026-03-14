import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<'email' | 'password' | null>(null);
  const { signIn } = useAuth();

  function handleSignIn() {
    signIn();
    router.replace('/(tabs)/dashboard');
  }

  return (
    <View style={styles.root}>
      {/* Background decoration orbs */}
      <LinearGradient
        colors={['rgba(123,79,212,0.22)', 'transparent']}
        style={styles.orbTop}
        start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(79,139,255,0.14)', 'transparent']}
        style={styles.orbBottom}
        start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoShadow}>
          <LinearGradient colors={['#9B6FE8', '#4F8BFF']} style={styles.logo} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={{ fontSize: 28, color: '#fff' }}>⚕</Text>
          </LinearGradient>
        </View>

        <Text style={styles.title}>Vitora</Text>
        <Text style={styles.sub}>Your personal health co-pilot</Text>

        <TextInput
          style={[styles.input, focused === 'email' && styles.inputFocused]}
          placeholder="Email address"
          placeholderTextColor="rgba(255,255,255,0.28)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
        />
        <TextInput
          style={[styles.input, focused === 'password' && styles.inputFocused]}
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.28)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused(null)}
        />

        <TouchableOpacity onPress={handleSignIn} activeOpacity={0.85} style={styles.btnWrap}>
          <LinearGradient colors={['#9B6FE8', '#4F8BFF']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.btnText}>Sign in</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerTxt}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={16} color="rgba(255,255,255,0.55)" style={{ marginRight: 8 }} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg, overflow: 'hidden' },
  orbTop: {
    position: 'absolute', width: 340, height: 340, borderRadius: 170,
    top: -120, alignSelf: 'center',
  },
  orbBottom: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    bottom: 20, right: -80,
  },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 32 },
  logoShadow: {
    alignSelf: 'center', marginBottom: 18,
    shadowColor: '#7B4FD4', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55, shadowRadius: 18, elevation: 14,
  },
  logo: {
    width: 72, height: 72, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 34, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 6, letterSpacing: -0.5 },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 32, letterSpacing: 0.4 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, marginBottom: 10,
    fontSize: 13, color: '#fff',
  },
  inputFocused: {
    borderColor: 'rgba(123,79,212,0.6)',
    backgroundColor: 'rgba(123,79,212,0.07)',
  },
  btnWrap: {
    marginTop: 6, borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  btn: { paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerTxt: { fontSize: 11, color: 'rgba(255,255,255,0.22)', letterSpacing: 0.5 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingVertical: 12,
  },
  googleText: { color: 'rgba(255,255,255,0.55)', fontSize: 13 },
});
