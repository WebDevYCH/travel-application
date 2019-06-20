const mongoose = require('mongoose');
const graphql = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLFloat,
} = graphql;
const Transit = mongoose.model('transit');

const TransitType = new GraphQLObjectType({
	name: 'TransitType',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		dateCreated: { type: GraphQLString },
		description: { type: GraphQLString },
		user: {
			type: require('./user_type'),
			resolve(parentValue) {
				return Transit.findById(parentValue)
					.populate('user')
					.then(transit => {
						return transit.user;
					});
			},
		},
		startDestination: {
			type: require('./destination_type'),
			resolve(parentValue) {
				return Transit.findById(parentValue)
					.populate('startDestination')
					.then(transit => {
						return transit.startDestination;
					});
			},
		},
		endDestination: {
			type: require('./destination_type'),
			resolve(parentValue) {
				return Transit.findById(parentValue)
					.populate('endDestination')
					.then(transit => {
						return transit.endDestination;
					});
			},
		},
		likedBy: {
			type: new GraphQLList(require('./user_type')),
			resolve(parentValue) {
				return Transit.findById(parentValue)
					.populate('likedBy')
					.then(transit => {
						return transit.likedBy;
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
				return Transit.findById(parentValue)
					.populate('comments')
					.then(transit => {
						return transit.comments;
					});
			},
		},
	}),
});

module.exports = TransitType;
