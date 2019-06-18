const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { toggleAnyLike, updateAny, addTagsToAny } = require('./functions');

const TripSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	destinations: [
		{
			type: Schema.Types.ObjectId,
			ref: 'destination',
		},
	],
	// These are placed by order of the array in the cards
	transits: [
		{
			type: Schema.Types.ObjectId,
			ref: 'transit',
		},
	],
	// These relate by the associated destination ID
	activities: [
		{
			type: Schema.Types.ObjectId,
			ref: 'activity',
		},
	],
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

TripSchema.statics.toggleLike = function(tripId, userId) {
	return toggleAnyLike(this, tripId, userId);
};

TripSchema.statics.addTags = function(tripId, tags) {
	return addTagsToAny(this, tripId, tags);
};

TripSchema.statics.update = function(tripId, userId, updateObject) {
	return updateAny('trip', this, tripId, userId, updateObject, [
		'name',
		'description',
		'destinations',
		'transits',
		'activities',
		'tags',
	]);
};

mongoose.model('trip', TripSchema);
