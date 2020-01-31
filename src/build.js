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

function buildLang(langName, langData, buildTemplate, expand) {
	expand = expand || false;

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
			value: expand ? JSON.stringify(langData, null, '\t\t').replace(/"/g, "'") : JSON.stringify(langData)/* eslint-disable-line quotes */
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
