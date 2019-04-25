const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

// Import GraphQL Types
const UserType = require('./user_type');
const DestinationType = require('./destination_type');
const ActivityType = require('./activity_type');
// Import Mongoose Model
const User = mongoose.model('user');
const Destination = mongoose.model('destination');
const Activity = mongoose.model('activity');

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		users: {
			type: new GraphQLList(UserType),
			resolve() {
				return User.find({});
			},
		},
		destinations: {
			type: new GraphQLList(DestinationType),
			resolve() {
				return Destination.find({});
			},
		},
		activities: {
			type: new GraphQLList(ActivityType),
			resolve() {
				return Activity.find({});
			},
		},
	}),
});

module.exports = RootQuery;
