const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { updateAny } = require('./functions');

const CommentSchema = new Schema({
	title: { type: String, required: true },
	comment: { type: String, required: true },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	dateCreated: { type: Date, default: Date.now },
});

// Update will only be possible if user is the same
CommentSchema.statics.update = function(commentId, userId, updateObject) {
	return updateAny('comment', this, commentId, userId, updateObject, [
		'title',
		'comment',
	]);
};

mongoose.model('comment', CommentSchema);
