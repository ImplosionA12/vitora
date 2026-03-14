import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import DetailModal, { ModalContent } from '../../components/DetailModal';
import Toast from '../../components/Toast';

export default function HealthScreen() {
  const [filled, setFilled] = useState(6);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glassAnims = useRef([...Array(10)].map(() => new Animated.Value(0))).current;

  // initialise already-filled glasses
  React.useEffect(() => {
    glassAnims.slice(0, filled).forEach(a => a.setValue(1));
  }, []);

  function tapGlass(i: number) {
    const next = i + 1;
    setFilled(next);
    glassAnims.forEach((a, idx) => {
      if (idx < next) {
        Animated.spring(a, { toValue: 1, damping: 14, stiffness: 200, useNativeDriver: true }).start();
      } else {
        Animated.timing(a, { toValue: 0, duration: 150, useNativeDriver: true }).start();
      }
    });
    // Micro-feedback toast
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(`💧 +200ml logged — ${(next * 0.2).toFixed(1)}L total`);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['rgba(220,50,68,0.08)', 'transparent']}
        style={styles.bgOrb}
        start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>My Health</Text>

        {/* Heart Rate */}
        <View style={styles.hrCard}>
          <View style={styles.hrTopRow}>
            <Text style={styles.cardLabel}>HEART RATE</Text>
            <TouchableOpacity onPress={() => setModal({ title: 'Heart Rate Status', subtitle: 'Within healthy range', icon: '✅', accent: Colors.teal, body: 'Your heart rate is within the normal resting range of 60–100 bpm. Readings below 70 bpm at rest indicate good cardiovascular fitness.' })} activeOpacity={0.7}>
              <View style={styles.normalBadge}><Text style={styles.normalTxt}>Normal</Text></View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setModal({ title: 'Heart Rate', subtitle: "Today's overview", icon: '❤️', accent: '#DC324C', rows: [{ label: 'Current', value: '68 bpm', color: '#fff' }, { label: 'Resting', value: '58 bpm', color: Colors.teal }, { label: 'Max today', value: '142 bpm', color: Colors.amber }, { label: 'Min today', value: '54 bpm', color: Colors.blue }, { label: 'Average', value: '72 bpm', color: 'rgba(255,255,255,0.55)' }] })}>
            <View style={styles.hrValRow}>
              <Text style={styles.hrNum}>68</Text>
              <Text style={styles.hrBpm}>bpm</Text>
            </View>
            <Svg width="100%" height={42} viewBox="0 0 280 42" style={{ marginTop: 6, marginBottom: 2 }}>
              <Polyline
                points="0,21 28,21 44,21 56,5 64,37 72,8 80,28 94,21 118,21 134,21 152,21 164,4 172,38 180,7 188,28 202,21 280,21"
                stroke="#DC324C" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9"
              />
            </Svg>
          </TouchableOpacity>
          <View style={styles.hrMiniRow}>
            {[
              { val: '58', lbl: 'Resting', modal: { title: 'Resting HR', subtitle: 'Lowest recorded today', icon: '💤', accent: Colors.teal, body: '58 bpm is an excellent resting heart rate, indicating strong cardiovascular fitness. Athletes typically have resting HR between 40–60 bpm.' } },
              { val: '142', lbl: 'Max today', modal: { title: 'Max Heart Rate', subtitle: 'Peak recorded today', icon: '🔥', accent: Colors.amber, body: '142 bpm was reached during your most active period. You hit 72% of your estimated max HR — moderate-intensity zone.' } },
              { val: '68', lbl: 'Current', modal: { title: 'Current HR', subtitle: 'Live reading', icon: '❤️', accent: '#DC324C', body: '68 bpm — you\'re at rest. This is within the healthy resting range of 60–100 bpm.' } },
            ].map((s) => (
              <TouchableOpacity key={s.lbl} onPress={() => setModal(s.modal)} activeOpacity={0.7}>
                <View style={styles.hrMini}>
                  <Text style={styles.hrMiniVal}>{s.val}</Text>
                  <Text style={styles.hrMiniLbl}>{s.lbl}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Water */}
        <View style={styles.waterCard}>
          <View style={styles.waterRow}>
            <TouchableOpacity onPress={() => setModal({ title: 'Water Intake', subtitle: `${(filled * 0.2).toFixed(1)}L of 2.4L goal`, icon: '💧', accent: Colors.blue, rows: [{ label: 'Consumed', value: `${(filled * 0.2).toFixed(1)} L`, color: Colors.blue }, { label: 'Remaining', value: `${(2.4 - filled * 0.2).toFixed(1)} L`, color: Colors.amber }, { label: 'Base goal', value: '2.0 L', color: 'rgba(255,255,255,0.5)' }, { label: 'Activity bonus', value: '+400 ml', color: Colors.teal }, { label: 'Glasses logged', value: `${filled} / 10`, color: '#fff' }] })} activeOpacity={0.8}>
              <View>
                <Text style={styles.cardLabel}>WATER INTAKE</Text>
                <Text style={styles.waterVal}>{(filled * 0.2).toFixed(1)}L</Text>
                <Text style={styles.waterTarget}>of 2.4L dynamic goal</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.glassWrap}>
              {Array.from({ length: 10 }).map((_, i) => (
                <TouchableOpacity key={i} onPress={() => tapGlass(i)}>
                  <View style={styles.glassOuter}>
                    <Animated.View style={[StyleSheet.absoluteFillObject, styles.glassFill, { opacity: glassAnims[i] }]} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity onPress={() => setModal({ title: 'Smart Hydration Goal', subtitle: 'Auto-adjusted today', icon: '⚡', accent: Colors.blue, body: "Your base goal of 2.0L has been raised by 400ml today based on your step count (4,200 steps) and local temperature (32°C). Vitora adjusts your goal daily to keep you optimally hydrated." })} activeOpacity={0.7}>
            <Text style={styles.waterSmart}>⚡ Goal raised +400ml due to today's activity</Text>
          </TouchableOpacity>
        </View>

        {/* Sleep */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => setModal({ title: "Last Night's Sleep", subtitle: '7h 32m — Above average', icon: '🌙', accent: Colors.primary, rows: [{ label: 'Total duration', value: '7h 32m', color: '#fff' }, { label: 'Deep sleep', value: '1h 45m (23%)', color: '#7B4FD4' }, { label: 'REM', value: '1h 20m (18%)', color: Colors.blue }, { label: 'Light sleep', value: '3h 55m (52%)', color: '#9BB4FF' }, { label: 'Awake', value: '~12 min', color: 'rgba(255,255,255,0.35)' }, { label: 'vs your avg', value: '+38 min', color: Colors.teal }] })} style={styles.sleepCard}>
          <View style={styles.sleepHeader}>
            <Text style={styles.cardLabel}>LAST NIGHT'S SLEEP</Text>
            <Text style={styles.sleepHrs}>7h 32m</Text>
          </View>
          <View style={styles.sleepBar}>
            <View style={[styles.stage, { flex: 2, backgroundColor: '#7B4FD4' }]} />
            <View style={[styles.stage, { flex: 1.5, backgroundColor: '#4F8BFF' }]} />
            <View style={[styles.stage, { flex: 3, backgroundColor: '#9BB4FF' }]} />
            <View style={[styles.stage, { flex: 0.5, backgroundColor: 'rgba(255,255,255,0.14)' }]} />
          </View>
          <View style={styles.legend}>
            {[
              { c: '#7B4FD4', l: 'Deep', modal: { title: 'Deep Sleep', subtitle: '1h 45m last night', icon: '🌙', accent: '#7B4FD4', body: "Deep sleep is the most restorative stage. It's critical for physical recovery, immune function, and memory. 1h 45m is above the recommended minimum." } },
              { c: '#4F8BFF', l: 'REM', modal: { title: 'REM Sleep', subtitle: '1h 20m last night', icon: '💭', accent: Colors.blue, body: "REM sleep drives emotional regulation and memory. You're right on target at 1h 20m — healthy adults need 90–120 min." } },
              { c: '#9BB4FF', l: 'Light', modal: { title: 'Light Sleep', subtitle: '3h 55m last night', icon: '☁️', accent: '#9BB4FF', body: 'Light sleep acts as a transition between stages and helps with mental recovery. It typically makes up the largest portion of sleep.' } },
              { c: 'rgba(255,255,255,0.2)', l: 'Awake', modal: { title: 'Awake Time', subtitle: '~12 min last night', icon: '👁', accent: Colors.amber, body: 'Brief awake periods are completely normal. Under 20 minutes of awake time is excellent and has minimal impact on sleep quality.' } },
            ].map((s) => (
              <TouchableOpacity key={s.l} onPress={() => setModal(s.modal)} activeOpacity={0.7}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: s.c }]} />
                  <Text style={styles.legendTxt}>{s.l}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </ScrollView>

      <DetailModal visible={!!modal} onClose={() => setModal(null)} content={modal} />
      <Toast message={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg, overflow: 'hidden' },
  bgOrb: { position: 'absolute', width: 380, height: 280, borderRadius: 190, top: -60, alignSelf: 'center' },
  scroll: { padding: 16, paddingBottom: 8 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 18, letterSpacing: -0.5 },
  cardLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.38)', letterSpacing: 1.2 },
  hrCard: { backgroundColor: 'rgba(220,50,80,0.1)', borderWidth: 1, borderColor: 'rgba(220,50,80,0.22)', borderTopWidth: 2, borderTopColor: Colors.red, borderRadius: 18, padding: 14, marginBottom: 10 },
  hrTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  normalBadge: { backgroundColor: 'rgba(79,212,160,0.14)', borderWidth: 1, borderColor: 'rgba(79,212,160,0.3)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  normalTxt: { fontSize: 9, fontWeight: '700', color: Colors.teal, letterSpacing: 0.3 },
  hrValRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  hrNum: { fontSize: 48, fontWeight: '800', color: '#fff', lineHeight: 54, letterSpacing: -2 },
  hrBpm: { fontSize: 14, color: 'rgba(255,255,255,0.38)', marginBottom: 10 },
  hrMiniRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  hrMini: { alignItems: 'center', paddingHorizontal: 8 },
  hrMiniVal: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
  hrMiniLbl: { fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2, letterSpacing: 0.3 },
  waterCard: { backgroundColor: 'rgba(79,139,255,0.08)', borderWidth: 1, borderColor: 'rgba(79,139,255,0.2)', borderTopWidth: 2, borderTopColor: Colors.blue, borderRadius: 18, padding: 14, marginBottom: 10 },
  waterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  waterVal: { fontSize: 28, fontWeight: '800', color: Colors.blue, marginVertical: 2, letterSpacing: -0.5 },
  waterTarget: { fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 1 },
  glassWrap: { flexDirection: 'row', gap: 3, alignItems: 'flex-end' },
  glassOuter: { width: 12, height: 20, borderRadius: 3, borderWidth: 1, borderColor: 'rgba(79,139,255,0.4)', overflow: 'hidden' },
  glassFill: { backgroundColor: 'rgba(79,139,255,0.6)', borderRadius: 3 },
  waterSmart: { fontSize: 10, color: 'rgba(79,139,255,0.8)', marginTop: 8, fontWeight: '500' },
  sleepCard: { backgroundColor: 'rgba(123,79,212,0.08)', borderWidth: 1, borderColor: 'rgba(123,79,212,0.2)', borderTopWidth: 2, borderTopColor: Colors.primary, borderRadius: 18, padding: 14 },
  sleepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sleepHrs: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  sleepBar: { flexDirection: 'row', height: 10, borderRadius: 6, overflow: 'hidden', gap: 1, marginBottom: 9 },
  stage: { height: '100%' },
  legend: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendTxt: { fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: '500' },
});
