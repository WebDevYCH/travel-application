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
};
