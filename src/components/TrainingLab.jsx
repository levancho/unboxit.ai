import { useTraining } from '../hooks/useTraining';
export default function TrainingLab(){
const { canvasRef, rounds, error, busy, status, train, reset } = useTraining();
return (<section className="section split" id="playground"><div className="lesson-copy"><span className="section-number">{"01 / LEARNING BY DOING"}</span>
<h2>{"Practice makes"}<br /><span style={{"color":"var(--blue)"}}>{"better predictions."}</span>
</h2>
<p>{"Imagine guessing how many scoops of ice cream a shop will sell as the day gets hotter. You could start with a wild guess. Or learn from past days."}</p>
<p>{"Each dot is an example. The line is our tiny model’s prediction. Press "}<strong>{"Train"}</strong>
{" and watch it adjust to make smaller mistakes."}</p>
<div className="callout">{"That’s machine learning: use examples to improve a prediction rule. Real systems can learn much more complex patterns."}</div>
</div>
<div className="lab"><div className="lab-header"><span>{"THE TINY LEARNING LAB"}</span>
<span className="tag">{"TRY IT YOURSELF"}</span>
</div>
<canvas className="plot" id="training" aria-label="Scatter plot of temperature and ice cream sales, with a line that improves as the model trains" ref={canvasRef}></canvas>
<div className="lab-controls"><div className="metrics"><div>{"Training rounds"}<strong id="rounds">{rounds}</strong>
</div>
<div>{"Typical error"}<strong id="error">{error.toFixed(1)}{" scoops"}</strong>
</div>
</div>
<div><button id="train" className="button orange" onClick={train} disabled={busy}>{"Train 10 rounds"}</button>
<button id="reset" className="button ghost" onClick={reset}>{"Reset"}</button>
</div>
</div>
<p id="training-status" className="note" aria-live="polite">{status}</p>
<p className="note">{"Illustrative data. A real model must also be tested on examples it hasn’t trained on."}</p>
</div>
</section>
);
}
