import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ScrollView, TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

export type ModalRow = { label: string; value: string; color?: string };

export type ModalAction = { label: string; color: string; onPress: () => void };

export type ModalContent = {
  title: string;
  subtitle?: string;
  accent?: string;
  icon?: string;
  rows?: ModalRow[];
  body?: string;
  actions?: ModalAction[];
};

type Props = {
  visible: boolean;
  onClose: () => void;
  content: ModalContent | null;
};

export default function DetailModal({ visible, onClose, content }: Props) {
  const slide = useRef(new Animated.Value(300)).current;
  const fade  = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      iconScale.setValue(0.5);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 220 }),
      ]).start(() => {
        Animated.spring(iconScale, { toValue: 1, damping: 14, stiffness: 200, useNativeDriver: true }).start();
      });
    } else {
      Animated.parallel([
        Animated.timing(fade,  { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 300, duration: 180, useNativeDriver: true }),
      ]).start(({ finished }) => { if (finished) setRendered(false); });
    }
  }, [visible]);

  if (!rendered || !content) return null;

  const accent = content.accent ?? Colors.primary;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents={visible ? 'box-none' : 'none'}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[StyleSheet.absoluteFillObject, styles.overlay, { opacity: fade }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slide }] }]}>
        {/* Gradient header glow */}
        <LinearGradient
          colors={[accent + '28', accent + '00']}
          style={styles.headerGlow}
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
          pointerEvents="none"
        />

        <View style={styles.handle} />

        <Animated.View style={[styles.iconWrap, { borderColor: accent + '55', transform: [{ scale: iconScale }] }]}>
          <LinearGradient colors={[accent + '40', accent + '18']} style={StyleSheet.absoluteFillObject} />
          {content.icon
            ? <Text style={styles.iconTxt}>{content.icon}</Text>
            : <View style={[styles.iconDot, { backgroundColor: accent }]} />}
        </Animated.View>

        <Text style={styles.title}>{content.title}</Text>
        {content.subtitle
          ? <Text style={[styles.subtitle, { color: accent + 'aa' }]}>{content.subtitle}</Text>
          : null}

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {content.body
            ? <Text style={styles.bodyTxt}>{content.body}</Text>
            : null}

          {content.rows?.map((row, i) => (
            <View key={i}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={[styles.rowValue, { color: row.color ?? '#fff' }]}>{row.value}</Text>
              </View>
              {i < (content.rows!.length - 1) && (
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.07)', 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.rowDivider}
                />
              )}
            </View>
          ))}
        </ScrollView>

        {content.actions?.map((action, i) => (
          <TouchableOpacity key={i} activeOpacity={0.85} style={[styles.actionBtn, { borderColor: action.color + '44' }]} onPress={action.onPress}>
            <Text style={[styles.actionTxt, { color: action.color }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity activeOpacity={0.85} onPress={onClose}>
          <LinearGradient colors={[accent, accent + 'bb']} style={styles.closeBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.closeTxt}>Done</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: 'rgba(0,0,0,0.65)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#111120',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: 34,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    maxHeight: '78%', overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 140,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignSelf: 'center', marginBottom: 20,
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: 12,
    borderWidth: 1, overflow: 'hidden',
  },
  iconTxt: { fontSize: 24 },
  iconDot: { width: 16, height: 16, borderRadius: 8 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 4, letterSpacing: -0.3 },
  subtitle: { fontSize: 12, textAlign: 'center', marginBottom: 18, letterSpacing: 0.3 },
  body: { marginBottom: 16 },
  bodyTxt: { fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 21 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowDivider: { height: 1, marginBottom: 0 },
  rowLabel: { fontSize: 13, color: 'rgba(255,255,255,0.42)' },
  rowValue: { fontSize: 14, fontWeight: '600' },
  actionBtn: { borderRadius: 14, paddingVertical: 13, alignItems: 'center', marginTop: 8, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  actionTxt: { fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },
  closeBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  closeTxt: { color: '#fff', fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },
});
