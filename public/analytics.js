// Public measurement identifiers. Never collect demo input or drawing contents.
if (['unboxit.ai', 'www.unboxit.ai', 'unboxit-ai.snowy-rain-00a8.workers.dev'].includes(location.hostname)) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-PT6PWGJ5G5');
  const google = document.createElement('script');
  google.async = true;
  google.src = 'https://www.googletagmanager.com/gtag/js?id=G-PT6PWGJ5G5';
  document.head.appendChild(google);
  const cloudflare = document.createElement('script');
  cloudflare.type = 'module';
  cloudflare.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  cloudflare.dataset.cfBeacon = JSON.stringify({token: 'd073115706004df99422e177a03dc7ec'});
  document.head.appendChild(cloudflare);
}
