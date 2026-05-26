import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  children: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  style?: ViewStyle;
}

export function Badge({ children, variant = 'secondary', style }: BadgeProps) {
  const getBadgeStyle = (): ViewStyle[] => {
    const badgeStyles: ViewStyle[] = [styles.badgeBase];
    switch (variant) {
      case 'primary':
        badgeStyles.push(styles.primary);
        break;
      case 'secondary':
        badgeStyles.push(styles.secondary);
        break;
      case 'success':
        badgeStyles.push(styles.success);
        break;
      case 'warning':
        badgeStyles.push(styles.warning);
        break;
    }
    if (style) {
      badgeStyles.push(style);
    }
    return badgeStyles;
  };

  const getTextStyle = (): TextStyle[] => {
    const textStyles: TextStyle[] = [styles.textBase];
    switch (variant) {
      case 'primary':
        textStyles.push(styles.textPrimary);
        break;
      case 'secondary':
        textStyles.push(styles.textSecondary);
        break;
      case 'success':
        textStyles.push(styles.textSuccess);
        break;
      case 'warning':
        textStyles.push(styles.textWarning);
        break;
    }
    return textStyles;
  };

  return (
    <View style={getBadgeStyle()}>
      <Text style={getTextStyle()}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeBase: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  textBase: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Variant Backgrounds
  primary: {
    backgroundColor: '#dbeafe', // blue-100
  },
  secondary: {
    backgroundColor: '#f1f5f9', // slate-100
  },
  success: {
    backgroundColor: '#dcfce7', // green-100
  },
  warning: {
    backgroundColor: '#ffedd5', // orange-100
  },
  // Variant Texts
  textPrimary: {
    color: '#1d4ed8', // blue-700
  },
  textSecondary: {
    color: '#475569', // slate-600
  },
  textSuccess: {
    color: '#15803d', // green-700
  },
  textWarning: {
    color: '#c2410c', // orange-700
  },
});
