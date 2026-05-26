import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { ModuleCard } from '../ModuleCard';
import { LessonCard } from '../LessonCard';
import { Button } from '../ui/Button';
import { Icon } from '../Icon';
import { modules, lessons } from '../../data/mockData';
import { Module } from '../../types';

export function LearnScreen() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const moduleLessons = selectedModule
    ? lessons.filter((lesson) => lesson.moduleId === selectedModule.id)
    : [];

  const handleLessonClick = (title: string) => {
    Alert.alert('Abrindo Aula', `Abrindo aula: ${title}`);
  };

  if (selectedModule) {
    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <Button
          variant="ghost"
          onPress={() => setSelectedModule(null)}
          style={styles.backBtn}
        >
          <Icon name="ChevronLeft" size={16} color="#64748b" style={styles.backIcon} />
          <Text style={styles.backText}>Voltar para Módulos</Text>
        </Button>

        {/* Module Detail Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{selectedModule.title}</Text>
          <Text style={styles.subtitle}>{selectedModule.description}</Text>
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsList}>
          {moduleLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => handleLessonClick(lesson.title)}
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderIconContainer}>
          <Icon name="GraduationCap" size={28} color="#1d4ed8" />
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
              <View style={[styles.progressBar, { width: '53%' }]} />
            </View>
            <Text style={styles.progressPctText}>53%</Text>
          </View>
        </View>
      </Card>

      {/* Modules listing */}
      <View style={styles.modulesSection}>
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onClick={() => setSelectedModule(module)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// Inline helper Card since we need it in LearnScreen but can't import ui/Card styled specifically
function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.cardBase, style]}>{children}</View>;
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
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
    backgroundColor: '#dbeafe', // blue-100
    borderRadius: 10,
    marginRight: 12,
  },
  pageHeaderTextContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  cardBase: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  progressCard: {
    backgroundColor: '#2563eb', // blue-600 flat background
    borderColor: '#1d4ed8',
    padding: 20,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 13,
    color: '#dbeafe', // blue-100
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
    color: '#dbeafe',
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
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  progressPctText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  modulesSection: {
    gap: 8,
  },
});
