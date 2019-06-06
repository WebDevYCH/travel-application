const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
	const User = mongoose.model('user');

	return this.findById(tripId).then(trip => {
		const array = trip.likedBy;
		if (array.indexOf(userId) > -1) {
			const index = array.indexOf(userId);
			array.splice(index, 1);
			return trip.save();
		}
		array.push(userId);
		return trip.save();
	});
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
