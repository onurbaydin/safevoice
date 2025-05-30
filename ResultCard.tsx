import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export type AnalysisResult = {
  id: string;
  date: Date;
  transcript: string;
  isSafe: boolean;
  tags: string[];
  emotionalTone: string;
  stressScore: number;
  deceptionLikelihood: number;
};

type ResultCardProps = {
  result: AnalysisResult;
  onPress?: () => void;
  showFullDetails?: boolean;
};

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onPress,
  showFullDetails = false,
}) => {
  const { colors } = useTheme();

  const formattedDate = result.date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const formattedTime = result.date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'sensitive content':
        return '#FF9800';
      case 'not suitable for children':
        return '#F44336';
      case 'not office-appropriate':
        return '#E91E63';
      default:
        return colors.accent;
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

  const getDeceptionText = (likelihood: number) => {
    if (likelihood < 30) return 'Low probability of deception';
    if (likelihood < 70) return 'Moderate probability of deception';
    return 'High probability of deception';
  };

  return (
    <View style={{...styles.container, backgroundColor: colors.card}}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={{...styles.date, color: colors.text}}>{formattedDate}</Text>
          <Text style={{...styles.time, color: colors.text + '99'}}>{formattedTime}</Text>
        </View>
        <View 
          style={{
            ...styles.safetyBadge,
            backgroundColor: result.isSafe ? '#4CAF5033' : '#F4433633',
            borderColor: result.isSafe ? '#4CAF50' : '#F44336' 
          }}
        >
          <Ionicons
            name={result.isSafe ? 'shield-checkmark' : 'warning'}
            size={16}
            color={result.isSafe ? '#4CAF50' : '#F44336'}
            style={styles.safetyIcon}
          />
          <Text
            style={{
              ...styles.safetyText,
              color: result.isSafe ? '#4CAF50' : '#F44336'
            }}
          >
            {result.isSafe ? 'Safe' : 'Unsafe'}
          </Text>
        </View>
      </View>

      {result.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {result.tags.map((tag, index) => (
            <View 
              key={index}
              style={{
                ...styles.tag, 
                backgroundColor: getTagColor(tag) + '33', 
                borderColor: getTagColor(tag)
              }}
            >
              <Text style={{...styles.tagText, color: getTagColor(tag)}}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.divider} />

      <Text 
        style={{...styles.transcriptTitle, color: colors.text}}
        numberOfLines={1}
      >
        Transcript
      </Text>

      <Text 
        style={{...styles.transcript, color: colors.text + 'CC'}}
        numberOfLines={showFullDetails ? undefined : 2}
      >
        {result.transcript}
      </Text>

      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name={getEmotionIcon(result.emotionalTone)} size={18} color={colors.text} />
          <Text style={{...styles.detailText, color: colors.text}}>
            {result.emotionalTone}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="speedometer" size={18} color={colors.text} />
          <Text style={{...styles.detailText, color: colors.text}}>
            Stress Level: {result.stressScore}%
          </Text>
        </View>
        
        {showFullDetails && (
          <View style={styles.detailRow}>
            <Ionicons 
              name={result.deceptionLikelihood > 50 ? "alert-circle" : "checkmark-circle"} 
              size={18} 
              color={colors.text} 
            />
            <Text style={{...styles.detailText, color: colors.text}}>
              {getDeceptionText(result.deceptionLikelihood)}
            </Text>
          </View>
        )}
      </View>

      <View 
        style={{
          ...styles.indicator,
          backgroundColor: result.isSafe ? '#4CAF50' : '#F44336'
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {},
  date: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
  },
  safetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  safetyIcon: {
    marginRight: 4,
  },
  safetyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#FFFFFF15',
    marginVertical: 12,
  },
  transcriptTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  transcript: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailsContainer: {
    marginTop: 8,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});

export default ResultCard;