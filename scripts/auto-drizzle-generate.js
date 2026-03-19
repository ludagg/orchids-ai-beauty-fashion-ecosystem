const { spawn } = require('child_process');

const proc = spawn('bun', ['run', 'drizzle-kit', 'generate'], {
  stdio: ['pipe', 'inherit', 'inherit'],
});

const intervalId = setInterval(() => {
  if (proc.stdin.writable) {
    proc.stdin.write('\r');
  }
}, 500);

proc.on('close', (code) => {
  clearInterval(intervalId);
  process.exit(code);
});
