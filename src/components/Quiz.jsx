import { useState } from 'react';
export default function Quiz(){
const [answer, setAnswer] = useState(null);
return (<div className="quiz"><div><span className="section-number" style={{"color":"#3b511b"}}>{"THE 10-SECOND CHECK"}</span>
<h3>{"An AI sounds very sure."}<br />{"Does that make it right?"}</h3>
</div>
<div><div className="quiz-options"><button data-answer="yes" aria-pressed={answer === "yes"} onClick={() => setAnswer("yes")}>{"Yes, confidence means accuracy"}</button>
<button data-answer="no" aria-pressed={answer === "no"} onClick={() => setAnswer("no")}>{"No, I should check the evidence"}</button>
</div>
<p id="quiz-feedback" aria-live="polite">{answer === null ? "Pick your answer." : answer === "no" ? "Exactly. Confident wording is not evidence. Check the source, the facts, and the context." : "Not quite. Models can sound confident while making things up. Evidence matters more than tone."}</p>
</div>
</div>
);
}
