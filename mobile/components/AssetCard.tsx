import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Asset } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Icon } from './Icon';
import { Colors } from '../constants/Colors';

interface AssetCardProps {
  asset: Asset;
  onClick: () => void;
  allocatedAmount?: number;
}

export function AssetCard({ asset, onClick, allocatedAmount }: AssetCardProps) {
  const isAllocated = allocatedAmount !== undefined && allocatedAmount > 0;

  return (
    <TouchableOpacity onPress={onClick} activeOpacity={0.8}>
      <Card
        style={[
          styles.card,
          isAllocated ? styles.cardAllocated : styles.cardNormal,
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.iconContainer}>
              {asset.type === 'stock' ? (
                <Icon name="TrendingUp" size={20} color={Colors.primaryHover} />
              ) : (
                <Icon name="Building2" size={20} color={Colors.success} />
              )}
            </View>
            <View>
              <Text style={styles.title}>{asset.anonymousName}</Text>
              
              <View style={styles.badgeRow}>
                {asset.sector ? (
                  <Badge variant="secondary" style={styles.badge}>
                    {`Setor: ${asset.sector}`}
                  </Badge>
                ) : null}

                {asset.bondType ? (
                  <Badge variant="success" style={styles.badge}>
                    {asset.bondType}
                  </Badge>
                ) : null}
              </View>
            </View>
          </View>

          {isAllocated ? (
            <View style={styles.allocationBadge}>
              <Icon name="DollarSign" size={14} color={Colors.warningDark} />
              <Text style={styles.allocationText}>
                {allocatedAmount.toLocaleString('pt-BR')}
              </Text>
            </View>
          ) : null}
        </View>

        {asset.type === 'stock' && asset.indicators ? (
          <View style={styles.indicatorsGrid}>
            <View style={styles.indicatorCol}>
              <Text style={styles.indicatorLabel}>P/L</Text>
              <Text style={styles.indicatorVal}>
                {asset.indicators.pl?.toFixed(1) || '-'}
              </Text>
            </View>
            <View style={styles.indicatorCol}>
              <Text style={styles.indicatorLabel}>ROE</Text>
              <Text style={styles.indicatorVal}>
                {asset.indicators.roe ? `${asset.indicators.roe}%` : '-'}
              </Text>
            </View>
            <View style={styles.indicatorCol}>
              <Text style={styles.indicatorLabel}>Div. Yield</Text>
              <Text style={styles.indicatorVal}>
                {asset.indicators.dividendYield ? `${asset.indicators.dividendYield}%` : '-'}
              </Text>
            </View>
          </View>
        ) : null}

        {asset.type === 'bond' ? (
          <View style={styles.bondContainer}>
            <Text style={styles.bondLabel}>Taxa de Retorno</Text>
            <Text style={styles.bondVal}>{asset.rate}% a.a.</Text>
          </View>
        ) : null}

        {isAllocated ? (
          <View style={styles.allocatedFooter}>
            <Text style={styles.allocatedFooterText}>Alocado</Text>
          </View>
        ) : null}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    padding: 14,
    borderWidth: 2,
  },
  cardNormal: {
    borderColor: Colors.border, // slate-200
  },
  cardAllocated: {
    borderColor: Colors.warning, // orange-500
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    marginRight: 6,
  },
  allocationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight, // orange-100
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  allocationText: {
    color: Colors.warningDark, // orange-600
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  indicatorsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.background, // slate-50
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  indicatorCol: {
    flex: 1,
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 11,
    color: Colors.textMuted, // slate-500
    marginBottom: 2,
  },
  indicatorVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryDarker, // blue-900
  },
  bondContainer: {
    backgroundColor: '#f0fdf4', // green-50
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bondLabel: {
    fontSize: 12,
    color: Colors.textSecondary, // slate-600
  },
  bondVal: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.successDark, // green-700
  },
  allocatedFooter: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#fed7aa', // orange-200
    alignItems: 'center',
  },
  allocatedFooterText: {
    fontSize: 12,
    color: Colors.warningDark, // orange-600
    fontWeight: '600',
  },
});
