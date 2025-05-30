import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated,
{
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Button from '../components/Button';
import { AuthStackParamList } from '../App';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Welcome'
>;

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  
  // Animation values for the floating sound wave effect
  const animatedX1 = useSharedValue(0);
  const animatedX2 = useSharedValue(width * 0.2);
  const animatedX3 = useSharedValue(width * 0.4);
  const animatedY = useSharedValue(0);
  
  // Create animated styles for floating circles
  React.useEffect(() => {
    // Horizontal movement
    animatedX1.value = withRepeat(
      withSequence(
        withTiming(-width * 0.1, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
        withTiming(width * 0.1, { duration: 8000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    
    animatedX2.value = withRepeat(
      withSequence(
        withTiming(width * 0.3, { duration: 11000, easing: Easing.inOut(Easing.quad) }),
        withTiming(width * 0.1, { duration: 11000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    
    animatedX3.value = withRepeat(
      withSequence(
        withTiming(width * 0.3, { duration: 9000, easing: Easing.inOut(Easing.quad) }),
        withTiming(width * 0.5, { duration: 9000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    
    // Vertical movement
    animatedY.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const floatingCircle1Style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: animatedX1.value },
        { translateY: animatedY.value },
      ],
    };
  });

  const floatingCircle2Style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: animatedX2.value },
        { translateY: animatedY.value * -0.8 },
      ],
    };
  });

  const floatingCircle3Style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: animatedX3.value },
        { translateY: animatedY.value * 1.2 },
      ],
    };
  });

  const features = [
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy-Focused',
      description: 'Analyze voice messages privately for social appropriateness with confidence.',
    },
    {
      icon: 'pulse-outline',
      title: 'Emotion Detection',
      description: 'Detect emotional tone, stress levels, and potential deception in voice recordings.',
    },
    {
      icon: 'mic-outline',
      title: 'Upload or Record',
      description: 'Easily record a new voice message or upload an existing one for analysis.',
    },
    {
      icon: 'document-text-outline',
      title: 'Detailed Reports',
      description: 'Get comprehensive breakdowns of voice analysis with premium features.',
    },
  ];

  return (
    <LinearGradient
      colors={['#121212', '#1D1D1D', '#121212']}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>SafeVoice</Text>
              <Ionicons name="mic" size={24} color="#00FF99" style={styles.logoIcon} />
            </View>
            <Text style={styles.tagline}>
              Voice analysis for the privacy-conscious
            </Text>
          </View>

          <View style={styles.animatedBackground}>
            <Animated.View style={{...styles.floatingCircle, ...styles.circle1, ...floatingCircle1Style}} />
            <Animated.View style={{...styles.floatingCircle, ...styles.circle2, ...floatingCircle2Style}} />
            <Animated.View style={{...styles.floatingCircle, ...styles.circle3, ...floatingCircle3Style}} />
            
            <View style={styles.heroImageContainer}>
              <Image
                source={{ uri: 'https://api.a0.dev/assets/image?text=Voice%20analysis%20app%20with%20sound%20waves%20and%20privacy%20shield%20in%20neon%20green%20on%20dark%20background&aspect=1:1&seed=123' }}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Smart Voice Analysis</Text>
            <Text style={styles.featuresSubtitle}>
              Analyze voice messages for social appropriateness and emotional tone
            </Text>

            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name={feature.icon as any} size={24} color="#00FF99" />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonsContainer}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Signup')}
            variant="primary"
            size="large"
            fullWidth
            style={styles.mainButton}
          />
          <Button
            title="Already have an account? Login"
            onPress={() => navigation.navigate('Login')}
            variant="text"
            size="medium"
            fullWidth
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
          />
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logoIcon: {
    marginLeft: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
  },
  animatedBackground: {
    height: 300,
    position: 'relative',
    marginVertical: 20,
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 100,
  },
  circle1: {
    width: 180,
    height: 180,
    backgroundColor: '#00FF9915',
    top: 20,
    left: width * 0.1,
  },
  circle2: {
    width: 140,
    height: 140,
    backgroundColor: '#00FF9910',
    top: 100,
    left: width * 0.3,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: '#00FF9908',
    top: 50,
    left: width * 0.5,
  },
  heroImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  heroImage: {
    width: 240,
    height: 240,
  },
  featuresContainer: {
    marginTop: 20,
    paddingVertical: 20,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  featuresSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00FF9920',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    lineHeight: 20,
  },
  buttonsContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  mainButton: {
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#CCCCCC',
  },
});

export default WelcomeScreen;