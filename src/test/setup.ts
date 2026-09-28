import '@testing-library/jest-dom/vitest';

// O jsdom não implementa rolagem; o layout rola para o topo a cada tela nova.
window.scrollTo = () => {};

// Nem ResizeObserver; o layout observa a altura do header.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
