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

mongoose.model('destination', DestinationSchema);
