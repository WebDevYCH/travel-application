const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { toggleAnyLike, updateAny, addTagsToAny } = require('./functions');

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
	tags: [
		{
			type: String,
		},
	],
});

ActivitySchema.statics.toggleLike = function(activityId, userId) {
	return toggleAnyLike(this, activityId, userId);
};

ActivitySchema.statics.addTags = function(activityId, tags) {
	return addTagsToAny(this, activityId, tags);
};

ActivitySchema.statics.update = function(activityId, userId, updateObject) {
	return updateAny('activity', this, activityId, userId, updateObject, [
		'name',
		'description',
		'destination',
		'address',
		'tags',
	]);
};

mongoose.model('activity', ActivitySchema);
