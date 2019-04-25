const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
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
			return destination.save();
		}
		array.push(userId);
		return destination.save();
	});
};

mongoose.model('activity', ActivitySchema);
