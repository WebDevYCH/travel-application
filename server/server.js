const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const cloudFiles = require('cloudinary').v2;
const cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
//=====================================================

const app = express();
// Make sure that graphql requests are in json
app.use(express.json());
// Extended allows you to created a nested object from your query string
app.use(express.urlencoded({ extended: true }));
// Cookie Parser
app.use(cookieParser());
//=====================================================

// Mongoose Models
const models = require('./models');
// The schema for graphql to reference
const schema = require('./schema/schema');
// Add the config keys
const keys = require('./config/keys');
// Connect to mongoose:
const MONGO_URI = keys.mongoURI;
if (!MONGO_URI) {
	throw new Error('You must provide a MongoLab URI');
}
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
});
mongoose.connection
	.once('open', () => console.log('Connected to MongoLab instance.'))
	.on('error', error => console.log('Error connecting to MongoLab:', error));

//=====================================================
// Checks if user has a JWT Token - Hypothetically
app.use((req, res, next) => {
	// If there is a user token
	if (req.cookies['access-token']) {
		jwt.verify(
			req.cookies['access-token'],
			keys.authSecret,
			(err, decoded) => {
				if (err) {
					res.send('Error: ', err);
				}
				req.decodedToken = decoded;
				next();
			}
		);
	}
	req.decodedToken = false;
	next();
});
//=====================================================
const User = mongoose.model('user');
//=====================================================
app.post('/login', (req, res) => {
	if (!req.decodedToken) {
		// CHECK USERS EXISTENCE BECAUSE NO AUTH TOKEN
		// User.findOne({ email: req.body.email }, (err, user) => {
		// 	if (err) {
		// 		res.send('Error: ', err);
		// 	}
		// 	// Checks password against DB
		// 	const userAuth = user.validPassword(req.body.password);
		// 	if (userAuth) {
		// 		res.cookie('user', 'Josh Bowden', {
		// 			expires: new Date(Date.now() + 900000),
		// 			httpOnly: true,
		// 			overwrite: true,
		// 		});
		// 		res.send('user logged in and cookie set');
		// 	}
		// });
		const refreshToken = jwt.sign(
			{ userId: 'Example User ID', count: 'Example Count' },
			keys.authSecret,
			{
				expiresIn: '7d',
			}
		);
		const accessToken = jwt.sign(
			{ userId: 'Example User ID' },
			keys.authSecret,
			{
				expiresIn: '15min',
			}
		);
		res.cookie('refresh-token', refreshToken, {
			expires: new Date(Date.now() + 60 * 60 * 24 * 7),
			httpOnly: true,
			overwrite: true,
		});
		res.cookie('access-token', accessToken, {
			expires: new Date(Date.now() + 60 * 60 * 24 * 7),
			httpOnly: true,
			overwrite: true,
		});
		res.send('got it');
	} else {
		// Check Auth Data from JWT update Refresh Token
		const refreshToken = jwt.sign(
			{ userId: 'Example User ID', count: 'Example Count' },
			keys.authSecret,
			{
				expiresIn: '7d',
			}
		);
		res.cookie('refresh-token', refreshToken, {
			expires: new Date(Date.now() + 60 * 60 * 24 * 7),
			httpOnly: true,
			overwrite: true,
		});
		res.send(req.decodedToken);
		// res.send(req.cookies.user + ' is logged in.');
	}
});
//=====================================================
app.use(
	fileUpload({
		useTempFiles: true,
	})
);

cloudFiles.config({
	cloud_name: keys.cloudName,
	api_key: keys.cloudKey,
	api_secret: keys.cloudSecret,
});

// The post link includes the model type and model name - localhost:5000/upload/trip/tripID
// The body includes a file and the userID used for checking authentication
app.post('/upload/:modelName/:modelId', (req, res) => {
	const file = req.files.photo;
	// Before Uplaoder Check Ability to Edit Model - req.body.userID
	cloudFiles.uploader.upload(file.tempFilePath, (err, result) => {
		if (err) {
			console.log('Error: ', err);
		}
		// Update the Mongoose Model
		// Use the result to update the page before the image loads from the database
		res.send(result);
	});
});

//=====================================================

// The graphql route that handles all requests
app.use(
	'/graphql',
	graphqlHTTP(req => ({
		schema,
		graphiql: true,
		context: req.decodedToken,
	}))
);
//=====================================================

module.exports = app;
