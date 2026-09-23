import { useId } from 'react';
import { AchievementRarity } from '../../types';
import { artRegistry } from './artRegistry';
import { EstrelaGenerica } from './art/pictograms';
import { Frame } from './art/frames';
import { rarityStyle } from './rarity';

interface AchievementArtProps {
  code: string;
  rarity: AchievementRarity;
  unlocked: boolean;
  className?: string;
}

/**
 * Emblema de uma conquista: moldura da raridade + pictograma próprio. Desbloqueada,
 * sai colorida; bloqueada, vira uma silhueta cinza — mas com o mesmo desenho, para o
 * jogador saber o que está buscando.
 */
export function AchievementArt({ code, rarity, unlocked, className = '' }: AchievementArtProps) {
  // useId devolve algo como ":r3:"; os dois-pontos atrapalham referências url(#...) em alguns navegadores.
  const gradientId = `emblema-${useId().replace(/:/g, '')}`;
  const Pictogram = artRegistry[code] ?? EstrelaGenerica;
  const style = rarityStyle(rarity);

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`${unlocked ? style.frame : 'text-muted-foreground'} ${className}`}
      data-art={code in artRegistry ? code : 'fallback'}
      data-unlocked={unlocked}
    >
      <Frame rarity={rarity} unlocked={unlocked} gradientId={gradientId} />
      <g className={unlocked ? style.ink : 'text-muted-foreground'} opacity={unlocked ? 1 : 0.55}>
        <Pictogram />
      </g>
    </svg>
  );
}
