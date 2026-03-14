import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/auth';
import DetailModal, { ModalContent } from '../../components/DetailModal';
import GoalRing from '../../components/GoalRing';

// Mini sparkline bar chart
function MiniSpark({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 16, marginTop: 6 }}>
      {data.map((v, i) => (
        <View
          key={i}
          style={{ width: 5, borderRadius: 2, backgroundColor: color,
            height: Math.max(3, ((v - min) / range) * 16),
            opacity: i === data.length - 1 ? 1 : 0.38 + i * 0.08 }}
        />
      ))}
    </View>
  );
}

const METRICS = [
  { icon: '❤️', val: '68', unit: 'bpm', label: 'Heart Rate', trend: '↓ Resting normal', up: true,
    bg: 'rgba(220,50,68,0.08)', border: 'rgba(220,50,68,0.2)', accent: '#DC3244', topBorder: '#DC3244',
    spark: [72, 68, 75, 71, 69, 73, 68],
    modal: { title: 'Heart Rate', subtitle: 'Live reading', icon: '❤️', accent: '#DC324C',
      rows: [{ label: 'Current', value: '68 bpm', color: '#fff' }, { label: 'Resting', value: '58 bpm', color: Colors.teal }, { label: 'Max today', value: '142 bpm', color: Colors.amber }, { label: 'Status', value: 'Normal', color: Colors.teal }] } },
  { icon: '💧', val: '1.2', unit: 'L', label: 'Hydration', trend: 'Goal: 2.4L today', up: false,
    bg: 'rgba(79,139,255,0.08)', border: 'rgba(79,139,255,0.2)', accent: Colors.blue, topBorder: Colors.blue,
    spark: [1.8, 2.1, 1.5, 2.4, 2.0, 1.9, 1.2],
    modal: { title: 'Hydration', subtitle: 'Daily water intake', icon: '💧', accent: Colors.blue,
      rows: [{ label: 'Consumed', value: '1.2 L', color: Colors.blue }, { label: 'Remaining', value: '1.2 L', color: Colors.amber }, { label: 'Daily goal', value: '2.4 L', color: '#fff' }, { label: 'Goal type', value: 'Dynamic', color: 'rgba(255,255,255,0.55)' }] } },
  { icon: '🌙', val: '7.5', unit: 'hrs', label: 'Sleep', trend: '↑ Above avg', up: true,
    bg: 'rgba(123,79,212,0.08)', border: 'rgba(123,79,212,0.2)', accent: Colors.primary, topBorder: Colors.primary,
    spark: [6.5, 7.2, 6.8, 7.5, 8.0, 7.3, 7.5],
    modal: { title: 'Sleep', subtitle: 'Last night', icon: '🌙', accent: Colors.primary,
      rows: [{ label: 'Duration', value: '7h 32m', color: '#fff' }, { label: 'Deep sleep', value: '1h 45m', color: Colors.primary }, { label: 'REM', value: '1h 20m', color: Colors.blue }, { label: 'vs average', value: '+38 min', color: Colors.teal }] } },
  { icon: '👟', val: '4.2k', unit: '', label: 'Steps', trend: '42% of goal', up: false,
    bg: 'rgba(244,169,78,0.08)', border: 'rgba(244,169,78,0.2)', accent: Colors.amber, topBorder: Colors.amber,
    spark: [6200, 4800, 8100, 5500, 7200, 9100, 4200],
    modal: { title: 'Steps', subtitle: "Today's activity", icon: '👟', accent: Colors.amber,
      rows: [{ label: 'Steps taken', value: '4,200', color: '#fff' }, { label: 'Daily goal', value: '10,000', color: 'rgba(255,255,255,0.45)' }, { label: 'Progress', value: '42%', color: Colors.amber }, { label: 'Calories burned', value: '~180 kcal', color: Colors.teal }] } },
];

