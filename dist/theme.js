(() => {
  const system = matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = localStorage.getItem('unboxit-theme'); } catch {}
  if (!['day', 'night'].includes(saved)) saved = null;
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'night' ? '#101014' : '#f4f6fb');
    const button = document.querySelector('#theme-toggle');
    if (button) {
      button.setAttribute('aria-checked', String(theme === 'night'));
      button.innerHTML = '<span aria-hidden="true">' + (theme === 'night' ? '☾' : '☀') + '</span><span>' + (theme === 'night' ? 'Night' : 'Day') + '</span><span class="theme-track" aria-hidden="true"></span>';
      button.title = theme === 'night' ? 'Switch to day mode' : 'Switch to night mode';
    }
    document.dispatchEvent(new CustomEvent('themechange', {detail: {theme}}));
  }
  apply(saved || (system.matches ? 'night' : 'day'));
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelector('#theme-toggle').onclick = () => {
      saved = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
      try { localStorage.setItem('unboxit-theme', saved); } catch {}
      apply(saved);
    };
  });
  system.addEventListener('change', e => { if (!saved) apply(e.matches ? 'night' : 'day'); });
})();
