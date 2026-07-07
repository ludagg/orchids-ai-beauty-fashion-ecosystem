const { spawn } = require('child_process');

const child = spawn('bun', ['run', 'drizzle-kit', 'generate'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

child.stdout.on('data', (data) => {
  const str = data.toString();
  process.stdout.write(str);

  // Look for the interactive prompt
  if (str.includes('Is short_description column in products table created or renamed')) {
    // Send Enter (carriage return + newline) to select the first option
    child.stdin.write('\n');
  }
});

child.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
