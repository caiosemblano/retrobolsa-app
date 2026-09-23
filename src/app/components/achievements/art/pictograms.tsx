/*
 * Pictogramas das conquistas, num viewBox 64×64, desenhados dentro da área útil
 * das molduras (~13..51). Tudo em currentColor: quem os usa decide a cor da tinta.
 */

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Primeira Carteira — carteira com o cartão saindo e o bolso de fecho. */
export function Carteira() {
  return (
    <g>
      <rect x="15" y="22" width="34" height="24" rx="5" {...traco} />
      <path d="M20 22 L37 15.5 L40.5 22" {...traco} />
      <path d="M49 29 H40 a5 5 0 0 0 0 10 H49" {...traco} />
      <circle cx="41" cy="34" r="2" fill="currentColor" />
    </g>
  );
}

/** Tudo Investido — pilha de moedas cheia. */
export function PilhaDeMoedas() {
  return (
    <g>
      <ellipse cx="32" cy="19" rx="12" ry="4.5" fill="currentColor" fillOpacity={0.35} stroke="currentColor" strokeWidth={3} />
      <path d="M20 19 V41 A12 4.5 0 0 0 44 41 V19" {...traco} />
      <path d="M20 26.5 A12 4.5 0 0 0 44 26.5" {...traco} />
      <path d="M20 34 A12 4.5 0 0 0 44 34" {...traco} />
    </g>
  );
}

/** Estudante — livro aberto. */
export function LivroAberto() {
  return (
    <g>
      <path
        d="M32 22 C27 18.5 20.5 18 15 19.5 V44 C20.5 42.5 27 43 32 46.5 C37 43 43.5 42.5 49 44 V19.5 C43.5 18 37 18.5 32 22 Z"
        {...traco}
      />
      <path d="M32 22 V46.5" {...traco} />
      <path d="M19.5 27 C22.5 26.4 25.5 26.7 28 27.8 M19.5 33 C22.5 32.4 25.5 32.7 28 33.8" {...traco} strokeWidth={2} />
      <path d="M44.5 27 C41.5 26.4 38.5 26.7 36 27.8 M44.5 33 C41.5 32.4 38.5 32.7 36 33.8" {...traco} strokeWidth={2} />
    </g>
  );
}

/** No Azul — gráfico subindo, com seta. */
export function GraficoEmAlta() {
  return (
    <g>
      <path d="M16 16 V46 H48" {...traco} />
      <path d="M21 40 L28.5 32 L34 36.5 L45 23" {...traco} strokeWidth={3.5} />
      <path d="M38.5 22.5 H45.5 V29.5" {...traco} strokeWidth={3.5} />
    </g>
  );
}

/** Equilibrista — balança de dois pratos. */
export function Balanca() {
  return (
    <g>
      <path d="M32 17 V45 M24 46 H40 M16 21.5 H48" {...traco} />
      <circle cx="32" cy="16" r="2.5" fill="currentColor" />
      <path d="M16 21.5 L11.5 33 M16 21.5 L20.5 33 M48 21.5 L43.5 33 M48 21.5 L52.5 33" {...traco} strokeWidth={2} />
      <path d="M10.5 33 H21.5 C21.5 37.5 10.5 37.5 10.5 33 Z" fill="currentColor" />
      <path d="M42.5 33 H53.5 C53.5 37.5 42.5 37.5 42.5 33 Z" fill="currentColor" />
    </g>
  );
}

/** Diversificador — pizza de 5 fatias, uma em destaque. */
export function Pizza() {
  return (
    <g>
      <path d="M32 32 L32 18 A14 14 0 0 1 45.31 27.67 Z" fill="currentColor" />
      <path d="M32 32 L40.23 43.33 A14 14 0 0 1 23.77 43.33 Z" fill="currentColor" fillOpacity={0.4} />
      <circle cx="32" cy="32" r="14" {...traco} />
      <path d="M32 32 L32 18 M32 32 L45.31 27.67 M32 32 L40.23 43.33 M32 32 L23.77 43.33 M32 32 L18.69 27.67" {...traco} strokeWidth={2} />
    </g>
  );
}

