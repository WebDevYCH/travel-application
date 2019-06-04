const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	destination: {
		type: Schema.Types.ObjectId,
		ref: 'destination',
		required: true,
	},
	address: { type: String },
	price: { type: Number },
	likedBy: [
		{
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
	],
});

ActivitySchema.statics.toggleLike = function(activityId, userId) {
	const User = mongoose.model('user');

	return this.findById(activityId).then(activity => {
		const array = activity.likedBy;
		if (array.indexOf(userId) > -1) {
			const index = array.indexOf(userId);
			array.splice(index, 1);
			return activity.save();
		}
		array.push(userId);
		return activity.save();
	});
};

ActivitySchema.statics.update = function(activityId, userId, updateObject) {
	return this.findById(activityId).then(activity => {
		if (activity.user == userId) {
			if (updateObject.name) {
				activity.name = updateObject.name;
			}
			if (updateObject.description) {
				activity.description = updateObject.description;
			}
			if (updateObject.destination) {
				activity.destination = updateObject.destination;
			}
			if (updateObject.address) {
				activity.address = updateObject.address;
			}
			return activity.save();
		} else {
			return new Error(
				`User Authentication Error: You must be the user that created the activity to update it`
			);
		}
	});
};

mongoose.model('activity', ActivitySchema);
