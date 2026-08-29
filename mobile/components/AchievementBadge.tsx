import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Achievement } from '../types';
import { Card } from './ui/Card';
import { Icon } from './Icon';
import { Colors } from '../constants/Colors';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const formattedDate = achievement.unlockedAt
    ? new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')
    : '';

  return (
    <Card
      style={[
        styles.card,
        achievement.unlocked ? styles.cardUnlocked : styles.cardLocked,
      ]}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.iconWrapper,
            achievement.unlocked ? styles.iconUnlocked : styles.iconLocked,
          ]}
        >
          {achievement.unlocked ? (
            <Icon name={achievement.icon} size={24} color={Colors.cardBackground} />
          ) : (
            <Icon name="Lock" size={24} color={Colors.textMuted} />
          )}
        </View>

        <Text
          style={[
            styles.title,
            achievement.unlocked ? styles.titleUnlocked : styles.titleLocked,
          ]}
        >
          {achievement.title}
        </Text>

        <Text style={styles.description}>{achievement.description}</Text>

        {achievement.unlocked && formattedDate ? (
          <Text style={styles.date}>Desbloqueado em {formattedDate}</Text>
        ) : !achievement.unlocked ? (
          <Text style={styles.lockedText}>Bloqueado</Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    flex: 1,
    minHeight: 160,
  },
  cardUnlocked: {
    backgroundColor: '#fffdf5', // yellow-50/orange-50 shade
    borderColor: '#fed7aa', // orange-200
    borderWidth: 1.5,
  },
  cardLocked: {
    backgroundColor: Colors.background, // slate-50
    borderColor: Colors.border, // slate-200
    opacity: 0.7,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 9999,
    marginBottom: 8,
  },
  iconUnlocked: {
    backgroundColor: Colors.warning, // orange-500
  },
  iconLocked: {
    backgroundColor: Colors.borderDark, // slate-300
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  titleUnlocked: {
    color: Colors.textPrimary, // slate-900
  },
  titleLocked: {
    color: Colors.textMuted, // slate-500
  },
  description: {
    fontSize: 11,
    color: Colors.textMuted, // slate-500
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 14,
  },
  date: {
    fontSize: 10,
    color: Colors.warningDark, // orange-600
    fontWeight: '500',
  },
  lockedText: {
    fontSize: 10,
    color: Colors.textMuted, // slate-500
  },
});
