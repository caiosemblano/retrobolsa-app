import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CompetitionCard } from '../CompetitionCard';
import { RankingItem } from '../RankingItem';
import { Card } from '../ui/Card';
import { Icon } from '../Icon';
import { Button } from '../ui/Button';
import { competitionService } from '../../services/competitionService';
import { portfolioService } from '../../services/portfolioService';
import { rankingService } from '../../services/rankingService';
import { Competition, Result, RankingEntry } from '../../types';

interface HomeScreenProps {
  onStartCompetition: (comp: Competition) => void;
  onViewResults: () => void;
}

export function HomeScreen({ onStartCompetition, onViewResults }: HomeScreenProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [lastResult, setLastResult] = useState<Result | null>(null);
  const [topRanking, setTopRanking] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [compRes, resultRes, rankingRes] = await Promise.all([
        competitionService.getActive().catch(() => null),
        portfolioService.getLastResult().then(res => res.data).catch(() => null),
        rankingService.get('quinzenal').then(res => res.data).catch(() => [])
      ]);

      setCompetition(compRes);
      setLastResult(resultRes);
      setTopRanking(rankingRes.slice(0, 5));
    } catch (err) {
      setError('Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNextRound = () => {
    Alert.alert('Avançar Rodada', 'Tem certeza que deseja fechar esta rodada e ir para a próxima?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Avançar', onPress: async () => {
        setIsLoading(true);
        await competitionService.nextRound().catch(e => console.error(e));
        await fetchData();
      }}
    ]);
  };

  const handleResetGame = () => {
    Alert.alert('Resetar Jogo', 'Isso apagará todas as carteiras e voltará para a rodada 1!', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Resetar', style: 'destructive', onPress: async () => {
        setIsLoading(true);
        await competitionService.resetGame().catch(e => console.error(e));
        await fetchData();
      }}
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando painel...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="AlertCircle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Info */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.headerTitle}>Competições</Text>
            <Text style={styles.headerSubtitle}>
              Participe e teste suas estratégias
            </Text>
          </View>
          {/* Admin Controls */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button variant="outline" onPress={handleNextRound} style={{ paddingHorizontal: 12 }}>
              <Icon name="ArrowRight" size={16} color="#475569" />
            </Button>
            <Button variant="outline" onPress={handleResetGame} style={{ paddingHorizontal: 12 }}>
              <Icon name="RefreshCcw" size={16} color="#ef4444" />
            </Button>
          </View>
        </View>
      </View>

      {/* Competition Card */}
      <View style={styles.section}>
        {competition ? (
          <CompetitionCard
            competition={competition}
            onAction={() => onStartCompetition(competition)}
          />
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>Não há competições ativas no momento.</Text>
          </Card>
        )}
      </View>

      <View style={styles.divider} />

      {/* Last Result Card */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Icon name="TrendingUp" size={20} color="#16a34a" style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Seu Último Resultado</Text>
        </View>

        {lastResult ? (
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
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>Você ainda não possui resultados de simulação.</Text>
            <Text style={styles.emptyCardSubText}>Participe de uma rodada para ver seu histórico!</Text>
          </Card>
        )}
      </View>

      <View style={styles.divider} />

      {/* Top 5 rankings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top 5 da Rodada Anterior</Text>
        {topRanking.length > 0 ? (
          <View style={styles.rankingList}>
            {topRanking.map((entry) => (
              <RankingItem key={entry.rank} entry={entry} showRentability />
            ))}
          </View>
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>Nenhum ranking disponível ainda.</Text>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#475569',
  },
  errorText: {
    marginTop: 10,
    color: '#334155',
    textAlign: 'center',
  },
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
    color: '#0f172a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
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
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
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
    color: '#475569',
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
    color: '#15803d',
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
    color: '#166534',
  },
  detailsBtn: {
    backgroundColor: '#16a34a',
  },
  rankingList: {
    marginTop: 8,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    borderStyle: 'dashed',
    backgroundColor: '#f8fafc',
  },
  emptyCardText: {
    color: '#475569',
    textAlign: 'center',
  },
  emptyCardSubText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});
