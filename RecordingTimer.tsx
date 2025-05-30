import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  withRepeat,
} from 'react-native-reanimated';

type RecordingTimerProps = {
  isRecording: boolean;
};

const RecordingTimer: React.FC<RecordingTimerProps> = ({ isRecording }) => {
  const { colors } = useTheme();
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const pulseAnim = useSharedValue(1);
  const dotOpacity = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      
      // Start animations
      pulseAnim.value = withRepeat(
        withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      
      dotOpacity.value = withRepeat(
        withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setSeconds(0);
      
      // Reset animations
      pulseAnim.value = withTiming(1);
      dotOpacity.value = withTiming(1);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      opacity: dotOpacity.value,
      transform: [
        { scale: pulseAnim.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {isRecording ? (
        <Text style={{...styles.timerText, color: colors.text}}>
          {formatTime(seconds)}
        </Text>
      ) : null}
      <Text style={{...styles.recordingText, color: colors.text + 'AA'}}>
        {isRecording ? 'Recording...' : 'Ready to record'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
  },
  recordingText: {
    fontSize: 14,
  },
});

export default RecordingTimer;