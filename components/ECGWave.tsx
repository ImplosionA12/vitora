import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface ECGWaveProps {
  width: number;
  height: number;
  color?: string;
}

export default function ECGWave({ width, height, color = Colors.red }: ECGWaveProps) {
  const ecgPath = `M0,${height * 0.6}
    L${width * 0.05},${height * 0.6}
    L${width * 0.1},${height * 0.55}
    L${width * 0.15},${height * 0.65}
    L${width * 0.18},${height * 0.2}
    L${width * 0.22},${height * 0.85}
    L${width * 0.26},${height * 0.6}
    L${width * 0.35},${height * 0.6}
    L${width * 0.4},${height * 0.55}
    L${width * 0.45},${height * 0.65}
    L${width * 0.48},${height * 0.2}
    L${width * 0.52},${height * 0.85}
    L${width * 0.56},${height * 0.6}
    L${width * 0.65},${height * 0.6}
    L${width * 0.7},${height * 0.55}
    L${width * 0.75},${height * 0.65}
    L${width * 0.78},${height * 0.2}
    L${width * 0.82},${height * 0.85}
    L${width * 0.86},${height * 0.6}
    L${width},${height * 0.6}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="ecgGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={color} stopOpacity="0" />
          <Stop offset="0.3" stopColor={color} stopOpacity="1" />
          <Stop offset="0.7" stopColor={color} stopOpacity="1" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path
        d={ecgPath}
        stroke={`url(#ecgGrad)`}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
