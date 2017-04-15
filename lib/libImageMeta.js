exports.getImageMetaData = async (image) => {
	const meta = await image.metadata();
	const {width, height} = meta;
	return Object.assign({}, meta, {
		ratio: width / height,
		largestDimension: Math.max(width, height)
	});
};

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
