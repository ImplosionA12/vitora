import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import DetailModal, { ModalContent } from '../../components/DetailModal';

const CONTACTS = [
  { name: 'Mom', role: 'Primary contact', avatar: 'M', grad: ['#7B4FD4', '#4F8BFF'] as [string, string],
    modal: { title: 'Mom', subtitle: 'Primary emergency contact', icon: '👩', accent: Colors.primary, rows: [{ label: 'Relationship', value: 'Mother' }, { label: 'Priority', value: '1st contact', color: Colors.teal }, { label: 'Notification', value: 'SMS + Call', color: '#fff' }, { label: 'Location shared', value: 'Yes', color: Colors.teal }] } },
  { name: 'Rahul (roommate)', role: 'Secondary contact', avatar: 'R', grad: ['#4FD4A0', '#4F8BFF'] as [string, string],
    modal: { title: 'Rahul', subtitle: 'Secondary emergency contact', icon: '👨', accent: Colors.teal, rows: [{ label: 'Relationship', value: 'Roommate' }, { label: 'Priority', value: '2nd contact', color: Colors.amber }, { label: 'Notification', value: 'SMS + Call', color: '#fff' }, { label: 'Location shared', value: 'Yes', color: Colors.teal }] } },
];

const SIM_STEPS = [
  { icon: '📍', label: 'Live location shared', color: Colors.teal },
  { icon: '❤️', label: 'Vitals transmitted (HR 68bpm, SpO₂ 98%)', color: Colors.red },
  { icon: '📱', label: 'Mom notified via SMS + call', color: Colors.primary },
  { icon: '📱', label: 'Rahul notified via SMS', color: Colors.blue },
];

