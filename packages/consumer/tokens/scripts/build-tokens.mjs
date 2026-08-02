import { buildTokenVariant } from '@goshi/style-dictionary-config';

const FOUNDATION_PRIMITIVE = ['../../foundations/tokens/src/primitive/**/*.json'];
const ALIAS_SCALE = ['src/alias.scale.json'];
const isCon = (token) => token.path[0] === 'con';

await buildTokenVariant({
  label: 'con (light)',
  source: [
    ...FOUNDATION_PRIMITIVE,
    '../../foundations/tokens/src/semantic/color.light.json',
    '../../foundations/tokens/src/semantic/color.action.json',
    'src/alias.color.json',
    ...ALIAS_SCALE,
  ],
  filter: isCon,
  exportName: 'conLight',
  stripPrefix: ['con'],
  cssFile: 'con-light.css',
  cssSelector: ':root, [data-goshi-theme="light"]',
});

await buildTokenVariant({
  label: 'con (dark)',
  source: [
    ...FOUNDATION_PRIMITIVE,
    '../../foundations/tokens/src/semantic/color.dark.json',
    '../../foundations/tokens/src/semantic/color.action.json',
    'src/alias.color.json',
    ...ALIAS_SCALE,
  ],
  filter: isCon,
  exportName: 'conDark',
  stripPrefix: ['con'],
  cssFile: 'con-dark.css',
  cssSelector: '[data-goshi-theme="dark"]',
});
