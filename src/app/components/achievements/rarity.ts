import { AchievementRarity } from '../../types';

interface RarityStyle {
  label: string;
  /** Cor da moldura do emblema (vira o currentColor do SVG). */
  frame: string;
  /** Cor do pictograma sobre a moldura: a variante escura do token, para contraste. */
  ink: string;
  /** Borda e fundo do card quando a conquista está desbloqueada. */
  card: string;
  /** Cor do rótulo de raridade e da data. */
  text: string;
}

const rarityStyles: Record<AchievementRarity, RarityStyle> = {
  comum: { label: 'Comum', frame: 'text-gain', ink: 'text-gain-foreground', card: 'border-gain/35 bg-gain-soft', text: 'text-gain' },
  raro: { label: 'Raro', frame: 'text-info', ink: 'text-info-foreground', card: 'border-info/35 bg-info-soft', text: 'text-info' },
  epico: { label: 'Épico', frame: 'text-epic', ink: 'text-epic-foreground', card: 'border-epic/35 bg-epic-soft', text: 'text-epic' },
  lendario: { label: 'Lendário', frame: 'text-gold', ink: 'text-gold-foreground', card: 'border-gold/35 bg-gold-soft', text: 'text-gold' },
};

/** Estilo da raridade; uma raridade desconhecida (API mais nova que o app) cai em "comum". */
export function rarityStyle(rarity: string): RarityStyle {
  return rarityStyles[rarity as AchievementRarity] ?? rarityStyles.comum;
}
