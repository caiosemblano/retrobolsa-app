import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { RankingItem } from '../RankingItem';
import { Icon } from '../Icon';
import { rankingService, RankingType } from '../../services/rankingService';
import { RankingEntry } from '../../types';

export function RankingsScreen() {
  const [quinzenal, setQuinzenal] = useState<RankingEntry[]>([]);
  const [season, setSeason] = useState<RankingEntry[]>([]);
  const [general, setGeneral] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setIsLoading(true);
        const [qRes, sRes, gRes] = await Promise.all([
          rankingService.get('quinzenal').catch(() => ({ data: [] })),
          rankingService.get('season').catch(() => ({ data: [] })),
          rankingService.get('general').catch(() => ({ data: [] }))
        ]);
        setQuinzenal(qRes.data);
        setSeason(sRes.data);
        setGeneral(gRes.data);
      } catch (error) {
        console.error('Failed to fetch rankings', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando rankings...</Text>
      </View>
    );
  }

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
            {quinzenal.map((entry) => (
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
            {season.map((entry) => (
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
            {general.map((entry) => (
              <RankingItem key={entry.rank} entry={entry} />
            ))}
          </View>
        </TabsContent>
      </Tabs>
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
    backgroundColor: '#eab308',
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
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  infoBoxTemporada: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  infoBoxGeral: {
    backgroundColor: '#fff7ed',
    borderColor: '#fdba74',
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  infoBoxText: {
    fontSize: 12,
    color: '#475569',
  },
  rankingList: {
    gap: 4,
  },
});
