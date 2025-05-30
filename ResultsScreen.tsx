import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../App';
import ResultCard, { AnalysisResult } from '../components/ResultCard';
import EmotionDetailPopup from '../components/EmotionDetailPopup';
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type ResultsScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Results'
>;

type ResultsScreenRouteProps = RouteProp<
  MainStackParamList,
  'Results'
>;

// Mock result for demo purposes
const MOCK_RESULT: AnalysisResult = {
  id: '123',
  date: new Date(),
  transcript: 'I don\'t think I can make the meeting tomorrow. My schedule is really packed with other deadlines that are more urgent right now. Maybe we can postpone it to next week when I\'ll have more bandwidth to focus on this project.',
  isSafe: true,
  tags: ['Not office-appropriate'],
  emotionalTone: 'Nervous',
  stressScore: 68,
  deceptionLikelihood: 75,
};

const ResultsScreen: React.FC = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProps>();
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [result] = useState<AnalysisResult>(MOCK_RESULT);
  const [showEmotionPopup, setShowEmotionPopup] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(!user?.isPremium);
  
  const handleNavigateBack = () => {
    navigation.navigate('TabNavigator', { screen: 'Home' });
  };
  
  const handleToggleTranscript = () => {
    setShowFullTranscript(prev => !prev);
  };
  
  const handleShowDetails = () => {
    setShowEmotionPopup(true);
  };
  
  const handleCloseEmotionPopup = () => {
    setShowEmotionPopup(false);
  };
  
  const handleUpgrade = () => {
    setShowAdPopup(false);
    navigation.navigate('Subscription');
  };
  
  const handleDismissAd = () => {
    setShowAdPopup(false);
  };
  
  return (
    <SafeAreaView style={{...styles.container, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleNavigateBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{...styles.headerTitle, color: colors.text}}>
          Analysis Results
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{...styles.sectionTitle, color: colors.text}}>
              Voice Transcript
            </Text>
            <TouchableOpacity onPress={handleToggleTranscript}>
              <Text style={{...styles.sectionAction, color: colors.primary}}>
                {showFullTranscript ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{...styles.transcriptContainer, backgroundColor: colors.card}}>
            <Text 
              style={{...styles.transcriptText, color: colors.text}}
              numberOfLines={showFullTranscript ? undefined : 3}
            >
              {result.transcript}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{...styles.sectionTitle, color: colors.text}}>
              Safety Analysis
            </Text>
          </View>
          
          <View style={{...styles.safetyContainer, backgroundColor: colors.card}}>
            <View 
              style={{
                ...styles.safetyBadge, 
                backgroundColor: result.isSafe ? colors.success + '20' : colors.danger + '20',
                borderColor: result.isSafe ? colors.success : colors.danger,
              }}
            >
              <Ionicons 
                name={result.isSafe ? 'shield-checkmark' : 'warning'} 
                size={24} 
                color={result.isSafe ? colors.success : colors.danger} 
              />
              <Text 
                style={{
                  ...styles.safetyText,
                  color: result.isSafe ? colors.success : colors.danger,
                }}
              >
                {result.isSafe ? 'Safe Content' : 'Unsafe Content'}
              </Text>
            </View>

            {result.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {result.tags.map((tag, index) => (
                  <View 
                    key={index} 
                    style={{
                      ...styles.tag,
                      backgroundColor: colors.warning + '20',
                      borderColor: colors.warning,
                    }}
                  >
                    <Text style={{...styles.tagLabel, color: colors.text + 'DD'}}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={{...styles.safetyDescription, color: colors.text + 'CC'}}>
              {result.isSafe 
                ? 'This content appears safe for most contexts. ' +
                  (result.tags.length > 0 ? 'However, some potential sensitivities were detected as noted above.' : '')
                : 'This content contains potentially sensitive topics that might not be appropriate in all contexts.'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{...styles.sectionTitle, color: colors.text}}>
              Emotional Analysis
            </Text>
            {!user?.isPremium && (
              <View style={{...styles.premiumBadge, backgroundColor: colors.primary + '20'}}>
                <Ionicons name="flash" size={14} color={colors.primary} />
                <Text style={{...styles.premiumText, color: colors.primary}}>
                  Premium
                </Text>
              </View>
            )}
          </View>

          <View style={{...styles.emotionContainer, backgroundColor: colors.card}}>
            <TouchableOpacity
              style={styles.emotionTouchable}
              onPress={handleShowDetails}
              activeOpacity={0.8}
            >
              <View style={styles.emotionHeader}>
                <View>
                  <Text style={{...styles.emotionTitle, color: colors.text}}>
                    {result.emotionalTone}
                  </Text>
                  <Text style={{...styles.stressLabel, color: colors.text + 'AA'}}>
                    Stress Level: {result.stressScore}%
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.text + '80'} />
              </View>
            </TouchableOpacity>

            {!user?.isPremium && (
              <TouchableOpacity
                style={{...styles.upgradeBanner, borderColor: colors.primary + '50'}}
                onPress={() => navigation.navigate('Subscription')}
                activeOpacity={0.8}
              >
                <Ionicons name="lock-closed" size={16} color={colors.primary} />
                <Text style={{...styles.upgradeText, color: colors.text}}>
                  Upgrade to Premium for full emotional breakdown
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button 
            title="View Full Report" 
            onPress={handleShowDetails}
            variant="primary"
            size="large"
            style={styles.actionButton}
          />
          
          <TouchableOpacity 
            style={{...styles.dashboardButton, borderColor: colors.border}}
            onPress={handleNavigateBack}
          >
            <Ionicons name="grid" size={18} color={colors.text} />
            <Text style={styles.dashboardText}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        {!user?.isPremium && (
          <View style={{...styles.bannerAd, backgroundColor: colors.card}}>
            <Text style={{...styles.adText, color: colors.text}}>
              Upgrade to Premium for Ad-Free Experience
            </Text>
            <Button
              title="Upgrade"
              onPress={() => navigation.navigate('Subscription')}
              variant="outline"
              size="small"
            />
          </View>
        )}
      </ScrollView>

      <EmotionDetailPopup
        visible={showEmotionPopup}
        onClose={handleCloseEmotionPopup}
        result={result}
      />

      {showAdPopup && !user?.isPremium && (
        <View style={styles.adPopupOverlay}>
          <View style={{...styles.adPopup, backgroundColor: colors.card}}>
            <TouchableOpacity 
              style={styles.adPopupCloseButton} 
              onPress={handleDismissAd}
            >
              <Ionicons name="close" size={24} color={colors.text + '80'} />
            </TouchableOpacity>
            
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=SafeVoice%20Premium&aspect=1:1' }}
              style={styles.adImage}
              resizeMode="contain"
            />
            
            <Text style={{...styles.adPopupTitle, color: colors.text}}>
              Unlock Premium Features
            </Text>
            
            <Text style={{...styles.adPopupText, color: colors.text + 'CC'}}>
              Get unlimited analyses, ad-free experience, and detailed emotional breakdown reports with Premium.
            </Text>
            
            <View style={styles.adPopupButtons}>
              <Button
                title="Upgrade Now"
                onPress={handleUpgrade}
                variant="primary"
                size="medium"
                style={styles.adPopupButton}
              />
              
              <TouchableOpacity onPress={handleDismissAd}>
                <Text style={{...styles.adPopupSecondaryText, color: colors.text + '99'}}>
                  Maybe Later
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  content: {
    padding: 16,
    paddingBottom: 80, // For ad banner space
  },
  resultCardContainer: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '500',
  },
  transcriptContainer: {
    padding: 16,
    borderRadius: 12,
  },
  transcriptText: {
    fontSize: 15,
    lineHeight: 22,
  },
  safetyContainer: {
    padding: 16,
    borderRadius: 12,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  safetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  safetyText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  tagsContainer: {
    marginBottom: 12,
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  safetyDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  emotionContainer: {
    padding: 16,
    borderRadius: 12,
  },
  emotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emotionMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionIcon: {
    marginRight: 12,
  },
  emotionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  stressLabel: {
    fontSize: 14,
  },
  detailsButton: {
    paddingHorizontal: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  upgradeText: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 10,
  },
  actionsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  dashboardButton: {
    marginTop: 12,
  },
  actionButton: {
    marginBottom: 12,
  },
  bannerAd: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  adText: {
    fontSize: 14,
    fontWeight: '600',
  },
  adButton: {
    paddingHorizontal: 16,
  },
  adPopupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  adPopup: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  adPopupCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 4,
  },
  adImage: {
    width: '100%',
    height: 180,
  },
  adPopupTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  adPopupText: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 24,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  adPopupButtons: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  adPopupButton: {
    width: '100%',
    marginBottom: 12,
  },
  adPopupSecondaryButton: {
    paddingVertical: 8,
  },
  adPopupSecondaryText: {
    fontSize: 14,
  },
});

export default ResultsScreen;