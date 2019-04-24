const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
//=====================================================

const app = express();
// Make sure that graphql requests are in json
app.use(express.json());
// Extended allows you to created a nested object from your query string
app.use(express.urlencoded({ extended: true }));
//=====================================================

// The schema for graphql to reference
const schema = require('./schema/schema');
// Mongoose Models
const models = require('./models');
// Add the config keys
const keys = require('./config/keys');
// Connect to mongoose:
const MONGO_URI = keys.mongoURI;
if (!MONGO_URI) {
	throw new Error('You must provide a MongoLab URI');
}
mongoose.connect(MONGO_URI, { useNewUrlParser: true });
mongoose.connection
	.once('open', () => console.log('Connected to MongoLab instance.'))
	.on('error', error => console.log('Error connecting to MongoLab:', error));
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
