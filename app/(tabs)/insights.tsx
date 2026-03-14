import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import DetailModal, { ModalContent } from '../../components/DetailModal';

const BARS = [10, 14, 20, 12, 22, 28, 26];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const AI_INSIGHTS = [
  {
    tag: 'Sleep × Heart Rate',
    tagColor: '#A07FFF',
    tagBg: 'rgba(123,79,212,0.18)',
    tagBorder: 'rgba(123,79,212,0.3)',
    confidence: 87,
    insight: 'On nights you sleep 7+ hrs, your resting HR drops an average of ',
    highlight: '11 bpm',
    highlightColor: '#A07FFF',
    suffix: ' the next morning.',
    bars: BARS,
    barColor: '#A07FFF',
    modal: {
      title: 'Sleep × Heart Rate',
      subtitle: 'AI correlation · 87% confidence',
      icon: '🔗', accent: '#A07FFF',
      body: 'On nights you sleep 7+ hours, your resting HR the next morning drops by an average of 11 bpm.\n\nThis correlation has been detected over 14 days at 87% confidence. Quality sleep reduces sympathetic nervous system activity, letting your heart work more efficiently at rest.\n\nTip: Aim for 7–9 hours nightly to maintain this benefit.',
    },
  },
  {
    tag: 'Steps × Sleep Quality',
    tagColor: '#7FB5FF',
    tagBg: 'rgba(79,139,255,0.14)',
    tagBorder: 'rgba(79,139,255,0.3)',
    confidence: 73,
    insight: 'You sleep ',
    highlight: '18% better',
    highlightColor: '#7FB5FF',
    suffix: ' on days your step count exceeds 5,000.',
    bars: null,
    barColor: Colors.blue,
    modal: {
      title: 'Steps × Sleep Quality',
      subtitle: 'AI correlation · 73% confidence',
      icon: '🔗', accent: Colors.blue,
      body: "On days you walk more than 5,000 steps, your deep sleep increases by an average of 18% and you fall asleep 14 minutes faster.\n\nPhysical activity raises adenosine levels in the brain, which increases sleep pressure and results in deeper, more restorative sleep.\n\nYour hydration goal is also auto-adjusted based on step count and local temperature.",
    },
  },
];

