#!/usr/bin/env node

const 
	{ buildLang } = require('../src/build'),
	fs = require('fs'),
	{ getLangFilePath, readLangFile, validateConfigBuild } = require('../src/lib-fs'),
	yargs = require('yargs');

const args = yargs.usage('USAGE: $0 [options]\n\nBuilds lang data from JSON files into javascript.')
	.strict(true)
	.option('config', {
		alias: 'c',
		describe: 'Config file path',
		required: true,
		requiresArg: true
	}).option('expand', {
		alias: [ 'e' ],
		describe: 'When this flag is set, JSON data inserted into build file will expanded to span multiple lines for readability. The default behaviour will compact inserted JSON onto a single line.',
		boolean: true,
		default: false
	}).option('expand-spacing', {
		alias: [ 's' ],
		describe: 'Spacing to use when expanding JSON. Can either be a number (of spaces) or a string which is prepended to each new indentation level. No effect without `expand` option.',
		requiresArg: true,
		default: 4
	}).argv;

const configFile = args.config;
const expand = args.expand;
const spacing = args.s;

let config = null;
try {
	config = JSON.parse(fs.readFileSync(configFile));
} catch(e) {
	let msg = null;
	if (e instanceof SyntaxError) {
		msg = 'Config file is not valid JSON!';
	} else {
		msg = 'Unable to open config file!';
	}

	throw new Error(`${msg} ${e}`);
}

validateConfigBuild(config);

const templatePath = config.buildTemplateFile;
if (!fs.existsSync(templatePath)) {
	throw new Error(`Template file does not exist! ${templatePath}`);
}

let templateContents = null;
try {
	templateContents = fs.readFileSync(templatePath).toString();
} catch (e) {
	throw new Error(`Unable to read template file! ${e}`);
}

config.langNames.forEach(langName => {
	const langPath = getLangFilePath(config.langDir, langName);

	if (!fs.existsSync(langPath)) {
		console.log(`Lang file does not exist: ${langPath}`);
		return;
	}

	const langJson = readLangFile(langPath);
	const built = buildLang(langName, langJson, templateContents, expand, spacing);
	fs.writeFileSync(`${config.buildDir}/${langName}.js`, built);
});
