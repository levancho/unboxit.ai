import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 500);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  function goUp() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('paused');
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
    document.querySelector('header .brand')?.focus({ preventScroll: true });
  }
  return visible && <button className="back-to-top" onClick={goUp} aria-label="Back to top" title="Back to top"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7M12 5v14" /></svg></button>;
}
