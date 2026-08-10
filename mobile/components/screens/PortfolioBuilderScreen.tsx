import React, { useEffect, useState } from 'react';
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
  ActivityIndicator,
  Alert
} from 'react-native';
import { AssetCard } from '../AssetCard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Icon } from '../Icon';
import { competitionService } from '../../services/competitionService';
import { portfolioService } from '../../services/portfolioService';
import { Asset, Portfolio, Competition } from '../../types';
import { Colors } from '../../constants/Colors';

interface PortfolioBuilderScreenProps {
  onConfirm: () => void;
  onBack: () => void;
}

export function PortfolioBuilderScreen({ onConfirm, onBack }: PortfolioBuilderScreenProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [allocationAmount, setAllocationAmount] = useState<string>('0');

  useEffect(() => {
    const fetchComp = async () => {
      try {
        setIsLoading(true);
        const res = await competitionService.getActive();
        setCompetition(res);
      } catch (err) {
        setError('Erro ao carregar a competição ativa.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchComp();
  }, []);

  const totalBudget = competition?.budget || 100000;
  const allocatedTotal = Object.values(portfolio).reduce((sum, amount) => sum + amount, 0);
  const remaining = totalBudget - allocatedTotal;
  const allocationPercentage = (allocatedTotal / totalBudget) * 100;

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

  const handleSubmit = async () => {
    if (!competition) return;

    try {
      setIsSubmitting(true);
      const allocations = Object.keys(portfolio).map(assetId => ({
        assetId,
        amount: portfolio[assetId],
      }));

      const res = await portfolioService.submit({
        competitionId: competition.id,
        allocations,
      });

      if (res.warnings && res.warnings.length > 0) {
        Alert.alert('Aviso', res.warnings.join('\n\n'), [
          { text: 'OK', onPress: onConfirm }
        ]);
      } else {
        onConfirm();
      }
    } catch (err) {
      console.error(err);
      // Let the interceptor handle the error alert
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rule 5: Submit button enabled as long as allocation > 0
  const canConfirm = allocatedTotal > 0 && !isSubmitting;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primaryHover} />
        <Text style={styles.loadingText}>Carregando ativos...</Text>
      </View>
    );
  }

  if (error || !competition) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="AlertCircle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error || 'Nenhuma competição ativa'}</Text>
        <Button variant="ghost" onPress={onBack} style={{ marginTop: 20 }}>Voltar</Button>
      </View>
    );
  }

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
          <Icon name="ChevronLeft" size={16} color={Colors.textMuted} style={styles.backIcon} />
          <Text style={styles.backText}>Voltar</Text>
        </Button>

        {/* Screen Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Monte sua Carteira</Text>
          <Text style={styles.subtitle}>
            Distribua seu orçamento de R$ {totalBudget.toLocaleString('pt-BR')} entre os ativos disponíveis
          </Text>
        </View>

        {/* Assets List */}
        <View style={styles.assetsSection}>
          <Text style={styles.sectionTitle}>Ativos Disponíveis</Text>
          {competition.assets.map((asset) => (
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
        {!canConfirm && allocatedTotal === 0 ? (
          <View style={styles.warningContainer}>
            <Icon name="AlertCircle" size={16} color={Colors.warningDark} style={styles.warningIcon} />
            <Text style={styles.warningText}>
              Aloque capital para confirmar sua carteira
            </Text>
          </View>
        ) : null}
        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          disabled={!canConfirm}
          style={styles.confirmBtn}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={Colors.cardBackground} style={{ marginRight: 8 }} />
          ) : (
            <Icon name="Wallet" size={18} color={canConfirm ? Colors.cardBackground : Colors.textMuted} style={styles.walletIcon} />
          )}
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
                    <Icon name="Lock" size={20} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.inputLabel}>Valor a Investir (R$)</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    value={allocationAmount}
                    onChangeText={(val) => {
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
                  <View style={styles.presetRow}>
                    {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                      <TouchableOpacity
                        key={pct}
                        style={styles.presetChip}
                        onPress={() => setPresetPercentage(pct)}
                      >
                        <Text style={styles.presetChipText}>
                          {pct === 0 ? 'Zerar' : `${pct * 100}%`}
                        </Text>
                      </TouchableOpacity>
                    ))}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
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
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stickyHeader: {
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: Colors.textMuted,
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
    backgroundColor: Colors.primaryHover,
    borderColor: Colors.primaryDark,
    padding: 14,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  budgetLabel: {
    fontSize: 12,
    color: Colors.primaryLight,
    marginBottom: 2,
  },
  budgetLabelRight: {
    fontSize: 12,
    color: Colors.primaryLight,
    marginBottom: 2,
    textAlign: 'right',
  },
  textAlignRight: {
    alignItems: 'flex-end',
  },
  budgetVal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.cardBackground,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 3,
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 130,
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
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  headerInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  assetsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  assetCardWrapper: {
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: Colors.error,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    zIndex: 5,
  },
  removeBtnText: {
    color: Colors.cardBackground,
    fontSize: 11,
    fontWeight: '600',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.textMuted,
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
    color: Colors.warningDark,
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
    color: Colors.cardBackground,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmBtnTextDisabled: {
    color: Colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContentWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  modalCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.textPrimary,
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
    borderBottomColor: Colors.background,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalBody: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 16,
    backgroundColor: Colors.background,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  presetChip: {
    backgroundColor: Colors.background,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  availableText: {
    fontSize: 12,
    color: Colors.textMuted,
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
    backgroundColor: Colors.warning,
    paddingHorizontal: 20,
  },
});
