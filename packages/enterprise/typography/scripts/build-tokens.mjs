// Deliberately empty source (see ../src/type-scale.json) — the Enterprise
// type scale is not defined yet. This build script exists so the pipeline
// is proven end-to-end: once real values are added to type-scale.json
// (same shape as @goshi/consumer-typography's src/type-scale.json, but NOT
// copied from it — Enterprise gets its own scale), nothing else here needs
// to change.
import { buildTokenVariant } from '@goshi/style-dictionary-config';

await buildTokenVariant({
  label: 'ent typography (empty placeholder)',
  source: ['src/type-scale.json'],
  filter: (token) => token.path[0] === 'ent',
  exportName: 'entTypography',
  stripPrefix: ['ent', 'typography'],
});
