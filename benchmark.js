// Source: https://arxiv.org/html/2604.24602v4, Table 1.
// Textual: L1–L4 average. Joint: severity-5 visual corruption + L1–L4.
// WMC and L5 are separate protocols and are not included in these data.
const MG_BENCHMARK = Object.freeze({
  methods: Object.freeze([
    { name: 'Source-only', textual: 57.97, joint: 21.68, style: 'source-bar' },
    { name: 'Entropy-only', textual: 55.40, joint: 21.68, style: '' },
    { name: 'Entropy + Diversity', textual: 55.38, joint: 21.76, style: '' },
    { name: 'SAR', textual: 56.84, joint: 25.61, style: 'external-bar' },
    { name: 'TPT', textual: 56.05, joint: 24.07, style: 'external-bar' },
    { name: 'BATCLIP', textual: 60.61, joint: 29.29, style: 'external-bar' },
    { name: 'MG-MTTA', textual: 66.51, joint: 26.27, style: 'ours-bar' }
  ].map(Object.freeze)),
  captions: Object.freeze({
    textual: 'Textual: label-preserving prompt perturbations, averaged over L1–L4. The visual input remains unchanged. Three-seed averages; Table 1.',
    joint: 'Joint: severity-5 visual corruption combined with label-preserving textual perturbations, averaged over L1–L4. Three-seed averages; Table 1.'
  })
});
