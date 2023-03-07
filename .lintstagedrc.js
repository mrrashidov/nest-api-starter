module.exports = {
    '*.{vue,js,jsx,cjs,mjs,ts,tsx,cts,mts}': () => ['pnpm lint'],
    '*.json': 'pnpm format'
  }