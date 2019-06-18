module.exports = {
	toggleAnyLike: function(model, id, userId) {
		return model.findById(id).then(item => {
			const array = item.likedBy;
			if (array.indexOf(userId) > -1) {
				const index = array.indexOf(userId);
				array.splice(index, 1);
				return item.save();
			}
			array.push(userId);
			return item.save();
		});
	},
	updateAny: function(modelName, model, id, userId, updateObject, fields) {
		return model.findById(id).then(item => {
			if (item.user == userId) {
				fields.forEach(function(field) {
					if (updateObject[field]) {
						item[field] = updateObject[field];
					}
				});

				return item.save();
			} else {
				return new Error(
					`User Authentication Error: You must be the user that created the ${modelName} to update it`
				);
			}
		});
	},
	addTagsToAny: function(model, id, tags) {
		return model.findById(id).then(item => {
			const oldTags = item.tags;
			let newTags = oldTags.concat(tags); // tags must be an array
			let uniqueTags = [...new Set(newTags)]; // remove any duplicates from array
			item.tags = uniqueTags;
			return item.save();
		});
	},
	addPriceToAny: function(model, id, price) {
		return model.findById(id).then(item => {
			if (isNaN(price)) {
				return new Error(
					`User Entry Error: You must enter a valid number for price`
				);
			} else {
				const prices = [...item.userPrices, price];
				const sum = prices.reduce(
					(previous, current) => (current += previous)
				);
				const average = sum / prices.length;
				item.averagePrice = average;
				const minimum = Math.min(...prices);
				item.minimumPrice = minimum;
				const maximum = Math.max(...prices);
				item.maximumPrice = maximum;
				item.userPrices.push(price);
				return item.save();
			}
		});
	},
};
