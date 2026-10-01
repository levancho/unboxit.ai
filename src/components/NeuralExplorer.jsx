import { useEffect, useRef } from 'react';
import { mountNeuralExplorer } from '../engines/neural-explorer';
export default function NeuralExplorer(){
const rootRef = useRef(null);
useEffect(() => mountNeuralExplorer(rootRef.current), []);
return (<div className="explorer" id="explorer" data-mode="beginner" ref={rootRef}><div className="explorer-top"><div className="explorer-title"><span>{"LIVE 3D"}</span>
{" Neural network explorer"}</div>
<div className="mode-toggle" role="group" aria-label="Explanation level"><button id="mode-beginner" aria-pressed="true">{"Beginner"}</button>
<button id="mode-advanced" aria-pressed="false">{"Advanced"}</button>
</div>
<small id="nn-count"></small>
<button id="nn-orbit" aria-pressed="true" title="Turn automatic rotation on or off">{"Auto-spin: On"}</button>
<button id="nn-expand" aria-expanded="false">{"Full view"}</button>
</div>
<div className="explorer-body"><aside className="input-dock"><p className="dock-label">{"01 / GIVE IT AN INPUT"}</p>
<div id="pixel-grid" className="pixel-grid" role="group" aria-label="Draw a digit on this 5 by 7 pixel grid"></div>
<div className="digit-templates" role="group" aria-label="Example digits"><button data-digit="0">{"0"}</button>
<button data-digit="1">{"1"}</button>
<button data-digit="2">{"8"}</button>
</div>
<div className="input-tools"><button id="nn-clear">{"Clear"}</button>
<button id="nn-noise">{"Add noise"}</button>
</div>
<small>{"Draw a 0, 1, or 8. Click or paint the squares."}</small>
<button id="nn-train" className="button orange">{"Teach the network"}</button>
<div className="model-info"><span>{"Training rounds"}</span>
<b id="nn-rounds">{"0"}</b>
</div>
<button id="nn-reset">{"Forget training"}</button>
<div className="advanced-only training-settings"><label htmlFor="nn-rate">{"Learning rate "}<output id="nn-rate-value">{"0.07"}</output>
</label>
<input id="nn-rate" type="range" min="0.01" max="0.20" step="0.01" defaultValue="0.07" /><div className="model-info"><span>{"Batch loss"}</span>
<b id="nn-loss">{"—"}</b>
</div>
<small>{"12 noisy samples per batch. Tanh hidden layers, softmax output, cross-entropy loss."}</small>
</div>
</aside>
<div className="network-stage"><div className="stage-hint">{"DRAG TO ORBIT · CLICK A NEURON · ZOOM BELOW"}</div>
<div className="stage-badge">{"35 → 18 → 12 → 3"}</div>
<div className="advanced-only deep-hud"><span>{"DEEP NETWORK "}<b>{"04 HIDDEN LAYERS"}</b>
</span>
<span>{"SIGNAL PATH "}<b id="nn-flow-stage">{"Input pixels"}</b>
</span>
</div>
<canvas id="network3d" tabIndex="0" aria-label="Interactive 3D neural network. Drag to rotate. Use arrow keys to rotate and plus or minus to zoom. Use the neuron menus for accessible inspection."></canvas>
<div className="nn-legend"><span><i></i>
{" Positive activation"}</span>
<span className="negative"><i></i>
{" Negative activation"}</span>
<span>{"Brightness = strength"}</span>
</div>
<p className="output-flow-note">Output dots show the relative prediction scores. Tiny scores may have no dots; all three digits are still calculated.</p>
<div className="deep-controls"><label className="advanced-only">{"Structure"}<select id="nn-layout"><option value="rings">{"Neural rings"}</option>
<option value="lattice">{"Layer lattice"}</option>
</select>
</label>
<button id="nn-flow" className="signal-switch" role="switch" aria-checked="true" aria-label="Signal animation"><span>{"Signal animation"}</span>
<span className="switch-track" aria-hidden="true"></span>
<span id="nn-flow-state" aria-hidden="true">{"On"}</span>
</button>
<label className="advanced-only">{"Flow speed"}<input id="nn-speed" type="range" min="0.3" max="2" step="0.1" defaultValue="1" /></label>
</div>
<div className="camera-controls"><button id="nn-home">{"Reset view"}</button>
<label className="camera-range">{"Zoom"}<input id="nn-zoom" type="range" min="0.6" max="1.8" step="0.05" defaultValue="1" /></label>
<label className="camera-range advanced-only">{"Spread"}<input id="nn-spread" type="range" min="0.7" max="1.5" step="0.05" defaultValue="1" /></label>
<label className="sr-only" htmlFor="nn-view">{"Connections"}</label>
<select id="nn-view" className="advanced-only"><option value="flow">{"Signal flow"}</option>
<option value="weights">{"Weight strength"}</option>
<option value="focused">{"Selected connections"}</option>
</select>
</div>
<div className="prediction-dock" aria-label="Predicted digit probabilities"><span>{"THE MODEL’S GUESS"}</span>
<div className="digit-prob"><div><span>{"Digit 0"}</span>
<b id="nn-p0"></b>
</div>
<div className="bar"><i id="nn-b0"></i>
</div>
</div>
<div className="digit-prob"><div><span>{"Digit 1"}</span>
<b id="nn-p1"></b>
</div>
<div className="bar"><i id="nn-b1"></i>
</div>
</div>
<div className="digit-prob"><div><span>{"Digit 8"}</span>
<b id="nn-p2"></b>
</div>
<div className="bar"><i id="nn-b2"></i>
</div>
</div>
</div>
</div>
<aside className="inspect-dock"><p className="dock-label">{"02 / LOOK INSIDE"}</p>
<div id="nn-inspector" aria-live="polite"></div>
<div className="neuron-picker"><label className="sr-only" htmlFor="nn-layer">{"Inspect layer"}</label>
<select id="nn-layer"><option value="0">{"Input"}</option>
<option value="1">{"Hidden 1"}</option>
<option value="2">{"Hidden 2"}</option>
<option value="3">{"Output"}</option>
</select>
<label className="sr-only" htmlFor="nn-neuron">{"Inspect neuron"}</label>
<select id="nn-neuron"></select>
</div>
<button id="nn-disable" className="advanced-only" disabled={true} aria-pressed="false">{"Switch off neuron"}</button>
<small className="advanced-only">{"An intervention during prediction. Training still uses the complete network."}</small>
</aside>
</div>
<div className="explorer-bottom"><p id="nn-status" aria-live="polite">{"Start with a digit, then teach the network. Its initial weights are random, so its first guesses are unreliable."}</p>
<button id="nn-signal" className="button orange">{"Watch the signal"}</button>
</div>
<div className="advanced-only advanced-summary"><span>{"Architecture "}<b id="nn-architecture">{"35 · 18 · 12 · 3"}</b>
</span>
<span>{"Parameters "}<b id="nn-parameters">{"915"}</b>
</span>
<span>{"Hidden activation "}<b>{"tanh(z)"}</b>
</span>
<span>{"Output "}<b>{"softmax(z)"}</b>
</span>
<span>{"Training "}<b>{"Mini-batch gradient descent"}</b>
</span>
</div>
</div>
);
}
