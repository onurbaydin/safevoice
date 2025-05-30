import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MainStackParamList } from '../App';
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type NewAnalysisScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'NewAnalysis'
>;

const NewAnalysisScreen: React.FC = () => {
  const navigation = useNavigation<NewAnalysisScreenNavigationProp>();
  const { colors } = useTheme();
  
  // Animation values
  const recordScale = useSharedValue(1);
  const uploadScale = useSharedValue(1);

  const handlePressIn = (type: 'record' | 'upload') => {
    if (type === 'record') {
      recordScale.value = withSpring(0.95);
    } else {
      uploadScale.value = withSpring(0.95);
    }
  };

  const handlePressOut = (type: 'record' | 'upload') => {
    if (type === 'record') {
      recordScale.value = withSpring(1);
    } else {
      uploadScale.value = withSpring(1);
    }
  };

  const handleRecord = () => {
    navigation.navigate('Recording');
  };

  const handleUpload = () => {
    // In a real app, we would launch a file picker here
    // For now, let's simulate a file being selected and navigate to the analysis progress
    setTimeout(() => {
      navigation.navigate('AnalysisProgress', { recordingUri: 'file:///mock/path/recording.m4a' });
    }, 500);
  };

  const recordAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: recordScale.value }],
    };
  });

  const uploadAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: uploadScale.value }],
    };
  });

  return (
    <LinearGradient
      colors={['#121212', '#181818', '#121212']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topSection}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={{...styles.headerTitle, color: colors.text}}>
                New Analysis
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.titleSection}>
              <Text style={{...styles.title, color: colors.text}}>
                Analyze Voice Sample
              </Text>
              <Text style={{...styles.subtitle, color: colors.text + 'AA'}}>
                Choose how you want to provide a voice sample for analysis
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={{...styles.optionCard, backgroundColor: colors.card}}
                onPress={() => handleOptionSelect('record')}
              >
                <View style={styles.optionContent}>
                  <View style={{...styles.optionIconContainer, backgroundColor: colors.primary + '20'}}>
                    <Ionicons name="mic" size={28} color={colors.primary} />
                  </View>
                  <Text style={{...styles.optionTitle, color: colors.text}}>Record Now</Text>
                  <Text style={{...styles.optionDescription, color: colors.text + 'AA'}}>
                    Record a new voice sample directly on your device
                  </Text>
                </View>

                <Button
                  title="Record"
                  onPress={() => handleOptionSelect('record')}
                  small
                  variant="primary"
                  icon="mic-outline"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{...styles.optionCard, backgroundColor: colors.card}}
                onPress={() => handleOptionSelect('upload')}
              >
                <View style={styles.optionContent}>
                  <View style={{...styles.optionIconContainer, backgroundColor: colors.primary + '20'}}>
                    <Ionicons name="cloud-upload" size={28} color={colors.primary} />
                  </View>
                  <Text style={{...styles.optionTitle, color: colors.text}}>Upload File</Text>
                  <Text style={{...styles.optionDescription, color: colors.text + 'AA'}}>
                    Upload an existing audio file from your device
                  </Text>
                </View>

                <Button
                  title="Select File"
                  onPress={() => handleOptionSelect('upload')}
                  small
                  variant="secondary"
                  style={{...styles.optionButton, borderColor: colors.primary}}
                  icon="document-outline"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={{...styles.infoText, color: colors.text + 'CC'}}>
              For best results, ensure your voice sample is at least 10 seconds long
              and recorded in a quiet environment. Audio files should be in MP3, 
              WAV, or M4A format and no larger than 10MB.
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
  scrollContent: {
    flex: 1,
  },
  topSection: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  titleSection: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: 30,
  },
  optionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 280,
  },
  optionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 'auto',
    paddingBottom: 20,
  },
  optionButton: {
    marginTop: 'auto',
    paddingHorizontal: 20,
  },
  infoSection: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});

export default NewAnalysisScreen;