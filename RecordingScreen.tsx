import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MainStackParamList } from '../App';
import RecordingTimer from '../components/RecordingTimer';
import { useTheme } from '../contexts/ThemeContext';
import Animated,
{
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';

type RecordingScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Recording'
>;

const RecordingScreen: React.FC = () => {
  const navigation = useNavigation<RecordingScreenNavigationProp>();
  const { colors } = useTheme();
  const [isRecording, setIsRecording] = useState(true);
  
  // Animation values for record button pulsing effect
  const recordBtnScale = useSharedValue(1);
  const outerRingScale = useSharedValue(1);
  const outerRingOpacity = useSharedValue(0.7);
  
  React.useEffect(() => {
    // Start pulsing animation for outer ring
    outerRingScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2000 }),
        withTiming(1.2, { duration: 2000 })
      ),
      -1,
      true
    );
    
    outerRingOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 2000 }),
        withTiming(0.5, { duration: 2000 })
      ),
      -1,
      true
    );
    
    const cleanup = setTimeout(() => {
      // Simulate recording for 3 seconds
      handleStopRecording();
    }, 15000); // longer timeout for demo purposes
    
    return () => clearTimeout(cleanup);
  }, []);
  
  const handlePressStop = () => {
    recordBtnScale.value = withSpring(0.95);
    setTimeout(() => {
      recordBtnScale.value = withSpring(1);
      handleStopRecording();
    }, 200);
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    
    // In a real app, we would stop recording and save the file
    setTimeout(() => {
      navigation.replace('AnalysisProgress', {
        recordingUri: 'file:///mock/path/recording.m4a',
      });
    }, 500);
  };
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: recordBtnScale.value }],
    };
  });
  
  const outerRingAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: outerRingScale.value }],
      opacity: outerRingOpacity.value,
    };
  });

  return (
    <LinearGradient
      colors={['#121212', '#1A1A1A', '#121212']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={{...styles.headerTitle, color: colors.text}}>
              Voice Recording
            </Text>
            <View style={{width: 28}} />
          </View>

          <View style={styles.recordingContainer}>
            {isRecording ? (
              <RecordingTimer 
                isRecording={isRecording}
              />
            ) : (
              <Text 
                style={{
                  ...styles.readyText,
                  color: colors.text,
                  marginTop: 20
                }}
              >
                Ready to record
              </Text>
            )}
            
            <View style={styles.buttonContainer}>
              <Animated.View style={{...styles.outerRing, ...outerRingAnimatedStyle}}>
                <View style={{...styles.outerRingInner, borderColor: colors.danger}} />
              </Animated.View>
              
              <TouchableOpacity
                onPress={recording ? handleStopRecording : handleStartRecording}
                style={{...styles.recordButton, backgroundColor: colors.danger}}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={recording ? "square" : "mic"} 
                  size={32} 
                  color="#FFF" 
                />
              </TouchableOpacity>
            </View>
            
            <Text style={{...styles.tapText, color: colors.text + 'AA'}}>
              {recording ? "Tap to stop recording" : "Tap to start recording"}
            </Text>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={{...styles.infoText, color: colors.text + 'CC'}}>
              Speak clearly and naturally. For best analysis results, record in a quiet 
              environment and provide at least 10-15 seconds of speech.
            </Text>
          </View>
        </ScrollView>
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
    justifyContent: 'space-between',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  visualizerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  visualizer: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 20,
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  bottomContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordButtonContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRingInner: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FF5252',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    width: 25,
    height: 25,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  tapText: {
    marginTop: 20,
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    padding: 10,
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
  scrollView: {
    flex: 1,
  },
  readyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  recordingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecordingScreen;