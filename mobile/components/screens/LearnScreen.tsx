import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, ActivityIndicator, Linking, Platform } from 'react-native';
import { ModuleCard } from '../ModuleCard';
import { LessonCard } from '../LessonCard';
import { Button } from '../ui/Button';
import { Icon } from '../Icon';
import { articleService } from '../../services/articleService';
import { Module, Lesson } from '../../types';

export function LearnScreen() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoadingModules(true);
        const res = await articleService.getModules();
        setModules(res.data);
      } catch (err) {
        setError('Erro ao carregar os módulos de aprendizado.');
        console.error(err);
      } finally {
        setIsLoadingModules(false);
      }
    };
    fetchModules();
  }, []);

  const handleModuleClick = async (module: Module) => {
    setSelectedModule(module);
    try {
      setIsLoadingLessons(true);
      const res = await articleService.getLessons(module.id);
      setLessons(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao carregar as aulas deste módulo.');
      setLessons([]);
    } finally {
      setIsLoadingLessons(false);
    }
  };

  const handleToggleComplete = async (lesson: Lesson) => {
    const executeUncomplete = async () => {
      try {
        await articleService.uncomplete(lesson.id);
        
        // Update local state
        setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, completed: false } : l));
        setModules(prev => prev.map(m => {
          if (m.id === selectedModule?.id) {
            return { ...m, completedLessons: Math.max(0, m.completedLessons - 1) };
          }
          return m;
        }));
      } catch (err) {
        Alert.alert('Erro', 'Falha ao desmarcar a aula. Tente novamente.');
      }
    };

    if (lesson.completed) {
      if (Platform.OS === 'web') {
        const confirmed = window.confirm('Deseja desmarcar esta aula?');
        if (confirmed) {
          executeUncomplete();
        }
      } else {
        Alert.alert(
          'Desmarcar Aula',
          'Deseja remover esta aula das suas concluídas?',
          [
            { text: 'Não', style: 'cancel' },
            { 
              text: 'Sim, remover', 
              onPress: executeUncomplete
            }
          ]
        );
      }
      return;
    }

    const executeComplete = async () => {
      try {
        await articleService.complete(lesson.id);
        Alert.alert('Sucesso', 'Aula marcada como concluída!');
        
        // Update local state
        setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, completed: true } : l));
        setModules(prev => prev.map(m => {
          if (m.id === selectedModule?.id) {
            return { ...m, completedLessons: m.completedLessons + 1 };
          }
          return m;
        }));
      } catch (err) {
        Alert.alert('Erro', 'Falha ao completar a aula. Tente novamente.');
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Você já assistiu a esta aula e deseja marcá-la como concluída?');
      if (confirmed) {
        executeComplete();
      }
    } else {
      Alert.alert(
        'Confirmar Conclusão',
        'Você já assistiu a esta aula e deseja marcá-la como concluída?',
        [
          { text: 'Não', style: 'cancel' },
          { 
            text: 'Sim, marcar', 
            onPress: executeComplete
          }
        ]
      );
    }
  };

  const handleWatch = (lesson: Lesson) => {
    if (lesson.youtubeUrl) {
      Linking.openURL(lesson.youtubeUrl).catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o link do vídeo.');
      });
    } else {
      Alert.alert('Aviso', 'Esta aula não possui um vídeo associado.');
    }
  };

  if (isLoadingModules) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primaryHover} />
        <Text style={styles.loadingText}>Carregando conteúdo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="AlertCircle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (selectedModule) {
    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <Button
          variant="ghost"
          onPress={() => setSelectedModule(null)}
          style={styles.backBtn}
        >
          <Icon name="ChevronLeft" size={16} color={Colors.textMuted} style={styles.backIcon} />
          <Text style={styles.backText}>Voltar para Módulos</Text>
        </Button>

        {/* Module Detail Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{selectedModule.title}</Text>
          <Text style={styles.subtitle}>{selectedModule.description}</Text>
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsList}>
          {isLoadingLessons ? (
            <ActivityIndicator size="large" color={Colors.primaryHover} style={{ marginTop: 20 }} />
          ) : lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onToggleComplete={() => handleToggleComplete(lesson)}
                onWatch={() => handleWatch(lesson)}
              />
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: Colors.textMuted, marginTop: 20 }}>
              Nenhuma aula disponível neste módulo.
            </Text>
          )}
        </View>
      </ScrollView>
    );
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessonsCount, 0);
  const completedLessons = modules.reduce((acc, m) => acc + m.completedLessons, 0);
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderIconContainer}>
          <Icon name="GraduationCap" size={28} color={Colors.primaryDark} />
        </View>
        <View style={styles.pageHeaderTextContainer}>
          <Text style={styles.pageTitle}>Aprender</Text>
          <Text style={styles.pageSubtitle}>
            Aprimore seus conhecimentos financeiros
          </Text>
        </View>
      </View>

      {/* Progress banner card */}
      <Card style={styles.progressCard}>
        <Text style={styles.progressTitle}>Domine os Fundamentos</Text>
        <Text style={styles.progressText}>
          Complete as aulas para melhorar suas estratégias e tomar decisões mais informadas nas competições.
        </Text>
        <View style={styles.progressBarWrapper}>
          <Text style={styles.progressLabel}>Progresso Total</Text>
          <View style={styles.progressBarRow}>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progressPct}%` }]} />
            </View>
            <Text style={styles.progressPctText}>{progressPct}%</Text>
          </View>
        </View>
      </Card>

      {/* Modules listing */}
      <View style={styles.modulesSection}>
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onClick={() => handleModuleClick(module)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// Inline helper Card since we need it in LearnScreen but can't import ui/Card styled specifically
import { Colors } from '../../constants/Colors';
function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.cardBase, style]}>{children}</View>;
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
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  lessonsList: {
    gap: 12,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageHeaderIconContainer: {
    padding: 12,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    marginRight: 12,
  },
  pageHeaderTextContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  cardBase: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressCard: {
    backgroundColor: Colors.primaryHover,
    borderColor: Colors.primaryDark,
    padding: 20,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.cardBackground,
    marginBottom: 6,
  },
  progressText: {
    fontSize: 13,
    color: Colors.primaryLight,
    lineHeight: 18,
    marginBottom: 16,
  },
  progressBarWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.primaryLight,
    marginBottom: 6,
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 4,
  },
  progressPctText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.cardBackground,
  },
  modulesSection: {
    gap: 8,
  },
});
