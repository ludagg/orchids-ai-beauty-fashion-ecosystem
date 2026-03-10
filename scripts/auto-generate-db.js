const { spawn } = require('child_process');

const child = spawn('bun', ['run', 'drizzle-kit', 'generate'], {
  stdio: ['pipe', 'inherit', 'inherit']
});

const interval = setInterval(() => {
  child.stdin.write('\r');
}, 500);

child.on('close', (code) => {
  clearInterval(interval);
  process.exit(code);
});
