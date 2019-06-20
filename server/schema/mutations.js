const graphql = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLNonNull,
	GraphQLList,
	GraphQLFloat,
} = graphql;
const mongoose = require('mongoose');

// Import GraphQL Types
const UserType = require('./user_type');
const DestinationType = require('./destination_type');
const ActivityType = require('./activity_type');
const TransitType = require('./transit_type');
const TripType = require('./trip_type');
const CommentType = require('./comment_type');
// Import Mongoose Model
const User = mongoose.model('user');
const Destination = mongoose.model('destination');
const Activity = mongoose.model('activity');
const Transit = mongoose.model('transit');
const Trip = mongoose.model('trip');
const Comment = mongoose.model('comment');

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
				userPrices: {
					type: new GraphQLList(GraphQLFloat),
				},
				averagePrice: { type: GraphQLFloat },
				minimumPrice: { type: GraphQLFloat },
				maximumPrice: { type: GraphQLFloat },
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
		addActivityPrice: {
			type: ActivityType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				price: { type: GraphQLFloat },
			},
			resolve(parentValue, { id, price }) {
				return Activity.addPrice(id, price);
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
				userPrices: {
					type: new GraphQLList(GraphQLFloat),
				},
				averagePrice: { type: GraphQLFloat },
				minimumPrice: { type: GraphQLFloat },
				maximumPrice: { type: GraphQLFloat },
			},
			resolve(
				parentValue,
				{
					id,
					user,
					name,
					description,
					destination,
					address,
					tags,
					userPrices,
					averagePrice,
					maximumPrice,
					minimumPrice,
				}
			) {
				return Activity.update(id, user, {
					name,
					description,
					destination,
					address,
					tags,
					userPrices,
					averagePrice,
					maximumPrice,
					minimumPrice,
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
				tags: {
					type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
				},
				userPrices: {
					type: new GraphQLList(GraphQLFloat),
				},
				averagePrice: { type: GraphQLFloat },
				minimumPrice: { type: GraphQLFloat },
				maximumPrice: { type: GraphQLFloat },
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
		addTransitTags: {
			type: TransitType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				tags: {
					type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
				},
			},
			resolve(parentValue, { id, tags }) {
				return Transit.addTags(id, tags);
			},
		},
		addTransitPrice: {
			type: TransitType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				price: { type: GraphQLFloat },
			},
			resolve(parentValue, { id, price }) {
				return Transit.addPrice(id, price);
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
				tags: {
					type: new GraphQLList(GraphQLString),
				},
				userPrices: {
					type: new GraphQLList(GraphQLFloat),
				},
				averagePrice: { type: GraphQLFloat },
				minimumPrice: { type: GraphQLFloat },
				maximumPrice: { type: GraphQLFloat },
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
					tags,
					userPrices,
					averagePrice,
					maximumPrice,
					minimumPrice,
				}
			) {
				return Transit.update(id, user, {
					name,
					description,
					startDestination,
					endDestination,
					tags,
					userPrices,
					averagePrice,
					maximumPrice,
					minimumPrice,
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
				tags: {
					type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
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
		addTripTags: {
			type: TripType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				tags: {
					type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
				},
			},
			resolve(parentValue, { id, tags }) {
				return Trip.addTags(id, tags);
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
				tags: {
					type: new GraphQLList(GraphQLString),
				},
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
					tags,
				}
			) {
				return Trip.update(id, user, {
					name,
					description,
					destinations,
					transits,
					activities,
					tags,
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
		addComment: {
			type: CommentType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				comment: { type: new GraphQLNonNull(GraphQLString) },
				user: { type: new GraphQLNonNull(GraphQLID) },
				modelName: { type: new GraphQLNonNull(GraphQLString) },
				modelId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parentValue, args) {
				return new Comment(args).save().then(comment => {
					switch (args.modelName) {
						case 'activity':
							return Activity.comment(
								args.modelId,
								comment._id
							).then(() => {
								return comment;
							});
							break;
						case 'trip':
							return Trip.comment(args.modelId, comment._id).then(
								() => {
									return comment;
								}
							);
							break;
						default:
							return new Error(
								'There was an error attaching comment'
							);
					}
				});
			},
		},
		deleteComment: {
			type: CommentType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				modelName: { type: new GraphQLNonNull(GraphQLString) },
				modelId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parentValue, { id }) {
				return Comment.deleteOne({ _id: id }).then(comment => {
					switch (args.modelName) {
						case 'activity':
							return Activity.uncomment(
								args.modelId,
								comment._id
							).then(() => {
								return comment;
							});
							break;
						case 'trip':
							return Trip.uncomment(
								args.modelId,
								comment._id
							).then(() => {
								return comment;
							});
							break;
						default:
							return new Error(
								'There was an error deleting comment'
							);
					}
				});
			},
		},
	},
});

module.exports = mutation;
