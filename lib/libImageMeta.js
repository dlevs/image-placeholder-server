'use strict';

exports.constrainDimensions = (width, height, limit) => {
	const maxDimension = Math.max(width, height);
	if (maxDimension <= limit) {
		return {width, height};
	}

	const scale = maxDimension / limit;
	return {
		width: width / scale,
		height: height / scale
	}
};
