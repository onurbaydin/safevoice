import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../App';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, googleAuth } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    setLoginError(null);
    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      console.log('Attempting login with:', email);
      await login(email, password);
      // Navigation is handled in App.tsx based on authentication state
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError(null);
    setIsSubmitting(true);
    try {
      await googleAuth();
      // Navigation is handled in App.tsx based on authentication state
    } catch (error) {
      console.error('Google login error:', error);
      setLoginError('Failed to login with Google. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Enter your email to reset your password.');
  };

  return (
    <SafeAreaView style={{...styles.container, backgroundColor: colors.background}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <StatusBar style="light" />
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={{...styles.headerTitle, color: colors.text}}>
                Welcome Back
              </Text>
              <Text style={{...styles.headerSubtitle, color: colors.text + 'CC'}}>
                Please sign in to your account
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={colors.text + '80'} />
                <TextInput
                  style={{
                    ...styles.input,
                    color: colors.text,
                    borderColor: emailFocus ? colors.primary : colors.border
                  }}
                  placeholder="Email Address"
                  placeholderTextColor={colors.text + '50'}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.text + '80'} />
                <TextInput
                  style={{
                    ...styles.input,
                    color: colors.text,
                    borderColor: passwordFocus ? colors.primary : colors.border
                  }}
                  placeholder="Password"
                  placeholderTextColor={colors.text + '50'}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={styles.passwordToggle} 
                  onPress={() => setShowPassword(prev => !prev)}
                  disabled={isLoading}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.text + '80'}
                  />
                </TouchableOpacity>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                  <Text style={{...styles.forgotPasswordText, color: colors.primary}}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                title="Login"
                onPress={handleLogin}
                variant="primary"
                isLoading={isLoading}
              />

              <View style={styles.dividerContainer}>
                <View style={{...styles.dividerLine, backgroundColor: colors.border}} />
                <Text style={{...styles.dividerText, color: colors.text + 'CC'}}>
                  OR
                </Text>
                <View style={{...styles.dividerLine, backgroundColor: colors.border}} />
              </View>

              <Button
                title="Continue with Google"
                onPress={handleGoogleLogin}
                variant="secondary"
                icon="logo-google"
                disabled={isLoading}
              />
            </View>

            <View style={styles.footerContainer}>
              <Text style={{...styles.signupText, color: colors.text + 'CC'}}>
                Don't have an account?
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Signup')}
                disabled={isLoading}
              >
                <Text style={{...styles.signupLink, color: colors.primary}}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginTop: 8,
  },
  headerContainer: {
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5252',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
  googleButton: {
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;