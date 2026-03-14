import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface MetricCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit: string;
  color: string;
  subtitle?: string;
}

export default function MetricCard({ icon, label, value, unit, color, subtitle }: MetricCardProps) {
  return (
    <View style={[styles.card, { borderTopColor: color, borderTopWidth: 2 }]}>
      <View style={[styles.iconCircle, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 0,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600', marginBottom: 4 },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  value: { fontSize: 22, fontWeight: '800' },
  unit: { fontSize: 12, color: Colors.textSecondary, marginBottom: 3 },
  subtitle: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
});
