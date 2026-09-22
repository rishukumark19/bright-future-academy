const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client');
const srcJsDir = path.join(clientDir, 'src', 'js');

const routes = [
    'register', 'checkout', 'status', 'success', 'failed', 'cancelled', 'access-pending', 'help'
];

function replaceLinksInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    if (filePath.endsWith('.html')) {
        // Replace href="/"
        content = content.replace(/href="\/"/g, 'href="./index.html"');
        
        // Replace href="/route"
        for (const route of routes) {
            const regex = new RegExp(`href="/${route}"`, 'g');
            content = content.replace(regex, `href="./${route}.html"`);
        }
    }

    if (filePath.endsWith('.js')) {
        // Replace window.location.href = '/'
        content = content.replace(/location\.href\s*=\s*'\/';/g, 'location.href = \'./index.html\';');
        
        // Replace window.location.href = '/route'
        for (const route of routes) {
            const regex1 = new RegExp(`location\\.href\\s*=\\s*['"\`]\/${route}(['"\`\\?])`, 'g');
            content = content.replace(regex1, `location.href = './${route}.html$1`);
            
            // For template literals like `/status?id=${}`
            const regex2 = new RegExp(`['"\`]\/${route}\\?`, 'g');
            content = content.replace(regex2, `'./${route}.html?`);
            
            // For simple quotes without query
            const regex3 = new RegExp(`['"\`]\/${route}['"\`]`, 'g');
            content = content.replace(regex3, `'./${route}.html'`);
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

// Process HTML files
const files = fs.readdirSync(clientDir);
for (const file of files) {
    if (file.endsWith('.html')) {
        replaceLinksInFile(path.join(clientDir, file));
    }
}

// Process JS files
const jsFiles = fs.readdirSync(srcJsDir);
for (const file of jsFiles) {
    if (file.endsWith('.js')) {
        replaceLinksInFile(path.join(srcJsDir, file));
    }
}
