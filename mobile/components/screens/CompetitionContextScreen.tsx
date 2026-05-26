import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { EconomicIndicatorCard } from '../EconomicIndicatorCard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Icon } from '../Icon';
import { currentCompetition } from '../../data/mockData';

interface CompetitionContextScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function CompetitionContextScreen({ onNext, onBack }: CompetitionContextScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Button
        variant="ghost"
        onPress={onBack}
        style={styles.backBtn}
      >
        <Icon name="ChevronLeft" size={16} color="#64748b" style={styles.backIcon} />
        <Text style={styles.backText}>Voltar</Text>
      </Button>

      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Icon name="FileText" size={28} color="#1d4ed8" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            {currentCompetition.economicContext.title}
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
          {currentCompetition.economicContext.indicators.map((indicator, index) => (
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
        <Icon name="ArrowRight" size={18} color="#ffffff" style={styles.nextBtnIcon} />
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
    color: '#64748b', // slate-500
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
    backgroundColor: '#dbeafe', // blue-100
    borderRadius: 10,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  gradientCard: {
    backgroundColor: '#2563eb', // blue-600 flat color
    borderColor: '#1d4ed8',
    padding: 16,
    marginBottom: 20,
  },
  gradientTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  gradientText: {
    fontSize: 13,
    color: '#dbeafe', // blue-100
    lineHeight: 18,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  indicatorsList: {
    flexDirection: 'column',
  },
  tipsCard: {
    backgroundColor: '#fff7ed', // orange-50
    borderColor: '#fed7aa', // orange-200
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 13,
    color: '#475569', // slate-600
    lineHeight: 18,
  },
  nextBtn: {
    backgroundColor: '#f97316', // orange-500
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  nextBtnIcon: {
    marginLeft: 4,
  },
});
