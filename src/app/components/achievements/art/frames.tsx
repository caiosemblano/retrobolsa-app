import { AchievementRarity } from '../../../types';

/**
 * Forma da moldura por raridade, num viewBox 64×64. A forma sozinha já comunica a
 * raridade — não só a cor —, o que ajuda quem distingue mal as cores.
 */
const framePaths: Record<AchievementRarity, string> = {
  // Círculo
  comum: 'M4 32 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0 Z',
  // Hexágono
  raro: 'M32 3 L57.1 17.5 V46.5 L32 61 L6.9 46.5 V17.5 Z',
  // Escudo
  epico: 'M32 3 L56 11 V30 C56 45 45 55 32 61 C19 55 8 45 8 30 V11 Z',
  // Estrela de 16 pontas
  lendario:
    'M32 2 L41.57 8.9 L53.21 10.79 L55.1 22.43 L62 32 L55.1 41.57 L53.21 53.21 L41.57 55.1 ' +
    'L32 62 L22.43 55.1 L10.79 53.21 L8.9 41.57 L2 32 L8.9 22.43 L10.79 10.79 L22.43 8.9 Z',
};

interface FrameProps {
  rarity: AchievementRarity;
  unlocked: boolean;
  /** Id único do gradiente — vários emblemas convivem na mesma página. */
  gradientId: string;
}

/** Moldura em currentColor: gradiente com brilho quando desbloqueada, silhueta apagada quando não. */
export function Frame({ rarity, unlocked, gradientId }: FrameProps) {
  const d = framePaths[rarity] ?? framePaths.comum;

  if (!unlocked) {
    return <path d={d} fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5} />;
  }

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity={0.62} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${gradientId})`} />
      {/* Filete interno claro: dá o relevo de medalha. */}
      <path
        d={d}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.35}
        strokeWidth={1.5}
        transform="translate(32 32) scale(0.86) translate(-32 -32)"
      />
    </>
  );
}
