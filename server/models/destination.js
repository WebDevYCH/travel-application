const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
	title: { type: String },
	dateCreated: { type: Date, default: Date.now },
	description: { type: String },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
	},
});

mongoose.model('destination', DestinationSchema);
