'use strict';
const fs = require("fs");

function buildProjects() {
	let inputFileName = "projects";

	let inputFileContent = fs.readFileSync(inputFileName, { encoding: "utf-8" });

	let lines = inputFileContent.split("\n");

	let html = lines.map((line) => {
		let m;
		
		// make it html-safe
		line = line.replace(/</g, `&lt;`);
		
		// make links clickable
		line = line.replace(/(https?:\/\/[^ ]+)/g, `<a href="$&">$&</a>`);
		
		m = line.match(/^\*\*\* (.*) \*\*\*/);
		if (m) {
			return `<b>${m[1]}</b>`;
		} else if ((m = line.match(/([^:]*:)(.*)/))) {
			let b = m[1];
			if (b === "Project:") b = `<b>${b}</b>`;
			return `<span style="color: gray">${b}</span>${m[2]}`;
		}
		return line;
	});

	let projectsList = `<pre class="pre-serif">${html.join("\n")}</pre>`;
	return projectsList;
}

module.exports = buildProjects;

//let projectsTemplate = fs.readFileSync('projects.template.html', { encoding: "utf-8" });

//let projectsOutput = projectsTemplate.replace('$[projects-list]', projectsList);

//fs.writeFileSync("../djedr.github.io/projects.html", projectsOutput);
//console.log(html);
