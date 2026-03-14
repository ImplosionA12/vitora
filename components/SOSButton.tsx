import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface SOSButtonProps {
  onActivate: () => void;
}

export default function SOSButton({ onActivate }: SOSButtonProps) {
  const [holding, setHolding] = useState(false);
  const [activated, setActivated] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(1)).current;
  const ring2 = useRef(new Animated.Value(1)).current;
  const ring3 = useRef(new Animated.Value(1)).current;
  const holdAnim = useRef<Animated.CompositeAnimation | null>(null);
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Idle pulse rings
    const pulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ring1, { toValue: 1.3, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(ring1, { toValue: 1, duration: 0, useNativeDriver: true }),
        ])
      ).start();
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(ring2, { toValue: 1.6, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(ring2, { toValue: 1, duration: 0, useNativeDriver: true }),
          ])
        ).start();
      }, 300);
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(ring3, { toValue: 1.9, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(ring3, { toValue: 1, duration: 0, useNativeDriver: true }),
          ])
        ).start();
      }, 600);
    };
    pulse();
  }, []);

  const startHold = () => {
    setHolding(true);
    progress.setValue(0);
    holdAnim.current = Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    holdAnim.current.start(({ finished }) => {
      if (finished) {
        setActivated(true);
        onActivate();
      }
    });
  };

  const endHold = () => {
    setHolding(false);
    holdAnim.current?.stop();
    Animated.timing(progress, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const ringStyle = (scale: Animated.Value, opacity: number) => ({
    position: 'absolute' as const,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: Colors.red,
    opacity,
    transform: [{ scale }],
  });

  const progressColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['#DC3244', '#FF6680'],
  });

  return (
    <View style={styles.container}>
      {/* Rings */}
      <Animated.View style={ringStyle(ring3, 0.15)} />
      <Animated.View style={ringStyle(ring2, 0.25)} />
      <Animated.View style={ringStyle(ring1, 0.4)} />

      {/* Main button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={startHold}
        onPressOut={endHold}
        style={styles.btnWrapper}
      >
        <Animated.View
          style={[
            styles.btn,
            holding && {
              borderColor: progressColor,
              borderWidth: 3,
            },
          ]}
        >
          <Ionicons name="warning" size={36} color={Colors.red} />
          <Text style={styles.btnLabel}>{activated ? 'ACTIVATED' : 'SOS'}</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Progress arc text */}
      <Text style={styles.holdText}>
        {holding ? 'Hold to activate...' : activated ? 'Emergency sent!' : 'Hold 3s to send SOS'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', width: 200, height: 200 },
  btnWrapper: { zIndex: 10 },
  btn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2a0a10',
    borderWidth: 2,
    borderColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  btnLabel: { color: Colors.red, fontWeight: '800', fontSize: 16, letterSpacing: 2 },
  holdText: { color: Colors.textSecondary, fontSize: 13, marginTop: 16, textAlign: 'center' },
});
