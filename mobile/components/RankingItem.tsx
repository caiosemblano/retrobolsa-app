import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RankingEntry } from '../types';
import { Icon } from './Icon';

interface RankingItemProps {
  entry: RankingEntry;
  showRentability?: boolean;
}

export function RankingItem({ entry, showRentability }: RankingItemProps) {
  const getRankIcon = () => {
    switch (entry.rank) {
      case 1:
        return <Icon name="Trophy" size={18} color="#eab308" />;
      case 2:
        return <Icon name="Medal" size={18} color="#94a3b8" />;
      case 3:
        return <Icon name="Award" size={18} color="#d97706" />;
      default:
        return null;
    }
  };

  const getRankBadgeStyle = () => {
    if (entry.rank <= 3) return styles.badgeTopThree;
    if (entry.rank <= 10) return styles.badgeTopTen;
    return styles.badgeNormal;
  };

  const getRankBadgeTextStyle = () => {
    if (entry.rank <= 10) return styles.badgeTextWhite;
    return styles.badgeTextNormal;
  };

  return (
    <View
      style={[
        styles.container,
        entry.isCurrentUser ? styles.containerUser : styles.containerNormal,
      ]}
    >
      <View style={[styles.badge, getRankBadgeStyle()]}>
        <Text style={[styles.badgeText, getRankBadgeTextStyle()]}>
          {entry.rank}
        </Text>
      </View>

      {getRankIcon() && (
        <View style={styles.iconContainer}>
          {getRankIcon()}
        </View>
      )}

      <View style={styles.content}>
        <Text
          style={[
            styles.username,
            entry.isCurrentUser ? styles.usernameUser : styles.usernameNormal,
          ]}
        >
          {entry.username}
          {entry.isCurrentUser ? ' (Você)' : ''}
        </Text>
        {showRentability && entry.rentability !== undefined ? (
          <Text style={styles.rentability}>
            Rentabilidade: {entry.rentability}%
          </Text>
        ) : null}
      </View>

      <View style={styles.pointsContainer}>
        <Text
          style={[
            styles.pointsText,
            entry.isCurrentUser ? styles.pointsTextUser : styles.pointsTextNormal,
          ]}
        >
          {entry.points.toLocaleString('pt-BR')} pts
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
  },
  containerNormal: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0', // slate-200
  },
  containerUser: {
    backgroundColor: '#fff7ed', // orange-50
    borderColor: '#fdba74', // orange-300
    borderWidth: 2,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeTopThree: {
    backgroundColor: '#f97316', // orange-500 (using flat color instead of gradient)
  },
  badgeTopTen: {
    backgroundColor: '#2563eb', // blue-600
  },
  badgeNormal: {
    backgroundColor: '#e2e8f0', // slate-200
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  badgeTextWhite: {
    color: '#ffffff',
  },
  badgeTextNormal: {
    color: '#334155', // slate-700
  },
  iconContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  usernameNormal: {
    color: '#0f172a', // slate-900
  },
  usernameUser: {
    color: '#c2410c', // orange-700
  },
  rentability: {
    fontSize: 12,
    color: '#64748b', // slate-500
    marginTop: 2,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pointsTextNormal: {
    color: '#0f172a',
  },
  pointsTextUser: {
    color: '#c2410c',
  },
});
