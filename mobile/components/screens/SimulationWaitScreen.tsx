import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from '../ui/Card';
import { Icon } from '../Icon';

export function SimulationWaitScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.centerContainer}>
        <Card style={styles.mainCard}>
          {/* Custom Spinner Section */}
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
            <View style={styles.iconOverlay}>
              <Icon name="TrendingUp" size={24} color="#16a34a" />
            </View>
          </View>

          <Text style={styles.title}>Carteira Confirmada! 🎉</Text>
          
          <Text style={styles.description}>
            A simulação histórica de 3 a 10 anos está em andamento. 
            Estamos calculando o desempenho de sua carteira no período selecionado.
          </Text>

          <Card style={styles.timeCard}>
            <View style={styles.timeHeader}>
              <Icon name="Clock" size={18} color="#ea580c" style={styles.timeIcon} />
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
    borderColor: '#bfdbfe', // blue-200
    borderWidth: 2,
    backgroundColor: '#f8fafc',
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
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#475569', // slate-600
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
    color: '#334155', // slate-700
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1d4ed8', // blue-700
  },
  tipBox: {
    backgroundColor: '#dbeafe', // blue-100
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  tipText: {
    fontSize: 13,
    color: '#1e3a8a', // blue-900
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
    backgroundColor: '#ffffff',
  },
  stepEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  stepText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
});