export default function DashboardScreen() {
  const [modal, setModal] = useState<ModalContent | null>(null);
  const cardAnim = useRef(new Animated.Value(0)).current;
  const { signOut } = useAuth();

  useEffect(() => {
    Animated.spring(cardAnim, { toValue: 1, damping: 18, stiffness: 160, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['rgba(123,79,212,0.11)', 'transparent']} style={styles.bgOrb} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>GOOD MORNING</Text>
            <Text style={styles.name}>Ruthvik 👋</Text>
          </View>
          <TouchableOpacity activeOpacity={0.75} onPress={() => setModal({ title: 'Ruthvik', subtitle: 'Your health profile', icon: '👤', accent: Colors.primary, rows: [{ label: 'Age', value: '22' }, { label: 'Height', value: '175 cm' }, { label: 'Weight', value: '68 kg' }, { label: 'Blood type', value: 'O+', color: Colors.red }], actions: [{ label: 'Sign Out', color: Colors.red, onPress: () => { setModal(null); signOut(); router.replace('/login'); } }] })}>
            <LinearGradient colors={['#9B6FE8', '#4F8BFF']} style={styles.avatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={styles.avatarTxt}>R</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Health Coach Card */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => setModal({ title: 'Health Coach', subtitle: 'AI-powered daily advice', icon: '🧠', accent: Colors.teal, body: "Based on today's data:\n\n• You're 5,800 steps short of your goal. A 12-minute walk before 6pm will close the gap.\n\n• Your hydration is at 50% — drink 2 more glasses before your next meal.\n\n• Your sleep trend is strong this week. Keep the same bedtime tonight to maintain momentum.\n\nVitora learns your patterns daily to make these suggestions more accurate over time." })}>
          <LinearGradient colors={['rgba(79,212,160,0.12)', 'rgba(79,139,255,0.07)']} style={styles.coachCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.coachTop}>
              <View style={styles.aiBadge}><Text style={styles.aiBadgeTxt}>AI COACH</Text></View>
              <Text style={styles.coachEmoji}>🧠</Text>
            </View>
            <Text style={styles.coachTitle}>Daily Health Coach</Text>
            <Text style={styles.coachBody}>
              You're slightly behind your step goal.{' '}
              <Text style={{ color: Colors.teal, fontWeight: '700' }}>A 12-min walk</Text>{' '}
              will close the gap and improve tonight's sleep quality.
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Recharge Score Card */}
        <Animated.View style={{ opacity: cardAnim, transform: [{ scale: cardAnim }] }}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setModal({ title: 'Recharge Score', subtitle: 'How your 74 was calculated', icon: '⚡', accent: Colors.primary, rows: [{ label: 'Sleep Quality', value: '+35', color: Colors.teal }, { label: 'Activity Level', value: '+18', color: Colors.blue }, { label: 'Heart Recovery', value: '+15', color: Colors.primary }, { label: 'Hydration', value: '+6', color: Colors.amber }, { label: 'Total Score', value: '74 / 100', color: '#fff' }] })}>
            <LinearGradient colors={['rgba(123,79,212,0.26)', 'rgba(79,139,255,0.12)']} style={styles.rechargeCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={styles.rechargeLabel}>RECHARGE SCORE</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreNum}>74</Text>
                <Text style={styles.scoreUnit}> / 100</Text>
              </View>
              <View style={styles.barBg}>
                <LinearGradient colors={['#9B6FE8', '#4F8BFF']} style={styles.barFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
              </View>
              <Text style={styles.rechargeInsight}>↑ Sleep improved your HR by 11% today · Tap to see breakdown</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Metrics 2x2 */}
        <View style={styles.grid}>
          {METRICS.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.metricCard, { backgroundColor: m.bg, borderColor: m.border, borderTopColor: m.topBorder, borderTopWidth: 2 }]}
              activeOpacity={0.75}
              onPress={() => setModal(m.modal)}
            >
              <Text style={styles.metricIcon}>{m.icon}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                <Text style={[styles.metricVal, { color: m.accent }]}>{m.val}</Text>
                {m.unit ? <Text style={styles.metricUnit}>{m.unit}</Text> : null}
              </View>
              <Text style={styles.metricLbl}>{m.label}</Text>
              <Text style={[styles.metricTrend, { color: m.up ? Colors.teal : Colors.amber }]}>{m.trend}</Text>
              <MiniSpark data={m.spark} color={m.accent} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Goal Progress Rings */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => setModal({ title: "Today's Goals", subtitle: 'Progress across all targets', icon: '🎯', accent: Colors.teal, rows: [{ label: 'Steps', value: '4,200 / 10,000 (42%)', color: Colors.amber }, { label: 'Hydration', value: '1.2L / 2.4L (50%)', color: Colors.blue }, { label: 'Sleep', value: '7.5h / 8.5h (88%)', color: Colors.teal }] })}>
          <View style={styles.ringsCard}>
            <Text style={styles.ringsSectionTitle}>TODAY'S GOALS</Text>
            <View style={styles.ringsRow}>
              <GoalRing progress={0.42} color={Colors.amber} label="Steps" value="42%" />
              <GoalRing progress={0.50} color={Colors.blue} label="Hydration" value="50%" />
              <GoalRing progress={0.88} color={Colors.teal} label="Sleep" value="88%" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Insight Card */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => setModal({ title: 'Correlation Found', subtitle: 'Sleep × Heart Rate', icon: '🔗', accent: Colors.amber, body: 'Your resting heart rate is consistently 12 bpm lower on days following 7+ hours of sleep. This correlation has been detected over the past 14 days at 87% confidence.\n\nQuality sleep reduces sympathetic nervous system activity, allowing your heart to work more efficiently at rest.' })}>
          <View style={styles.insightCard}>
            <View style={styles.insightDot} />
            <Text style={styles.insightTxt}>
              <Text style={styles.insightBold}>Correlation found: </Text>
              Your resting HR is 12 bpm lower on days you sleep 7+ hrs. Keep it up!
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <DetailModal visible={!!modal} onClose={() => setModal(null)} content={modal} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg, overflow: 'hidden' },
  bgOrb: { position: 'absolute', width: 420, height: 320, borderRadius: 210, top: -60, left: -60 },
  scroll: { padding: 16, paddingBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  greeting: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: 1.4 },
  name: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  coachCard: { borderRadius: 16, padding: 13, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(79,212,160,0.2)' },
  coachTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  aiBadge: { backgroundColor: 'rgba(79,212,160,0.18)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(79,212,160,0.3)' },
  aiBadgeTxt: { fontSize: 8, fontWeight: '800', color: Colors.teal, letterSpacing: 1 },
  coachEmoji: { fontSize: 18 },
  coachTitle: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 4 },
  coachBody: { fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 17 },
  rechargeCard: { borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(123,79,212,0.3)' },
  rechargeLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: 1.2, marginBottom: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'flex-end' },
  scoreNum: { fontSize: 52, fontWeight: '800', color: '#fff', lineHeight: 58, letterSpacing: -2 },
  scoreUnit: { fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 8 },
  barBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.09)', borderRadius: 5, marginTop: 10, overflow: 'hidden' },
  barFill: { height: 5, width: '74%', borderRadius: 5 },
  rechargeInsight: { fontSize: 10, color: 'rgba(180,160,255,0.8)', marginTop: 7 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  metricCard: { width: '47.6%', borderWidth: 1, borderRadius: 14, padding: 12 },
  metricIcon: { fontSize: 18, marginBottom: 6 },
  metricVal: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  metricUnit: { fontSize: 11, color: 'rgba(255,255,255,0.38)' },
  metricLbl: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.32)', marginTop: 3, letterSpacing: 0.3 },
  metricTrend: { fontSize: 9, marginTop: 3 },
  ringsCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 10 },
  ringsSectionTitle: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: 1.2, marginBottom: 12 },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  insightCard: { backgroundColor: 'rgba(244,169,78,0.08)', borderWidth: 1, borderColor: 'rgba(244,169,78,0.2)', borderRadius: 14, padding: 13, flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  insightDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.amber, marginTop: 3, flexShrink: 0 },
  insightTxt: { fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 17, flex: 1 },
  insightBold: { color: Colors.amber, fontWeight: '700' },
});
