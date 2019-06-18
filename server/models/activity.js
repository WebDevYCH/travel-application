const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {
	toggleAnyLike,
	updateAny,
	addTagsToAny,
	addPriceToAny,
} = require('./functions');

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
	userPrices: {
		type: Array,
		default: [0.0],
	},
	averagePrice: { type: Number, default: 0.0 },
	minimumPrice: { type: Number, default: 0.0 },
	maximumPrice: { type: Number, default: 0.0 },
});

ActivitySchema.statics.toggleLike = function(activityId, userId) {
	return toggleAnyLike(this, activityId, userId);
};

ActivitySchema.statics.addTags = function(activityId, tags) {
	return addTagsToAny(this, activityId, tags);
};

ActivitySchema.statics.addPrice = function(activityId, price) {
	return addPriceToAny(this, activityId, price);
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
