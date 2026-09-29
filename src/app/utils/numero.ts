/** Número no formato brasileiro, com até `casas` decimais (12.5 → "12,5"). */
export function formatarNumero(valor: number, casas = 1): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: casas });
}

/** Percentual já em % (18.3 → "18,3%"). */
export function formatarPercentual(valor: number, casas = 1): string {
  return `${formatarNumero(valor, casas)}%`;
}

/** Valor em reais (2.8892 → "R$ 2,89"). */
export function formatarReais(valor: number, casas = 2): string {
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })}`;
}
