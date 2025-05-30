import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  // Determine button styling based on variant
  const getBackgroundColor = (): string => {
    if (disabled || isLoading) return '#666666';

    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.card;
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getBorderColor = (): string => {
    if (disabled || isLoading) return '#666666';

    switch (variant) {
      case 'outline':
        return colors.primary;
      default:
        return 'transparent';
    }
  };

  const getTextColor = (): string => {
    if (disabled || isLoading) return '#AAAAAA';

    switch (variant) {
      case 'primary':
        return '#121212';
      case 'secondary':
        return colors.text;
      case 'outline':
      case 'text':
        return colors.primary;
      default:
        return colors.text;
    }
  };

  // Determine button sizing
  const getPadding = (): { paddingVertical: number; paddingHorizontal: number } => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'medium':
        return { paddingVertical: 10, paddingHorizontal: 20 };
      case 'large':
        return { paddingVertical: 14, paddingHorizontal: 28 };
      default:
        return { paddingVertical: 10, paddingHorizontal: 20 };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: variant === 'outline' ? 2 : 0,
    borderRadius: 30,
    ...getPadding(),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const buttonTextStyle: TextStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
    fontWeight: '600',
    ...textStyle,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={buttonStyle}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} style={styles.loadingIndicator} />
      ) : (
        <>
          {icon && (
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={getFontSize() + 2} color={getTextColor()} />
            </View>
          )}
          <Text style={buttonTextStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 8,
  },
  loadingIndicator: {
    marginRight: 8,
  },
});

export default Button;