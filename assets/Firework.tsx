import React, { useRef, useEffect } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const firework = require('./firework.json');

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export default function Firework(): React.ReactElement {
  const progress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress.current, {
      toValue: 1,
      duration: 5500,
      delay: 600,
      easing: Easing.bezier(0.22, 0.73, 0.64, -0.13),
      useNativeDriver: true,
    }).start();
  });

  return (
    <Animated.View
      style={{
        opacity: progress.current.interpolate({
          inputRange: [0, 0.5, 0.8, 1],
          outputRange: [1, 1, 0.9, 0],
        }),
      }}>
      <AnimatedLottieView
        progress={progress.current}
        source={firework}
        style={styles.animation}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animation: {
    alignSelf: 'center',
    width: 300,
    height: 600,
  },
});
