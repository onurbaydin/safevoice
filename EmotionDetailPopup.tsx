import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { AnalysisResult } from './ResultCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type EmotionDetailPopupProps = {
  visible: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
};

const EmotionDetailPopup: React.FC<EmotionDetailPopupProps> = ({
  visible,
  onClose,
  result,
}) => {
  const { colors } = useTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.back()) });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.9, { duration: 200 });
    }
  }, [visible]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  if (!result) return null;

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'angry':
        return '#F44336';
      case 'calm':
        return '#4CAF50';
      case 'nervous':
        return '#FF9800';
      case 'happy':
        return '#2196F3';
      case 'sad':
        return '#9C27B0';
      default:
        return colors.primary;
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'angry':
        return 'flame';
      case 'calm':
        return 'water';
      case 'nervous':
        return 'pulse';
      case 'happy':
        return 'happy';
      case 'sad':
        return 'sad';
      default:
        return 'analytics';
    }
  };

  const getEmotionDescription = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'angry':
        return 'Voice analysis detected high pitch variations and intensity consistent with anger or frustration.';
      case 'calm':
        return 'Voice analysis detected even tone, consistent pace, and relaxed vocalization patterns.';
      case 'nervous':
        return 'Voice analysis detected trembling, hesitation, and pitch inconsistencies associated with anxiety.';
      case 'happy':
        return 'Voice analysis detected upbeat intonation, variation, and energetic speech patterns.';
      case 'sad':
        return 'Voice analysis detected lower energy, monotone delivery, and slower speech rate.';
      default:
        return 'Voice analysis detected mixed emotional patterns.';
    }
  };

  const getDeceptionAnalysis = (score: number) => {
    if (score < 30) {
      return 'Low likelihood of deception detected. Speech patterns show consistency and natural flow.';
    } else if (score < 70) {
      return 'Moderate indicators of potential deception. Some hesitation and unusual speech patterns detected.';
    } else {
      return 'High probability of deception. Significant voice stress, unnatural pauses, and inconsistent patterns detected.';
    }
  };

  const getStressAnalysis = (score: number) => {
    if (score < 30) {
      return 'Low stress levels detected in vocal patterns. Voice remains steady and controlled.';
    } else if (score < 70) {
      return 'Moderate stress detected. Some tension in vocal patterns and minor variations in pitch.';
    } else {
      return 'High stress levels detected. Significant tension in voice, irregular breathing, and pitch fluctuations.';
    }
  };

  const emotionColor = getEmotionColor(result.emotionalTone);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <Animated.View
          style={{
            ...styles.modalContainer,
            backgroundColor: colors.card,
            ...animatedContainerStyle
          }}
        >
          <View style={styles.header}>
            <Text style={{...styles.title, color: colors.text}}>Voice Analysis Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={{...styles.emotionSection, borderColor: emotionColor}}>
            <View style={styles.emotionHeader}>
              <Ionicons
                name={getEmotionIcon(result.emotionalTone)}
                size={32}
                color={emotionColor}
              />
              <Text style={{...styles.emotionTitle, color: emotionColor}}>
                {result.emotionalTone}
              </Text>
            </View>
            <Text style={{...styles.emotionDescription, color: colors.text}}>
              {getEmotionDescription(result.emotionalTone)}
            </Text>
          </View>

          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={{...styles.metricLabel, color: colors.text + 'CC'}}>
                Stress Level
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={{
                    ...styles.progressBar,
                    width: `${result.stressScore}%`,
                    backgroundColor: result.stressScore > 70
                      ? colors.danger
                      : result.stressScore > 30
                        ? colors.warning
                        : colors.success,
                  }}
                />
                <Text style={{...styles.progressText, color: colors.text}}>
                  {result.stressScore}%
                </Text>
              </View>
              <Text style={{...styles.analysisText, color: colors.text + 'CC'}}>
                {getStressAnalysis(result.stressScore)}
              </Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={{...styles.metricLabel, color: colors.text + 'CC'}}>
                Deception Probability
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={{
                    ...styles.progressBar,
                    width: `${result.deceptionLikelihood}%`,
                    backgroundColor: result.deceptionLikelihood > 70
                      ? colors.danger
                      : result.deceptionLikelihood > 30
                        ? colors.warning
                        : colors.success,
                  }}
                />
                <Text style={{...styles.progressText, color: colors.text}}>
                  {result.deceptionLikelihood}%
                </Text>
              </View>
              <Text style={{...styles.analysisText, color: colors.text + 'CC'}}>
                {getDeceptionAnalysis(result.deceptionLikelihood)}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  emotionSection: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  emotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emotionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 12,
  },
  emotionDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  metricsContainer: {
    gap: 20,
  },
  metricItem: {
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#33333333',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    textAlign: 'right',
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default EmotionDetailPopup;