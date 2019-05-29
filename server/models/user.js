const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now },
});

UserSchema.statics.update = function(userId, updateObject) {
	return this.findById(userId).then(user => {
		if (updateObject.name) {
			user.name = updateObject.name;
		}
		if (updateObject.email) {
			user.email = updateObject.email;
		}
		if (updateObject.password) {
			user.password = updateObject.password;
		}
		return user.save();
	});
};

mongoose.model('user', UserSchema);
