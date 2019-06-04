const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransitSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	startDestination: {
		type: Schema.Types.ObjectId,
		ref: 'destination',
		required: true,
	},
	endDestination: {
		type: Schema.Types.ObjectId,
		ref: 'destination',
		required: true,
	},
	likedBy: [
		{
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
	],
	// Add a ote for users creating this that if a trip includes a few places to make multiple transits
});

TransitSchema.statics.toggleLike = function(transitId, userId) {
	const User = mongoose.model('user');

	return this.findById(transitId).then(transit => {
		const array = transit.likedBy;
		if (array.indexOf(userId) > -1) {
			const index = array.indexOf(userId);
			array.splice(index, 1);
			return activity.save();
		}
		array.push(userId);
		return transit.save();
	});
};

TransitSchema.statics.update = function(transitId, userId, updateObject) {
	return this.findById(transitId).then(transit => {
		if (transit.user == userId) {
			if (updateObject.name) {
				transit.name = updateObject.name;
			}
			if (updateObject.description) {
				transit.description = updateObject.description;
			}
			if (updateObject.startDestination) {
				transit.startDestination = updateObject.startDestination;
			}
			if (updateObject.endDestination) {
				transit.endDestination = updateObject.endDestination;
			}
			return transit.save();
		} else {
			return new Error(
				`User Authentication Error: You must be the user that created the transit to update it`
			);
		}
	});
};

mongoose.model('transit', TransitSchema);
