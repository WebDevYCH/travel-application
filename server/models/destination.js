const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
	title: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now },
	description: { type: String, required: true },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	likedBy: [
		{
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
	],
});

DestinationSchema.statics.toggleLike = function(destinationId, userId) {
	const User = mongoose.model('user');

	return this.findById(destinationId).then(destination => {
		const array = destination.likedBy;
		if (array.indexOf(userId) > -1) {
			const index = array.indexOf(userId);
			array.splice(index, 1);
			return destination.save();
		}
		array.push(userId);
		return destination.save();
	});
};

DestinationSchema.statics.update = function(
	destinationId,
	userId,
	updateObject
) {
	return this.findById(destinationId).then(destination => {
		if (destination.user == userId) {
			if (updateObject.title) {
				destination.title = updateObject.title;
			}
			if (updateObject.description) {
				destination.description = updateObject.description;
			}
			return destination.save();
		} else {
			return new Error(
				`User Authentication Error: You must be the user that created the destination to update it`
			);
		}
	});
};

mongoose.model('destination', DestinationSchema);
