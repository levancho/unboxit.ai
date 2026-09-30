import{NeuralModel,SHAPE as BASIC_SHAPE,DIGITS,TEMPLATES}from'./neural-model.mjs';
const q=s=>document.querySelector(s),root=q('#explorer'),canvas=q('#network3d'),ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let SHAPE=BASIC_SHAPE;const models={beginner:new NeuralModel(),advanced:new NeuralModel(187,[35,64,48,32,16,3])},losses={beginner:null,advanced:null};let mode='beginner',disabledNeuron=null,lastLoss=null,layout='rings',flowOn=!reduced,flowSpeed=1,flowStart=0;let model=models.beginner,input=TEMPLATES[0].slice(),result=model.forward(input),yaw=-.75,pitch=.24,zoom=1,spread=1,auto=!reduced,running=false,paused=reduced,selected=null,hovered=null,points=[],edges=[],projected=[],w=800,h=450,last=0,clock=0,pulse=-99,drag=null,drawValue=1,drawing=false,visible=true;
let names=[];
function build(){
 points=[];edges=[];names=SHAPE.map((n,l)=>l===0?'Input pixels':l===SHAPE.length-1?'Prediction':'Hidden layer '+l);
 const offsets=[];let offset=0;
 SHAPE.forEach((n,l)=>{
  offsets.push(offset);offset+=n;
  const cols=l===0?5:l===SHAPE.length-1?1:Math.ceil(Math.sqrt(n)),rows=Math.ceil(n/cols);
  for(let i=0;i<n;i++){
   let x=(l-(SHAPE.length-1)/2)*(mode==='advanced'?1.72:2.6),y,z;
   if(mode==='advanced'&&l>0&&l<SHAPE.length-1&&layout==='rings'){
    const ring=Math.floor(i/16),angle=(i%16)/16*Math.PI*2+ring*.16;
    const radius=1.12+ring*.22;y=Math.cos(angle)*radius;z=Math.sin(angle)*radius;x+=(ring-1.5)*.12;
   }else{y=((rows-1)/2-Math.floor(i/cols))*(l===SHAPE.length-1?.7:.37);z=(i%cols-(cols-1)/2)*.44}
   points.push({l,i,x,y,z});
  }
 });
 for(let l=0;l<SHAPE.length-1;l++)for(let j=0;j<SHAPE[l+1];j++)for(let i=0;i<SHAPE[l];i++)edges.push({a:offsets[l]+i,b:offsets[l+1]+j,l,i,j});
 q('#nn-count').textContent=points.length+' neurons · '+edges.length.toLocaleString()+' connections';
 q('.stage-badge').textContent=SHAPE.join(' → ');
 q('#nn-architecture').textContent=SHAPE.join(' · ');
 q('#nn-parameters').textContent=(edges.length+SHAPE.slice(1).reduce((a,b)=>a+b,0)).toLocaleString();
 q('#nn-layer').innerHTML=names.map((n,l)=>`<option value="${l}">${n}</option>`).join('');
}build();
function resize(){w=canvas.clientWidth;h=canvas.clientHeight;const dpr=Math.min(devicePixelRatio,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}new ResizeObserver(resize).observe(canvas);
function project(p){let x=p.x*spread,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);let xx=x*cy+p.z*sy,zz=-x*sy+p.z*cy,yy=p.y*cp-zz*sp;zz=p.y*sp+zz*cp;let scale=Math.min(w/(mode==='advanced'?12.3:9.6),h/6)*zoom*10/(10+zz);return{x:w/2+xx*scale,y:h/2-yy*scale,z:zz,s:scale}}
function active(p){return result.acts[p.l][p.i]}
const palette=['165,180,255','85,232,246','124,143,255','198,124,255','247,139,201','215,250,120'];
function color(p){return p.l===SHAPE.length-1?'215,250,120':active(p)<0?'250,126,86':mode==='advanced'?palette[p.l]:'124,160,255'}
function path3D(vertices,stroke,width=1,close=false){
 ctx.beginPath();vertices.forEach((v,i)=>{let p=project(v);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});if(close)ctx.closePath();ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();
}
function scenery(){
 if(mode!=='advanced')return;
 // Each luminous ring encloses one actual computational layer.
 for(let l=1;l<SHAPE.length-1;l++){
  const x=(l-(SHAPE.length-1)/2)*1.72,verts=[];
  for(let j=0;j<=80;j++){let a=j/80*Math.PI*2;verts.push({x,y:Math.cos(a)*2.03,z:Math.sin(a)*2.03})}
  path3D(verts,`rgba(${palette[l]},.22)`);
  const sweep=[];
  for(let j=0;j<=18;j++){let a=clock*.35+l+j/80*Math.PI*2;sweep.push({x,y:Math.cos(a)*2.03,z:Math.sin(a)*2.03})}
  path3D(sweep,`rgba(${palette[l]},.8)`,2);
 }
 for(let i=0;i<64;i++){const x=((i*73)%101)/101*w,y=((i*47)%97)/97*h;ctx.fillStyle=`rgba(150,184,255,${.06+.10*(1+Math.sin(clock*.4+i))/2})`;ctx.fillRect(x,y,1.3,1.3)}
}
function render(t){
 requestAnimationFrame(render);let dt=Math.min((t-last)/1000,.04);last=t;if(!visible||!w||!h)return;
 if(!paused){clock+=dt;if(auto&&!drag)yaw+=dt*(mode==='advanced'?.12:.18)}
 ctx.clearRect(0,0,w,h);
 const glow=ctx.createRadialGradient(w*.53,h*.52,5,w*.53,h*.52,w*.6);glow.addColorStop(0,mode==='advanced'?'#334b7644':'#242d514d');glow.addColorStop(1,'#0d101900');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 for(let x=-6;x<=6;x++)path3D([{x,y:-2.25,z:-3},{x,y:-2.25,z:3}],'#4d689015');
 for(let z=-3;z<=3;z++)path3D([{x:-6,y:-2.25,z},{x:6,y:-2.25,z}],'#4d689015');
 scenery();
 projected=points.map(project);
 const focus=hovered??selected,view=q('#nn-view').value,advanced=mode==='advanced';
 const progress=clock-pulse,cycle=SHAPE.length*.65+1.5;
 const scan=advanced&&flowOn?((clock-flowStart)*flowSpeed)%cycle:progress;
 edges.forEach((e,idx)=>{
  let a=projected[e.a],b=projected[e.b],weight=model.weights[e.l][e.j][e.i],linked=focus===e.a||focus===e.b;
  if(view==='focused'&&focus!=null&&!linked)return;
  let alpha=focus!=null?(linked?.62:.008):view==='weights'?Math.min(.32,.018+Math.abs(weight)*.25):advanced?.027:.07;
  const rgb=weight<0?'249,132,94':advanced?palette[e.l+1]:'123,154,255';
  ctx.strokeStyle=`rgba(${rgb},${alpha})`;ctx.lineWidth=linked?1.5:view==='weights'?Math.min(2,.25+Math.abs(weight)*2):.55;
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  let travel=(scan-e.l*.65)/.65;
  if(travel>=0&&travel<=1&&(advanced?idx%19===0:(e.i+e.j)%3===0)){
   const x=a.x+(b.x-a.x)*travel,y=a.y+(b.y-a.y)*travel,tail=Math.max(0,travel-.09);
   ctx.beginPath();ctx.moveTo(a.x+(b.x-a.x)*tail,a.y+(b.y-a.y)*tail);ctx.lineTo(x,y);ctx.strokeStyle=`rgba(${rgb},.8)`;ctx.lineWidth=1.5;ctx.stroke();
   ctx.fillStyle='#e4faff';ctx.beginPath();ctx.arc(x,y,advanced?1.8:2.3,0,Math.PI*2);ctx.fill();
  }
 });
 [...points.keys()].sort((a,b)=>projected[b].z-projected[a].z).forEach(k=>{
  let p=points[k],v=projected[k],a=Math.abs(active(p)),r=Math.max(2.1,v.s*(p.l===SHAPE.length-1?.14:advanced?.054:.08)),rgb=color(p),lit=scan>=p.l*.65&&scan<p.l*.65+.65;
  const isOff=disabledNeuron?.l===p.l&&disabledNeuron?.i===p.i,halo=lit?6:4;
  const grad=ctx.createRadialGradient(v.x,v.y,0,v.x,v.y,r*halo);grad.addColorStop(0,`rgba(${rgb},${(lit?.36:.12)+a*.22})`);grad.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=grad;ctx.fillRect(v.x-r*halo,v.y-r*halo,r*halo*2,r*halo*2);
  ctx.beginPath();ctx.arc(v.x,v.y,r,0,Math.PI*2);
  const orb=ctx.createRadialGradient(v.x-r*.3,v.y-r*.35,0,v.x,v.y,r);orb.addColorStop(0,`rgba(241,246,255,${lit?1:.5+a*.5})`);orb.addColorStop(.4,`rgba(${rgb},${.4+a*.6})`);orb.addColorStop(1,`rgba(${rgb},.23)`);ctx.fillStyle=orb;ctx.fill();
  if(isOff){ctx.strokeStyle='#fc826d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(v.x-r-3,v.y-r-3);ctx.lineTo(v.x+r+3,v.y+r+3);ctx.stroke()}
  if(k===focus||lit&&(!advanced||p.i%4===0)){ctx.beginPath();ctx.arc(v.x,v.y,r+4,0,Math.PI*2);ctx.strokeStyle=k===focus?'#ffffff':`rgba(${rgb},.45)`;ctx.lineWidth=1;ctx.stroke()}
  if(p.l===SHAPE.length-1){ctx.fillStyle='#d7fa78';ctx.font='600 13px Arial';ctx.fillText(DIGITS[p.i]+'',v.x+r+8,v.y+5)}
 });
 let occupied=[];for(let l=0;l<SHAPE.length;l++){let p=project({x:(l-(SHAPE.length-1)/2)*(advanced?1.72:2.6),y:advanced?-2.45:-1.85,z:0});if(occupied.some(x=>Math.abs(p.x-x)<64))continue;occupied.push(p.x);ctx.font='11px Arial';ctx.textAlign='center';ctx.fillStyle=advanced?`rgb(${palette[l]})`:'#9aa9c8';ctx.fillText(SHAPE[l]+(l===0?' INPUTS':l===SHAPE.length-1?' OUTPUTS':' · H'+l),p.x,p.y);ctx.textAlign='left'}
 if(advanced){
  const layer=Math.min(SHAPE.length-1,Math.max(0,Math.floor(scan/.65)));
  const label=flowOn?names[layer]:'Manual signal';if(q('#nn-flow-stage').textContent!==label)q('#nn-flow-stage').textContent=label;
 }
}
requestAnimationFrame(render);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting}).observe(root);
function probabilities(){let values=result.probabilities.map(v=>Math.round(v*100)),diff=100-values.reduce((a,b)=>a+b,0);values[result.probabilities.indexOf(Math.max(...result.probabilities))]+=diff;DIGITS.forEach((v,i)=>{q('#nn-p'+i).textContent=values[i]+'%';q('#nn-b'+i).style.width=values[i]+'%'});q('#nn-rounds').textContent=model.rounds;inspect()}
function calculate(){result=model.forward(input,disabledNeuron);probabilities()}
function grid(){q('#pixel-grid').innerHTML=input.map((v,i)=>`<button type="button" class="pixel ${v?'on':''}" aria-label="Row ${Math.floor(i/5)+1}, column ${i%5+1}" aria-pressed="${!!v}" data-pixel="${i}"></button>`).join('')}
function paint(el){let i=Number(el.dataset.pixel);input[i]=drawValue;el.classList.toggle('on',!!drawValue);el.setAttribute('aria-pressed',String(!!drawValue));calculate()}
q('#pixel-grid').addEventListener('pointerdown',e=>{if(!e.target.matches('[data-pixel]'))return;e.preventDefault();drawing=true;drawValue=input[Number(e.target.dataset.pixel)]?0:1;paint(e.target)});q('#pixel-grid').addEventListener('pointermove',e=>{if(!drawing)return;let el=document.elementFromPoint(e.clientX,e.clientY);if(el?.matches('[data-pixel]'))paint(el)});q('#pixel-grid').addEventListener('click',e=>{if(e.detail===0&&e.target.matches('[data-pixel]')){drawValue=input[Number(e.target.dataset.pixel)]?0:1;paint(e.target)}});window.addEventListener('pointerup',()=>drawing=false);window.addEventListener('pointercancel',()=>drawing=false);
document.querySelectorAll('[data-digit]').forEach(b=>b.onclick=()=>{input=TEMPLATES[Number(b.dataset.digit)].slice();grid();calculate();send()});q('#nn-clear').onclick=()=>{input=Array(35).fill(0);grid();calculate()};q('#nn-noise').onclick=()=>{for(let j=0;j<4;j++){let i=Math.floor(Math.random()*35);input[i]=1-input[i]}grid();calculate();send()};
function send(){pulse=clock;flowStart=clock;q('#nn-status').textContent=paused?'Prediction calculated. Resume motion to watch the signal.':'Input pixels pass through '+(SHAPE.length-2)+' hidden layers to produce three scores.';calculate()}q('#nn-signal').onclick=send;
q('#nn-train').onclick=()=>{if(running)return;running=true;q('#mode-beginner').disabled=true;q('#mode-advanced').disabled=true;q('#nn-train').disabled=true;q('#nn-reset').disabled=true;let target=model.rounds+300;q('#nn-status').textContent='Learning from noisy examples of 0, 1, and 8…';function step(){for(let i=0;i<15;i++)lastLoss=model.trainBatch(12,Number(q('#nn-rate').value));q('#nn-loss').textContent=lastLoss.toFixed(4);calculate();if(model.rounds<target)requestAnimationFrame(step);else{running=false;q('#mode-beginner').disabled=false;q('#mode-advanced').disabled=false;q('#nn-train').disabled=false;q('#nn-reset').disabled=false;q('#nn-status').textContent='Training complete. Try adding noise or drawing your own 0, 1, or 8. Other digits are outside this model’s training.';pulse=clock}}step()};q('#nn-reset').onclick=()=>{model=models[mode]=new NeuralModel(mode==='advanced'?187:87,SHAPE);disabledNeuron=null;lastLoss=null;q('#nn-loss').textContent='—';calculate();q('#nn-status').textContent='Weights reset. The scores are guesses until you train the network.'};
function inspect(){let box=q('#nn-inspector');let dp=selected==null?null:points[selected];q('#nn-disable').disabled=!dp||dp.l===0||dp.l===SHAPE.length-1;const off=dp&&disabledNeuron?.l===dp.l&&disabledNeuron?.i===dp.i;q('#nn-disable').textContent=off?'Restore neuron':'Switch off neuron';q('#nn-disable').setAttribute('aria-pressed',String(!!off));if(selected==null){box.innerHTML='<div class="inspect-orbit">◎</div><h3>Follow a thought.</h3><p>Select a glowing neuron to inspect its number and the connections feeding into it.</p><small>A neuron is a calculation, not a brain cell.</small>';return}let p=points[selected],a=active(p),z=result.sums[p.l][p.i];q('#nn-layer').value=p.l;fillNeuronList(p.l,p.i);let incoming=p.l?model.weights[p.l-1][p.i].map((weight,i)=>({weight,i,contribution:weight*result.acts[p.l-1][i]})).sort((a,b)=>Math.abs(b.contribution)-Math.abs(a.contribution)).slice(0,3):[];box.innerHTML=`<span class="inspector-eyebrow">${names[p.l]}</span><h3>${p.l===0?'Pixel':p.l===SHAPE.length-1?'Digit '+DIGITS[p.i]:'Neuron'} ${p.l===SHAPE.length-1?'':String(p.i+1).padStart(2,'0')}</h3><div class="activation">${a.toFixed(3)}<small>${p.l===SHAPE.length-1?'Output probability':'Activation'}</small></div><p>${p.l===0?'An illuminated pixel sends 1; a dark pixel sends 0.':p.l===SHAPE.length-1?'The final scores are converted into probabilities across the three possible digits.':'This neuron combines incoming values, adds a bias, and passes the result through a squashing function.'}</p>${p.l>0?`<div class="neuron-math advanced-only"><span>Σ(w × input) + b</span><b>${z.toFixed(3)}</b></div><div class="neuron-math advanced-only"><span>Bias</span><b>${model.biases[p.l-1][p.i].toFixed(3)}</b></div><h4 class="advanced-only">Strongest contributions</h4>${incoming.map(e=>`<div class="contribution advanced-only"><span>N${e.i+1} · w ${e.weight.toFixed(2)}</span><b class="${e.contribution<0?'negative':'positive'}">${e.contribution>=0?'+':''}${e.contribution.toFixed(3)}</b></div>`).join('')}`:''}`}
function fillNeuronList(layer,value=0){let s=q('#nn-neuron');if(s.options.length!==SHAPE[layer]||s.dataset.layer!==String(layer)){s.innerHTML=Array.from({length:SHAPE[layer]},(_,i)=>`<option value="${i}">${Number(layer)===0?'Pixel':'Neuron'} ${i+1}</option>`).join('');s.dataset.layer=layer}s.value=value}
function selectFromMenu(){let layer=Number(q('#nn-layer').value),i=Number(q('#nn-neuron').value);selected=points.findIndex(p=>p.l===layer&&p.i===i);inspect()};q('#nn-layer').onchange=()=>{fillNeuronList(Number(q('#nn-layer').value));selectFromMenu()};q('#nn-neuron').onchange=selectFromMenu;fillNeuronList(0);
function hit(x,y){let best=null,dist=18;projected.forEach((p,i)=>{let dd=Math.hypot(x-p.x,y-p.y);if(dd<dist){best=i;dist=dd}});return best}
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,originX:e.clientX,originY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{let r=canvas.getBoundingClientRect();if(drag){let dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved||=Math.hypot(e.clientX-drag.originX,e.clientY-drag.originY)>5;if(drag.moved){yaw+=dx*.006;pitch=Math.max(-1.1,Math.min(1.1,pitch+dy*.005));auto=false;reflectAuto()}drag.x=e.clientX;drag.y=e.clientY}else hovered=hit(e.clientX-r.left,e.clientY-r.top);canvas.style.cursor=drag?'grabbing':hovered==null?'grab':'pointer'});canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved){let r=canvas.getBoundingClientRect();selected=hit(e.clientX-r.left,e.clientY-r.top);inspect()}drag=null});canvas.addEventListener('pointercancel',()=>drag=null);canvas.addEventListener('pointerleave',()=>hovered=null);
canvas.addEventListener('wheel',e=>{if(document.activeElement!==canvas)return;e.preventDefault();zoom=Math.max(.6,Math.min(1.8,zoom-e.deltaY*.001));q('#nn-zoom').value=zoom},{passive:false});canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','Escape'].includes(e.key)){e.preventDefault();auto=false;reflectAuto();if(e.key==='ArrowLeft')yaw-=.12;if(e.key==='ArrowRight')yaw+=.12;if(e.key==='ArrowUp')pitch=Math.min(1.1,pitch+.1);if(e.key==='ArrowDown')pitch=Math.max(-1.1,pitch-.1);if(e.key==='+')zoom=Math.min(1.8,zoom+.1);if(e.key==='-')zoom=Math.max(.6,zoom-.1);if(e.key==='Escape')expand(false);q('#nn-zoom').value=zoom}});
function reflectAuto(){q('#nn-orbit').setAttribute('aria-pressed',String(auto));q('#nn-orbit').textContent=auto?'Auto-spin: On':'Auto-spin: Off'}q('#nn-orbit').onclick=()=>{auto=!auto;if(auto&&paused)q('#motion').click();reflectAuto()};reflectAuto();q('#nn-zoom').oninput=e=>zoom=Number(e.target.value);q('#nn-spread').oninput=e=>spread=Number(e.target.value);q('#nn-home').onclick=()=>{yaw=-.75;pitch=.24;zoom=1;spread=1;q('#nn-zoom').value=1;q('#nn-spread').value=1};
function expand(value){if(value){root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Neural network explorer full view')}else{root.removeAttribute('role');root.removeAttribute('aria-modal');root.removeAttribute('aria-label')}root.classList.toggle('expanded',value);q('#nn-expand').textContent=value?'Close full view':'Full view';q('#nn-expand').setAttribute('aria-expanded',String(value));document.body.classList.toggle('explorer-open',value);resize();if(!value)q('#nn-expand').focus()}q('#nn-expand').onclick=()=>expand(!root.classList.contains('expanded'));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('expanded'))expand(false)});
document.addEventListener('motionchange',e=>{paused=e.detail.paused;if(paused){auto=false;reflectAuto()}});grid();calculate();

function setMode(next){
 if(running||next===mode)return;
 losses[mode]=lastLoss;mode=next;model=models[mode];SHAPE=model.shape;lastLoss=losses[mode];
 result=model.forward(input);disabledNeuron=null;selected=null;hovered=null;
 root.dataset.mode=mode;
 q('#mode-beginner').setAttribute('aria-pressed',String(mode==='beginner'));q('#mode-advanced').setAttribute('aria-pressed',String(mode==='advanced'));
 q('#nn-view').value='flow';spread=1;zoom=1;yaw=mode==='advanced'?-.48:-.75;pitch=mode==='advanced'?.32:.24;
 q('#nn-spread').value=1;q('#nn-zoom').value=1;q('#nn-loss').textContent=lastLoss==null?'—':lastLoss.toFixed(4);
 build();fillNeuronList(0);calculate();pulse=clock;
 q('#nn-status').textContent=mode==='advanced'?'Deep network: four hidden layers, 7,408 connections. Train this separate model, inspect any neuron, or switch one off to test its influence.':'Pick a digit, teach the network, and watch the signal. Brighter neurons have stronger activations.';
 resize();
}
q('#nn-layout').onchange=e=>{layout=e.target.value;build();inspect()};
q('#nn-flow').onclick=()=>{flowOn=!flowOn;if(flowOn&&paused)q('#motion').click();q('#nn-flow').textContent=flowOn?'Live flow: On':'Live flow: Off';q('#nn-flow').setAttribute('aria-pressed',String(flowOn))};
q('#nn-flow').textContent=flowOn?'Live flow: On':'Live flow: Off';q('#nn-flow').setAttribute('aria-pressed',String(flowOn));
q('#nn-speed').oninput=e=>flowSpeed=Number(e.target.value);
q('#mode-beginner').onclick=()=>setMode('beginner');q('#mode-advanced').onclick=()=>setMode('advanced');q('#nn-rate').oninput=e=>q('#nn-rate-value').textContent=Number(e.target.value).toFixed(2);
q('#nn-disable').onclick=()=>{if(selected==null)return;const p=points[selected];if(p.l===0||p.l===SHAPE.length-1)return;const before=result.probabilities.slice();const restore=disabledNeuron?.l===p.l&&disabledNeuron?.i===p.i;disabledNeuron=restore?null:{l:p.l,i:p.i};calculate();const delta=result.probabilities.map((v,i)=>(v-before[i])*100);q('#nn-status').textContent=(restore?'Neuron restored.':'Neuron switched off.')+' Probability changes: '+DIGITS.map((v,i)=>v+': '+(delta[i]>=0?'+':'')+delta[i].toFixed(2)+' percentage points').join(' · ')};

root.addEventListener('keydown',e=>{if(e.key!=='Tab'||!root.classList.contains('expanded'))return;const items=[...root.querySelectorAll('button:not(:disabled),select,input,[tabindex="0"]')].filter(el=>el.getClientRects().length);const first=items[0],end=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus()}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus()}});
const modelContext=document.modelContext;
if(modelContext?.registerTool){const lifecycle=new AbortController();const readState=()=>({mode,rounds:model.rounds,probabilities:result.probabilities.map((probability,i)=>({digit:DIGITS[i],probability})),disabledNeuron,selectedNeuron:selected==null?null:{layer:points[selected].l,index:points[selected].i}});const registrations=[{name:'read_neural_network',title:'Read neural network',description:'Read the learning explorer’s current mode, training rounds, neuron selection, and output probabilities.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>readState()},{name:'configure_neural_explorer',title:'Configure neural explorer',description:'Choose Beginner or Advanced mode and optionally load a digit template. Updates the visible explorer; does not train or reset weights.',inputSchema:{type:'object',properties:{mode:{type:'string',enum:['beginner','advanced']},digit:{type:'integer',enum:[0,1,8]}},required:['mode'],additionalProperties:false},annotations:{readOnlyHint:false},execute:(value)=>{if(!value||!['beginner','advanced'].includes(value.mode)||Object.keys(value).some(k=>!['mode','digit'].includes(k))||(value.digit!==undefined&&!DIGITS.includes(value.digit)))throw new Error('Choose a supported mode and an optional digit: 0, 1, or 8.');setMode(value.mode);if(value.digit!==undefined){input=TEMPLATES[DIGITS.indexOf(value.digit)].slice();grid();calculate();send()}return readState()}}];for(const tool of registrations){try{Promise.resolve(modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true})}
