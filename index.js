const fs = require('fs');
export function createNewApp() {
    fs.appendFile('newFile.html', '<html></html>', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}
