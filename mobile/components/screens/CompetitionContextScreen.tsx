import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { EconomicIndicatorCard } from '../EconomicIndicatorCard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Icon } from '../Icon';
import { competitionService } from '../../services/competitionService';
import { Competition } from '../../types';
import { Colors } from '../../constants/Colors';

interface CompetitionContextScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function CompetitionContextScreen({ onNext, onBack }: CompetitionContextScreenProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComp = async () => {
      try {
        setIsLoading(true);
        const res = await competitionService.getActive();
        setCompetition(res);
      } catch (err) {
        setError('Erro ao carregar os dados do cenário econômico.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primaryHover} />
        <Text style={styles.loadingText}>Carregando cenário...</Text>
      </View>
    );
  }

  if (error || !competition) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="AlertCircle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error || 'Cenário indisponível'}</Text>
        <Button variant="ghost" onPress={onBack} style={{ marginTop: 20 }}>Voltar</Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Button
        variant="ghost"
        onPress={onBack}
        style={styles.backBtn}
      >
        <Icon name="ChevronLeft" size={16} color={Colors.textMuted} style={styles.backIcon} />
        <Text style={styles.backText}>Voltar</Text>
      </Button>

      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Icon name="FileText" size={28} color={Colors.primaryDark} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            {competition.economicContext.title}
          </Text>
          <Text style={styles.subtitle}>
            Analise os indicadores antes de escolher seus ativos
          </Text>
        </View>
      </View>

      {/* Blue-Green gradient info card */}
      <Card style={styles.gradientCard}>
        <Text style={styles.gradientTitle}>Contexto Histórico Anônimo</Text>
        <Text style={styles.gradientText}>
          Os indicadores abaixo representam um momento real da economia brasileira. 
          Use seu conhecimento para montar a melhor carteira de investimentos!
        </Text>
      </Card>

      {/* Indicators listing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indicadores Econômicos</Text>
        <View style={styles.indicatorsList}>
          {competition.economicContext.indicators.map((indicator, index) => (
            <EconomicIndicatorCard key={index} indicator={indicator} />
          ))}
        </View>
      </View>

      {/* Tips Box */}
      <Card style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Dica</Text>
        <Text style={styles.tipsText}>
          Lembre-se das aulas! Juros altos podem favorecer títulos, mas também podem impactar empresas. 
          Inflação elevada afeta diferentes setores de formas distintas.
        </Text>
      </Card>

      {/* Forward Action Button */}
      <Button
        variant="primary"
        size="lg"
        onPress={onNext}
        style={styles.nextBtn}
      >
        <Text style={styles.nextBtnText}>Escolher Ativos</Text>
        <Icon name="ArrowRight" size={18} color={Colors.cardBackground} style={styles.nextBtnIcon} />
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.textSecondary,
  },
  errorText: {
    marginTop: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
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
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconContainer: {
    padding: 12,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  gradientCard: {
    backgroundColor: Colors.primaryHover,
    borderColor: Colors.primaryDark,
    padding: 16,
    marginBottom: 20,
  },
  gradientTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.cardBackground,
    marginBottom: 6,
  },
  gradientText: {
    fontSize: 13,
    color: Colors.primaryLight,
    lineHeight: 18,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  indicatorsList: {
    flexDirection: 'column',
  },
  tipsCard: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  nextBtn: {
    backgroundColor: Colors.warning,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: {
    color: Colors.cardBackground,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  nextBtnIcon: {
    marginLeft: 4,
  },
});
