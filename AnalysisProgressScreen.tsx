import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MainStackParamList } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

type AnalysisProgressScreenProps = NativeStackNavigationProp<
  MainStackParamList,
  'AnalysisProgress'
>;

type AnalysisProgressRouteProps = RouteProp<
  MainStackParamList,
  'AnalysisProgress'
>;

const ANALYSIS_STEPS = [
  { id: 1, label: 'Transcribing audio...', icon: 'text' },
  { id: 2, label: 'Detecting content safety...', icon: 'shield-checkmark' },
  { id: 3, label: 'Analyzing emotional tone...', icon: 'analytics' },
  { id: 4, label: 'Measuring stress indicators...', icon: 'pulse' },
  { id: 5, label: 'Processing complete!', icon: 'checkmark-circle' },
];

const AnalysisProgressScreen: React.FC = () => {
  const navigation = useNavigation<AnalysisProgressScreenProps>();
  const route = useRoute<AnalysisProgressRouteProps>();
  const { colors } = useTheme();
  
  // State for tracking progress
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animation values
  const rotation = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  
  useEffect(() => {
    // Rotate the circular loader
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
    
    // Pulse the loading icon
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.in(Easing.ease) })
      ),
      -1,
      true
    );
    
    // Simulate analysis with step changes
    const stepInterval = 3000; // 3 seconds per step
    let stepTimer: NodeJS.Timeout;
    
    const advanceStep = () => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= ANALYSIS_STEPS.length) {
          setIsComplete(true);
          cancelAnimation(rotation);
          cancelAnimation(pulseScale);
          
          // Navigate to results after a short delay
          setTimeout(() => {
            navigation.replace('Results', { analysisId: '123' });
          }, 1000);
          
          return prev;
        }
        return next;
      });
    };
    
    // Start advancing through steps
    stepTimer = setInterval(advanceStep, stepInterval);
    
    // Progress bar animation
    const totalDuration = stepInterval * ANALYSIS_STEPS.length;
    const animateProgress = () => {
      const stepSize = 0.01;
      const interval = 100;
      
      const timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + stepSize;
          progressWidth.value = withTiming(next * 100, { duration: 100 });
          
          if (next >= 1) {
            clearInterval(timer);
          }
          return next >= 1 ? 1 : next;
        });
      }, interval);
      
      return () => clearInterval(timer);
    };
    
    const progressCleanup = animateProgress();
    
    return () => {
      clearInterval(stepTimer);
      progressCleanup();
    };
  }, []);
  
  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });
  
  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });
  
  const renderCurrentStep = () => {
    if (currentStep >= ANALYSIS_STEPS.length) return null;
    
    const step = ANALYSIS_STEPS[currentStep];
    
    return (
      <View style={styles.currentStepContainer}>
        <Animated.View style={pulseStyle}>
          <View style={{...styles.stepIconContainer, backgroundColor: colors.primary + '20'}}>
            <Ionicons name={step.icon as any} size={30} color={colors.primary} />
          </View>
        </Animated.View>
        <Text style={{...styles.stepLabel, color: colors.text}}>{step.label}</Text>
      </View>
    );
  };
  
  return (
    <LinearGradient
      colors={['#121212', '#1A1A1A', '#121212']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={{...styles.headerTitle, color: colors.text}}>
            Analyzing Voice
          </Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.loaderContainer}>
            <Animated.View style={{...styles.circularLoader, ...rotationStyle}}>
              <LinearGradient
                colors={[colors.primary, 'transparent']}
                style={styles.loaderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            
            <View style={styles.waveContainer}>
              <Animated.View style={waveAnimatedStyle}>
                <Ionicons name="radio" size={32} color={colors.primary} />
              </Animated.View>
            </View>
          </View>
          
          {renderCurrentStep()}
          
          <View style={styles.progressContainer}>
            <View style={{...styles.progressBar, backgroundColor: colors.border}}>
              <Animated.View
                style={{
                  ...styles.progressFill,
                  width: `${Math.min(100, progress)}%`,
                  backgroundColor: colors.primary
                }}
              />
            </View>
            <Text style={{...styles.progressText, color: colors.text + 'AA'}}>
              {Math.min(100, Math.round(progress))}% Complete
            </Text>
          </View>
          
          <View style={styles.stepsContainer}>
            {ANALYSIS_STEPS.map((step, index) => (
              <View key={index} style={styles.step}>
                <View 
                  style={{...styles.stepIconContainer, backgroundColor: colors.primary + '20'}}
                >
                  <Ionicons name={step.icon} size={24} color={colors.primary} />
                </View>
                <Text style={{...styles.stepLabel, color: colors.text}}>{step.label}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={{...styles.infoText, color: colors.text + 'CC'}}>
              Please wait while we analyze your recording. This typically takes 30-45 seconds.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  circularLoader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    overflow: 'hidden',
  },
  loaderGradient: {
    width: '100%',
    height: '100%',
  },
  waveContainer: {
    position: 'absolute',
    top: 100,
    left: 100,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  waveAnimatedStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    overflow: 'hidden',
  },
  innerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  analyzeImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  currentStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  stepIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
  },
  stepsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF10',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});

export default AnalysisProgressScreen;