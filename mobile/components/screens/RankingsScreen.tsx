import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { RankingItem } from '../RankingItem';
import { Icon } from '../Icon';
import { quinzenalRanking, seasonRanking, generalRanking } from '../../data/mockData';

export function RankingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Icon name="Trophy" size={28} color="#ffffff" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Rankings</Text>
          <Text style={styles.subtitle}>Veja sua posição entre os investidores</Text>
        </View>
      </View>

      <Tabs defaultValue="quinzenal">
        <TabsList>
          <TabsTrigger value="quinzenal">Quinzenal</TabsTrigger>
          <TabsTrigger value="temporada">Temporada</TabsTrigger>
          <TabsTrigger value="geral">Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="quinzenal">
          <View style={[styles.infoBox, styles.infoBoxQuinzenal]}>
            <Text style={styles.infoBoxTitle}>Rodada Atual</Text>
            <Text style={styles.infoBoxText}>
              Classificação baseada na rentabilidade da última rodada completada
            </Text>
          </View>
          <View style={styles.rankingList}>
            {quinzenalRanking.map((entry) => (
              <RankingItem key={entry.rank} entry={entry} showRentability />
            ))}
          </View>
        </TabsContent>

        <TabsContent value="temporada">
          <View style={[styles.infoBox, styles.infoBoxTemporada]}>
            <Text style={styles.infoBoxTitle}>Temporada Atual</Text>
            <Text style={styles.infoBoxText}>
              Soma dos pontos das 5 rodadas quinzenais da temporada
            </Text>
          </View>
          <View style={styles.rankingList}>
            {seasonRanking.map((entry) => (
              <RankingItem key={entry.rank} entry={entry} />
            ))}
          </View>
        </TabsContent>

        <TabsContent value="geral">
          <View style={[styles.infoBox, styles.infoBoxGeral]}>
            <Text style={styles.infoBoxTitle}>Ranking Geral</Text>
            <Text style={styles.infoBoxText}>
              Pontuação acumulada de todas as temporadas
            </Text>
          </View>
          <View style={styles.rankingList}>
            {generalRanking.map((entry) => (
              <RankingItem key={entry.rank} entry={entry} />
            ))}
          </View>
        </TabsContent>
      </Tabs>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconContainer: {
    padding: 12,
    backgroundColor: '#eab308', // yellow-500 (using flat color matching Trophy)
    borderRadius: 10,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  infoBox: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoBoxQuinzenal: {
    backgroundColor: '#eff6ff', // blue-50
    borderColor: '#bfdbfe', // blue-200
  },
  infoBoxTemporada: {
    backgroundColor: '#f0fdf4', // green-50
    borderColor: '#bbf7d0', // green-200
  },
  infoBoxGeral: {
    backgroundColor: '#fff7ed', // orange-50
    borderColor: '#fdba74', // orange-300
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  infoBoxText: {
    fontSize: 12,
    color: '#475569', // slate-600
  },
  rankingList: {
    gap: 4,
  },
});
