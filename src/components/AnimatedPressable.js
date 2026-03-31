import React, { useRef, useCallback } from 'react';
import { Animated, TouchableOpacity, Platform } from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

let Haptics = null;
try {
  if (Platform.OS !== 'web') {
    Haptics = require('expo-haptics');
  }
} catch (_) {
  // expo-haptics unavailable (Expo Go, web, etc.)
}

const SPRING_CONFIGS = {
  scale: { tension: 150, friction: 8 },
  bounce: { tension: 200, friction: 5 },
  twist: { tension: 150, friction: 8 },
  pop: { tension: 250, friction: 6 },
};

const SCALE_VALUES = {
  scale: 0.96,
  bounce: 0.92,
  twist: 0.96,
  pop: 0.96,
};

const HAPTIC_MAP = {
  light: 'Light',
  medium: 'Medium',
  heavy: 'Heavy',
};

function triggerHaptic(level) {
  if (!Haptics || level === 'none') return;
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle[HAPTIC_MAP[level] || 'Light']);
  } catch (_) {
    // Swallow — haptics are best-effort
  }
}

export default function AnimatedPressable({
  children,
  style,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  activeOpacity,
  animationType = 'scale',
  haptic = 'light',
  scaleValue,
  ...rest
}) {
  const animVal = useRef(new Animated.Value(1)).current;
  const rotateVal = useRef(new Animated.Value(0)).current;

  const targetScale = scaleValue ?? SCALE_VALUES[animationType] ?? 0.96;
  const springCfg = SPRING_CONFIGS[animationType] || SPRING_CONFIGS.scale;

  const handlePressIn = useCallback(
    (e) => {
      if (disabled) return;
      triggerHaptic(haptic);

      Animated.spring(animVal, {
        toValue: targetScale,
        ...springCfg,
        useNativeDriver: true,
      }).start();

      if (animationType === 'twist') {
        Animated.spring(rotateVal, {
          toValue: 1,
          ...springCfg,
          useNativeDriver: true,
        }).start();
      }

      onPressIn?.(e);
    },
    [disabled, haptic, animationType, targetScale, springCfg, onPressIn],
  );

  const handlePressOut = useCallback(
    (e) => {
      if (disabled) return;

      if (animationType === 'pop') {
        Animated.sequence([
          Animated.spring(animVal, {
            toValue: 1.05,
            tension: 300,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.spring(animVal, {
            toValue: 1,
            tension: 150,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.spring(animVal, {
          toValue: 1,
          ...springCfg,
          useNativeDriver: true,
        }).start();
      }

      if (animationType === 'twist') {
        Animated.spring(rotateVal, {
          toValue: 0,
          ...springCfg,
          useNativeDriver: true,
        }).start();
      }

      onPressOut?.(e);
    },
    [disabled, animationType, springCfg, onPressOut],
  );

  const rotate = rotateVal.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2deg'],
  });

  const animatedStyle = {
    transform: [
      { scale: animVal },
      ...(animationType === 'twist' ? [{ rotate }] : []),
    ],
  };

  return (
    <AnimatedTouchable
      style={[style, animatedStyle, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={activeOpacity ?? 0.9}
      {...rest}
    >
      {children}
    </AnimatedTouchable>
  );
}
