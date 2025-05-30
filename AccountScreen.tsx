import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
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
import { LinearGradient } from 'expo-linear-gradient';

type AccountScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList
>;

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const { colors, theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  const handleUpgrade = () => {
    navigation.navigate('Subscription');
  };

  return (
    <SafeAreaView style={{...styles.container, backgroundColor: colors.background}}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={{...styles.title, color: colors.text}}>Account</Text>

          {/* Back button if needed for navigation */}
          {/* Profile information */}
          <View style={styles.profileContainer}>
            <View style={{...styles.avatarContainer, backgroundColor: colors.primary + '20'}}>
              <Text style={{...styles.avatarText, color: colors.primary}}>
                {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
              </Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={{...styles.profileName, color: colors.text}}>
                {user?.displayName || 'User'}
              </Text>
              <Text style={{...styles.profileEmail, color: colors.text + 'AA'}}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>

            <View 
              style={{...styles.planBadge, borderColor: user?.isPremium ? colors.primary : colors.border}}
            >
              <Text style={{...styles.planText, color: user?.isPremium ? colors.primary : colors.text}}>
                {user?.isPremium ? 'Premium' : 'Basic'}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={{...styles.upgradeCard, backgroundColor: colors.card}}
            onPress={() => navigation.navigate('Subscription')}
          >
            <View style={styles.upgradeCardContent}>
              <View>
                <Text style={{...styles.upgradeTitle, color: colors.text}}>
                  Upgrade to Premium
                </Text>
                <Text style={{...styles.upgradeDescription, color: colors.text + 'CC'}}>
                  Unlock unlimited analyses and ad-free experience
                </Text>
              </View>
              <Button 
                title="Upgrade" 
                onPress={() => navigation.navigate('Subscription')} 
                small
                variant="primary"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={{...styles.sectionTitle, color: colors.text}}>Settings</Text>
        </View>
        
        <View style={{...styles.settingsCard, backgroundColor: colors.card}}>
          <TouchableOpacity style={styles.settingsItem} onPress={toggleTheme}>
            <View style={styles.settingsItemLeft}>
              <View style={{...styles.settingsIcon, backgroundColor: '#4285F430'}}>
                <Ionicons name="moon-outline" size={20} color="#4285F4" />
              </View>
              <Text style={{...styles.settingsText, color: colors.text}}>
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text + '70'} />
          </TouchableOpacity>

          <View style={{...styles.settingsDivider, backgroundColor: colors.border}} />

          <TouchableOpacity style={styles.settingsItem} onPress={() => handleOpenLink('https://safeVoice.a0.dev/privacy')}>
            <View style={styles.settingsItemLeft}>
              <View style={{...styles.settingsIcon, backgroundColor: '#9C27B030'}}>
                <Ionicons name="shield-outline" size={20} color="#9C27B0" />
              </View>
              <Text style={{...styles.settingsText, color: colors.text}}>
                Privacy Policy
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text + '70'} />
          </TouchableOpacity>

          <View style={{...styles.settingsDivider, backgroundColor: colors.border}} />

          <TouchableOpacity style={styles.settingsItem} onPress={() => handleOpenLink('https://safeVoice.a0.dev/terms')}>
            <View style={styles.settingsItemLeft}>
              <View style={{...styles.settingsIcon, backgroundColor: '#F4433630'}}>
                <Ionicons name="document-text-outline" size={20} color="#F44336" />
              </View>
              <Text style={{...styles.settingsText, color: colors.text}}>
                Terms of Service
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text + '70'} />
          </TouchableOpacity>

          <View style={{...styles.settingsDivider, backgroundColor: colors.border}} />

          <TouchableOpacity style={styles.settingsItem} onPress={() => handleOpenLink('https://safeVoice.a0.dev/help')}>
            <View style={styles.settingsItemLeft}>
              <View style={{...styles.settingsIcon, backgroundColor: '#4CAF5030'}}>
                <Ionicons name="help-circle-outline" size={20} color="#4CAF50" />
              </View>
              <Text style={{...styles.settingsText, color: colors.text}}>
                Help & Support
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text + '70'} />
          </TouchableOpacity>
        </View>

        {/* Usage Section */}
        <View style={styles.section}>
          <Text style={{...styles.sectionTitle, color: colors.text}}>Usage</Text>
        </View>

        <View style={{...styles.usageCard, backgroundColor: colors.card}}>
          <View style={styles.usageItem}>
            <Text style={{...styles.usageLabel, color: colors.text}}>
              Analyses Today
            </Text>
            <Text style={{...styles.usageValue, color: colors.primary}}>
              {user?.isPremium ? 'Unlimited' : `${user?.analysesToday || 0}/1`}
            </Text>
          </View>

          <View style={{...styles.usageDivider, backgroundColor: colors.border}} />

          <View style={styles.usageItem}>
            <Text style={{...styles.usageLabel, color: colors.text}}>
              Total Analyses
            </Text>
            <Text style={{...styles.usageValue, color: colors.primary}}>
              {user?.totalAnalyses || 0}
            </Text>
          </View>

          {user?.isPremium && (
            <>
              <View style={{...styles.usageDivider, backgroundColor: colors.border}} />
              <View style={styles.usageItem}>
                <Text style={{...styles.usageLabel, color: colors.text}}>
                  Premium Until
                </Text>
                <Text style={{...styles.usageValue, color: colors.primary}}>
                  {user?.premiumUntil || 'N/A'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{...styles.logoutButton, borderColor: colors.danger}}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={{ color: colors.danger, marginLeft: 8, fontWeight: '500' }}>Logout</Text>
          </TouchableOpacity>

          <Text style={{...styles.appVersion, color: colors.text + '70'}}>
            SafeVoice v1.0.0
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  planText: {
    fontSize: 12,
    fontWeight: '600',
  },
  upgradeCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  upgradeCardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingsCard: {
    borderRadius: 16,
    marginBottom: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsText: {
    fontSize: 16,
  },
  settingsDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  usageCard: {
    borderRadius: 16,
    marginBottom: 24,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  usageLabel: {
    fontSize: 16,
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  usageDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    marginTop: 8,
  },
  appVersion: {
    fontSize: 12,
  },
});

export default AccountScreen;