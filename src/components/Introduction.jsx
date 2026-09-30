export default function Introduction() {
  return (
    <section className="welcome" id="learn" aria-labelledby="welcome-title">
      <div className="welcome-main">
        <span className="eyebrow"><span className="tiny-line" />AI EXPLAINED FOR EVERYDAY PEOPLE</span>
        <h1 id="welcome-title">Understand AI.<br /><em>Start with curiosity.</em></h1>
        <p className="welcome-description">UnboxIt is a free, hands-on guide to how artificial intelligence works. Short videos and small experiments help you understand how AI learns, makes predictions, and gets things wrong.</p>
        <p className="welcome-audience"><strong>Who is it for?</strong> Curious beginners, students, parents, and anyone who uses AI and wants to understand what’s happening behind the screen. No coding or math background needed.</p>
        <div className="welcome-actions">
          <a className="button orange" href="#playground">Start with one simple experiment <span aria-hidden="true">↗</span></a>
          <a className="welcome-video" href="#films">Prefer to watch? Start with a short film →</a>
        </div>
        <p className="welcome-reassurance">Free to explore · No sign-up · Learn at your own pace</p>
      </div>
      <aside className="welcome-guide" id="about" aria-labelledby="mission-title">
        <span className="section-number">OUR MISSION</span>
        <h2 id="mission-title">Make AI easier<br />to understand.</h2>
        <p>We want more people to feel informed, ask better questions, and know when to question an AI answer.</p>
        <div className="welcome-guide-divider" />
        <h3>A little less mystery, in three steps.</h3>
        <ol>
          <li><span aria-hidden="true">01</span><div><strong>Try something small.</strong><p>Press a button. Change an example. See what happens.</p></div></li>
          <li><span aria-hidden="true">02</span><div><strong>Understand the idea.</strong><p>Plain-language explanations connect each experiment to how AI works.</p></div></li>
          <li><span aria-hidden="true">03</span><div><strong>Explore when you’re ready.</strong><p>The 3D network and advanced controls are there when you want to go deeper.</p></div></li>
        </ol>
      </aside>
      <div className="welcome-outcomes" aria-label="What you will learn">
        <span>YOU’LL DISCOVER</span>
        <p>How AI learns from examples</p><p>How it chooses an answer</p><p>Why it can still be wrong</p>
      </div>
    </section>
  );
}
