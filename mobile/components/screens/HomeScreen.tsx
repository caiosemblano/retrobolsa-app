import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { CompetitionCard } from '../CompetitionCard';
import { RankingItem } from '../RankingItem';
import { Card } from '../ui/Card';
import { Icon } from '../Icon';
import { Button } from '../ui/Button';
import { currentCompetition, lastResult, quinzenalRanking } from '../../data/mockData';

interface HomeScreenProps {
  onStartCompetition: () => void;
  onViewResults: () => void;
}

export function HomeScreen({ onStartCompetition, onViewResults }: HomeScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Competições</Text>
        <Text style={styles.headerSubtitle}>
          Participe e teste suas estratégias de investimento
        </Text>
      </View>

      {/* Competition Card */}
      <View style={styles.section}>
        <CompetitionCard
          competition={currentCompetition}
          onAction={onStartCompetition}
        />
      </View>

      <View style={styles.divider} />

      {/* Last Result Card */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Icon name="TrendingUp" size={20} color="#16a34a" style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Seu Último Resultado</Text>
        </View>

        <Card style={styles.resultsCard}>
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={styles.gridLabel}>Sua Posição</Text>
              <View style={styles.gridValContainer}>
                <Icon name="Target" size={16} color="#15803d" style={styles.gridValIcon} />
                <Text style={styles.gridValText}>{lastResult.rank}º lugar</Text>
              </View>
            </View>

            <View style={styles.gridCol}>
              <Text style={styles.gridLabel}>Rentabilidade</Text>
              <Text style={styles.gridValText}>
                {lastResult.rentability}% ({lastResult.annualReturn}% a.a.)
              </Text>
            </View>
          </View>

          <View style={styles.portfolioValueContainer}>
            <Text style={styles.portfolioValueLabel}>Valor Final da Carteira</Text>
            <Text style={styles.portfolioValueVal}>
              R$ {lastResult.portfolioValue.toLocaleString('pt-BR')}
            </Text>
          </View>

          <Button
            variant="success"
            onPress={onViewResults}
            style={styles.detailsBtn}
          >
            Ver Detalhes Completos
          </Button>
        </Card>
      </View>

      <View style={styles.divider} />

      {/* Top 5 rankings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 5 da Rodada Anterior</Text>
        <View style={styles.rankingList}>
          {quinzenalRanking.slice(0, 5).map((entry) => (
            <RankingItem key={entry.rank} entry={entry} showRentability />
          ))}
        </View>
      </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a', // slate-900
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b', // slate-500
  },
  section: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0', // slate-200
    marginVertical: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  resultsCard: {
    backgroundColor: '#f0fdf4', // green-50
    borderColor: '#bbf7d0', // green-200
    borderWidth: 2,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  gridCol: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 12,
    color: '#475569', // slate-600
    marginBottom: 4,
  },
  gridValContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridValIcon: {
    marginRight: 4,
  },
  gridValText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15803d', // green-700
  },
  portfolioValueContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  portfolioValueLabel: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 2,
  },
  portfolioValueVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534', // green-800
  },
  detailsBtn: {
    backgroundColor: '#16a34a', // green-600
  },
  rankingList: {
    marginTop: 8,
  },
});
