const graphql = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLNonNull,
	GraphQLList,
} = graphql;
const mongoose = require('mongoose');

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
				password = User.generateHash(password);
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
				if (password) {
					password = User.generateHash(password);
				}
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
				climate: { type: new GraphQLNonNull(GraphQLString) },
				user: { type: new GraphQLNonNull(GraphQLID) },
				tags: {
					type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
				},
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
				climate: { type: GraphQLString },
				user: { type: new GraphQLNonNull(GraphQLID) },
				tags: {
					type: new GraphQLList(GraphQLString),
				},
			},
			resolve(
				parentValue,
				{ id, user, title, description, climate, tags }
			) {
				return Destination.update(id, user, {
					title,
					description,
					climate,
					tags,
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
		addDestinationTags: {
			type: DestinationType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				tags: {
					type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
				},
			},
			resolve(parentValue, { id, tags }) {
				return Destination.addTags(id, tags);
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
				tags: {
					type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
				},
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
		addActivityTags: {
			type: ActivityType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				tags: {
					type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
				},
			},
			resolve(parentValue, { id, tags }) {
				return Activity.addTags(id, tags);
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
				tags: {
					type: new GraphQLList(GraphQLString),
				},
			},
			resolve(
				parentValue,
				{ id, user, name, description, destination, address, tags }
			) {
				return Activity.update(id, user, {
					name,
					description,
					destination,
					address,
					tags,
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
		addTransit: {
			type: TransitType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				user: { type: new GraphQLNonNull(GraphQLID) },
				startDestination: { type: new GraphQLNonNull(GraphQLID) },
				endDestination: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parentValue, args) {
				return new Transit(args).save();
			},
		},
		toggleTransitLike: {
			type: TransitType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				userId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parentValue, { id, userId }) {
				return Transit.toggleLike(id, userId);
			},
		},
		updateTransit: {
			type: TransitType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				description: { type: GraphQLString },
				user: { type: new GraphQLNonNull(GraphQLID) },
				startDestination: { type: GraphQLID },
				endDestination: { type: GraphQLID },
			},
			resolve(
				parentValue,
				{
					id,
					user,
					name,
					description,
					startDestination,
					endDestination,
				}
			) {
				return Transit.update(id, user, {
					name,
					description,
					startDestination,
					endDestination,
				});
			},
		},
		deleteTransit: {
			type: TransitType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return Transit.deleteOne({ _id: id });
			},
		},
		addTrip: {
			type: TripType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				user: { type: new GraphQLNonNull(GraphQLID) },
				destinations: {
					type: new GraphQLList(GraphQLID),
				},
				transits: {
					type: new GraphQLList(GraphQLID),
				},
				activities: {
					type: new GraphQLList(GraphQLID),
				},
			},
			resolve(parentValue, args) {
				return new Trip(args).save();
			},
		},
		toggleTripLike: {
			type: TripType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				userId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parentValue, { id, userId }) {
				return Trip.toggleLike(id, userId);
			},
		},
		updateTrip: {
			type: TripType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				description: { type: GraphQLString },
				user: { type: new GraphQLNonNull(GraphQLID) },
				destinations: { type: new GraphQLList(GraphQLID) },
				transits: { type: new GraphQLList(GraphQLID) },
				activities: { type: new GraphQLList(GraphQLID) },
			},
			resolve(
				parentValue,
				{
					id,
					user,
					name,
					description,
					destinations,
					transits,
					activities,
				}
			) {
				return Trip.update(id, user, {
					name,
					description,
					destinations,
					transits,
					activities,
				});
			},
		},
		deleteTrip: {
			type: TripType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return Trip.deleteOne({ _id: id });
			},
		},
	},
});

module.exports = mutation;
