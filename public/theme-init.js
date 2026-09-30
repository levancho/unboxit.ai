// Apply the stored preference before React renders to avoid a theme flash.
(() => {
  let saved;
  try { saved = localStorage.getItem('unboxit-theme'); } catch {}
  const theme = ['day','night'].includes(saved) ? saved : matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light';
})();
