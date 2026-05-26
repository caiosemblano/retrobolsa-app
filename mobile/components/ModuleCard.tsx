import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Module } from '../types';
import { Card } from './ui/Card';
import { Icon } from './Icon';

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

export function ModuleCard({ module, onClick }: ModuleCardProps) {
  const progress = (module.completedLessons / module.lessonsCount) * 100;

  return (
    <TouchableOpacity onPress={onClick} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon name={module.icon} size={24} color="#1d4ed8" />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{module.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {module.description}
            </Text>

            {/* Custom Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.lessonsText}>
                {module.completedLessons} de {module.lessonsCount} aulas
              </Text>
              <Text style={styles.percentageText}>
                {Math.round(progress)}% completo
              </Text>
            </View>
          </View>

          <View style={styles.arrowContainer}>
            <Icon name="ChevronRight" size={20} color="#94a3b8" />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    padding: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 12,
    backgroundColor: '#dbeafe', // blue-100
    borderRadius: 8,
    marginRight: 16,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a', // slate-900
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#64748b', // slate-600
    marginBottom: 12,
    lineHeight: 18,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e2e8f0', // slate-200
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6', // blue-500
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonsText: {
    fontSize: 12,
    color: '#64748b', // slate-600
    flex: 1,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8', // blue-700
  },
  arrowContainer: {
    marginLeft: 8,
  },
});
