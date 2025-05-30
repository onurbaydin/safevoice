import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../App';
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type SubscriptionScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Subscription'
>;

interface PlanFeature {
  title: string;
  basic: boolean | string;
  premium: boolean | string;
  icon?: string;
}

const FEATURES: PlanFeature[] = [
  { 
    title: 'Daily analyses', 
    basic: '1 / day', 
    premium: 'Unlimited', 
    icon: 'analytics'
  },
  { 
    title: 'Ad-free experience', 
    basic: false, 
    premium: true, 
    icon: 'eye'
  },
  { 
    title: 'Emotional analysis', 
    basic: 'Basic', 
    premium: 'Advanced', 
    icon: 'heart'
  },
  { 
    title: 'Deception detection', 
    basic: 'Limited', 
    premium: 'Full access', 
    icon: 'shield-checkmark'
  },
  { 
    title: 'Downloadable reports', 
    basic: false, 
    premium: true, 
    icon: 'download'
  },
  { 
    title: 'Historical data', 
    basic: '7 days', 
    premium: '90 days', 
    icon: 'time'
  },
];

const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<SubscriptionScreenNavigationProp>();
  const { colors } = useTheme();
  const { user, upgradeAccount } = useAuth();
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  const handleUpgrade = async () => {
    if (user?.isPremium) return;
    
    setIsProcessing(true);
    try {
      await upgradeAccount();
      // Navigate back or show success message
      navigation.navigate('TabNavigator', { screen: 'Account' });
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <SafeAreaView style={{...styles.container, backgroundColor: colors.background}}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{...styles.headerTitle, color: colors.text}}>
            Upgrade to Premium
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="star" size={32} color={colors.primary} />
          </View>
          <Text style={{...styles.heroTitle, color: colors.text}}>
            Unlock the Full Experience
          </Text>
          <Text style={{...styles.heroSubtitle, color: colors.text + 'CC'}}>
            Get unlimited analyses, premium features, and an ad-free experience
          </Text>
        </View>
        
        {/* Plans Section */}
        <View style={styles.plansSection}>
          <View style={{...styles.planCard, ...styles.basicPlan, backgroundColor: colors.card}}>
            <Text style={{...styles.planLabel, color: colors.text + 'AA'}}>
              BASIC
            </Text>
            <Text style={{...styles.planTitle, color: colors.text}}>
              Free
            </Text>
            <Text style={{...styles.planPrice, color: colors.text}}>
              $0/month
            </Text>
            <View style={{...styles.planDivider, backgroundColor: colors.border}} />
            <Text style={{...styles.planDescription, color: colors.text + 'BB'}}>
              • 1 voice analysis per day
              • Basic content safety detection
              • Ad-supported experience
            </Text>
          </View>
          
          <View style={{...styles.planCard, ...styles.premiumPlan, borderColor: colors.primary}}>
            <View style={{...styles.popularBadge, backgroundColor: colors.primary}}>
              <Text style={{ color: '#000', fontSize: 10, fontWeight: '600' }}>POPULAR</Text>
            </View>
            <Text style={{...styles.planLabel, color: colors.primary}}>
              PREMIUM
            </Text>
            <Text style={{...styles.planTitle, color: colors.text}}>
              Premium
            </Text>
            <Text style={{...styles.planPrice, color: colors.text}}>
              $9.99/month
            </Text>
            <View style={{...styles.planDivider, backgroundColor: colors.border}} />
            <Text style={{...styles.planDescription, color: colors.text + 'BB'}}>
              • Unlimited voice analyses
              • Advanced emotional detection
              • Detailed stress scoring
              • No ads
            </Text>
            <Button
              title="Subscribe Now"
              variant="primary"
              onPress={handleSubscribe}
              style={styles.subscribeButton}
            />
          </View>
        </View>
        
        {/* Features Comparison */}
        <Text style={{...styles.comparisonTitle, color: colors.text}}>
          Features Comparison
        </Text>
        
        <View style={{...styles.comparisonTable, backgroundColor: colors.card}}>
          <View style={styles.tableHeader}>
            <Text style={{...styles.featureColumnHeader, color: colors.text + 'AA'}}>
              Feature
            </Text>
            <Text style={{...styles.planColumnHeader, color: colors.text + 'AA'}}>
              Basic
            </Text>
            <Text style={{...styles.planColumnHeader, color: colors.primary}}>
              Premium
            </Text>
          </View>
          
          <View style={styles.tableContent}>
            {features.map((feature, index) => (
              <View 
                key={index}
                style={{
                  ...styles.featureRow,
                  borderBottomColor: colors.border,
                  borderBottomWidth: index < features.length - 1 ? StyleSheet.hairlineWidth : 0
                }}
              >
                <View style={styles.featureColumn}>
                  <Text style={{...styles.featureText, color: colors.text}}>
                    {feature.name}
                  </Text>
                </View>
                
                <View style={styles.valueColumn}>
                  {feature.basic ? (
                    typeof feature.basic === 'string' ? (
                      <Text style={{...styles.featureValueText, color: colors.text}}>
                        {feature.basic}
                      </Text>
                    ) : (
                      <Ionicons name="checkmark" size={20} color={colors.text} />
                    )
                  ) : (
                    <Ionicons name="close" size={20} color={colors.text + '50'} />
                  )}
                </View>
                
                <View style={styles.valueColumn}>
                  {feature.premium ? (
                    typeof feature.premium === 'string' ? (
                      <Text style={{...styles.featureValueText, color: colors.primary}}>
                        {feature.premium}
                      </Text>
                    ) : (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )
                  ) : (
                    <Ionicons name="close" size={20} color={colors.text + '50'} />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={{...styles.faqTitle, color: colors.text}}>
            Frequently Asked Questions
          </Text>
          
          <View style={{...styles.faqItem, backgroundColor: colors.card}}>
            <Text style={{...styles.faqQuestion, color: colors.text}}>
              How is my payment information secured?
            </Text>
            <Text style={{...styles.faqAnswer, color: colors.text + 'CC'}}>
              All payment information is securely processed through our payment provider and we never store your credit card details on our servers.
            </Text>
          </View>
          
          <View style={{...styles.faqItem, backgroundColor: colors.card}}>
            <Text style={{...styles.faqQuestion, color: colors.text}}>
              Can I cancel my subscription anytime?
            </Text>
            <Text style={{...styles.faqAnswer, color: colors.text + 'CC'}}>
              Yes, you can cancel your Premium subscription at any time. You'll continue to have access to Premium features until the end of your billing period.
            </Text>
          </View>
          
          <View style={{...styles.faqItem, backgroundColor: colors.card}}>
            <Text style={{...styles.faqQuestion, color: colors.text}}>
              Is there a free trial available?
            </Text>
            <Text style={{...styles.faqAnswer, color: colors.text + 'CC'}}>
              New users can try Premium features with a 7-day free trial. You won't be charged until the trial period ends, and you can cancel anytime.
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={{...styles.footerText, color: colors.text + 'AA'}}>
            By subscribing, you agree to our Terms of Service and automatically renewing subscription terms.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIcon: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
  },
  plansSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  planCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  basicPlan: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  premiumPlan: {
    borderWidth: 1,
    backgroundColor: '#00FF9910',
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: -28,
    paddingHorizontal: 30,
    paddingVertical: 4,
    transform: [{ rotate: '45deg' }],
  },
  popularText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
  },
  planLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: '400',
  },
  planDivider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  planDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  subscribeButton: {
    marginTop: 'auto',
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  comparisonTable: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  featureColumnHeader: {
    flex: 2,
    fontSize: 14,
    fontWeight: '600',
  },
  planColumnHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableContent: {
    padding: 16,
  },
  featureRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  featureColumn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
  },
  valueColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureValueText: {
    fontSize: 14,
  },
  faqSection: {
    marginBottom: 32,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  faqItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default SubscriptionScreen;