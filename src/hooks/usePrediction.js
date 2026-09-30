import { useState } from 'react';
import { contexts, probabilitiesAt, sample } from '../lib/learning';

export function usePrediction() {
  const [context, updateContext] = useState('cat');
  const [temperature, updateTemperature] = useState(40);
  const [choice, setChoice] = useState(null);
  const current = contexts[context];
  const probabilities = probabilitiesAt(current.weights, temperature);
  return {context, temperature, current, probabilities, choice,
    setContext(value) {updateContext(value); setChoice(null);},
    setTemperature(value) {updateTemperature(value); setChoice(null);},
    predict() {setChoice(sample(probabilities));},
  };
}
