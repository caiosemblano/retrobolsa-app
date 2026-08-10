import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lesson } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Icon } from './Icon';
import { Colors } from '../constants/Colors';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <TouchableOpacity onPress={onClick} activeOpacity={0.8}>
      <Card
        style={[
          styles.card,
          lesson.completed ? styles.cardCompleted : styles.cardNormal,
        ]}
      >
        <View style={styles.container}>
          <View
            style={[
              styles.statusIcon,
              lesson.completed ? styles.statusCompleted : styles.statusIncomplete,
            ]}
          >
            {lesson.completed ? (
              <Icon name="CheckCircle" size={20} color={Colors.cardBackground} />
            ) : (
              <Icon name="Circle" size={20} color={Colors.textMuted} />
            )}
          </View>

          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                lesson.completed ? styles.titleCompleted : styles.titleNormal,
              ]}
            >
              {lesson.title}
            </Text>
            <View style={styles.durationRow}>
              <Icon name="Clock" size={14} color={Colors.textMuted} style={styles.clockIcon} />
              <Text style={styles.durationText}>{lesson.duration}</Text>
            </View>
          </View>

          <Button
            variant={lesson.completed ? 'secondary' : 'primary'}
            size="sm"
            onPress={onClick}
            style={lesson.completed ? styles.btnRevisar : styles.btnAssistir}
          >
            <Icon
              name="Play"
              size={12}
              color={lesson.completed ? Colors.textSecondary : Colors.cardBackground}
              style={styles.playIcon}
            />
            <Text style={[styles.btnText, lesson.completed ? styles.textRevisar : styles.textAssistir]}>
              {lesson.completed ? 'Revisar' : 'Assistir'}
            </Text>
          </Button>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
  },
  cardCompleted: {
    backgroundColor: '#f0fdf4', // green-50
    borderColor: '#bbf7d0', // green-200
  },
  cardNormal: {
    borderColor: Colors.border, // slate-200
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusCompleted: {
    backgroundColor: Colors.success, // green-600
  },
  statusIncomplete: {
    backgroundColor: Colors.background, // slate-100
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleCompleted: {
    color: '#14532d', // green-900
  },
  titleNormal: {
    color: Colors.textPrimary, // slate-900
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 4,
  },
  durationText: {
    fontSize: 12,
    color: Colors.textMuted, // slate-500
  },
  btnRevisar: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderColor: Colors.borderDark,
  },
  btnAssistir: {
    backgroundColor: Colors.warning, // orange-500
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  playIcon: {
    marginRight: 4,
  },
  btnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textRevisar: {
    color: Colors.textSecondary,
  },
  textAssistir: {
    color: Colors.cardBackground,
  },
});
