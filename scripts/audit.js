const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

const checkDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) return false;
  const files = fs.readdirSync(dirPath);
  return files.length > 0;
};

const hasTests = (dirPath) => {
    if (!fs.existsSync(dirPath)) return false;
    let found = false;
    const search = (currentPath) => {
        const files = fs.readdirSync(currentPath);
        for(const file of files) {
            const fullPath = path.join(currentPath, file);
            if (fs.statSync(fullPath).isDirectory()) {
                search(fullPath);
            } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
                found = true;
                return;
            }
        }
    }
    search(dirPath);
    return found;
};

console.log("Pages & Écrans:", checkDir(path.join(projectRoot, 'src/app')) ? '✅' : '❌');
console.log("Composants UI:", checkDir(path.join(projectRoot, 'src/components')) ? '✅' : '❌');
console.log("Authentification (API):", checkDir(path.join(projectRoot, 'src/app/api/auth')) ? '✅' : '❌');
console.log("API & Backend:", checkDir(path.join(projectRoot, 'src/app/api')) ? '✅' : '❌');
console.log("Base de données (Schema):", checkDir(path.join(projectRoot, 'src/db/schema')) ? '✅' : '❌');
console.log("Tests (src/lib):", hasTests(path.join(projectRoot, 'src/lib')) ? '✅' : '❌');
