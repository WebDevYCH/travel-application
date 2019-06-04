const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

// Import GraphQL Types
const UserType = require('./user_type');
const DestinationType = require('./destination_type');
const ActivityType = require('./activity_type');
const TransitType = require('./transit_type');
const TripType = require('./trip_type');
// Import Mongoose Model
const User = mongoose.model('user');
const Destination = mongoose.model('destination');
const Activity = mongoose.model('activity');
const Transit = mongoose.model('transit');
const Trip = mongoose.model('trip');

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
		transits: {
			type: new GraphQLList(TransitType),
			resolve() {
				return Transit.find({});
			},
		},
		trips: {
			type: new GraphQLList(TripType),
			resolve() {
				return Trip.find({});
			},
		},
		user: {
			type: UserType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return User.findById(id);
			},
		},
		destination: {
			type: DestinationType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return Destination.findById(id);
			},
		},
		activity: {
			type: ActivityType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return Activity.findById(id);
			},
		},
		transit: {
			type: TransitType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return Transit.findById(id);
			},
		},
		trip: {
			type: TripType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return Trip.findById(id);
			},
		},
	}),
});

module.exports = RootQuery;
