import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Competition } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Icon } from './Icon';

interface CompetitionCardProps {
  competition: Competition;
  onAction: () => void;
}

export function CompetitionCard({ competition, onAction }: CompetitionCardProps) {
  const getStatusBadge = () => {
    switch (competition.status) {
      case 'open':
        return <Badge variant="success">Mercado Aberto</Badge>;
      case 'simulating':
        return <Badge variant="warning">Em Simulação</Badge>;
      case 'closed':
        return <Badge variant="secondary">Mercado Fechado</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (competition.status) {
      case 'open':
        return <Icon name="Clock" size={24} color="#16a34a" />;
      case 'simulating':
        return <Icon name="Trophy" size={24} color="#ea580c" />;
      case 'closed':
        return <Icon name="CheckCircle" size={24} color="#64748b" />;
    }
  };

  const getButtonText = () => {
    switch (competition.status) {
      case 'open':
        return 'Montar Carteira';
      case 'simulating':
        return 'Aguardando Resultado';
      case 'closed':
        return 'Ver Resultados';
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.iconContainer}>
            {getStatusIcon()}
          </View>
          <View>
            <Text style={styles.title}>Rodada {competition.round}</Text>
            <Text style={styles.subtitle}>Competição Quinzenal</Text>
          </View>
        </View>
        {getStatusBadge()}
      </View>

      {competition.status === 'open' && competition.daysLeft !== undefined ? (
        <View style={styles.alertBox}>
          <View style={styles.alertContent}>
            <Icon name="Clock" size={16} color="#ea580c" style={styles.alertIcon} />
            <Text style={styles.alertText}>
              Faltam {competition.daysLeft} {competition.daysLeft === 1 ? 'dia' : 'dias'} para o fechamento
            </Text>
          </View>
        </View>
      ) : null}

      <Button
        variant="primary"
        size="lg"
        onPress={onAction}
        disabled={competition.status === 'simulating'}
        style={styles.button}
      >
        {getButtonText()}
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: '#93c5fd', // blue-300
    borderWidth: 2,
    backgroundColor: '#f0f9ff', // shade of blue/green
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a', // slate-900
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b', // slate-600
  },
  alertBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 8,
  },
  alertText: {
    fontSize: 13,
    color: '#334155', // slate-700
  },
  button: {
    width: '100%',
    backgroundColor: '#f97316', // orange-500
  },
});
