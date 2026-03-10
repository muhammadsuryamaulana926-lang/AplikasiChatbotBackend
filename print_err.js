const fs = require('fs');
const errs = JSON.parse(fs.readFileSync('./core/adaptive-learning-data.json', 'utf8') || '{}');
console.log(JSON.stringify(errs.errors || [], null, 2));
