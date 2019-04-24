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
		user: {
			type: require('./user_type'),
			resolve(parentValue) {
				return Destination.findById(parentValue)
					.populate('user')
					.then(destination => {
						// console.log(destination);
						return destination.user;
					});
			},
		},
	}),
});

module.exports = DestinationType;
