import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
}: ButtonProps) {
  const getButtonStyles = (): ViewStyle[] => {
    const buttonStyles: ViewStyle[] = [styles.buttonBase];

    // Variant style
    if (disabled) {
      buttonStyles.push(styles.disabled);
    } else {
      switch (variant) {
        case 'primary':
          buttonStyles.push(styles.primary);
          break;
        case 'secondary':
          buttonStyles.push(styles.secondary);
          break;
        case 'ghost':
          buttonStyles.push(styles.ghost);
          break;
        case 'danger':
          buttonStyles.push(styles.danger);
          break;
        case 'success':
          buttonStyles.push(styles.success);
          break;
      }
    }

    // Size style
    switch (size) {
      case 'sm':
        buttonStyles.push(styles.sm);
        break;
      case 'md':
        buttonStyles.push(styles.md);
        break;
      case 'lg':
        buttonStyles.push(styles.lg);
        break;
    }

    if (style) {
      buttonStyles.push(style);
    }

    return buttonStyles;
  };

  const getTextStyles = (): TextStyle[] => {
    const textStyles: TextStyle[] = [styles.textBase];

    if (disabled) {
      textStyles.push(styles.textDisabled);
    } else {
      switch (variant) {
        case 'primary':
        case 'danger':
        case 'success':
          textStyles.push(styles.textLight);
          break;
        case 'secondary':
          textStyles.push(styles.textSecondary);
          break;
        case 'ghost':
          textStyles.push(styles.textGhost);
          break;
      }
    }

    switch (size) {
      case 'sm':
        textStyles.push(styles.textSm);
        break;
      case 'md':
        textStyles.push(styles.textMd);
        break;
      case 'lg':
        textStyles.push(styles.textLg);
        break;
    }

    return textStyles;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={getButtonStyles()}
      activeOpacity={0.7}
    >
      {typeof children === 'string' ? (
        <Text style={getTextStyles()}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
  // Variants
  primary: {
    backgroundColor: Colors.warning, // orange-500
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.error, // red-500
  },
  success: {
    backgroundColor: Colors.success, // green-600
  },
  disabled: {
    backgroundColor: Colors.borderDark, // slate-300
    borderColor: Colors.borderDark,
  },
  // Text Colors
  textLight: {
    color: Colors.cardBackground,
  },
  textSecondary: {
    color: Colors.textSecondary, // slate-700
  },
  textGhost: {
    color: Colors.textMuted, // slate-500
  },
  textDisabled: {
    color: Colors.textMuted, // slate-400
  },
  // Sizes
  sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  md: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  // Text Sizes
  textSm: {
    fontSize: 13,
  },
  textMd: {
    fontSize: 15,
  },
  textLg: {
    fontSize: 17,
  },
});
