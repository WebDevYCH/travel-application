const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const Comment = mongoose.model('comment');

const CommentType = new GraphQLObjectType({
	name: 'CommentType',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		comment: { type: GraphQLString },
		dateCreated: { type: GraphQLString },
		user: {
			type: require('./user_type'),
			resolve(parentValue) {
				return Comment.findById(parentValue)
					.populate('user')
					.then(comment => {
						return comment.user;
					});
			},
		},
	}),
});

module.exports = CommentType;
