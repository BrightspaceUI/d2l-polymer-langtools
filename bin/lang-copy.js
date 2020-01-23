const
	{ copyLang } = require('../src/copy'),
	{ getTextDiff } = require('../src/diff'),
	fs = require('fs'),
	{ getLangFilePath, readLangFile, validateConfigCopy } = require('../src/lib-fs'),
	yargs = require('yargs');

const args = yargs.usage('USAGE: $0 [options] [terms]\n\nCopies new and deleted lang terms from the source file to all other lang term files. Default behaviour will not copy changes to existing lang terms. If an existing term is modified, you must specify the term as an argument to force-copy it from the source file (any translations of this term will be lost).')
	.strict(true)
	.option('config', {
		alias: 'c',
		describe: 'Config file path',
		required: true,
		requiresArg: true
	}).option('sort', {
		alias: [ 's' ],
		describe: 'If this flag is set, all generated lang term files will be sorted by key name.',
		boolean: true,
		default: false
	}).option('verbose', {
		alias: [ 'v' ],
		describe: 'If this flag is set, script will output lang file diff to console.'
	}).option('all', {
		alias: [ 'a', 'copy-all' ],
		describe: 'If this flag is set, the entirety of all lang term files will be overwritten with the contents of the source lang file; deleting any existing translations.',
		boolean: true,
		default: false
	}).argv;

const configFile = args.config;
const sort = args.sort;
const verbose = args.verbose;
const copyAll = args.all;
const overrides = args._;

let config = null;
try {
	config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
} catch (e) {
	let msg = null;
	if (e instanceof SyntaxError) {
		msg = 'Config file is not valid JSON!';
	} else {
		msg = 'Unable to open config file!';
	}

	throw new Error(`${msg} ${e}`);
}

validateConfigCopy(config);

const srcFile = getLangFilePath(config.langDir, config.copySourceLang);
const destFiles = config.langNames.map(langName => {
	return {
		name: langName,
		path: getLangFilePath(config.langDir, langName)
	};
});

const sourceJson = readLangFile(srcFile);

destFiles.forEach(({ name, path }) => {
	if (path === srcFile) {
		return;
	}

	const destJson = fs.existsSync(path) ? readLangFile(path) : {};
	let outputJson = copyLang(sourceJson, copyAll ? {} : destJson, overrides);

	if (sort) {
		const outputSorted = {};
		Object.keys(outputJson).sort((l, r) => l.toLowerCase().localeCompare(r.toLowerCase())).forEach(key => {
			outputSorted[key] = outputJson[key];
		});
		outputJson = outputSorted;
	}

	if (verbose) {
		const diff = getTextDiff(destJson, outputJson, overrides);
		if (diff.length > 0) {
			console.log(`Changes made to lang [${name}]:\n${diff}\n`);
		}
	}

	fs.writeFileSync(path, JSON.stringify(outputJson, null, 4) + '\n');
});
