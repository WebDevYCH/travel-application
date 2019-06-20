const mongoose = require('mongoose');
const graphql = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
} = graphql;
const Destination = mongoose.model('destination');

const DestinationType = new GraphQLObjectType({
	name: 'DestinationType',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		dateCreated: { type: GraphQLString },
		description: { type: GraphQLString },
		climate: { type: GraphQLString },
		user: {
			type: require('./user_type'),
			resolve(parentValue) {
				return Destination.findById(parentValue)
					.populate('user')
					.then(destination => {
						return destination.user;
					});
			},
		},
		likedBy: {
			type: new GraphQLList(require('./user_type')),
			resolve(parentValue) {
				return Destination.findById(parentValue)
					.populate('likedBy')
					.then(destination => {
						return destination.likedBy;
					});
			},
		},
		tags: {
			type: new GraphQLList(GraphQLString),
		},
		comments: {
			type: new GraphQLList(require('./comment_type')),
			resolve(parentValue) {
				return Destination.findById(parentValue)
					.populate('comments')
					.then(destination => {
						return destination.comments;
					});
			},
		},
	}),
});

module.exports = DestinationType;
