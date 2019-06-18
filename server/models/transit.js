const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {
	toggleAnyLike,
	updateAny,
	addTagsToAny,
	addPriceToAny,
} = require('./functions');

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
	// Add a ote for users creating this that if a trip includes a few places to make multiple transits
});

TransitSchema.statics.toggleLike = function(transitId, userId) {
	return toggleAnyLike(this, transitId, userId);
};

TransitSchema.statics.addTags = function(transitId, tags) {
	return addTagsToAny(this, transitId, tags);
};

TransitSchema.statics.addPrice = function(transitId, price) {
	return addPriceToAny(this, transitId, price);
};

TransitSchema.statics.update = function(transitId, userId, updateObject) {
	return updateAny('transit', this, transitId, userId, updateObject, [
		'name',
		'description',
		'startDestination',
		'endDestination',
		'tags',
		'userPrices',
		'averagePrice',
		'maximumPrice',
		'minimumPrice',
	]);
};

mongoose.model('transit', TransitSchema);
