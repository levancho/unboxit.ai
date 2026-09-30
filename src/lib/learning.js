export const points = [[.08,.18],[.14,.24],[.22,.22],[.28,.34],[.37,.33],[.43,.48],[.51,.45],[.58,.59],[.65,.6],[.72,.7],[.82,.71],[.89,.84]];
export const initialModel = {slope: -.3, bias: .85, rounds: 0};
export function loss(model) {
  return Math.sqrt(points.reduce((sum, [x,y]) => sum + (model.slope*x+model.bias-y)**2, 0)/points.length)*100;
}
export function trainStep(model) {
  let ds = 0, db = 0;
  for (const [x,y] of points) {const error = model.slope*x+model.bias-y; ds += 2*error*x/points.length; db += 2*error/points.length;}
  return {slope: model.slope-.35*ds, bias: model.bias-.35*db, rounds: model.rounds+1};
}
export const contexts = {
  cat: {sentence:'The cat sat on the',words:['mat','sofa','moon'],weights:[.65,.3,.05]},
  space: {sentence:'The astronaut floated toward the',words:['station','moon','sofa'],weights:[.6,.36,.04]},
  food: {sentence:'The baker took the bread out of the',words:['oven','pan','ocean'],weights:[.82,.16,.02]},
};
export function probabilitiesAt(weights, temperature) {
  const t = .2 + temperature/100*1.8;
  const values = weights.map(p => p**(1/t));
  const total = values.reduce((sum,p) => sum+p,0);
  return values.map(p => p/total);
}
export function sample(probabilities, random = Math.random()) {
  for (let i=0; i<probabilities.length-1; i++) {random -= probabilities[i]; if(random<0)return i;}
  return probabilities.length-1;
}
