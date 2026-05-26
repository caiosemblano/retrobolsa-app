import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Asset } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Icon } from './Icon';

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
                <Icon name="TrendingUp" size={20} color="#2563eb" />
              ) : (
                <Icon name="Building2" size={20} color="#16a34a" />
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
              <Icon name="DollarSign" size={14} color="#ea580c" />
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
    borderColor: '#e2e8f0', // slate-200
  },
  cardAllocated: {
    borderColor: '#f97316', // orange-500
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
    color: '#0f172a',
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
    backgroundColor: '#ffedd5', // orange-100
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  allocationText: {
    color: '#ea580c', // orange-600
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  indicatorsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc', // slate-50
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
    color: '#64748b', // slate-500
    marginBottom: 2,
  },
  indicatorVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e3a8a', // blue-900
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
    color: '#475569', // slate-600
  },
  bondVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803d', // green-700
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
    color: '#ea580c', // orange-600
    fontWeight: '600',
  },
});
