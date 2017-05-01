'use strict';

const deepFreeze = require('deep-freeze');
const flatMap = require('lodash/flatMap');
const Image = require('./Image');
const ImageManager = require('./ImageManager');
const images = [
	{
		// ratio: 2,
		width: 200,
		height: 100,
		filepath: '/foo/bar/images/animals/cats/cat5.jpg'
	},

	{
		// ratio: 1,
		width: 100,
		height: 100,
		filepath: '/foo/bar/images/animals/cats/cat.jpg'
	},
	{
		// ratio: 1,
		width: 1000,
		height: 1000,
		filepath: '/foo/bar/images/animals/dogs/dog.jpg'
	},
	{
		// ratio: 1,
		width: 400,
		height: 400,
		filepath: '/foo/bar/images/animals/cats/cat3.jpg'
	},
	{
		// ratio: 1,
		width: 200,
		height: 200,
		filepath: '/foo/bar/images/animals/cats/cat2.jpg'
	},


	{
		// ratio: 0.5,
		width: 50,
		height: 100,
		filepath: '/foo/bar/images/animals/cats/cat4.jpg'
	},

	{
		// ratio: 1,
		width: 200,
		height: 200,
		filepath: '/foo/bar/images/landscapes/cities/buildings/building.jpg'
	}
];
const options = {imageRootPath: '/foo/bar/images/'};

deepFreeze(images);
deepFreeze(options);

const imageManager = new ImageManager(images, options);


describe('ImageManager', () => {

	describe('.length', () => {
		test('value is correct.', () => {
			expect(imageManager.length).toBe(images.length);
		});
	});

	describe('.categoryIds', () => {
		test('IDs are correct and in alphabetical order', () => {
			expect(imageManager.categoryIds).toEqual(['all', 'animals', 'buildings', 'cats', 'cities', 'dogs', 'landscapes']);
		});
	});

	describe('.organizedImages', () => {
		test('values are organised correctly', () => {

			// Check that the "all" category is ordered the way we expect.
			expect(imageManager.organizedImages.all).toEqual([
				{
					ratio: 0.5,
					images: [
						new Image({
							// ratio: 0.5,
							width: 50,
							height: 100,
							filepath: '/foo/bar/images/animals/cats/cat4.jpg'
						}, options)
					]
				},
				{
					ratio: 1,
					images: [
						new Image({
							// ratio: 1,
							width: 100,
							height: 100,
							filepath: '/foo/bar/images/animals/cats/cat.jpg'
						}, options),
						new Image({
							// ratio: 1,
							width: 200,
							height: 200,
							filepath: '/foo/bar/images/animals/cats/cat2.jpg'
						}, options),
						new Image({
							// ratio: 1,
							width: 200,
							height: 200,
							filepath: '/foo/bar/images/landscapes/cities/buildings/building.jpg'
						}, options),
						new Image({
							// ratio: 1,
							width: 400,
							height: 400,
							filepath: '/foo/bar/images/animals/cats/cat3.jpg'
						}, options),
						new Image({
							// ratio: 1,
							width: 1000,
							height: 1000,
							filepath: '/foo/bar/images/animals/dogs/dog.jpg'
						}, options)
					]
				},
				{
					ratio: 2,
					images: [
						new Image({
							// ratio: 2,
							width: 200,
							height: 100,
							filepath: '/foo/bar/images/animals/cats/cat5.jpg'
						}, options)
					]
				}
			]);


			/**
			 * Check the number of ratio groupings and the total number of images
			 * for a collection of organised images.
			 *
			 * @param {Array} ratioGroups
			 * @param {Number} nGroups
			 * @param {Number} nImages
			 */
			const expectNumberOfGroupsAndImages = (ratioGroups, nGroups, nImages) => {
				expect(ratioGroups.length).toBe(nGroups);
				expect(flatMap(ratioGroups, ({images}) => images).length).toBe(nImages);
			};

			expectNumberOfGroupsAndImages(imageManager.organizedImages.all, 3, 7);
			expectNumberOfGroupsAndImages(imageManager.organizedImages.animals, 3, 6);
			expectNumberOfGroupsAndImages(imageManager.organizedImages.buildings, 1, 1);
			expectNumberOfGroupsAndImages(imageManager.organizedImages.cats, 3, 5);
			expectNumberOfGroupsAndImages(imageManager.organizedImages.cities, 1, 1);
			expectNumberOfGroupsAndImages(imageManager.organizedImages.dogs, 1, 1);
			expectNumberOfGroupsAndImages(imageManager.organizedImages.landscapes, 1, 1);
		});
	});

	describe('.getImageGroup()', () => {
		describe('general usage', () => {
			test('gets the expected image group if ratio matches a group exactly', () => {
				expect(imageManager.getImageGroup(0.5, 'all')[0].filepath).toBe('/foo/bar/images/animals/cats/cat4.jpg');
				expect(imageManager.getImageGroup(1, 'all')[0].filepath).toBe('/foo/bar/images/animals/cats/cat.jpg');
			});

			test('returns all expected results for a ratio', () => {
				expect(imageManager.getImageGroup(1, 'cats').length).toBe(3);
				expect(imageManager.getImageGroup(1, 'all').length).toBe(5);
			});

			test('category parameter is optional and defaults to "all"', () => {
				expect(imageManager.getImageGroup(1)).toBe(imageManager.getImageGroup(1, 'all'));
			});

			test('returns an empty array if cannot find a matching image group', () => {
				expect(imageManager.getImageGroup(0.5, 'non existent category')).toEqual([]);
			});
		});

		describe('rounding where an exact ratio match doesn\'t exist', () => {
			test('gets the lowest group if ratio is less than the minimum', () => {
				expect(
					imageManager.getImageGroup(0.1, 'all')
				).toBe(
					imageManager.getImageGroup(0.5, 'all')
				);
			});

			test('gets the highest group if ratio is greater than the maximum', () => {
				expect(
					imageManager.getImageGroup(1000, 'all')
				).toBe(
					imageManager.getImageGroup(2, 'all')
				);
			});

			test('rounds ratio up', () => {
				expect(
					imageManager.getImageGroup(0.9, 'all')
				).toBe(
					imageManager.getImageGroup(1, 'all')
				);
			});

			test('rounds ratio down', () => {
				expect(
					imageManager.getImageGroup(1.1, 'all')
				).toBe(
					imageManager.getImageGroup(1, 'all')
				);
			});
		});
	});
});
