import Header from './components/Header';
import TrainingLab from './components/TrainingLab';
import PredictionLab from './components/PredictionLab';
import Quiz from './components/Quiz';
import Films from './components/Films';
import NeuralExplorer from './components/NeuralExplorer';
import DiscoveryLab from './components/DiscoveryLab';
export default function App(){ return <>
<a className="skip" href="#learn">{"Skip to lessons"}</a>
<Header /><main><section className="hero" id="learn"><div className="hero-copy"><div className="eyebrow"><span className="tiny-line"></span>
{"A SMALL GUIDE TO A BIG IDEA"}</div>
<h1>{"AI isn’t magic."}<br />{"Let’s "}<em>{"unbox"}</em>
{" it."}</h1>
<p>{"You don’t need a tech degree. Just a little curiosity."}<br className="desktop" />{" See how machines learn, make predictions, and sometimes get it completely wrong."}</p>
<div className="hero-actions"><a className="button orange" href="#playground">{"Let me try it"}</a>
<a className="text-link" href="#films">{"▶ Watch the mini films"}</a>
</div>
<div className="hero-foot"><span>{"NO JARGON."}</span>
<span>{"NO MATH HOMEWORK."}</span>
<span>{"ALL CURIOSITY."}</span>
</div>
</div>
<NeuralExplorer /><p className="explorer-note">{"Two real neural networks running in your browser. Beginner has 68 neurons; Advanced has 198. Each keeps its own training progress. Signal timing and 3D positions are illustrative. It learns synthetic 5 × 7 examples of three digits—not general handwriting. These scores measure relative preference, not guaranteed accuracy."}</p>
</section>
<div className="chapter-strip"><span>{"01 "}<b>{"Learn from examples"}</b>
</span>
<span>{"02 "}<b>{"Find the pattern"}</b>
</span>
<span>{"03 "}<b>{"Make a prediction"}</b>
</span>
<span>{"04 "}<b>{"Check the answer"}</b>
</span>
</div>
<div id="chapters"><TrainingLab /><div className="band"><PredictionLab /></div>
<DiscoveryLab /><Films /><div className="band"><section className="section" id="reality"><div className="section-head"><div><span className="section-number">{"04 / KEEP YOUR HUMAN BRAIN SWITCHED ON"}</span>
<h2>{"Useful? Absolutely."}<br />{"Infallible? Absolutely not."}</h2>
</div>
<p>{"AI is a broad family of tools. These demos explain machine learning and language generation—two important parts of it."}</p>
</div>
<div className="myths"><article className="myth"><span className="symbol">{"≈"}</span>
<h3>{"Fluent isn’t factual."}</h3>
<p>{"A model can produce a convincing answer that’s false, including invented references. Check important claims against reliable sources."}</p>
</article>
<article className="myth"><span className="symbol">{"◐"}</span>
<h3>{"Examples shape outcomes."}</h3>
<p>{"Missing or biased training examples can lead to unfair or unreliable predictions. Better data and careful testing matter."}</p>
</article>
<article className="myth"><span className="symbol">{"↻"}</span>
<h3>{"Chatting isn’t training."}</h3>
<p>{"Using your conversation as context is different from updating a model’s learned connections. Products may separately store or use chats under their settings."}</p>
</article>
</div>
<Quiz /><p className="sources">{"Curious to go deeper? Explore Google’s "}<a href="https://developers.google.com/machine-learning/crash-course/llm" target="_blank" rel="noopener">{"language model introduction"}</a>
{" and "}<a href="https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent" target="_blank" rel="noopener">{"how training reduces errors"}</a>
{". All interactive examples here are simplified teaching tools."}</p>
</section>
</div>
</div>
</main>
<footer><a className="brand" href="#">{"UNBOXIT.AI"}</a>
<p>{"A little less mystery. A lot more understanding."}</p>
<span>{"MADE FOR CURIOUS HUMANS."}</span>
</footer>

</>; }