export default function InsightsScreen() {
  const [modal, setModal] = useState<ModalContent | null>(null);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['rgba(244,169,78,0.07)', 'transparent']} style={styles.bgOrb} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Your Insights</Text>

        {/* Body Load Score */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => setModal({ title: 'Body Load Score', subtitle: '38 / 100 — Low stress', icon: '🧘', accent: Colors.amber, rows: [{ label: 'Score', value: '38 / 100', color: Colors.amber }, { label: 'Level', value: 'Low stress', color: Colors.teal }, { label: 'Recovery', value: 'Great', color: Colors.teal }, { label: 'HRV', value: 'High (positive)', color: Colors.teal }, { label: 'Sleep', value: 'High (positive)', color: Colors.teal }, { label: 'vs yesterday', value: '-12 pts', color: Colors.teal }] })}>
          <LinearGradient colors={['rgba(244,100,78,0.13)', 'rgba(244,169,78,0.08)']} style={styles.stressCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.stressRow}>
              <View>
                <Text style={styles.cardLabel}>BODY LOAD SCORE</Text>
                <Text style={styles.stressVal}>38</Text>
                <Text style={styles.stressDesc}>Low stress — great recovery</Text>
              </View>
              <Text style={{ fontSize: 36 }}>🧘</Text>
            </View>
            <View style={styles.stressBarBg}>
              <LinearGradient colors={[Colors.teal, Colors.amber, '#F46450']} style={[styles.stressBarFill, { width: '38%' }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* AI Insight Cards */}
        <Text style={styles.sectionHeader}>AI GENERATED INSIGHTS</Text>
        {AI_INSIGHTS.map((item, idx) => (
          <TouchableOpacity key={idx} activeOpacity={0.85} onPress={() => setModal(item.modal)}>
            <View style={styles.corrCard}>
              {/* AI badge row */}
              <View style={styles.corrCardTop}>
                <View style={[styles.corrTag, { backgroundColor: item.tagBg, borderColor: item.tagBorder }]}>
                  <Text style={[styles.corrTagTxt, { color: item.tagColor }]}>{item.tag}</Text>
                </View>
                <View style={styles.aiBadgeSmall}>
                  <Text style={styles.aiBadgeSmallTxt}>🤖 AI</Text>
                </View>
              </View>

              <Text style={styles.corrInsight}>
                {item.insight}
                <Text style={{ color: item.highlightColor, fontWeight: '700' }}>{item.highlight}</Text>
                {item.suffix}
              </Text>

              {item.bars && (
                <View style={styles.corrChart}>
                  {item.bars.map((h, i) => (
                    <LinearGradient
                      key={i}
                      colors={i >= 5 ? [item.barColor, item.barColor + '99'] : [item.barColor + '55', item.barColor + '22']}
                      style={[styles.corrBar, { height: h }]}
                      start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    />
                  ))}
                  <View style={styles.daysRow}>
                    {DAYS.map((d, i) => <Text key={i} style={styles.dayTxt}>{d}</Text>)}
                  </View>
                </View>
              )}

              {/* Confidence footer */}
              <View style={styles.confidenceRow}>
                <View style={[styles.confBg, { width: '100%' }]}>
                  <View style={[styles.confFill, { width: `${item.confidence}%`, backgroundColor: item.tagColor }]} />
                </View>
                <Text style={[styles.confTxt, { color: item.tagColor }]}>{item.confidence}% confidence</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Weekly Summary */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => setModal({ title: 'Weekly Health Report', subtitle: 'Mar 8 – Mar 14', icon: '📊', accent: Colors.primary, rows: [{ label: 'Avg Sleep', value: '7.3h  ↑ +0.4h', color: Colors.teal }, { label: 'Avg Heart Rate', value: '69 bpm  ↓ improving', color: Colors.teal }, { label: 'Activity Level', value: 'Moderate  → consistent', color: Colors.amber }, { label: 'Avg Hydration', value: '1.9L  ↓ below goal', color: Colors.red }, { label: 'Recovery trend', value: 'Improving week-on-week', color: Colors.teal }] })}>
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyTop}>
              <Text style={styles.cardLabel}>WEEKLY HEALTH REPORT</Text>
              <Text style={styles.weeklyDate}>Mar 8 – Mar 14</Text>
            </View>
            <View style={styles.weeklyGrid}>
              {[
                { label: 'Avg Sleep', val: '7.3h', color: Colors.teal, up: true },
                { label: 'Avg HR', val: '69 bpm', color: Colors.teal, up: true },
                { label: 'Activity', val: 'Moderate', color: Colors.amber, up: null },
                { label: 'Hydration', val: '1.9L', color: Colors.red, up: false },
              ].map((s, i) => (
                <View key={i} style={styles.weeklyItem}>
                  <Text style={[styles.weeklyVal, { color: s.color }]}>{s.val}</Text>
                  <Text style={styles.weeklyLbl}>{s.label}</Text>
                  {s.up !== null && <Text style={{ fontSize: 9, color: s.up ? Colors.teal : Colors.red }}>{s.up ? '↑ improving' : '↓ below goal'}</Text>}
                </View>
              ))}
            </View>
            <LinearGradient colors={[Colors.teal + '33', Colors.primary + '22']} style={styles.weeklyBadge} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.weeklyBadgeTxt}>🏆 Recovery improving week-on-week</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>

        {/* Suggestion */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => setModal({ title: "Today's Suggestion", subtitle: 'Personalised for you', icon: '💡', accent: Colors.teal, body: "Take a 15-minute walk before 6pm.\n\nWhy:\n• Step count is at 42% of goal (4,200 / 10,000)\n• Body load is low (38/100) — enough energy for light activity\n• Walking now boosts afternoon energy and helps hit step goal\n\nEstimated benefit: +1,400 steps, ~60 kcal, improved mood." })}>
          <View style={styles.suggestCard}>
            <Text style={styles.suggestLbl}>TODAY'S SUGGESTION</Text>
            <Text style={styles.suggestTxt}>
              Take a 15-min walk before 6pm — your step count is behind and your body load is low enough for light activity.
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
  bgOrb: { position: 'absolute', width: 380, height: 260, borderRadius: 190, top: -60, right: -60 },
  scroll: { padding: 16, paddingBottom: 8 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 18, letterSpacing: -0.5 },
  cardLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.38)', letterSpacing: 1.2 },
  sectionHeader: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: 1.4, marginBottom: 10, marginTop: 4 },
  stressCard: { borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(244,120,78,0.24)', borderTopWidth: 2, borderTopColor: Colors.amber },
  stressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stressVal: { fontSize: 38, fontWeight: '800', color: Colors.amber, letterSpacing: -1, marginVertical: 2 },
  stressDesc: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  stressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 6, marginTop: 10, overflow: 'hidden' },
  stressBarFill: { height: 6, borderRadius: 6 },
  corrCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 14, marginBottom: 9 },
  corrCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  corrTag: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  corrTagTxt: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  aiBadgeSmall: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  aiBadgeSmallTxt: { fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  corrInsight: { fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 18, marginBottom: 10 },
  corrChart: { marginBottom: 10 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, paddingHorizontal: 2 },
  dayTxt: { fontSize: 8, color: 'rgba(255,255,255,0.25)', width: 17, textAlign: 'center' },
  corrBar: { width: 17, borderRadius: 4, marginBottom: 0 },
  confidenceRow: { gap: 4 },
  confBg: { height: 3, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' },
  confFill: { height: 3, borderRadius: 3, opacity: 0.6 },
  confTxt: { fontSize: 9, fontWeight: '600', opacity: 0.7 },
  weeklyCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderTopWidth: 2, borderTopColor: Colors.primary, borderRadius: 16, padding: 14, marginBottom: 9 },
  weeklyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  weeklyDate: { fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: '500' },
  weeklyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  weeklyItem: { width: '46%', gap: 2 },
  weeklyVal: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  weeklyLbl: { fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: '600', letterSpacing: 0.4 },
  weeklyBadge: { borderRadius: 8, paddingVertical: 7, paddingHorizontal: 10 },
  weeklyBadgeTxt: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  suggestCard: { backgroundColor: 'rgba(79,212,160,0.08)', borderWidth: 1, borderColor: 'rgba(79,212,160,0.2)', borderTopWidth: 2, borderTopColor: Colors.teal, borderRadius: 16, padding: 13 },
  suggestLbl: { fontSize: 9, fontWeight: '700', color: Colors.teal, letterSpacing: 1.2, marginBottom: 6 },
  suggestTxt: { fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 18 },
});
