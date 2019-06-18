const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { toggleAnyLike } = require('./functions');

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
});

TripSchema.statics.toggleLike = function(tripId, userId) {
	return toggleAnyLike(this, tripId, userId);
};

TripSchema.statics.update = function(tripId, userId, updateObject) {
	return this.findById(tripId).then(trip => {
		if (trip.user == userId) {
			if (updateObject.name) {
				trip.name = updateObject.name;
			}
			if (updateObject.description) {
				trip.description = updateObject.description;
			}
			if (updateObject.destinations) {
				trip.destination = updateObject.destinations;
			}
			if (updateObject.transits) {
				trip.address = updateObject.transits;
			}
			if (updateObject.activities) {
				trip.address = updateObject.activities;
			}
			return trip.save();
		} else {
			return new Error(
				`User Authentication Error: You must be the user that created the trip to update it`
			);
		}
	});
};

mongoose.model('trip', TripSchema);
