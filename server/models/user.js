const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

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

// generating a hash
UserSchema.statics.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.statics.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

mongoose.model('user', UserSchema);
