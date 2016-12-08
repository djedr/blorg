'use strict';

var fs = require('fs');

let postsInputDir = 'posts/';
let postsOutputDir = '../djedr.github.io/posts/';
console.log(process.argv);

let files = fs.readdirSync(postsInputDir);
console.log(files);

let postList = "";

let htmlHead = 
`<!doctype html>
<meta charset="utf-8" />
<title>The Text Files</title>`;

function stylesheet(relative = "") {
    return `<link rel="stylesheet" type="text/css" href="${relative}main.css" />`;
}

let blogTitle =
    '<span class="blog-title" title="click to go back to the front page">' +
    '<a href="../index.html">The Text Files</a></span>';

let linkBackHome = `<a href="../index.html">Go back home</a>`;

files.forEach((fileName) => {
    let content = fs.readFileSync(postsInputDir + fileName, { encoding: 'utf-8' });

    let newLineIndex = content.indexOf('\n');
    if (newLineIndex === -1 || newLineIndex === 0) {
        throw Error("Title ain't right");
    }

    let title = content.substr(0, newLineIndex);
    let body = content.substr(newLineIndex + 1);
    let processedContent =
`
${htmlHead}
${stylesheet('../')}
<pre>${blogTitle}
<span class="date">${(new Date()).toISOString().slice(0, 10)}</span>
<span class="title">${title}</span>
${body}
${linkBackHome}</pre>
`;

    postList += `<a href="posts/${fileName}.html">${title}</a>\n`;

    console.log(processedContent);
});

console.log(postList);

let indexContent = fs.readFileSync('index', { encoding: 'utf-8' });
let processedIndexContent =
`${htmlHead}
${stylesheet()}
${indexContent.replace("$[posts]", postList)}
`;
console.log(processedIndexContent);