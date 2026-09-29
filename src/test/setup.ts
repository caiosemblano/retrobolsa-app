import '@testing-library/jest-dom/vitest';

// O jsdom não implementa rolagem; o layout rola para o topo a cada tela nova.
window.scrollTo = () => {};

// Nem ResizeObserver; o layout observa a altura do header.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// O floating-ui (posição de popovers do Radix) testa `el.matches(':modal')` a cada
// cálculo, e no jsdom esse seletor leva ~400 ms: abrir um popover levava 15 s.
// O jsdom não tem "top layer", então a resposta é sempre false.
const matchesOriginal = Element.prototype.matches;
Element.prototype.matches = function (this: Element, seletor: string) {
  if (seletor === ':modal' || seletor === ':popover-open') return false;
  return matchesOriginal.call(this, seletor);
};
