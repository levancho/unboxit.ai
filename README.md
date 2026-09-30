# UnboxIt.ai

An interactive introduction to artificial intelligence, built with React 19 and
Vite. Production runs directly on **Cloudflare Workers Static Assets** at
https://unboxit.ai.

## Develop

Use Node.js 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
npm test
npm run build
```

## Deploy

```sh
npx wrangler login
npm run deploy
```

`wrangler.jsonc` deploys to the `unboxit-ai` Worker in the owner's Cloudflare
account and binds `unboxit.ai` as a custom domain. Cloudflare manages DNS and TLS
for this binding. No ChatGPT hosting or authentication is required.

The GitHub repository is the source of truth. Pushes do not automatically deploy;
run `npm run deploy` after a verified build. Do not commit authentication tokens.

## Structure

- `src/components/`: React page sections, accessible controls, and media players.
- `src/hooks/`: React state for preferences, training, and next-token prediction.
- `src/engines/`: canvas/neural and discovery renderers mounted through React
  effects; animation frames, observers, and global listeners are cleaned up.
- `src/lib/`: deterministic neural-network and teaching-model calculations.
- `src/styles/`: responsive light/dark visual styles.
- `public/`: narrated films, captions, posters, theme bootstrap, and analytics.
- `tests/`: model independence, training progress, and probability tests.

The neural explorer has separate 68-neuron beginner and 198-neuron advanced
models. It is an educational 5 × 7 digit classifier, not a general handwriting
model. Attention weights and language-model probabilities are illustrative.

## Analytics

Google Analytics: `G-PT6PWGJ5G5`.
Cloudflare Web Analytics: public beacon token
`d073115706004df99422e177a03dc7ec`.
Both load only on the production domain or the production Worker hostname.
No drawings, converter text, or other custom input contents are collected by
this integration. Measurement IDs and beacon tokens are public identifiers.

## Hosting migration

Production moved from ChatGPT Sites to the owner's Cloudflare account on
2026-09-30. The old Sites domain binding was removed and the previous hosted
copy made owner-private. Its historical project remains only as a private
backup; it is not used for the domain, assets, or deployment.
