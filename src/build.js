function camelCase(str) {
	const orig = str.toLowerCase();
	let output = '';
	let newWord = false;

	for (let i = 0; i < orig.length; i++) {
		const char = orig.charAt(i);

		if (!char.match(/[a-z]/i)) {
			if (output.length > 0) {
				newWord = true;
			}
			continue;
		}

		output += newWord ? char.toUpperCase() : char;
		newWord = false;
	}

	return output;
}

function pascalCase(str) {
	const camel = camelCase(str);
	return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function expandData(obj, spacing, doubleQuotes) {
	const json = JSON.stringify(obj, null, spacing);

	if (doubleQuotes) {
		return json;
	}

	/* eslint-disable quotes */
	return json
		.replace(/([^\\])'/g, "$1\\'")	// Escape any existing single quotes
		.replace(/([^\\])"/g, "$1'")	// Make JSON use single quotes instead of double
		.replace(/\\"/g, "\"")			// Convert escaped double quotes to regular (now that JSON is using single)
	;
	/* eslint-enable quotes */
}

function buildLang(langName, langData, buildTemplate, expand, spacing, doubleQuotes) {
	expand = expand || false;
	spacing = spacing || 4;
	doubleQuotes = doubleQuotes || false;

	const replacements = [
		{
			regex: /{{langPascal}}/g,
			value: pascalCase(langName)
		},
		{
			regex: /{{langCamel}}/g,
			value: camelCase(langName)
		},
		{
			regex: /{{langData}}/g,
			value: expand ? expandData(langData, spacing, doubleQuotes) : JSON.stringify(langData)
		}
	];

	let built = buildTemplate;
	replacements.forEach(({ regex, value }) => {
		built = built.replace(regex, value);
	});

	return built;
}

module.exports = {
	buildLang
};
