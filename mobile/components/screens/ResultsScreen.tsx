import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RentabilityChart } from '../RentabilityChart';
import { Icon } from '../Icon';
import { lastResult } from '../../data/mockData';

interface ResultsScreenProps {
  onViewRanking: () => void;
  onBack: () => void;
}

export function ResultsScreen({ onViewRanking, onBack }: ResultsScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back Button */}
      <Button
        variant="ghost"
        onPress={onBack}
        style={styles.backBtn}
      >
        <Icon name="ChevronLeft" size={16} color="#64748b" style={styles.backIcon} />
        <Text style={styles.backText}>Voltar</Text>
      </Button>

      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resultados da Rodada</Text>
        <Text style={styles.headerSubtitle}>Veja como sua carteira performou</Text>
      </View>

      {/* Performance Summary Card */}
      <Card style={styles.highlightCard}>
        <View style={styles.rankRow}>
          <Icon name="Trophy" size={36} color="#ffffff" style={styles.trophyIcon} />
          <View>
            <Text style={styles.highlightLabel}>Sua Posição</Text>
            <Text style={styles.highlightVal}>{lastResult.rank}º lugar</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.highlightSubLabel}>Rentabilidade Total</Text>
            <Text style={styles.highlightSubVal}>{lastResult.rentability}%</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.highlightSubLabel}>Retorno Anual</Text>
            <Text style={styles.highlightSubVal}>{lastResult.annualReturn}% a.a.</Text>
          </View>
        </View>

        <View style={styles.portfolioValBox}>
          <Text style={styles.portfolioValLabel}>Valor Final da Carteira</Text>
          <Text style={styles.portfolioValText}>
            R$ {lastResult.portfolioValue.toLocaleString('pt-BR')}
          </Text>
          <Text style={styles.portfolioValSub}>
            De R$ 100.000 iniciais
          </Text>
        </View>
      </Card>

      {/* Rentability Chart */}
      <View style={styles.section}>
        <RentabilityChart data={lastResult.chartData} />
      </View>

      <View style={styles.divider} />

      {/* The Revelation Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Icon name="Eye" size={22} color="#f97316" style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>A Revelação</Text>
        </View>

        <Card style={styles.revealCard}>
          <Text style={styles.revealTitle}>Sua Carteira Revelada</Text>
          <View style={styles.revealedAssetsList}>
            {lastResult.revealedAssets.map((asset) => (
              <View key={asset.id} style={styles.revealedAssetItem}>
                <Text style={styles.revealedAssetIntro}>
                  Você investiu em "{asset.anonymousName}"
                </Text>
                <View style={styles.revealedAssetInfoRow}>
                  <Icon name="TrendingUp" size={14} color="#c2410c" style={styles.revealedIcon} />
                  <Text style={styles.revealedAssetText}>
                    que era {asset.realName}
                  </Text>
                </View>
                {asset.sector ? (
                  <Text style={styles.revealedAssetSector}>
                    Setor: {asset.sector}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        </Card>

        {/* Period Simulated */}
        <Card style={styles.periodCard}>
          <View style={styles.periodHeader}>
            <Icon name="Award" size={20} color="#2563eb" style={styles.periodIcon} />
            <Text style={styles.periodTitle}>Período Simulado</Text>
          </View>
          <Text style={styles.periodText}>
            O período histórico simulado foi de{' '}
            <Text style={styles.periodHighlight}>{lastResult.period}</Text> no Brasil.
          </Text>
        </Card>
      </View>

      {/* What did you learn */}
      <Card style={styles.learnCard}>
        <Text style={styles.learnTitle}>💡 O que você aprendeu?</Text>
        <Text style={styles.learnText}>
          Este foi um período marcante da economia brasileira. As empresas de commodities performaram excepcionalmente bem devido ao boom das exportações. Títulos prefixados também ofereceram bons retornos devido às altas taxas de juros da época.
        </Text>
      </Card>

      {/* Button to Ranking */}
      <Button
        variant="primary"
        size="lg"
        onPress={onViewRanking}
        style={styles.rankingBtn}
      >
        Ver Ranking Completo
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  backIcon: {
    marginRight: 4,
  },
  backText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
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
  highlightCard: {
    backgroundColor: '#16a34a', // green-600 flat background
    borderColor: '#15803d',
    padding: 20,
    marginBottom: 20,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trophyIcon: {
    marginRight: 12,
  },
  highlightLabel: {
    fontSize: 13,
    color: '#dcfce7', // green-100
    marginBottom: 2,
  },
  highlightVal: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  grid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  gridCol: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  highlightSubLabel: {
    fontSize: 11,
    color: '#dcfce7',
    marginBottom: 2,
  },
  highlightSubVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  portfolioValBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
  },
  portfolioValLabel: {
    fontSize: 12,
    color: '#dcfce7',
    marginBottom: 2,
  },
  portfolioValText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  portfolioValSub: {
    fontSize: 11,
    color: '#dcfce7',
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  revealCard: {
    backgroundColor: '#fffdf5', // light gold shade
    borderColor: '#fed7aa', // orange-200
    borderWidth: 2,
    padding: 16,
    marginBottom: 16,
  },
  revealTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  revealedAssetsList: {
    flexDirection: 'column',
  },
  revealedAssetItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  revealedAssetIntro: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  revealedAssetInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  revealedIcon: {
    marginRight: 4,
  },
  revealedAssetText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ea580c', // orange-600
  },
  revealedAssetSector: {
    fontSize: 12,
    color: '#64748b',
  },
  periodCard: {
    backgroundColor: '#eff6ff', // blue-50
    borderColor: '#bfdbfe', // blue-200
    borderWidth: 1,
    padding: 14,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  periodIcon: {
    marginRight: 6,
  },
  periodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  periodText: {
    fontSize: 13,
    color: '#475569',
  },
  periodHighlight: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  learnCard: {
    backgroundColor: '#f0fdf4', // green-50
    borderColor: '#bbf7d0', // green-200
    borderWidth: 1,
    padding: 14,
    marginVertical: 20,
  },
  learnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  learnText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  rankingBtn: {
    backgroundColor: '#f97316', // orange-500
    width: '100%',
  },
});
