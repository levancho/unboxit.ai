import { useEffect, useRef } from 'react';
import { mountDiscoveryLab } from '../engines/discovery-lab';
export default function DiscoveryLab(){
const rootRef = useRef(null);
useEffect(() => mountDiscoveryLab(rootRef.current), []);
return (<section id="discovery" className="section discovery" ref={rootRef}><div className="section-head"><div><span className="section-number">{"THE DISCOVERY LAB"}</span>
<h2>{"Don’t just read it."}<br />{"Change something."}</h2>
</div>
<p>{"Three small experiments. Move a control, make a prediction, and see what actually happens."}</p>
</div>
<div className="experiment-tabs" role="tablist" aria-label="AI experiments"><button role="tab" id="tab-map" aria-controls="panel-map" aria-selected="true" data-lab="map">{"01 "}<span>{"Teach a boundary"}</span>
</button>
<button role="tab" id="tab-attention" aria-controls="panel-attention" aria-selected="false" tabIndex="-1" data-lab="attention">{"02 "}<span>{"Follow attention"}</span>
</button>
<button role="tab" id="tab-vision" aria-controls="panel-vision" aria-selected="false" tabIndex="-1" data-lab="vision">{"03 "}<span>{"See like a filter"}</span>
</button>
</div>
<div className="experiment-panel" id="panel-map" role="tabpanel" aria-labelledby="tab-map"><div className="experiment-copy"><span className="experiment-kicker">{"PATTERN RECOGNITION"}</span>
<h3>{"You draw."}<br />{"The boundary moves."}</h3>
<p>{"Add blue circles or orange diamonds. A nearest-neighbor classifier colors each location according to the examples closest to it."}</p>
<div className="class-choice" role="group" aria-label="Example class"><button id="class-blue" aria-pressed="true">{"● Blue"}</button>
<button id="class-orange" aria-pressed="false">{"◆ Orange"}</button>
</div>
<label htmlFor="neighbor-count">{"Neighbors to consult "}<output id="neighbor-value">{"3"}</output>
</label>
<input id="neighbor-count" type="range" min="1" max="15" step="2" defaultValue="3" /><p className="control-help">{"One neighbor makes tiny islands. More neighbors smooth the boundary, sometimes hiding small patterns."}</p>
<div className="experiment-actions"><button id="map-undo">{"Undo point"}</button>
<button id="map-reset">{"Reset examples"}</button>
</div>
<p className="experiment-result" id="map-status" role="status"></p>
</div>
<div className="experiment-stage map-stage"><div className="stage-caption"><span>{"DECISION LANDSCAPE"}</span>
<span>{"LIVE · k-NN"}</span>
</div>
<canvas id="decision-map" width="720" height="430" tabIndex="0" aria-label="Decision map. Click to add a point. Keyboard: arrow keys move the crosshair, Enter adds a point, B selects blue, O selects orange."></canvas>
<div className="map-bottom"><span>{"● Blue region"}</span>
<span>{"◆ Orange region"}</span>
<span>{"Click anywhere to teach it"}</span>
</div>
<p className="stage-footnote">{"Coordinates are two imaginary features. Colors show majority votes, not calibrated confidence. Keyboard: arrows + Enter; B / O selects the class."}</p>
</div>
</div>
<div className="experiment-panel" id="panel-attention" role="tabpanel" aria-labelledby="tab-attention" hidden={true}><div className="experiment-copy"><span className="experiment-kicker">{"CONTEXT & ATTENTION"}</span>
<h3>{"Same word."}<br />{"Different meaning."}</h3>
<p>{"Select a word to see an illustrative attention pattern: which other words help interpret it in this sentence?"}</p>
<label htmlFor="attention-example">{"Choose a context"}</label>
<select id="attention-example"><option value="river">{"A river bank"}</option>
<option value="money">{"A money bank"}</option>
</select>
<div className="attention-key"><i></i>
{" Brighter = stronger attention"}</div>
<p className="experiment-result" id="attention-explanation" role="status"></p>
<p className="control-help">{"These weights are hand-authored for teaching. Real transformers learn multiple attention heads over tokens. Attention alone does not explain all model behavior."}</p>
</div>
<div className="experiment-stage attention-stage"><div className="stage-caption"><span>{"A WORD IN CONTEXT"}</span>
<span>{"ILLUSTRATIVE HEAD"}</span>
</div>
<div id="attention-words" className="attention-words" role="group" aria-label="Select a word"></div>
<svg id="attention-arcs" viewBox="0 0 600 160" role="img" aria-label="Attention connections between the selected word and its context"></svg>
<div id="attention-bars" className="attention-bars"></div>
<div className="stage-footnote">{"Each row sums to 100%. Select any word to explore a different row."}</div>
</div>
</div>
<div className="experiment-panel" id="panel-vision" role="tabpanel" aria-labelledby="tab-vision" hidden={true}><div className="experiment-copy"><span className="experiment-kicker">{"COMPUTER VISION"}</span>
<h3>{"From pixels"}<br />{"to patterns."}</h3>
<p>{"Toggle pixels, then slide a tiny filter across the image. Every output cell is a weighted sum of a 3 × 3 patch."}</p>
<label htmlFor="vision-filter">{"Choose a filter"}</label>
<select id="vision-filter"><option value="vertical">{"Vertical edges"}</option>
<option value="horizontal">{"Horizontal edges"}</option>
<option value="blur">{"Gentle blur"}</option>
</select>
<div className="experiment-actions"><button id="vision-shape">{"Load square"}</button>
<button id="vision-clear">{"Clear pixels"}</button>
</div>
<div id="kernel-matrix" className="kernel-matrix" aria-label="Filter weights"></div>
<p id="vision-explanation" className="experiment-result" role="status"></p>
<p className="control-help">{"This is a real convolution-style calculation (cross-correlation, no padding, stride 1). Neural networks can learn filters; these three are predefined."}</p>
</div>
<div className="experiment-stage vision-stage"><div className="stage-caption"><span>{"THE FEATURE DETECTOR"}</span>
<span>{"5 × 5 → 3 × 3"}</span>
</div>
<div className="vision-grids"><div><h4>{"1. Paint the input"}</h4>
<div id="vision-input" className="vision-input" role="group" aria-label="Input pixel grid"></div>
</div>
<span className="vision-times">{"×"}</span>
<div><h4>{"2. Inspect the output"}</h4>
<div id="vision-output" className="vision-output" role="group" aria-label="Filter output grid"></div>
</div>
</div>
<div className="vision-formula" id="vision-formula"></div>
<p className="stage-footnote">{"Click an output cell to highlight its input patch. Orange is negative, blue is positive; brightness shows magnitude."}</p>
</div>
</div>
</section>
);
}
