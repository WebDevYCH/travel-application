const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
// const mongoose = require('mongoose');

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		//
	}),
});

module.exports = RootQuery;
