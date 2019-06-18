const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { toggleAnyLike, updateAny } = require('./functions');

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
	return toggleAnyLike(this, transitId, userId);
};

TransitSchema.statics.update = function(transitId, userId, updateObject) {
	return updateAny('transit', this, transitId, userId, updateObject, [
		'name',
		'description',
		'startDestination',
		'endDestination',
	]);
};

mongoose.model('transit', TransitSchema);
