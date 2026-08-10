import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EconomicIndicator } from '../types';
import { Card } from './ui/Card';
import { Icon } from './Icon';
import { Colors } from '../constants/Colors';

interface EconomicIndicatorCardProps {
  indicator: EconomicIndicator;
}

export function EconomicIndicatorCard({ indicator }: EconomicIndicatorCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name={indicator.icon} size={24} color={Colors.primaryDark} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{indicator.name}</Text>
          <Text style={styles.value}>{indicator.value}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 10,
    backgroundColor: Colors.primaryLight, // blue-100
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    color: Colors.textMuted, // slate-500
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary, // slate-900
  },
});
