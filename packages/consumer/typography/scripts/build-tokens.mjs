import { buildTokenVariant } from '@epds/style-dictionary-config';

await buildTokenVariant({
  label: 'con typography',
  source: ['src/type-scale.json'],
  filter: (token) => token.path[0] === 'con',
  exportName: 'conTypography',
  stripPrefix: ['con', 'typography'],
  // Text styles are consumed as RN StyleSheet objects, not CSS custom
  // properties — no CSS output for this variant.
});
