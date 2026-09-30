import { useEffect, useRef, useState } from 'react';
import { initialModel, loss, points, trainStep } from '../lib/learning';

export function useTraining() {
  const canvasRef = useRef(null);
  const timer = useRef(null);
  const current = useRef({...initialModel});
  const [model, setModel] = useState(current.current);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('The starting line is a poor fit. Help it learn from the dots.');
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const canvas = canvasRef.current;
    function draw() {
      const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio,2);
      canvas.width = w*dpr; canvas.height = h*dpr;
      const ctx = canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
      const day = document.documentElement.dataset.theme === 'day';
      const px = x => 40+x*(w-60), py = y => h-37-y*(h-65);
      ctx.clearRect(0,0,w,h); ctx.font='11px Arial'; ctx.fillStyle=day?'#536078':'#aaaabd';
      for(let i=0;i<=4;i++) {const y=i/4;ctx.beginPath();ctx.moveTo(40,py(y));ctx.lineTo(w-20,py(y));ctx.strokeStyle=day?'#dce3ef':'#333340';ctx.stroke();ctx.fillText(Math.round(y*100),7,py(y)+4);}
      ctx.fillText('Scoops sold',40,13);ctx.fillText('Cooler ← Temperature → Hotter',Math.max(40,w/2-80),h-8);
      ctx.save();ctx.beginPath();ctx.rect(40,20,w-60,h-57);ctx.clip();ctx.beginPath();ctx.moveTo(px(0),py(model.bias));ctx.lineTo(px(1),py(model.slope+model.bias));ctx.strokeStyle=day?'#b43b20':'#fa7956';ctx.lineWidth=3;ctx.stroke();
      for(const [x,y] of points) {ctx.beginPath();ctx.moveTo(px(x),py(y));ctx.lineTo(px(x),py(model.slope*x+model.bias));ctx.strokeStyle='#7886ff44';ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(px(x),py(y),5,0,Math.PI*2);ctx.fillStyle=day?'#495fcb':'#9aa6ff';ctx.fill();}
      ctx.restore();
    }
    const observer = new ResizeObserver(draw); observer.observe(canvas);
    document.addEventListener('themechange', draw);draw();
    return () => {observer.disconnect();document.removeEventListener('themechange',draw);};
  }, [model]);
  function train() {
    if(timer.current !== null) return;
    setBusy(true);let remaining=10;
    function step() {
      do {current.current=trainStep(current.current);remaining--;} while(remaining>0 && document.body.classList.contains('paused'));
      setModel(current.current);
      if(remaining>0)timer.current=setTimeout(step,80);
      else {timer.current=null;setBusy(false);setStatus(current.current.rounds<40?'The error is shrinking. Train again to improve the fit.':'The line is learning the trend. Some variation remains: real data is rarely perfect.');}
    }
    step();
  }
  function reset() {clearTimeout(timer.current);timer.current=null;current.current={...initialModel};setModel(current.current);setBusy(false);setStatus('The starting line is a poor fit. Help it learn from the dots.');}
  return {canvasRef,rounds:model.rounds,error:loss(model),busy,status,train,reset};
}
