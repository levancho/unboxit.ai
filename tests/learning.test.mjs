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
