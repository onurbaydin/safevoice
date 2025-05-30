import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MainStackParamList } from '../App';
import ResultCard, { AnalysisResult } from '../components/ResultCard';
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'TabNavigator'
>;

// Mock data
const MOCK_RESULTS: AnalysisResult[] = [
  {
    id: '1',
    date: new Date(2023, 4, 25, 10, 30),
    transcript: 'Hey, just checking in about the meeting tomorrow. I think we should reschedule since most of the team is unavailable.',
    isSafe: true,
    tags: [],
    emotionalTone: 'Calm',
    stressScore: 15,
    deceptionLikelihood: 5,
  },
  {
    id: '2',
    date: new Date(2023, 4, 23, 14, 15),
    transcript: 'I can\'t believe they rejected our proposal again! This is the third time and we\'ve addressed all their concerns!',
    isSafe: true,
    tags: ['Not office-appropriate'],
    emotionalTone: 'Angry',
    stressScore: 75,
    deceptionLikelihood: 20,
  },
  {
    id: '3',
    date: new Date(2023, 4, 21, 9, 0),
    transcript: 'The presentation contains some sensitive financial projections that aren\'t public yet. Let\'s make sure this stays confidential.',
    isSafe: false,
    tags: ['Sensitive content'],
    emotionalTone: 'Nervous',
    stressScore: 65,
    deceptionLikelihood: 45,
  },
  {
    id: '4',
    date: new Date(2023, 4, 20, 16, 45),
    transcript: 'I\'m so excited about the new project! I think it\'s going to be a game-changer for our department.',
    isSafe: true,
    tags: [],
    emotionalTone: 'Happy',
    stressScore: 10,
    deceptionLikelihood: 5,
  },
  {
    id: '5',
    date: new Date(2023, 4, 18, 11, 20),
    transcript: 'I don\'t think I\'ll be able to make it to the team outing this weekend. Something came up with my family.',
    isSafe: true,
    tags: [],
    emotionalTone: 'Sad',
    stressScore: 40,
    deceptionLikelihood: 70,
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  // Animation value for the tutorial popup
  const tutorialOpacity = useSharedValue(0);
  const tutorialPosition = useSharedValue(50);

  useFocusEffect(
    useCallback(() => {
      // In a real app, we would fetch results from an API
      setResults(MOCK_RESULTS);

      // Animate tutorial in
      if (showTutorial) {
        tutorialOpacity.value = withSpring(1, { damping: 20 });
        tutorialPosition.value = withSpring(0, { damping: 20 });
      }

      return () => {
        // Cleanup if needed
      };
    }, [showTutorial])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setRefreshing(false);
    }, 1000);
  };

  const handleNewAnalysis = () => {
    navigation.navigate('NewAnalysis');
  };

  const handleViewResult = (resultId: string) => {
    navigation.navigate('Results', { analysisId: resultId });
  };

  const dismissTutorial = () => {
    tutorialOpacity.value = withSpring(0);
    tutorialPosition.value = withSpring(50);
    
    setTimeout(() => {
      setShowTutorial(false);
    }, 300);
  };

  const animatedTutorialStyle = useAnimatedStyle(() => {
    return {
      opacity: tutorialOpacity.value,
      transform: [{ translateY: tutorialPosition.value }],
    };
  });

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="mic-outline" size={70} color={colors.text + '40'} />
      <Text style={{...styles.emptyStateTitle, color: colors.text}}>
        No Analyses Yet
      </Text>
      <Text style={{...styles.emptyStateText, color: colors.text + '99'}}>
        Start by recording or uploading a voice message for analysis
      </Text>
      <Button
        title="New Analysis"
        onPress={handleNewAnalysis}
        variant="primary"
        size="large"
        style={styles.emptyStateButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={{...styles.container, backgroundColor: colors.background}}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View>
          <Text style={{...styles.title, color: colors.text}}>Dashboard</Text>
          <Text style={{...styles.subtitle, color: colors.text + 'AA'}}>
            {user?.isPremium ? 'Premium' : 'Basic'} Account
          </Text>
        </View>
        <TouchableOpacity
          style={{...styles.profileButton, backgroundColor: colors.card}}
          onPress={() => navigation.navigate('TabNavigator', { screen: 'Account' })}
        >
          <Ionicons name="person" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#00FF9915', '#00FF9905']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{...styles.statsCard, borderColor: colors.primary + '30'}}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={{...styles.statValue, color: colors.text}}>
                {user?.analysisCount || 0}
              </Text>
              <Text style={{...styles.statLabel, color: colors.text + 'AA'}}>
                Total Analyses
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={{...styles.statValue, color: colors.text}}>
                {user?.isPremium ? 'Unlimited' : `${user?.dailyLimit - (user?.analysisCount % user?.dailyLimit)}/${user?.dailyLimit}`}
              </Text>
              <Text style={{...styles.statLabel, color: colors.text + 'AA'}}>
                Remaining Today
              </Text>
            </View>
          </View>
          {!user?.isPremium && (
            <TouchableOpacity
              style={{...styles.upgradeButton, borderColor: colors.primary}}
              onPress={() => navigation.navigate('Subscription')}
            >
              <Ionicons name="flash" size={16} color={colors.primary} />
              <Text style={{...styles.upgradeText, color: colors.primary}}>
                Upgrade to Premium
              </Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>

      <View style={styles.recentContainer}>
        <Text style={{...styles.recentTitle, color: colors.text}}>
          Recent Analyses
        </Text>

        {results.length > 0 ? (
          <ScrollView
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
          >
            {results.map(result => (
              <TouchableOpacity
                key={result.id}
                onPress={() => handleViewResult(result.id)}
                activeOpacity={0.8}
              >
                <ResultCard result={result} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          renderEmptyState()
        )}
      </View>

      {showTutorial && (
        <Animated.View
          style={{
            ...styles.tutorialContainer,
            backgroundColor: colors.card,
            ...animatedTutorialStyle
          }}
        >
          <View style={styles.tutorialHeader}>
            <Text style={{...styles.tutorialTitle, color: colors.text}}>
              Welcome to SafeVoice
            </Text>
            <TouchableOpacity onPress={dismissTutorial}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={{...styles.tutorialText, color: colors.text + 'DD'}}>
            To get started, tap the + button to record or upload a voice message for analysis.
          </Text>
          
          <View style={styles.tutorialButtonsRow}>
            <Button
              title="Got it"
              onPress={dismissTutorial}
              variant="primary"
              size="small"
              style={styles.tutorialButton}
            />
            <TouchableOpacity onPress={dismissTutorial}>
              <Text style={{...styles.tutorialSkip, color: colors.text + '99'}}>
                Don't show again
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    height: 40,
    width: 1,
    backgroundColor: '#FFFFFF20',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  recentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  resultsList: {
    paddingBottom: 100,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyStateButton: {
    marginTop: 10,
  },
  tutorialContainer: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tutorialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  tutorialText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  tutorialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tutorialButton: {
    paddingHorizontal: 20,
  },
  tutorialSkip: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default HomeScreen;