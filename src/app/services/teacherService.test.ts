import { describe, expect, it } from 'vitest';
import { nomeDoArquivo, nomeDoCsv } from './teacherService';

describe('teacherService: nome do CSV', () => {
  it('monta o nome como a API, sem acentos nem espaços', () => {
    expect(nomeDoCsv('1º ano B')).toBe('turma-1o-ano-b.csv');
    expect(nomeDoCsv('Educação Financeira — Noturno')).toBe('turma-educacao-financeira-noturno.csv');
    expect(nomeDoCsv('!!!')).toBe('turma-alunos.csv');
  });

  it('usa o nome do cabeçalho quando ele chega, e o padrão quando não', () => {
    expect(nomeDoArquivo("attachment; filename=\"x.csv\"; filename*=UTF-8''turma-1o-ano-b.csv", 'p.csv')).toBe(
      'turma-1o-ano-b.csv',
    );
    expect(nomeDoArquivo('attachment; filename="alunos.csv"', 'p.csv')).toBe('alunos.csv');
    expect(nomeDoArquivo(undefined, 'turma-2o-ano.csv')).toBe('turma-2o-ano.csv');
  });
});
