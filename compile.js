'use strict';

const parse = require("../dj-parser/parse.js");
const fs = require("fs");

let inputFileName = process.argv[2];
let input = fs.readFileSync(inputFileName, { encoding: 'utf-8' });
let ast = parse(input);

function compile(ast, parent) {
	let op = ast[0];
	let str = "";
	let tag;
	let sigil;
	
	// substitute
	if (op.value === '$') {
		tag = ast[1];
		
		str += op.space;
		if (tag.value) {			
			sigil = tag.value[0];
			
			if (sigil === '@') {
				// from attribute
				console.log('ATR PARENT:', parent);
				let a;
				for (let i = 2; i < parent.length; i += 2) {
					a = parent[i];
					if (a.value) {
						if (a.value === tag.value.slice(1)) {
							str += parent[i + 1].value;
							break;
						}
					}
				};
			} else if (sigil === '$') {
				//str += 'CONTENT';
				console.log(ast);
				let i = 2, a;
				for (; i < parent.length; i += 2) {
					a = parent[i];
					
					if (a.value && a.value === '$')
						break;
				}
				if (a && a.value === '$') {
					for (i += 1; i < parent.length; ++i) {
						if (parent[i].value) str += parent[i].space + parent[i].value;
						else str += compile(parent[i], ast);
					}
				} 
			} else if (sigil === '^') { // run js
				const js = require('./' + tag.value.slice(1) + '.js');
				str += js();
			} else if (sigil === '#') { // html tag
				//tag.value = tag.value.slice(1);
				str += `${tag.space}<${tag.value}`;
			
				let arg, val, i;
				for (i = 2; i < ast.length; i += 2) {
					arg = ast[i];
					if (arg.value === '$')
						break;
					val = ast[i + 1];
					str += `${arg.space}${arg.value}=${val.value}`;
				}
				
				str += '>';
				
				if (arg && arg.value === '$') {
					for (i += 1; i < ast.length; ++i) {
						if (ast[i].value) str += ast[i].space + ast[i].value;
						else str += compile(ast[i], ast);
					}
				}
				str += `${op.space}</${tag.value}>`;
			} else { // from template file
				let template = fs.readFileSync(tag.value + '.template.html', { encoding: 'utf-8' });
				
				str += compile(parse(template), ast);
			}
		} else {
			str += compile(ast[i], ast);
		}
	// rewrite
	} else {
		for (let i = 1; i < ast.length; ++i) {
			if (ast[i].value) str += ast[i].space + ast[i].value;
			else str += compile(ast[i], parent);
		}
	}
	
	return str;
}
//console.log(JSON.stringify(ast));
let compiled = compile(ast, []);
console.log('compiled:\n', compiled);

fs.writeFileSync(process.argv[3] || 'output.html', compiled);
