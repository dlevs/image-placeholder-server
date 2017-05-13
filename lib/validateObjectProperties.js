'use strict';

const assert = require('assert');

const validateObjectProperties = (variableName, object, expectedProperties) => {
	expectedProperties.forEach((variable) => {
		const id = typeof variable === 'string' ? variable : variable.id;
		const {oneOf} = variable;
		const value = object[id];

		assert(
			value !== undefined,
			`${variableName}.${id} is not defined.`
		);

		if (oneOf) {
			assert(
				oneOf.includes(value),
				`${variableName}.${id} does not match expected value. It should be one of [${oneOf.map(val => `"${val}"`).join(', ')}].`
			);
		}
	});
};

module.exports = validateObjectProperties;
