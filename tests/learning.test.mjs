import test from 'node:test';
import assert from 'node:assert/strict';
import {initialModel, trainStep, loss, probabilitiesAt, sample} from '../src/lib/learning.js';
import {NeuralModel, TEMPLATES} from '../src/lib/neural-model.mjs';

test('training lowers error on the teaching dataset', () => {
  let model={...initialModel};const before=loss(model);
  for(let i=0;i<50;i++)model=trainStep(model);
  assert.equal(model.rounds,50);assert.ok(loss(model)<before/2);
});
test('temperature preserves total probability and changes the distribution', () => {
  const cold=probabilitiesAt([.65,.3,.05],0),hot=probabilitiesAt([.65,.3,.05],100);
  assert.ok(Math.abs(hot.reduce((s,p)=>s+p,0)-1)<1e-10);
  assert.ok(cold[0]>hot[0]);assert.ok(hot[2]>cold[2]);
  assert.equal(sample([.65,.3,.05],.9),1);
});
test('beginner and advanced are separate models with valid outputs', () => {
  const a=new NeuralModel(),b=new NeuralModel(187,[35,64,48,32,16,3]);
  assert.equal(a.shape.reduce((s,n)=>s+n),68);assert.equal(b.shape.reduce((s,n)=>s+n),198);
  a.trainBatch(12,.07);assert.equal(b.rounds,0);
  for(const m of [a,b])assert.ok(Math.abs(m.forward(TEMPLATES[0]).probabilities.reduce((s,p)=>s+p,0)-1)<1e-10);
});

import {outputDotCounts, probabilityLabel} from '../src/lib/output-flow.mjs';
test('output dots follow predictions, with no losing dots at near-total confidence', () => {
  for(const budget of [12,16]) {
    assert.deepEqual(outputDotCounts([.0001,.0001,.9998],budget),[0,0,budget]);
    const split=outputDotCounts([.5,.25,.25],budget);
    assert.equal(split.reduce((a,b)=>a+b,0),budget);
    assert.equal(split[0],budget/2);
    assert.deepEqual(outputDotCounts([1,0,0],budget),[budget,0,0]);
  }
  assert.equal(probabilityLabel(.9998),'>99.9%');
  assert.equal(probabilityLabel(.0001),'<0.1%');
});
test('trained digit eight drives the output dots in both architectures', () => {
  for(const model of [new NeuralModel(),new NeuralModel(187,[35,64,48,32,16,3])]) {
    for(let i=0;i<900;i++) model.trainBatch(12,.07);
    const probabilities=model.forward(TEMPLATES[2]).probabilities;
    assert.ok(probabilities[2]>.98);
    assert.deepEqual(outputDotCounts(probabilities,model.shape.at(-2)),[0,0,model.shape.at(-2)]);
  }
});
