const mongoose = require('mongoose');
const graphql = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLFloat,
} = graphql;
const Activity = mongoose.model('activity');

const ActivityType = new GraphQLObjectType({
	name: 'ActivityType',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		dateCreated: { type: GraphQLString },
		user: {
			type: require('./user_type'),
			resolve(parentValue) {
				return Activity.findById(parentValue)
					.populate('user')
					.then(activity => {
						return activity.user;
					});
			},
		},
		destination: {
			type: require('./destination_type'),
			resolve(parentValue) {
				return Activity.findById(parentValue)
					.populate('destination')
					.then(activity => {
						return activity.destination;
					});
			},
		},
		address: { type: GraphQLString },
		price: { type: GraphQLFloat },
		likedBy: {
			type: new GraphQLList(require('./user_type')),
			resolve(parentValue) {
				return Activity.findById(parentValue)
					.populate('likedBy')
					.then(activity => {
						return activity.likedBy;
					});
			},
		},
		tags: {
			type: new GraphQLList(GraphQLString),
		},
		userPrices: {
			type: new GraphQLList(GraphQLFloat),
		},
		averagePrice: { type: GraphQLFloat },
		minimumPrice: { type: GraphQLFloat },
		maximumPrice: { type: GraphQLFloat },
		comments: {
			type: new GraphQLList(require('./comment_type')),
			resolve(parentValue) {
				return Activity.findById(parentValue)
					.populate('comments')
					.then(activity => {
						return activity.comments;
					});
			},
		},
	}),
});

module.exports = ActivityType;
