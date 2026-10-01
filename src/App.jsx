import Introduction from './components/Introduction';
import Header from './components/Header';
import TrainingLab from './components/TrainingLab';
import PredictionLab from './components/PredictionLab';
import Quiz from './components/Quiz';
import Films from './components/Films';
import NeuralExplorer from './components/NeuralExplorer';
import DiscoveryLab from './components/DiscoveryLab';
export default function App(){ return <>
<a className="skip" href="#learn">{"Skip to lessons"}</a>
<Header /><main><Introduction /><div id="chapters"><TrainingLab /><div className="band"><PredictionLab /></div>
<section className="network-lesson" id="network" aria-labelledby="network-title">
<div className="section-head"><div><span className="section-number">READY TO LOOK A LITTLE CLOSER?</span><h2 id="network-title">Look inside a<br />neural network.</h2></div><p>A neural network is one way AI learns patterns. Start in Beginner mode: pick a digit, press “Teach the network,” and watch its guesses change. Advanced mode is optional.</p></div>
<NeuralExplorer />
<details className="network-explanation"><summary>About this experiment and its limits</summary><p>Two real neural networks run in your browser. Beginner has 68 neurons; Advanced has 198. Each keeps its own training progress. The 3D layout and signal timing are illustrations. These models learn small, synthetic examples of 0, 1, and 8—not general handwriting. Their scores are predictions, not guarantees.</p></details>
</section><DiscoveryLab /><Films /><div className="band"><section className="section" id="reality"><div className="section-head"><div><span className="section-number">{"04 / KEEP YOUR HUMAN BRAIN SWITCHED ON"}</span>
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
<div className="footer-support"><a className="coffee-link" href="https://ko-fi.com/l3vcoffe" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee on Ko-fi (opens in a new tab)"><span aria-hidden="true">☕</span> Buy me a coffee</a><small className="build-credit">Built with Astra</small></div>
</footer>

</>; }
