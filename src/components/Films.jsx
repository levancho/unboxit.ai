
export default function Films(){
const stopOtherVideos = event => document.querySelectorAll("video").forEach(video => { if(video !== event.currentTarget) video.pause(); });
return (<section className="section" id="films"><div className="section-head"><div><span className="section-number">{"03 / SMALL FILMS. BIG IDEAS."}</span>
<h2>{"See the idea"}<br />{"come to life."}</h2>
</div>
<p>{"Two narrated visual lessons. Hit play, listen, and follow the patterns."}</p>
</div>
<div className="film-grid"><article className="film"><video id="learning-video" controls={true} playsInline={true} preload="metadata" poster="learning.jpg" aria-label="How a neural network learns" onPlay={stopOtherVideos}><source src="learning.mp4?v=narrated-v4" type="video/mp4" /><track kind="captions" src="learning.vtt?v=narrated-v4" srcLang="en" label="English" />{"Your browser does not support this video. Read the transcript below."}</video>
<div className="film-body"><span className="section-number">{"FILM 01 / LEARNING"}</span>
<h3>{"From examples to predictions."}</h3>
<p>{"Follow information through a tiny neural network."}</p>
<details><summary>{"Read the transcript"}</summary>
<p id="learning-transcript">{"AI is not magic. It learns useful patterns from examples. Imagine predicting ice cream sales from the temperature. Each dot is a day we have already seen. At first, our model guesses badly. Training compares its predictions with the real answers, then adjusts its numbers to make the errors smaller. Repeat that process, and a useful pattern starts to emerge. Neural networks do this with many connected layers. The connections have strengths, called weights, that change during training. Once trained, the model can make predictions about new examples. But a good fit to old data is not enough. Test it on new data. And remember: a prediction can still be wrong."}</p>
</details>
</div>
</article>
<article className="film"><video id="prediction-video" controls={true} playsInline={true} preload="metadata" poster="prediction.jpg" aria-label="How a language model predicts text" onPlay={stopOtherVideos}><source src="prediction.mp4?v=narrated-v4" type="video/mp4" /><track kind="captions" src="prediction.vtt?v=narrated-v4" srcLang="en" label="English" />{"Your browser does not support this video. Read the transcript below."}</video>
<div className="film-body"><span className="section-number">{"FILM 02 / GENERATING"}</span>
<h3>{"One little token at a time."}</h3>
<p>{"See how a sentence grows, one prediction after another."}</p>
<details><summary>{"Read the transcript"}</summary>
<p id="prediction-transcript">{"How does AI write a sentence? A language model predicts the next piece of text, called a token. A token might be a whole word, a word part, or punctuation. The text so far provides context. After the cat sat on the, mat might be likely. Moon is possible, but less likely. These example probabilities are made up. The system chooses a token, adds it to the sentence, and predicts again. Repeating this can produce a whole paragraph. A setting called temperature changes how varied the choices are. More variety does not mean more truth. A fluent answer can still be wrong. Treat important answers as a starting point, and check the evidence."}</p>
</details>
</div>
</article>
</div>
</section>
);
}
