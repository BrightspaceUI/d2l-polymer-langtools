const fs = require('fs');

const reqCopyProps = [
	'copySourceLang',
	'langDir',
	'langNames'
];

const reqBuildProps = [
	'buildDir',
	'buildTemplateFile',
	'langDir',
	'langNames'
];

/**
 * Ensures given config object has all required keys for copy operation
 */
function validateConfigCopy(configData) {
	const missingProps = reqCopyProps.filter(prop => !configData[prop]);

	if (missingProps.length > 0) {
		throw new Error(`The following properties are missing from configuration file: ${missingProps.join(', ')}`);
	}
}

/**
 * Ensures given config object has all required keys for build operation
 */
function validateConfigBuild(configData) {
	const missingProps = reqBuildProps.filter(prop => !configData[prop]);

	if (missingProps.length > 0) {
		throw new Error(`The following properties are missing from configuration file: ${missingProps.join(', ')}`);
	}
}

function getLangFilePath(langDir, langName) {
	return `${langDir}/${langName}.json`;
}

/**
 * Will read and parse JSON lang file or throw.
 */
function readLangFile(filename) {
	try {
		return JSON.parse(fs.readFileSync(filename, 'utf-8'));
	} catch (e) {
		let msg = null;
		if (e instanceof SyntaxError) {
			msg = `Lang file is not valid JSON! (${filename})`;
		} else {
			msg = `Unable to open lang file! (${filename})`;
		}
    
		throw new Error(`${msg} ${e}`);
	}
}

module.exports = {
	getLangFilePath,
	readLangFile,
	validateConfigBuild,
	validateConfigCopy
};