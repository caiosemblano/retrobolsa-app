import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { HomeScreen } from './components/screens/HomeScreen';
import { LearnScreen } from './components/screens/LearnScreen';
import { RankingsScreen } from './components/screens/RankingsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { CompetitionContextScreen } from './components/screens/CompetitionContextScreen';
import { PortfolioBuilderScreen } from './components/screens/PortfolioBuilderScreen';
import { SimulationWaitScreen } from './components/screens/SimulationWaitScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { Icon } from './components/Icon';

type Screen = 'home' | 'learn' | 'rankings' | 'profile' | 'context' | 'portfolio' | 'simulation' | 'results';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onStartCompetition={() => setCurrentScreen('context')}
            onViewResults={() => setCurrentScreen('results')}
          />
        );
      case 'learn':
        return <LearnScreen />;
      case 'rankings':
        return <RankingsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'context':
        return (
          <CompetitionContextScreen
            onNext={() => setCurrentScreen('portfolio')}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'portfolio':
        return (
          <PortfolioBuilderScreen
            onConfirm={() => setCurrentScreen('simulation')}
            onBack={() => setCurrentScreen('context')}
          />
        );
      case 'simulation':
        return <SimulationWaitScreen />;
      case 'results':
        return (
          <ResultsScreen
            onViewRanking={() => setCurrentScreen('rankings')}
            onBack={() => setCurrentScreen('home')}
          />
        );
      default:
        return (
          <HomeScreen
            onStartCompetition={() => setCurrentScreen('context')}
            onViewResults={() => setCurrentScreen('results')}
          />
        );
    }
  };

  const mainScreens: Screen[] = ['home', 'learn', 'rankings', 'profile'];
  const shouldShowNav = mainScreens.includes(currentScreen);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📊 Cartola Financeiro</Text>
          <Text style={styles.headerSubtitle}>Simulador Histórico de Investimentos</Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.main}>
        {renderScreen()}
      </View>

      {/* Bottom Navigation Tab Bar */}
      {shouldShowNav && (
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentScreen('home')}
            activeOpacity={0.8}
          >
            <Icon
              name="Home"
              size={22}
              color={currentScreen === 'home' ? '#f97316' : '#64748b'}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === 'home' ? styles.navTextActive : styles.navTextInactive,
              ]}
            >
              Competir
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentScreen('learn')}
            activeOpacity={0.8}
          >
            <Icon
              name="GraduationCap"
              size={22}
              color={currentScreen === 'learn' ? '#f97316' : '#64748b'}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === 'learn' ? styles.navTextActive : styles.navTextInactive,
              ]}
            >
              Aprender
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentScreen('rankings')}
            activeOpacity={0.8}
          >
            <Icon
              name="Trophy"
              size={22}
              color={currentScreen === 'rankings' ? '#f97316' : '#64748b'}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === 'rankings' ? styles.navTextActive : styles.navTextInactive,
              ]}
            >
              Rankings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentScreen('profile')}
            activeOpacity={0.8}
          >
            <Icon
              name="User"
              size={22}
              color={currentScreen === 'profile' ? '#f97316' : '#64748b'}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === 'profile' ? styles.navTextActive : styles.navTextInactive,
              ]}
            >
              Perfil
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? 36 : 0, // Safe spacing for android statusbar
  },
  header: {
    backgroundColor: '#2563eb', // blue-600 flat background
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
      } as any,
    }),
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#93c5fd', // blue-300
    marginTop: 2,
  },
  main: {
    flex: 1,
    backgroundColor: '#f8fafc', // slate-50
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0', // slate-200
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8, // extra padding for iOS home indicator
    ...Platform.select({
      ios: {
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px -2px 4px rgba(100, 116, 139, 0.08)',
      } as any,
    }),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#f97316', // orange-500
  },
  navTextInactive: {
    color: '#64748b', // slate-500
  },
});
