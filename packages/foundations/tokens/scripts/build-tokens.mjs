import { buildTokenVariant } from '@epds/style-dictionary-config';

const PRIMITIVE_SOURCE = ['src/primitive/**/*.json'];
const isSemantic = (token) => token.filePath.includes('/semantic/');

await buildTokenVariant({
  label: 'primitives',
  source: PRIMITIVE_SOURCE,
  exportName: 'primitives',
  cssFile: 'primitives.css',
  cssSelector: ':root',
});

await buildTokenVariant({
  label: 'semantic (light)',
  source: [...PRIMITIVE_SOURCE, 'src/semantic/color.light.json'],
  filter: isSemantic,
  exportName: 'semanticLight',
  cssFile: 'semantic-light.css',
  cssSelector: ':root, [data-epds-theme="light"]',
});

await buildTokenVariant({
  label: 'semantic (dark)',
  source: [...PRIMITIVE_SOURCE, 'src/semantic/color.dark.json'],
  filter: isSemantic,
  exportName: 'semanticDark',
  cssFile: 'semantic-dark.css',
  cssSelector: '[data-epds-theme="dark"]',
});
