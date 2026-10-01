import { usePreferences } from '../hooks/usePreferences';
export default function Header(){
const { theme, toggleTheme, paused, toggleMotion } = usePreferences();
return (<header><a className="brand" href="#"><span className="brand-icon">{"aı"}</span>
{" UNBOXIT.AI"}</a>
<nav aria-label="Main navigation"><a href="#playground">{"Start here"}</a>
<a href="#films">{"Watch"}</a>
<a href="#network">{"Explore"}</a>
<a href="#about">{"Our mission"}</a>
</nav>
<div className="header-actions"><button id="theme-toggle" className="theme-toggle" role="switch" aria-label="Night mode" aria-checked={theme === "night"} onClick={toggleTheme} title={theme === "night" ? "Switch to day mode" : "Switch to night mode"}><span aria-hidden="true">{theme === "night" ? "☾" : "☀"}</span><span>{theme === "night" ? "Night" : "Day"}</span><span className="theme-track" aria-hidden="true" /></button>
<button className="motion" id="motion" aria-pressed={paused} onClick={toggleMotion}>{paused ? "Resume motion" : "Pause motion"}</button>
</div>
<a className="coffee-link" href="https://ko-fi.com/l3vcoffe" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee on Ko-fi (opens in a new tab)"><span aria-hidden="true">☕</span> Buy me a coffee</a>
</header>
);
}
