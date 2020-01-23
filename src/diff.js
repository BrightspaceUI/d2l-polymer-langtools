const chalk = require('chalk');

const diffActions = {
	add: 0,
	change: 1,
	noChange: 2,
	remove: 3
};

const actionRenderText = [];
actionRenderText[diffActions.add] = chalk.green('+');
actionRenderText[diffActions.change] = chalk.yellow('~');
actionRenderText[diffActions.remove] = chalk.red('-');

function computeLangDiff(before, after, overrides) {
	const keySet = [...new Set([...Object.keys(before), ...Object.keys(after)])];

	return keySet.reduce((acc, key) => {
		let action = null;

		if (!before[key]) {
			action = diffActions.add;
		} else if (!after[key]) {
			action = diffActions.remove;
		} else if (before[key] !== after[key]) {
			action = diffActions.change;
		} else if (overrides.indexOf(key) >= 0) {
			action = diffActions.noChange;
		}

		if (action !== null) {
			acc.push({
				action,
				term: key
			});
        }
        
        return acc;
	}, []);
}

function renderDiffText(diffItem) {
	const actionStr = (actionRenderText[diffItem.action] || '.');
	return `${actionStr} ${diffItem.term}`;
}

function getTextDiff(before, after, overrides) {
	const diff = computeLangDiff(before, after, overrides);
	return diff.sort((l, r) => l.term.toLowerCase().localeCompare(r.term.toLowerCase()))
		.map(renderDiffText)
		.join('\n');
}

module.exports = {
	getTextDiff
};
