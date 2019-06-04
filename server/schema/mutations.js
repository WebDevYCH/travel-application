const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } = graphql;
const mongoose = require('mongoose');

// Import GraphQL Types
const UserType = require('./user_type');
const DestinationType = require('./destination_type');
const ActivityType = require('./activity_type');
// Import Mongoose Model
const User = mongoose.model('user');
const Destination = mongoose.model('destination');
const Activity = mongoose.model('activity');

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
		updateUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				email: { type: GraphQLString },
				password: { type: GraphQLString },
			},
			resolve(parentValue, { id, name, email, password }) {
				return User.update(id, {
					name,
					email,
					password,
				});
			},
		},
		deleteUser: {
			type: UserType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return User.deleteOne({ _id: id });
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
		updateDestination: {
			type: DestinationType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				title: { type: GraphQLString },
				description: { type: GraphQLString },
				user: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parentValue, { id, user, title, description }) {
				return Destination.update(id, user, {
					title,
					description,
				});
			},
		},
		toggleDestinationLike: {
			type: DestinationType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				userId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parentValue, { id, userId }) {
				return Destination.toggleLike(id, userId);
			},
		},
		deleteDestination: {
			type: DestinationType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return Destination.deleteOne({ _id: id });
			},
		},
		addActivity: {
			type: ActivityType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				user: { type: new GraphQLNonNull(GraphQLID) },
				destination: { type: new GraphQLNonNull(GraphQLID) },
				address: { type: GraphQLString },
			},
			resolve(parentValue, args) {
				return new Activity(args).save();
			},
		},
		toggleActivityLike: {
			type: ActivityType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				userId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parentValue, { id, userId }) {
				return Activity.toggleLike(id, userId);
			},
		},
		updateActivity: {
			type: ActivityType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				description: { type: GraphQLString },
				user: { type: new GraphQLNonNull(GraphQLID) },
				destination: { type: GraphQLID },
				address: { type: GraphQLString },
			},
			resolve(
				parentValue,
				{ id, user, name, description, destination, address }
			) {
				return Activity.update(id, user, {
					name,
					description,
					destination,
					address,
				});
			},
		},
		deleteActivity: {
			type: ActivityType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return Activity.deleteOne({ _id: id });
			},
		},
	},
});

module.exports = mutation;
