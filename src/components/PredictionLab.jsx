import { usePrediction } from '../hooks/usePrediction';
export default function PredictionLab(){
const { context, setContext, temperature, setTemperature, current, probabilities, choice, predict } = usePrediction();
return (<section className="section" id="prediction"><div className="section-head"><div><span className="section-number">{"02 / THE NEXT PIECE OF THE PUZZLE"}</span>
<h2>{"How does AI"}<br />{"finish your sentence?"}</h2>
</div>
<p>{"A language model uses context to predict the next token—a word or piece of a word. Then it does it again."}</p>
</div>
<div className="predict-layout"><div className="lab"><label className="input-label" htmlFor="context">{"Choose a context"}</label>
<select id="context" value={context} onChange={e => setContext(e.target.value)}><option value="cat">{"An ordinary afternoon"}</option>
<option value="space">{"A story set in space"}</option>
<option value="food">{"Something delicious"}</option>
</select>
<div className="prompt" id="sentence">{current.sentence}{" "}<span className="blank">{choice === null ? "…" : current.words[choice]}</span></div>
<div id="probabilities">{current.words.map((word, i) => <div className="probability" key={word}><span>{word}</span><div className="bar"><i style={{width: `${probabilities[i] * 100}%`}} /></div><b>{Math.round(probabilities[i] * 100)}%</b></div>)}</div>
<button id="predict" className="button orange" onClick={predict}>{"Predict the next word"}</button>
<p className="note">{"An illustrative simulation with made-up probabilities, not a live language model."}</p>
</div>
<div><div className="range-head"><label htmlFor="temperature">{"How surprising should it be?"}</label>
<output id="temperature-label" htmlFor="temperature">{temperature < 30 ? "Predictable" : temperature < 70 ? "Balanced" : "Surprising"}</output>
</div>
<input id="temperature" type="range" min="0" max="100" value={temperature} onChange={e => setTemperature(Number(e.target.value))} /><div className="range-ends"><span>{"More predictable"}</span>
<span>{"More varied"}</span>
</div>
<p className="note">{"This represents “temperature.” Higher settings spread probability across more choices. They don’t make a model smarter or more truthful."}</p>
<div className="steps"><div className="step"><span>{"01"}</span>
<div><h3>{"Read the context"}</h3>
<p>{"The preceding text changes which continuation makes sense."}</p>
</div>
</div>
<div className="step"><span>{"02"}</span>
<div><h3>{"Score the possibilities"}</h3>
<p>{"The model assigns probabilities to possible next tokens."}</p>
</div>
</div>
<div className="step"><span>{"03"}</span>
<div><h3>{"Pick and repeat"}</h3>
<p>{"The chosen token becomes part of the context for the next one."}</p>
</div>
</div>
</div>
<p id="prediction-result" className="prediction-result" aria-live="polite">{choice === null ? "Your next word is waiting. Try a prediction." : <>Selected <b>“{current.words[choice]}”</b> from a {Math.round(probabilities[choice] * 100)}% chance. Try again: sampling can choose a different word.</>}</p>
</div>
</div>
</section>
);
}
