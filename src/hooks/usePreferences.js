import { useEffect, useState } from 'react';

export function usePreferences() {
  const [theme, setTheme] = useState(() => typeof document === 'undefined' ? 'day' : document.documentElement.dataset.theme || 'day');
  const [paused, setPaused] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'night' ? '#101014' : '#ffffff');
    document.dispatchEvent(new CustomEvent('themechange', {detail: {theme}}));
  }, [theme]);
  useEffect(() => {
    document.body.classList.toggle('paused', paused);
    document.dispatchEvent(new CustomEvent('motionchange', {detail: {paused}}));
    if (paused) document.querySelectorAll('video').forEach(video => video.pause());
  }, [paused]);
  useEffect(() => {
    const system = matchMedia('(prefers-color-scheme: dark)');
    const change = event => {
      let saved;
      try { saved = localStorage.getItem('unboxit-theme'); } catch {}
      if (!['day', 'night'].includes(saved)) setTheme(event.matches ? 'night' : 'day');
    };
    system.addEventListener('change', change);
    return () => system.removeEventListener('change', change);
  }, []);
  function toggleTheme() {
    const next = theme === 'night' ? 'day' : 'night';
    try { localStorage.setItem('unboxit-theme', next); } catch {}
    setTheme(next);
  }
  return {theme, toggleTheme, paused, toggleMotion: () => setPaused(value => !value)};
}