function SimStep({ icon, label, color, delay }: { icon: string; label: string; color: string; delay: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(translateX, { toValue: 0, damping: 14, stiffness: 180, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={[styles.simStep, { opacity, transform: [{ translateX }] }]}>
      <View style={[styles.simCheck, { borderColor: color + '55', backgroundColor: color + '18' }]}>
        <Text style={{ fontSize: 10 }}>✓</Text>
      </View>
      <Text style={styles.simIcon}>{icon}</Text>
      <Text style={styles.simLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function SOSScreen() {
  const [activated, setActivated] = useState(false);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const ring1 = useRef(new Animated.Value(1)).current;
  const ring2 = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.38)).current;
  const ring2Opacity = useRef(new Animated.Value(0.22)).current;
  const holdRef = useRef<Animated.CompositeAnimation | null>(null);
  const holdProg = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.8)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(ring1, { toValue: 1.12, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(ring1Opacity, { toValue: 0.55, duration: 1200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(ring1, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(ring1Opacity, { toValue: 0.22, duration: 1200, useNativeDriver: true }),
      ]),
    ])).start();
    setTimeout(() => {
      Animated.loop(Animated.sequence([
        Animated.parallel([
          Animated.timing(ring2, { toValue: 1.28, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0.38, duration: 1600, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring2, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0.12, duration: 1600, useNativeDriver: true }),
        ]),
      ])).start();
    }, 500);
  }, []);

  const start = () => {
    holdProg.setValue(0);
    holdRef.current = Animated.timing(holdProg, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: false });
    holdRef.current.start(({ finished }) => {
      if (finished) {
        setActivated(true);
        Animated.parallel([
          Animated.spring(successScale, { toValue: 1, damping: 14, stiffness: 180, useNativeDriver: true }),
          Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      }
    });
  };
  const stop = () => {
    if (!activated) {
      holdRef.current?.stop();
      Animated.timing(holdProg, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['rgba(220,50,68,0.1)', 'transparent']} style={styles.bgOrb} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Emergency SOS</Text>
        <Text style={styles.intro}>Hold button for 3 seconds to{'\n'}alert your emergency contacts</Text>

        {/* SOS Button */}
        <View style={styles.sosWrap}>
          <Animated.View style={[styles.ringOuter, { transform: [{ scale: ring2 }], opacity: ring2Opacity }]} />
          <Animated.View style={[styles.ringInner, { transform: [{ scale: ring1 }], opacity: ring1Opacity }]} />
          <TouchableOpacity onPressIn={start} onPressOut={stop} activeOpacity={0.9}>
            <LinearGradient
              colors={activated ? ['#4FD4A0', '#4F8BFF'] : ['#FF4560', '#DC3244']}
              style={styles.sosCore}
              start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sosLabel}>{activated ? '✓' : 'SOS'}</Text>
              <Text style={styles.sosSub}>{activated ? 'Sent!' : 'Hold 3s'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Simulation Flow */}
        {activated && (
          <Animated.View style={[styles.simCard, { opacity: successOpacity, transform: [{ scale: successScale }] }]}>
            <LinearGradient colors={['rgba(79,212,160,0.14)', 'rgba(79,139,255,0.08)']} style={StyleSheet.absoluteFillObject} />
            <Text style={styles.simTitle}>🚨 Alert Sent!</Text>
            <Text style={styles.simSubtitle}>The following actions were triggered:</Text>
            {SIM_STEPS.map((step, i) => (
              <SimStep key={i} icon={step.icon} label={step.label} color={step.color} delay={400 + i * 600} />
            ))}
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setActivated(false)} activeOpacity={0.8}>
              <Text style={styles.cancelTxt}>Cancel Alert</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Vitals */}
        {!activated && (
          <>
            <Text style={styles.sectionLbl}>VITALS SHARED ON ALERT</Text>
            <View style={styles.vitalsRow}>
              {[
                { val: '68', lbl: 'HR bpm', modal: { title: 'Heart Rate', subtitle: 'Shared on SOS alert', icon: '❤️', accent: Colors.red, rows: [{ label: 'Current', value: '68 bpm', color: '#fff' }, { label: 'Status', value: 'Normal', color: Colors.teal }, { label: 'Shared with', value: 'All contacts', color: 'rgba(255,255,255,0.5)' }] } },
                { val: '98%', lbl: 'SpO₂', modal: { title: 'Blood Oxygen (SpO₂)', subtitle: 'Shared on SOS alert', icon: '🫁', accent: Colors.blue, rows: [{ label: 'Reading', value: '98%', color: '#fff' }, { label: 'Normal range', value: '95–100%', color: Colors.teal }, { label: 'Status', value: 'Healthy', color: Colors.teal }, { label: 'Shared with', value: 'All contacts', color: 'rgba(255,255,255,0.5)' }] } },
                { val: '📍', lbl: 'Location', modal: { title: 'Live Location', subtitle: 'Shared on SOS alert', icon: '📍', accent: Colors.amber, body: 'Your GPS location is shared with all emergency contacts the moment SOS is triggered. Updates every 30 seconds until the alert is cancelled.' } },
              ].map((v) => (
                <TouchableOpacity key={v.lbl} style={styles.vitalCard} activeOpacity={0.75} onPress={() => setModal(v.modal)}>
                  <Text style={styles.vitalVal}>{v.val}</Text>
                  <Text style={styles.vitalLbl}>{v.lbl}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLbl}>EMERGENCY CONTACTS</Text>
            {CONTACTS.map((c, i) => (
              <TouchableOpacity key={i} style={styles.contactCard} activeOpacity={0.75} onPress={() => setModal(c.modal)}>
                <LinearGradient colors={c.grad} style={styles.cAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Text style={styles.cAvatarTxt}>{c.avatar}</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cName}>{c.name}</Text>
                  <Text style={styles.cRole}>{c.role}</Text>
                </View>
                <Text style={styles.cChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        <Text style={styles.note}>Alert includes your live location + last vitals{'\n'}to help contacts respond faster</Text>
      </ScrollView>

      <DetailModal visible={!!modal} onClose={() => setModal(null)} content={modal} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg, overflow: 'hidden' },
  bgOrb: { position: 'absolute', width: 380, height: 300, borderRadius: 190, top: -80, alignSelf: 'center' },
  scroll: { padding: 16, paddingBottom: 8, alignItems: 'center' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#FF4560', marginBottom: 5, letterSpacing: -0.5 },
  intro: { fontSize: 11, color: 'rgba(255,255,255,0.38)', textAlign: 'center', lineHeight: 18, marginBottom: 24 },
  sosWrap: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center', marginBottom: 26 },
  ringOuter: { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 1.5, borderColor: '#DC3244' },
  ringInner: { position: 'absolute', width: 84, height: 84, borderRadius: 42, borderWidth: 1.5, borderColor: '#DC3244' },
  sosCore: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  sosLabel: { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  sosSub: { fontSize: 8, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
  // Simulation flow
  simCard: { width: '100%', borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(79,212,160,0.25)', overflow: 'hidden' },
  simTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 4, letterSpacing: -0.3 },
  simSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 14 },
  simStep: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  simCheck: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  simIcon: { fontSize: 14 },
  simLabel: { fontSize: 12, color: 'rgba(255,255,255,0.78)', flex: 1, fontWeight: '500' },
  cancelBtn: { marginTop: 8, borderRadius: 10, paddingVertical: 9, alignItems: 'center', backgroundColor: 'rgba(220,50,68,0.12)', borderWidth: 1, borderColor: 'rgba(220,50,68,0.25)' },
  cancelTxt: { fontSize: 12, fontWeight: '700', color: Colors.red },
  // existing
  sectionLbl: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.38)', letterSpacing: 1.4, alignSelf: 'flex-start', marginBottom: 8 },
  vitalsRow: { flexDirection: 'row', gap: 8, marginBottom: 18, width: '100%' },
  vitalCard: { flex: 1, backgroundColor: 'rgba(220,50,60,0.09)', borderWidth: 1, borderColor: 'rgba(220,50,60,0.18)', borderTopWidth: 2, borderTopColor: Colors.red, borderRadius: 12, padding: 10, alignItems: 'center' },
  vitalVal: { fontSize: 16, fontWeight: '800', color: '#fff' },
  vitalLbl: { fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 3, letterSpacing: 0.3 },
  contactCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 11, marginBottom: 8, width: '100%' },
  cAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cAvatarTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  cName: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  cRole: { fontSize: 10, color: 'rgba(255,255,255,0.32)', marginTop: 2 },
  cChevron: { fontSize: 20, color: 'rgba(255,255,255,0.2)' },
  note: { fontSize: 10, color: 'rgba(220,50,60,0.6)', textAlign: 'center', lineHeight: 16, marginTop: 6 },
});
