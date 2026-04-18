const { spawn } = require('child_process');

const proc = spawn('bun', ['run', 'drizzle-kit', 'generate'], { stdio: ['pipe', 'inherit', 'inherit'] });

// Simply send enter characters continuously to default to first option
const interval = setInterval(() => {
  proc.stdin.write('\r\n');
}, 500);

proc.on('close', (code) => {
  clearInterval(interval);
  process.exit(code);
});
