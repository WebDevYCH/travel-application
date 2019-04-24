const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

// Import GraphQL Types
const UserType = require('./user_type');
// Import Mongoose Model
const User = mongoose.model('user');

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		users: {
			type: new GraphQLList(UserType),
			resolve() {
				return User.find({});
			},
		},
	}),
});

module.exports = RootQuery;
