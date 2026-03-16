const { execSync } = require('child_process');
try {
  execSync('bun run db:generate', { stdio: 'inherit' });
  execSync('bun run db:push', { stdio: 'inherit' });
} catch (e) {
  console.error("Setup failed");
}
