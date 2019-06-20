const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {
	toggleAnyLike,
	updateAny,
	addTagsToAny,
	commentOn,
	deleteComment,
} = require('./functions');

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
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'comment',
		},
	],
});

DestinationSchema.statics.toggleLike = function(destinationId, userId) {
	return toggleAnyLike(this, destinationId, userId);
};

DestinationSchema.statics.comment = function(destinationId, commentId) {
	return commentOn(this, destinationId, commentId);
};

DestinationSchema.statics.uncomment = function(destinationId, commentId) {
	return deleteComment(this, destinationId, commentId);
};

DestinationSchema.statics.addTags = function(destinationId, tags) {
	return addTagsToAny(this, destinationId, tags);
};

DestinationSchema.statics.update = function(
	destinationId,
	userId,
	updateObject
) {
	return updateAny('destination', this, destinationId, userId, updateObject, [
		'title',
		'description',
		'climate',
		'tags',
	]);
};

mongoose.model('destination', DestinationSchema);
