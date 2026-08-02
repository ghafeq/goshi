import { buildTokenVariant } from '@goshi/style-dictionary-config';

const PRIMITIVE_SOURCE = ['src/primitive/**/*.json'];
const isSemantic = (token) => token.filePath.includes('/semantic/');

await buildTokenVariant({
  label: 'primitives',
  source: PRIMITIVE_SOURCE,
  exportName: 'primitives',
  cssFile: 'primitives.css',
  cssSelector: ':root',
});

// color.action.json is theme-mode-invariant (sourced entirely from Figma's
// single "Inverse" token branch — no light/dark app-mode counterpart has
// been found yet, see docs/architecture/0006-figma-consumer-sync.md), so it
// loads into both builds unchanged.
await buildTokenVariant({
  label: 'semantic (light)',
  source: [...PRIMITIVE_SOURCE, 'src/semantic/color.light.json', 'src/semantic/color.action.json'],
  filter: isSemantic,
  exportName: 'semanticLight',
  cssFile: 'semantic-light.css',
  cssSelector: ':root, [data-goshi-theme="light"]',
});

await buildTokenVariant({
  label: 'semantic (dark)',
  source: [...PRIMITIVE_SOURCE, 'src/semantic/color.dark.json', 'src/semantic/color.action.json'],
  filter: isSemantic,
  exportName: 'semanticDark',
  cssFile: 'semantic-dark.css',
  cssSelector: '[data-goshi-theme="dark"]',
});
