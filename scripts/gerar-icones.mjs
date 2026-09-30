// Gera os ícones do PWA (PNG e SVG) sem dependências: desenha o logotipo do app
// (candles subindo sobre o verde da marca) e codifica o PNG com o zlib do Node.
// Uso: node scripts/gerar-icones.mjs
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const pasta = join(raiz, 'public', 'icons');
mkdirSync(pasta, { recursive: true });

const VERDE = [0x22, 0xc5, 0x5e];
const ESMERALDA = [0x34, 0xd3, 0x99];
const FUNDO = [0x06, 0x0b, 0x18];
const BRANCO = [0xff, 0xff, 0xff];

/** Os três candles, em frações do lado útil: [x do centro, topo do pavio, base do pavio, topo do corpo, base do corpo]. */
const CANDLES = [
  [0.28, 0.46, 0.86, 0.56, 0.78],
  [0.5, 0.3, 0.74, 0.38, 0.62],
  [0.72, 0.14, 0.56, 0.2, 0.46],
];

function dentroDoRetanguloArredondado(x, y, lado, raio) {
  const cx = Math.min(Math.max(x, raio), lado - raio);
  const cy = Math.min(Math.max(y, raio), lado - raio);
  return (x - cx) ** 2 + (y - cy) ** 2 <= raio ** 2;
}

/**
 * @param lado tamanho do PNG
 * @param mascaravel ícone "maskable": fundo até a borda e o desenho dentro da zona segura (80%)
 */
function desenhar(lado, mascaravel) {
  const amostras = 4; // superamostragem por eixo, para suavizar as bordas
  const pixels = Buffer.alloc(lado * lado * 4);
  const raio = mascaravel ? 0 : lado * 0.22;
  const margem = mascaravel ? lado * 0.2 : lado * 0.14;
  const util = lado - 2 * margem;

  for (let py = 0; py < lado; py++) {
    for (let px = 0; px < lado; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < amostras; sy++) {
        for (let sx = 0; sx < amostras; sx++) {
          const x = px + (sx + 0.5) / amostras;
          const y = py + (sy + 0.5) / amostras;
          if (!mascaravel && !dentroDoRetanguloArredondado(x, y, lado, raio)) continue;
          // Degradê diagonal, como o logotipo do cabeçalho.
          const t = (x + y) / (2 * lado);
          let cor = VERDE.map((v, i) => v + (ESMERALDA[i] - v) * t);
          const u = (x - margem) / util;
          const v = (y - margem) / util;
          for (const [centro, pavioTopo, pavioBase, corpoTopo, corpoBase] of CANDLES) {
            const noPavio = Math.abs(u - centro) <= 0.025 && v >= pavioTopo && v <= pavioBase;
            const noCorpo = Math.abs(u - centro) <= 0.085 && v >= corpoTopo && v <= corpoBase;
            if (noPavio || noCorpo) cor = BRANCO;
          }
          r += cor[0]; g += cor[1]; b += cor[2]; a += 255;
        }
      }
      const n = amostras * amostras;
      const i = (py * lado + px) * 4;
      if (a === 0) {
        pixels.set(mascaravel ? [...FUNDO, 255] : [0, 0, 0, 0], i);
      } else {
        const cobertura = a / (255 * n);
        pixels[i] = Math.round(r / (a / 255));
        pixels[i + 1] = Math.round(g / (a / 255));
        pixels[i + 2] = Math.round(b / (a / 255));
        pixels[i + 3] = Math.round(cobertura * 255);
      }
    }
  }
  return pixels;
}

const tabelaCrc = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(dados) {
  let c = 0xffffffff;
  for (const byte of dados) c = tabelaCrc[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function bloco(tipo, dados) {
  const tamanho = Buffer.alloc(4);
  tamanho.writeUInt32BE(dados.length);
  const corpo = Buffer.concat([Buffer.from(tipo, 'ascii'), dados]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(corpo));
  return Buffer.concat([tamanho, corpo, crc]);
}

function png(lado, pixels) {
  const cabecalho = Buffer.alloc(13);
  cabecalho.writeUInt32BE(lado, 0);
  cabecalho.writeUInt32BE(lado, 4);
  cabecalho[8] = 8; // bits por canal
  cabecalho[9] = 6; // RGBA
  const linhas = Buffer.alloc((lado * 4 + 1) * lado);
  for (let y = 0; y < lado; y++) {
    linhas[y * (lado * 4 + 1)] = 0; // sem filtro
    pixels.copy(linhas, y * (lado * 4 + 1) + 1, y * lado * 4, (y + 1) * lado * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloco('IHDR', cabecalho),
    bloco('IDAT', deflateSync(linhas, { level: 9 })),
    bloco('IEND', Buffer.alloc(0)),
  ]);
}

const saidas = [
  ['icon-192.png', 192, false],
  ['icon-512.png', 512, false],
  ['maskable-512.png', 512, true],
  ['apple-touch-icon.png', 180, true],
];
for (const [nome, lado, mascaravel] of saidas) {
  writeFileSync(join(pasta, nome), png(lado, desenhar(lado, mascaravel)));
  console.log(`public/icons/${nome}`);
}

// O mesmo desenho em SVG, para navegadores que aceitam ícone vetorial.
const m = 512 * 0.14;
const u = 512 - 2 * m;
const candles = CANDLES.map(([c, pt, pb, ct, cb]) => {
  const x = m + c * u;
  return `<rect x="${(x - 0.025 * u).toFixed(1)}" y="${(m + pt * u).toFixed(1)}" width="${(0.05 * u).toFixed(1)}" height="${((pb - pt) * u).toFixed(1)}" fill="#fff"/>`
    + `<rect x="${(x - 0.085 * u).toFixed(1)}" y="${(m + ct * u).toFixed(1)}" width="${(0.17 * u).toFixed(1)}" height="${((cb - ct) * u).toFixed(1)}" fill="#fff"/>`;
}).join('');
writeFileSync(join(pasta, 'icon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">`
  + `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22c55e"/><stop offset="1" stop-color="#34d399"/></linearGradient></defs>`
  + `<rect width="512" height="512" rx="${(512 * 0.22).toFixed(1)}" fill="url(#g)"/>${candles}</svg>\n`);
console.log('public/icons/icon.svg');
