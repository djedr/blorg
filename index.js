'use strict';

var fs = require('fs');

let postsInputDir = 'posts/';
let postsOutputDir = '../djedr.github.io/posts/';
console.log(process.argv);

var files = fs.readdirSync(postsInputDir);
console.log(files);

files.forEach((fileName) => {
    let content = fs.readFileSync(postsInputDir + fileName, { encoding: 'utf-8' });
    let linkBackHome = `<a href="../index.html">Go back home</a>`;
    let processedContent =
`
<!doctype html>
<meta charset="utf-8" />
<pre>${linkBackHome}
${(new Date()).toISOString().slice(0, 10)}
${content}
${linkBackHome}</pre>
`;
    console.log(processedContent);
});

