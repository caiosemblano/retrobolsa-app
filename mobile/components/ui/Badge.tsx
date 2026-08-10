import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

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
    backgroundColor: Colors.primaryLight, // blue-100
  },
  secondary: {
    backgroundColor: Colors.background, // slate-100
  },
  success: {
    backgroundColor: Colors.successLight, // green-100
  },
  warning: {
    backgroundColor: Colors.warningLight, // orange-100
  },
  // Variant Texts
  textPrimary: {
    color: Colors.primaryDark, // blue-700
  },
  textSecondary: {
    color: Colors.textSecondary, // slate-600
  },
  textSuccess: {
    color: Colors.successDark, // green-700
  },
  textWarning: {
    color: Colors.warningDarker, // orange-700
  },
});
