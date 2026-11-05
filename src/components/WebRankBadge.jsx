import { useEffect } from 'react';

// WebRank counter (site 7) with its live badge. The script counts pageviews and
// fills #webrank-badge. It is added after React mounts the footer, because the
// client render replaces the prerendered footer and would drop an earlier badge.
const KEY = '403500812ef037d102d0';
const SRC = `https://webrank.ge/counter/${KEY}.js?badge=aurora`;

export default function WebRankBadge() {
  useEffect(() => {
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const script = document.createElement('script');
    script.src = SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return <>
    <div id="webrank-badge" className="webrank-badge"></div>
    <noscript><a href="https://webrank.ge/site/7"><img src={`https://webrank.ge/counter/${KEY}/badge.svg?count=1`} alt="WebRank" width="88" height="31" /></a></noscript>
  </>;
}
