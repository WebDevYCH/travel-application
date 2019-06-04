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
	},
	endDestination: {
		type: Schema.Types.ObjectId,
		ref: 'destination',
	},
	likedBy: [
		{
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
	],
	// Add a ote for users creating this that if a trip includes a few places to make multiple transits
});

mongoose.model('transit', TransitSchema);
