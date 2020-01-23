/*
 * Builds lang data from JSON files into javascript
 */
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
	}).argv;

const configFile = args.config;

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
	const built = buildLang(langName, langJson, templateContents);
	fs.writeFileSync(`${config.buildDir}/${langName}.js`, built);
});
