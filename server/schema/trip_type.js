const mongoose = require('mongoose');
const graphql = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
} = graphql;
const Trip = mongoose.model('trip');

const TripType = new GraphQLObjectType({
	name: 'TripType',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		dateCreated: { type: GraphQLString },
		description: { type: GraphQLString },
		user: {
			type: require('./user_type'),
			resolve(parentValue) {
				return Trip.findById(parentValue)
					.populate('user')
					.then(trip => {
						return trip.user;
					});
			},
		},
		destinations: {
			type: require('./destination_type'),
			resolve(parentValue) {
				return Trip.findById(parentValue)
					.populate('destinations')
					.then(trip => {
						return trip.destinations;
					});
			},
		},
		transits: {
			type: require('./transit_type'),
			resolve(parentValue) {
				return Trip.findById(parentValue)
					.populate('transits')
					.then(trip => {
						return trip.transits;
					});
			},
		},
		activities: {
			type: require('./activity_type'),
			resolve(parentValue) {
				return Trip.findById(parentValue)
					.populate('activities')
					.then(trip => {
						return trip.activities;
					});
			},
		},
		likedBy: {
			type: new GraphQLList(require('./user_type')),
			resolve(parentValue) {
				return Trip.findById(parentValue)
					.populate('likedBy')
					.then(trip => {
						return trip.likedBy;
					});
			},
		},
	}),
});

module.exports = TripType;
