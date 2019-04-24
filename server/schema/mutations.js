const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } = graphql;
const mongoose = require('mongoose');

// Import Mongoose Models
const User = mongoose.model('user');
const Destination = mongoose.model('destination');
// Import GraphQL Types
const UserType = require('./user_type');
const DestinationType = require('./destination_type');

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addUser: {
			type: UserType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parentValue, { name, email, password }) {
				return new User({ name, email, password }).save();
			},
		},
		addDestination: {
			type: DestinationType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				user: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parentValue, args) {
				return new Destination(args).save();
			},
		},
	},
});

module.exports = mutation;
