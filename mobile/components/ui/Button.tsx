import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
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
    backgroundColor: '#f97316', // orange-500
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#ef4444', // red-500
  },
  success: {
    backgroundColor: '#16a34a', // green-600
  },
  disabled: {
    backgroundColor: '#cbd5e1', // slate-300
    borderColor: '#cbd5e1',
  },
  // Text Colors
  textLight: {
    color: '#ffffff',
  },
  textSecondary: {
    color: '#334155', // slate-700
  },
  textGhost: {
    color: '#64748b', // slate-500
  },
  textDisabled: {
    color: '#94a3b8', // slate-400
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
