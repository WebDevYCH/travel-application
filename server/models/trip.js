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
			return activity.save();
		}
		array.push(userId);
		return trip.save();
	});
};

mongoose.model('trip', TripSchema);
