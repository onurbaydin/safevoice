import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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

type SignupScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Signup'
>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signup, googleAuth } = useAuth();
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateInputs = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      await signup(email, password, name);
      // Navigation is handled in App.tsx based on authentication state
    } catch (error) {
      console.error('Signup error:', error);
      // Handle signup error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    try {
      await googleAuth();
      // Navigation is handled in App.tsx based on authentication state
    } catch (error) {
      console.error('Google signup error:', error);
      // Handle Google signup error
    } finally {
      setIsSubmitting(false);
    }
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
                Create Account
              </Text>
              <Text style={{...styles.headerSubtitle, color: colors.text + 'CC'}}>
                Sign up to get started with SafeVoice
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={colors.text + '80'} />
                <TextInput
                  style={{
                    ...styles.input,
                    color: colors.text,
                    borderColor: nameFocus ? colors.primary : colors.border
                  }}
                  placeholder="Full Name"
                  placeholderTextColor={colors.text + '50'}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setNameFocus(true)}
                  onBlur={() => setNameFocus(false)}
                  autoCapitalize="words"
                  editable={!isSubmitting}
                />
                {nameError ? (
                  <Text style={styles.errorText}>{nameError}</Text>
                ) : null}
              </View>

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
                  editable={!isSubmitting}
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
                  editable={!isSubmitting}
                />
                <TouchableOpacity 
                  style={styles.passwordToggle} 
                  onPress={() => setShowPassword(prev => !prev)}
                  disabled={isSubmitting}
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

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.text + '80'} />
                <TextInput
                  style={{
                    ...styles.input,
                    color: colors.text,
                    borderColor: confirmPasswordFocus ? colors.primary : colors.border
                  }}
                  placeholder="Confirm Password"
                  placeholderTextColor={colors.text + '50'}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setConfirmPasswordFocus(true)}
                  onBlur={() => setConfirmPasswordFocus(false)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
                <TouchableOpacity 
                  style={styles.passwordToggle} 
                  onPress={() => setShowConfirmPassword(prev => !prev)}
                  disabled={isSubmitting}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.text + '80'}
                  />
                </TouchableOpacity>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </View>

              <View style={styles.termsContainer}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setAgreeTerms(!agreeTerms)}
                  disabled={isSubmitting}
                >
                  <View style={{
                    ...styles.checkbox,
                    borderColor: agreeTerms ? colors.primary : colors.text + '50',
                    ...(agreeTerms ? { backgroundColor: colors.primary } : {})
                  }}>
                    {agreeTerms && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
                
                <Text style={{...styles.termsText, color: colors.text + 'AA'}}>
                  I agree to the 
                  <Text style={{...styles.termsLink, color: colors.primary}}>
                    {' '}Terms of Service
                  </Text> 
                  {' '}and{' '}
                  <Text style={{...styles.termsLink, color: colors.primary}}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>

              <Button
                title="Create Account"
                onPress={handleSignup}
                variant="primary"
                isLoading={isSubmitting}
                disabled={!agreeTerms}
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
                onPress={handleGoogleSignup}
                variant="secondary"
                icon="logo-google"
                disabled={isSubmitting}
              />
            </View>

            <View style={styles.footerContainer}>
              <Text style={{...styles.loginText, color: colors.text + 'CC'}}>
                Already have an account?
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
                disabled={isSubmitting}
              >
                <Text style={{...styles.loginLink, color: colors.primary}}>
                  Log in
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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginTop: 8,
  },
  header: {
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
  passwordToggle: {
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
  },
  checkboxContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    fontWeight: '500',
  },
  signupButton: {
    marginBottom: 20,
  },
  dividerContainer: {
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default SignupScreen;