import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from '../ui/Card';
import { Icon } from '../Icon';
import { Button } from '../ui/Button';
import { Colors } from '../../constants/Colors';

interface SimulationWaitScreenProps {
  onSkipWait?: () => void;
}

export function SimulationWaitScreen({ onSkipWait }: SimulationWaitScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.centerContainer}>
        <Card style={styles.mainCard}>
          {/* Custom Spinner Section */}
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={Colors.primaryHover} style={styles.loader} />
            <View style={styles.iconOverlay}>
              <Icon name="TrendingUp" size={24} color={Colors.success} />
            </View>
          </View>

          <Text style={styles.title}>Carteira Confirmada! 🎉</Text>
          
          <Text style={styles.description}>
            A simulação histórica de 3 a 10 anos está em andamento. 
            Estamos calculando o desempenho de sua carteira no período selecionado.
          </Text>

          <Card style={styles.timeCard}>
            <View style={styles.timeHeader}>
              <Icon name="Clock" size={18} color={Colors.warningDark} style={styles.timeIcon} />
              <Text style={styles.timeHeaderText}>Resultados disponíveis em:</Text>
            </View>
            <Text style={styles.timeValue}>
              Segunda-feira, 18/11/2025 às 20:00
            </Text>
          </Card>

          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              💡 Enquanto espera, que tal completar mais aulas na seção "Aprender"?
            </Text>
          </View>

          {onSkipWait && (
            <Button
              variant="outline"
              onPress={onSkipWait}
              style={{ marginTop: 20, borderColor: Colors.warning, borderWidth: 2 }}
            >
              <Text style={{ color: Colors.warningDark, fontWeight: 'bold', fontSize: 14 }}>
                ⏩ Pular 15 Dias (Demonstração)
              </Text>
            </Button>
          )}
        </Card>

        {/* Steps Grid (3 Column layout) */}
        <View style={styles.stepsGrid}>
          <Card style={styles.stepCard}>
            <Text style={styles.stepEmoji}>📊</Text>
            <Text style={styles.stepText}>Simulando mercado</Text>
          </Card>
          <Card style={styles.stepCard}>
            <Text style={styles.stepEmoji}>💰</Text>
            <Text style={styles.stepText}>Calculando retorno</Text>
          </Card>
          <Card style={styles.stepCard}>
            <Text style={styles.stepEmoji}>🏆</Text>
            <Text style={styles.stepText}>Gerando ranking</Text>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  mainCard: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderColor: Colors.primaryLightest, // blue-200
    borderWidth: 2,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  spinnerContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loader: {
    transform: [{ scale: 1.8 }],
  },
  iconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary, // slate-600
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  timeCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeIcon: {
    marginRight: 6,
  },
  timeHeaderText: {
    fontSize: 14,
    color: Colors.textSecondary, // slate-700
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark, // blue-700
  },
  tipBox: {
    backgroundColor: Colors.primaryLight, // blue-100
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  tipText: {
    fontSize: 13,
    color: Colors.primaryDarker, // blue-900
    textAlign: 'center',
    lineHeight: 18,
  },
  stepsGrid: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 400,
    marginTop: 24,
    justifyContent: 'space-between',
  },
  stepCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
  },
  stepEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  stepText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
