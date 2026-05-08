const fs = require('fs');
const path = require('path');

function scanDir(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file === 'node_modules' || file === '.git' || file === '.next') continue;
            results = results.concat(scanDir(fullPath));
        } else {
            if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

const files = scanDir('src');
console.log(`Found ${files.length} ts/tsx files in src/`);
