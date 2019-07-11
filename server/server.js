const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const cloudFiles = require('cloudinary').v2;
//=====================================================

const app = express();
// Make sure that graphql requests are in json
app.use(express.json());
// Extended allows you to created a nested object from your query string
app.use(express.urlencoded({ extended: true }));
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

app.post('/upload', (req, res) => {
	const file = req.files.photo;
	console.log(req.files.photo);
	cloudFiles.uploader.upload(file.tempFilePath, (err, result) => {
		if (err) {
			console.log('Error: ', err);
		}
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
