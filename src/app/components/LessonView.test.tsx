import { describe, expect, it } from 'vitest';
import { urlDoVideo } from './LessonView';

describe('urlDoVideo', () => {
  it('monta o embed sem cookies a partir de um ID do YouTube', () => {
    expect(urlDoVideo('Y9ng5fVji-A')).toBe('https://www.youtube-nocookie.com/embed/Y9ng5fVji-A?rel=0');
    expect(urlDoVideo('bb0-_GbSg5s')).toBe('https://www.youtube-nocookie.com/embed/bb0-_GbSg5s?rel=0');
  });

  it('não monta nada para aula sem vídeo', () => {
    expect(urlDoVideo(null)).toBeNull();
    expect(urlDoVideo(undefined)).toBeNull();
    expect(urlDoVideo('')).toBeNull();
  });

  it('recusa o que não é um ID do YouTube, em vez de colocar no src do iframe', () => {
    expect(urlDoVideo('javascript:')).toBeNull();
    expect(urlDoVideo('https://youtu.be/Y9ng5fVji-A')).toBeNull();
    expect(urlDoVideo('curto')).toBeNull();
    expect(urlDoVideo('Y9ng5fVji-A"><script>')).toBeNull();
  });
});
