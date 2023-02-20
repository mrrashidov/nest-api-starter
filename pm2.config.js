module.exports = {
  apps: [
    {
      name: '@nest-starter',
      script: './dist/src/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: true,
    },
  ],
};