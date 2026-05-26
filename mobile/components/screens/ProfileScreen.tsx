import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Card } from '../ui/Card';
import { AchievementBadge } from '../AchievementBadge';
import { Icon } from '../Icon';
import { userProfile } from '../../data/mockData';

export function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Seu progresso e conquistas</Text>
      </View>

      {/* User Info card */}
      <Card style={styles.profileCard}>
        <View style={styles.avatarRow}>
          {/* Circular avatar fallback/initials since standard RN Image might not render Dicebear SVG */}
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>VC</Text>
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.username}>{userProfile.username}</Text>
            <View style={styles.pointsRow}>
              <Icon name="Trophy" size={16} color="#ea580c" style={styles.trophyIcon} />
              <Text style={styles.pointsText}>
                {userProfile.totalPoints.toLocaleString('pt-BR')} pontos
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid (3 columns) */}
        <View style={styles.statsGrid}>
          <View style={styles.statCol}>
            <Icon name="Target" size={18} color="#2563eb" style={styles.statIcon} />
            <Text style={styles.statLabel}>Melhor Posição</Text>
            <Text style={styles.statVal}>{userProfile.bestRank}º lugar</Text>
          </View>
          
          <View style={[styles.statCol, styles.statColBorder]}>
            <Icon name="Award" size={18} color="#16a34a" style={styles.statIcon} />
            <Text style={styles.statLabel}>Competições</Text>
            <Text style={styles.statVal}>{userProfile.completedCompetitions}</Text>
          </View>
          
          <View style={styles.statCol}>
            <Icon name="Heart" size={18} color="#ea580c" style={styles.statIcon} />
            <Text style={styles.statLabel}>Ativo Favorito</Text>
            <Text style={styles.statVal} numberOfLines={1}>{userProfile.favoriteAsset}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.divider} />

      {/* Achievements grid (2 columns) */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Conquistas</Text>
        
        <View style={styles.achievementsGrid}>
          {userProfile.achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementWrapper}>
              <AchievementBadge achievement={achievement} />
            </View>
          ))}
        </View>
      </View>

      {/* Progress Footer Panel */}
      <Card style={styles.tipCard}>
        <Text style={styles.tipTitle}>Continue Progredindo!</Text>
        <Text style={styles.tipText}>
          Complete mais aulas e participe de competições para desbloquear novas conquistas e subir no ranking.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  profileCard: {
    backgroundColor: '#f0fdf4', // light shade
    borderColor: '#bfdbfe', // blue-200
    borderWidth: 2,
    padding: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#cbd5e1', // slate-300
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 3px rgba(100, 116, 139, 0.15)',
      } as any,
    }),
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155', // slate-700
  },
  userTextContainer: {
    marginLeft: 14,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyIcon: {
    marginRight: 4,
  },
  pointsText: {
    fontSize: 14,
    color: '#ea580c', // orange-600
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingVertical: 12,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  statColBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e2e8f0', // slate-200
  },
  statIcon: {
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 2,
  },
  statVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b', // slate-800
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 24,
  },
  achievementsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  achievementWrapper: {
    width: '50%',
    padding: 4,
  },
  tipCard: {
    backgroundColor: '#eff6ff', // blue-50
    borderColor: '#bfdbfe', // blue-200
    padding: 16,
    marginTop: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
});
