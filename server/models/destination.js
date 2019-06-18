const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { toggleAnyLike } = require('./functions');

const DestinationSchema = new Schema({
	title: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now },
	description: { type: String, required: true },
	climate: { type: String, required: true }, // Cold, Warm, Moderate, Seasonal - Saved lowercase
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
	tags: [
		{
			type: String,
		},
	],
});

DestinationSchema.statics.toggleLike = function(destinationId, userId) {
	return toggleAnyLike(this, destinationId, userId);
};

DestinationSchema.statics.addTags = function(destinationId, tags) {
	return this.findById(destinationId).then(destination => {
		const oldTags = destination.tags;
		let newTags = oldTags.concat(tags); // tags must be an array
		destination.tags = newTags;
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
			if (updateObject.climate) {
				destination.climate = updateObject.climate;
			}
			if (updateObject.tags) {
				destination.tags = updateObject.tags;
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
