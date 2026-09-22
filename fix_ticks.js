const fs = require('fs');
const path = require('path');
const jsDir = path.join('client', 'src', 'js');
fs.readdirSync(jsDir).forEach(f => { 
    if(f.endsWith('.js')){ 
        let c = fs.readFileSync(path.join(jsDir, f), 'utf8'); 
        c = c.replace(/'\.\/([a-z-]+)\.html\?id=\$\{/g, '`./$1.html?id=${'); 
        c = c.replace(/'\.\/([a-z-]+)\.html\?id=\$\{([^}]+)\}&verify_error=1`/g, '`./$1.html?id=${$2}&verify_error=1`');
        fs.writeFileSync(path.join(jsDir, f), c); 
    } 
});
