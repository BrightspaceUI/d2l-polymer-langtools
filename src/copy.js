/**
 * Copies new keys (with values) from src object to dest object. Keys that are
 * not in src will also be removed from dest. Any keys in dest that are specified
 * in the overrides array will have their values replaced with values from src[key].
 * @param {Object} src Source object
 * @param {Object} dest Destination object, not modified
 * @param {string[]} overrides Array of keys that, if already exist in dest, will have their
 * 		values overridden with the values from src.
 */
function copyLang(src, dest, overrides) {
	const outputJson = {};
	overrides = overrides || [];

	Object.keys(src).forEach(key => {
		if (!dest[key] || overrides.indexOf(key) >= 0) {
			// Copy new/overridden terms from src
			outputJson[key] = src[key];
		} else {
			// Otherwise keep current
			outputJson[key] = dest[key];
		}
	});

	return outputJson;
}

module.exports = {
	copyLang
};
