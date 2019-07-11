const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const cloudFiles = require('cloudinary').v2;
const cookieParser = require('cookie-parser');
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
	if (req.cookies.user) {
		req.authCookie = true;
	}
	next();
});
//=====================================================
app.post('/login', (req, res) => {
	if (!req.authCookie) {
		// Check login and set auth JWT
		res.cookie('user', 'Josh Bowden', {
			expires: new Date(Date.now() + 900000),
			httpOnly: true,
			overwrite: true,
		});
		res.send('cookie set');
	} else {
		// Check Auth Data from JWT update Refresh Token
		res.cookie('user', 'Josh Bowden', {
			expires: new Date(Date.now() + 900000),
			httpOnly: true,
			overwrite: true,
		});
		res.send(req.cookies.user + ' is logged in.');
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
	graphqlHTTP({
		schema,
		graphiql: true,
	})
);
//=====================================================

module.exports = app;
