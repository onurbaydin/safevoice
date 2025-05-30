import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import NewAnalysisScreen from './screens/NewAnalysisScreen';
import RecordingScreen from './screens/RecordingScreen';
import AnalysisProgressScreen from './screens/AnalysisProgressScreen';
import ResultsScreen from './screens/ResultsScreen';
import AccountScreen from './screens/AccountScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Types
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

export type MainStackParamList = {
  TabNavigator: undefined;
  NewAnalysis: undefined;
  Recording: undefined;
  AnalysisProgress: { recordingUri: string };
  Results: { analysisId: string };
  Subscription: undefined;
};

export type TabParamList = {
  Home: undefined;
  Account: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Custom Tab Bar Button for the floating action button
const CustomTabBarButton = ({ children, onPress }: { children: React.ReactNode, onPress: () => void }) => (
  <TouchableOpacity
    style={styles.customTabBarButton}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.customTabBarButtonInner}>
      {children}
    </View>
  </TouchableOpacity>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#00FF99',
        tabBarInactiveTintColor: '#777777',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="NewAnalysis" 
        component={NewAnalysisScreen}
        options={({ navigation }) => ({
          tabBarButton: (props) => (
            <CustomTabBarButton
              {...props}
              onPress={() => navigation.navigate('NewAnalysis')}
            >
              <Ionicons name="add" color="#121212" size={30} />
            </CustomTabBarButton>
          ),
          tabBarStyle: { display: 'none' }
        })}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#121212' },
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

const MainStackNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#121212' },
      }}
    >
      <MainStack.Screen name="TabNavigator" component={TabNavigator} />
      <MainStack.Screen name="NewAnalysis" component={NewAnalysisScreen} />
      <MainStack.Screen name="Recording" component={RecordingScreen} />
      <MainStack.Screen name="AnalysisProgress" component={AnalysisProgressScreen} />
      <MainStack.Screen name="Results" component={ResultsScreen} />
      <MainStack.Screen name="Subscription" component={SubscriptionScreen} />
    </MainStack.Navigator>
  );
};

// Create a separate component for the main app content
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <StatusBar style="light" />
      {isAuthenticated ? <MainStackNavigator /> : <AuthStackNavigator />}
    </>
  );
};

const App = () => {
  // Fix for React Native Web
  const disableCSSStyleWarning = () => {
    // Suppress the specific CSS warning in web environment
    if (typeof document !== 'undefined') {
      const originalError = console.error;
      console.error = (...args) => {
        if (
          typeof args[0] === 'string' && 
          (args[0].includes('Failed to set an indexed property') || 
           args[0].includes('CSSStyleDeclaration'))
        ) {
          return;
        }
        originalError.apply(console, args);
      };
    }
  };

  // Apply the fix
  React.useEffect(() => {
    disableCSSStyleWarning();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#181818',
    borderTopWidth: 0,
    elevation: 10,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  customTabBarButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTabBarButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00FF99',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00FF99',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  }
});

export default App;