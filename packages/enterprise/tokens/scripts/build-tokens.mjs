import { buildTokenVariant } from '@goshi/style-dictionary-config';

const FOUNDATION_PRIMITIVE = ['../../foundations/tokens/src/primitive/**/*.json'];
const ALIAS_SCALE = ['src/alias.scale.json'];
const isEnt = (token) => token.path[0] === 'ent';

await buildTokenVariant({
  label: 'ent (light)',
  source: [
    ...FOUNDATION_PRIMITIVE,
    '../../foundations/tokens/src/semantic/color.light.json',
    'src/alias.color.json',
    ...ALIAS_SCALE,
  ],
  filter: isEnt,
  exportName: 'entLight',
  stripPrefix: ['ent'],
  cssFile: 'ent-light.css',
  cssSelector: ':root, [data-goshi-theme="light"]',
});

await buildTokenVariant({
  label: 'ent (dark)',
  source: [
    ...FOUNDATION_PRIMITIVE,
    '../../foundations/tokens/src/semantic/color.dark.json',
    'src/alias.color.json',
    ...ALIAS_SCALE,
  ],
  filter: isEnt,
  exportName: 'entDark',
  stripPrefix: ['ent'],
  cssFile: 'ent-dark.css',
  cssSelector: '[data-goshi-theme="dark"]',
});
