import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AssetCard } from '../AssetCard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Icon } from '../Icon';
import { currentCompetition } from '../../data/mockData';
import { Asset, Portfolio } from '../../types';

interface PortfolioBuilderScreenProps {
  onConfirm: () => void;
  onBack: () => void;
}

const TOTAL_BUDGET = 100000;

export function PortfolioBuilderScreen({ onConfirm, onBack }: PortfolioBuilderScreenProps) {
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [allocationAmount, setAllocationAmount] = useState<string>('0');

  const allocatedTotal = Object.values(portfolio).reduce((sum, amount) => sum + amount, 0);
  const remaining = TOTAL_BUDGET - allocatedTotal;
  const allocationPercentage = (allocatedTotal / TOTAL_BUDGET) * 100;

  const currentAssetAllocated = selectedAsset ? portfolio[selectedAsset.id] || 0 : 0;
  const maxAvailableForAsset = remaining + currentAssetAllocated;

  const handleOpenAllocation = (asset: Asset) => {
    setSelectedAsset(asset);
    setAllocationAmount((portfolio[asset.id] || 0).toString());
  };

  const handleAllocate = () => {
    if (selectedAsset) {
      const amount = Math.min(Number(allocationAmount) || 0, maxAvailableForAsset);
      const newPortfolio = { ...portfolio };
      if (amount > 0) {
        newPortfolio[selectedAsset.id] = amount;
      } else {
        delete newPortfolio[selectedAsset.id];
      }
      setPortfolio(newPortfolio);
      setSelectedAsset(null);
      setAllocationAmount('0');
    }
  };

  const handleRemoveAllocation = (assetId: string) => {
    const newPortfolio = { ...portfolio };
    delete newPortfolio[assetId];
    setPortfolio(newPortfolio);
  };

  const setPresetPercentage = (percentage: number) => {
    const calculated = Math.floor(maxAvailableForAsset * percentage);
    setAllocationAmount(calculated.toString());
  };

  const canConfirm = allocatedTotal >= TOTAL_BUDGET * 0.5; // At least 50% allocated

  return (
    <View style={styles.outerContainer}>
      {/* Fixed Sticky Top Budget Display */}
      <View style={styles.stickyHeader}>
        <Card style={styles.budgetCard}>
          <View style={styles.budgetRow}>
            <View>
              <Text style={styles.budgetLabel}>Orçamento Disponível</Text>
              <Text style={styles.budgetVal}>
                R$ {remaining.toLocaleString('pt-BR')}
              </Text>
            </View>
            <View style={styles.textAlignRight}>
              <Text style={styles.budgetLabelRight}>Alocado</Text>
              <Text style={styles.budgetVal}>
                R$ {allocatedTotal.toLocaleString('pt-BR')}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${allocationPercentage}%` }]} />
          </View>
        </Card>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <Button
          variant="ghost"
          onPress={onBack}
          style={styles.backBtn}
        >
          <Icon name="ChevronLeft" size={16} color="#64748b" style={styles.backIcon} />
          <Text style={styles.backText}>Voltar</Text>
        </Button>

        {/* Screen Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Monte sua Carteira</Text>
          <Text style={styles.subtitle}>
            Distribua seu orçamento de R$ 100.000 entre os ativos disponíveis
          </Text>
        </View>

        {/* Assets List */}
        <View style={styles.assetsSection}>
          <Text style={styles.sectionTitle}>Ativos Disponíveis</Text>
          {currentCompetition.assets.map((asset) => (
            <View key={asset.id} style={styles.assetCardWrapper}>
              <AssetCard
                asset={asset}
                allocatedAmount={portfolio[asset.id]}
                onClick={() => handleOpenAllocation(asset)}
              />
              {portfolio[asset.id] !== undefined && portfolio[asset.id] > 0 ? (
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemoveAllocation(asset.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeBtnText}>Remover</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Sticky Bottom Action Panel */}
      <View style={styles.stickyFooter}>
        {!canConfirm ? (
          <View style={styles.warningContainer}>
            <Icon name="AlertCircle" size={16} color="#ea580c" style={styles.warningIcon} />
            <Text style={styles.warningText}>
              Aloque pelo menos 50% do orçamento para confirmar
            </Text>
          </View>
        ) : null}
        <Button
          variant="primary"
          size="lg"
          onPress={onConfirm}
          disabled={!canConfirm}
          style={styles.confirmBtn}
        >
          <Icon name="Wallet" size={18} color={canConfirm ? '#ffffff' : '#94a3b8'} style={styles.walletIcon} />
          <Text style={[styles.confirmBtnText, !canConfirm && styles.confirmBtnTextDisabled]}>
            Confirmar Carteira
          </Text>
        </Button>
      </View>

      {/* Custom Allocation Modal */}
      {selectedAsset && (
        <Modal
          visible={!!selectedAsset}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedAsset(null)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContentWrapper}
            >
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Alocar em {selectedAsset.anonymousName}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedAsset(null)}>
                    <Icon name="Lock" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.inputLabel}>Valor a Investir (R$)</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    value={allocationAmount}
                    onChangeText={(val) => {
                      // Prevent inputting more than available limit
                      const num = Number(val) || 0;
                      if (num <= maxAvailableForAsset) {
                        setAllocationAmount(val);
                      } else {
                        setAllocationAmount(maxAvailableForAsset.toString());
                      }
                    }}
                    placeholder="0"
                  />

                  <Text style={styles.inputLabel}>Usar percentual do disponível</Text>
                  {/* Preset percent selectors acting as custom slider chips */}
                  <View style={styles.presetRow}>
                    <TouchableOpacity
                      style={styles.presetChip}
                      onPress={() => setPresetPercentage(0)}
                    >
                      <Text style={styles.presetChipText}>Zerar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.presetChip}
                      onPress={() => setPresetPercentage(0.25)}
                    >
                      <Text style={styles.presetChipText}>25%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.presetChip}
                      onPress={() => setPresetPercentage(0.5)}
                    >
                      <Text style={styles.presetChipText}>50%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.presetChip}
                      onPress={() => setPresetPercentage(0.75)}
                    >
                      <Text style={styles.presetChipText}>75%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.presetChip}
                      onPress={() => setPresetPercentage(1)}
                    >
                      <Text style={styles.presetChipText}>100%</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.availableText}>
                    Disponível: R$ {maxAvailableForAsset.toLocaleString('pt-BR')}
                  </Text>
                </View>

                <View style={styles.modalFooter}>
                  <Button
                    variant="ghost"
                    onPress={() => setSelectedAsset(null)}
                    style={styles.modalCancelBtn}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onPress={handleAllocate}
                    style={styles.modalSubmitBtn}
                  >
                    Alocar
                  </Button>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f8fafc', // slate-50
  },
  stickyHeader: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', // slate-200
    ...Platform.select({
      ios: {
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 3px rgba(100, 116, 139, 0.05)',
      } as any,
    }),
    zIndex: 10,
  },
  budgetCard: {
    backgroundColor: '#2563eb', // blue-600 flat background
    borderColor: '#1d4ed8',
    padding: 14,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#dbeafe', // blue-100
    marginBottom: 2,
  },
  budgetLabelRight: {
    fontSize: 12,
    color: '#dbeafe',
    marginBottom: 2,
    textAlign: 'right',
  },
  textAlignRight: {
    alignItems: 'flex-end',
  },
  budgetVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 130, // Space for sticky bottom button
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    marginBottom: 12,
  },
  backIcon: {
    marginRight: 4,
  },
  backText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  headerInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  assetsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  assetCardWrapper: {
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#ef4444', // red-500
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    zIndex: 5,
  },
  removeBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px -2px 4px rgba(100, 116, 139, 0.1)',
      } as any,
    }),
    zIndex: 10,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  warningIcon: {
    marginRight: 6,
  },
  warningText: {
    fontSize: 12,
    color: '#ea580c', // orange-600
    fontWeight: '500',
  },
  confirmBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletIcon: {
    marginRight: 8,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmBtnTextDisabled: {
    color: '#94a3b8',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // dark transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContentWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0px 4px 10px rgba(15, 23, 42, 0.15)',
      } as any,
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalBody: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 16,
    backgroundColor: '#f8fafc',
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  presetChip: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  availableText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelBtn: {
    marginRight: 10,
  },
  modalSubmitBtn: {
    backgroundColor: '#f97316', // orange-500
    paddingHorizontal: 20,
  },
});
