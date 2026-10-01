// A finite set of illustrative output dots, apportioned by softmax probability.
// The model still computes every output; these dots are not individual signals.
export function outputDotCounts(probabilities, budget) {
  const quotas = probabilities.map(p => p * budget);
  const counts = quotas.map(Math.floor);
  const order = quotas.map((q, i) => i).sort((a, b) => (quotas[b] - counts[b]) - (quotas[a] - counts[a]));
  const remaining = budget - counts.reduce((a, b) => a + b, 0);
  for (let i = 0; i < remaining; i++) counts[order[i]]++;
  return counts;
}

export function probabilityLabel(p) {
  if (p > 0 && p < .001) return '<0.1%';
  if (p < 1 && p > .999) return '>99.9%';
  return `${(p * 100).toFixed(1)}%`;
}