/** Dois Dígitos — foguete decolando. */
export function Foguete() {
  return (
    <g>
      <path d="M32 13 C38.5 18.5 40.5 27 39 36 H25 C23.5 27 25.5 18.5 32 13 Z" {...traco} />
      <circle cx="32" cy="26" r="3.5" fill="currentColor" />
      <path d="M25.5 30.5 L19 39.5 L25 38.5 M38.5 30.5 L45 39.5 L39 38.5" {...traco} />
      <path d="M28 39.5 C28 44 32 49 32 49 C32 49 36 44 36 39.5 Z" fill="currentColor" />
    </g>
  );
}

/** Veterano — três divisas de patente. */
export function Divisas() {
  return (
    <g>
      <path d="M19 19 L32 27.5 L45 19" {...traco} strokeWidth={4.5} />
      <path d="M19 28 L32 36.5 L45 28" {...traco} strokeWidth={4.5} />
      <path d="M19 37 L32 45.5 L45 37" {...traco} strokeWidth={4.5} />
    </g>
  );
}

/** Pódio — três degraus com a estrela do primeiro lugar. */
export function Podio() {
  return (
    <g>
      <polygon
        points="32,14.5 33.35,18.14 37.23,18.3 34.19,20.71 35.23,24.45 32,22.3 28.77,24.45 29.81,20.71 26.77,18.3 30.65,18.14"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <rect x="26" y="28" width="12" height="18" rx="1.5" fill="currentColor" />
      <rect x="15.5" y="34" width="10.5" height="12" rx="1.5" fill="currentColor" fillOpacity={0.55} />
      <rect x="38" y="38" width="10.5" height="8" rx="1.5" fill="currentColor" fillOpacity={0.55} />
    </g>
  );
}

/** Módulo Concluído — medalha com fitas e visto. */
export function Medalha() {
  return (
    <g>
      <path d="M26.5 34 L22.5 48 L27.5 45.5 L30.5 49.5 L32.5 37.5 Z" fill="currentColor" fillOpacity={0.7} />
      <path d="M37.5 34 L41.5 48 L36.5 45.5 L33.5 49.5 L31.5 37.5 Z" fill="currentColor" fillOpacity={0.7} />
      <circle cx="32" cy="26" r="11" {...traco} />
      <path d="M27 26 L30.5 29.5 L37 22.5" {...traco} strokeWidth={3.5} />
    </g>
  );
}

/** Campeão da Rodada — troféu. */
export function Trofeu() {
  return (
    <g>
      <path d="M22 15 H42 V24 C42 31 37.5 35 32 35 C26.5 35 22 31 22 24 Z" fill="currentColor" />
      <path d="M22 18 H16.5 C16.5 25 19 28 23 28.5 M42 18 H47.5 C47.5 25 45 28 41 28.5" {...traco} />
      <path d="M32 35 V41" {...traco} strokeWidth={3.5} />
      <path d="M24 46 H40 V43.5 C40 42 38.5 41 37 41 H27 C25.5 41 24 42 24 43.5 Z" fill="currentColor" />
    </g>
  );
}

/** Formado — capelo de formatura com borla. */
export function Capelo() {
  return (
    <g>
      <path d="M32 16 L52 25 L32 34 L12 25 Z" fill="currentColor" />
      <path d="M20 29.5 V37 C20 40.5 25.5 43 32 43 C38.5 43 44 40.5 44 37 V29.5" {...traco} />
      <path d="M50 26 V36" {...traco} strokeWidth={2.5} />
      <circle cx="50" cy="38.5" r="2.5" fill="currentColor" />
    </g>
  );
}

/** Conquista que o app ainda não conhece (API mais nova): estrela genérica. */
export function EstrelaGenerica() {
  return (
    <polygon
      points="32,15 36.1,26.4 48.2,26.7 38.6,34.1 42.1,45.7 32,38.9 21.9,45.7 25.4,34.1 15.8,26.7 27.9,26.4"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    />
  );
}
