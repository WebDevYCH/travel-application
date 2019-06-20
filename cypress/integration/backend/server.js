describe('GraphQL Live Server:', () => {
	let createdUserID;
	let createdDestinationID;
	let createdDestinationID2;
	let createdActivityID;
	let createdUserAtTime;
	let createdTransitID;
	let createdTripID;
	let createdCommentID;
	let createdCommentID2;

	it('creates a user', () => {
		const addUserQuery = `mutation {
			addUser(name: "Josh", email: "test@gmail.com", password: "test") {
				  id
				  name
				  email
				  password
				  dateCreated
			}
		}`;

		cy.request({
			url: 'graphql',
			method: 'POST',
			body: { query: addUserQuery },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
			const userData = res.body.data.addUser;
			createdUserID = userData.id;
			createdUserAtTime = userData.dateCreated;
			cy.wrap(userData)
				.should('have.property', 'name')
				.and('eq', 'Josh');
			cy.wrap(userData)
				.should('have.property', 'email')
				.and('eq', 'test@gmail.com');
			cy.wrap(userData)
				.should('have.property', 'password')
				.and('not.eq', 'test');
		});
	});

	it('updates a user', () => {
		const updateUserQuery = `mutation {
			updateUser(id: "${createdUserID}", name: "Bill", email: "bill@gmail.com", password: "test1234") {
				name
				email
				password
			}
		}`;

		cy.request({
			url: 'graphql',
			method: 'POST',
			body: { query: updateUserQuery },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
			const user = res.body.data.updateUser;
			cy.wrap(user)
				.should('have.property', 'name')
				.and('eq', 'Bill');
			cy.wrap(user)
				.should('have.property', 'email')
				.and('eq', 'bill@gmail.com');
			cy.wrap(user)
				.should('have.property', 'password')
				.and('not.eq', 'test1234');
		});
	});

	it('adds a destination', () => {
		const addDestinationQuery = `mutation {
			addDestination(title: "Test Destination", description: "It is a test. It is awesome if it works", user: "${createdUserID}", climate: "cold", tags: ["First Destination", "Fun"]) {
				id
				title
				user {
					id
					name
					email
				}
				description
				climate
				tags
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addDestinationQuery },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
			const destinationData = res.body.data.addDestination;
			createdDestinationID = destinationData.id;
			cy.wrap(destinationData)
				.should('have.property', 'title')
				.and('eq', 'Test Destination');
			cy.wrap(destinationData)
				.should('have.property', 'description')
				.and('eq', 'It is a test. It is awesome if it works');
			cy.wrap(destinationData)
				.should('have.property', 'climate')
				.and('eq', 'cold');
			cy.wrap(destinationData).should('have.property', 'user');
		});
	});

	it('adds a second destination', () => {
		const addDestinationQuery = `mutation {
			addDestination(title: "Test Destination 2", description: "It is a test. It is awesome if it works", user: "${createdUserID}", climate: "warm", tags: ["Second Destination", "Lame"]) {
				id
				title
				user {
					id
					name
					email
				}
				description
				climate
				tags
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addDestinationQuery },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
			const destinationData = res.body.data.addDestination;
			createdDestinationID2 = destinationData.id;
			cy.wrap(destinationData)
				.should('have.property', 'title')
				.and('eq', 'Test Destination 2');
			cy.wrap(destinationData)
				.should('have.property', 'description')
				.and('eq', 'It is a test. It is awesome if it works');
			cy.wrap(destinationData)
				.should('have.property', 'climate')
				.and('eq', 'warm');
			cy.wrap(destinationData).should('have.property', 'user');
		});
	});

	it('adds an activity', () => {
		const addActivityQuery = `mutation {
			addActivity(name: "Test activity", description: "This is a test activity", user: "${createdUserID}", destination: "${createdDestinationID}", address: "Test Address", tags: ["First Activity Tag", "Blah"], userPrices: [1700.1], averagePrice: 1700.1, minimumPrice: 1700.1, maximumPrice: 1700.1) {
				id
				name
				description
				user {
					name
					email
				}
				destination {
					title
					description
					climate
				}
				tags
				userPrices
				averagePrice
				minimumPrice
				maximumPrice
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addActivityQuery },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
			const activityData = res.body.data.addActivity;
			createdActivityID = activityData.id;
		});
	});

	it('adds a transit', () => {
		const addTransitQuery = `mutation {
			addTransit(name: "Test Transit", description: "Test Transit Description", user: "${createdUserID}", startDestination: "${createdDestinationID}", endDestination: "${createdDestinationID2}", tags: ["Transit One Tag" , "Boring"], userPrices: [1700.1], averagePrice: 1700.1, minimumPrice: 1700.1, maximumPrice: 1700.1) {
				id
				name
				description
				user {
					name
					email
				}
				startDestination {
					title
					description
				}
				endDestination {
					title
					description
				}
				tags
				userPrices
				averagePrice
				minimumPrice
				maximumPrice
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addTransitQuery },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
			const transitData = res.body.data.addTransit;
			createdTransitID = transitData.id;
		});
	});

	it('adds a trip', () => {
		const addTrip = `mutation {
			addTrip(name: "Test Trip", description: "Test Trip Description", user: "${createdUserID}", destinations: ["${createdDestinationID}", "${createdDestinationID2}"], transits: ["${createdTransitID}"], activities: ["${createdActivityID}"], tags: ["Trip Tag", "Super Duper Fun"]) {
				id
				name
				description
				dateCreated
				user {
					name
					email
				}
				destinations {
					title
					description
				}
				transits {
					name
					description
				}
				activities {
					name
					description
				}
				tags
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addTrip },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
			const trip = res.body.data.addTrip;
			createdTripID = trip.id;
			cy.wrap(trip)
				.should('have.property', 'name')
				.and('eq', 'Test Trip');
			cy.wrap(trip)
				.should('have.property', 'description')
				.and('eq', 'Test Trip Description');
			cy.wrap(trip)
				.should('have.property', 'destinations')
				.its('length')
				.should('be', 2);
			cy.wrap(trip)
				.should('have.property', 'transits')
				.its('length')
				.should('be', 1);
			cy.wrap(trip)
				.should('have.property', 'activities')
				.its('length')
				.should('be', 1);
			cy.wrap(trip)
				.should('have.property', 'tags')
				.its('length')
				.should('be', 2);
		});
	});

	it('finds all users', () => {
		const findAllUsersQuery = `{
			users {
				id
				name
				email
				password
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: findAllUsersQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const users = res.body.data.users;
			cy.wrap(users)
				.its('length')
				.should('be.gt', 0);
		});
	});

	it('finds user by id', () => {
		const findUserByIdQuery = `{
			user(id: "${createdUserID}") {
				id
				name
				email
				password
				dateCreated
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: findUserByIdQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const user = res.body.data.user;
			cy.wrap(user)
				.should('have.property', 'name')
				.and('eq', 'Bill');
			cy.wrap(user)
				.should('have.property', 'email')
				.and('eq', 'bill@gmail.com');
			cy.wrap(user)
				.should('have.property', 'password')
				.and('not.eq', 'test1234');
			cy.wrap(user) // Date created remains the same after update
				.should('have.property', 'dateCreated')
				.and('eq', createdUserAtTime);
		});
	});

	it('finds destination by id', () => {
		const findDestinationByIdQuery = `{
			destination(id: "${createdDestinationID}") {
				title
				dateCreated
				description 
				user {
					name
				}
				likedBy {
					name
				}
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: findDestinationByIdQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const destination = res.body.data.destination;
			cy.wrap(destination)
				.should('have.property', 'title')
				.and('eq', 'Test Destination');
		});
	});

	it('finds activity by id', () => {
		const findActivityByIdQuery = `{
			activity(id: "${createdActivityID}") {
				name
				description 
				user {
					name
				}
				destination {
					title
				}
				address
				price
				likedBy {
					name
				}
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: findActivityByIdQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const activity = res.body.data.activity;
			cy.wrap(activity)
				.should('have.property', 'name')
				.and('eq', 'Test activity');
		});
	});

	it('comments on a destination', () => {
		const addComment = `mutation {
			addComment(title: "It was a good destination", comment: "That is all there is to say", user: "${createdUserID}", modelName: "destination", modelId: "${createdDestinationID}") {
				id
				title
				comment
				user {
					name
					email
				}
				dateCreated
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addComment },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const comment = res.body.data.addComment;
			createdCommentID2 = comment.id;
			cy.wrap(comment)
				.should('have.property', 'title')
				.should('eq', 'It was a good destination');
		});
	});

	it('likes a destination & checks comments', () => {
		const likeDestinationQuery = `mutation {
			toggleDestinationLike(id: "${createdDestinationID}", userId: "${createdUserID}") {
				title
				likedBy {
				  id
				  name
				  email
				}
				comments {
					title
					comment
				}
			  }
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: likeDestinationQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const destination = res.body.data.toggleDestinationLike;
			cy.wrap(destination)
				.should('have.property', 'likedBy')
				.its('length')
				.should('be.gt', 0);
			cy.wrap(destination)
				.should('have.property', 'comments')
				.its('length')
				.should('eq', 1);
		});
	});

	it('deletes comment on an destination', () => {
		const deleteComment = `mutation {
			deleteComment(id: "${createdCommentID2}", modelName: "destination", modelId: "${createdDestinationID}") {
				id
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: deleteComment },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const destination = res.body.data.deleteComment;
		});
	});

	it('dislikes a destination', () => {
		const likeDestinationQuery = `mutation {
			toggleDestinationLike(id: "${createdDestinationID}", userId: "${createdUserID}") {
				title
				likedBy {
				  id
				  name
				  email
				}
				comments {
					title
					comment
				}
			  }
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: likeDestinationQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const destination = res.body.data.toggleDestinationLike;
			cy.wrap(destination)
				.should('have.property', 'title')
				.and('eq', 'Test Destination');
			cy.wrap(destination)
				.should('have.property', 'likedBy')
				.its('length')
				.should('be', 0);
			cy.wrap(destination)
				.should('have.property', 'comments')
				.its('length')
				.should('be', 0);
		});
	});

	it('adds tags to a destination', () => {
		const addTagsToDestination = `mutation {
			addDestinationTags(id: "${createdDestinationID}", tags: ["Added Destination Tag"]) {
				title
				tags
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addTagsToDestination },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const destination = res.body.data.addDestinationTags;
			cy.wrap(destination)
				.should('have.property', 'title')
				.and('eq', 'Test Destination');
			cy.wrap(destination)
				.should('have.property', 'tags')
				.its('length')
				.should('eq', 3);
		});
	});

	it('updates a destination', () => {
		const updateDestination = `mutation {
			updateDestination(id: "${createdDestinationID}", user: "${createdUserID}", title: "Updated Destination Title", description: "Updated destination description", tags: ["Updated Destination Tag"]) {
				title
				description
				user {
					name
				}
				dateCreated
				tags
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: updateDestination },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const destination = res.body.data.updateDestination;
			cy.wrap(destination)
				.should('have.property', 'title')
				.should('eq', 'Updated Destination Title');
			cy.wrap(destination)
				.should('have.property', 'description')
				.should('eq', 'Updated destination description');
			cy.wrap(destination)
				.should('have.property', 'tags')
				.its('length')
				.should('eq', 1);
		});
	});

	it('likes a activity', () => {
		const toggleActivityLike = `mutation {
			toggleActivityLike(id: "${createdActivityID}", userId: "${createdUserID}") {
				name
				likedBy {
				  id
				  name
				  email
				}
			  }
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: toggleActivityLike },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const destination = res.body.data.toggleActivityLike;
			cy.wrap(destination)
				.should('have.property', 'likedBy')
				.its('length')
				.should('be.gt', 0);
		});
	});

	it('dislikes a activity', () => {
		const toggleActivityLike = `mutation {
			toggleActivityLike(id: "${createdActivityID}", userId: "${createdUserID}") {
				name
				likedBy {
				  id
				  name
				  email
				}
			  }
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: toggleActivityLike },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const destination = res.body.data.toggleActivityLike;
			cy.wrap(destination)
				.should('have.property', 'likedBy')
				.its('length')
				.should('eq', 0);
		});
	});

	it('adds tags to a activity', () => {
		const addTagsToActivity = `mutation {
			addActivityTags(id: "${createdActivityID}", tags: ["Added Activity Tag"]) {
				name
				tags
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addTagsToActivity },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const activity = res.body.data.addActivityTags;
			cy.wrap(activity)
				.should('have.property', 'tags')
				.its('length')
				.should('eq', 3);
		});
	});

	it('adds price to activity', () => {
		const addActivityPrice = `mutation {
			addActivityPrice(id: "${createdActivityID}", price: 1000.45) {
				name
				userPrices
				averagePrice
				minimumPrice
				maximumPrice
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addActivityPrice },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const activity = res.body.data.addActivityPrice;
			cy.wrap(activity)
				.should('have.property', 'minimumPrice')
				.should('eq', 1000.45);
			cy.wrap(activity)
				.should('have.property', 'maximumPrice')
				.should('eq', 1700.1);
			cy.wrap(activity)
				.should('have.property', 'averagePrice')
				.should('eq', 1350.275);
			cy.wrap(activity)
				.should('have.property', 'userPrices')
				.its('length')
				.should('eq', 2);
		});
	});

	it('comments on an activity', () => {
		const addComment = `mutation {
			addComment(title: "It was a good activity", comment: "That is all there is to say", user: "${createdUserID}", modelName: "activity", modelId: "${createdActivityID}") {
				id
				title
				comment
				user {
					name
					email
				}
				dateCreated
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addComment },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const comment = res.body.data.addComment;
			createdCommentID = comment.id;
			cy.wrap(comment)
				.should('have.property', 'title')
				.should('eq', 'It was a good activity');
		});
	});

	it('updates an activity & checks existence of comment', () => {
		const updateActivity = `mutation {
			updateActivity(id: "${createdActivityID}", user: "${createdUserID}", name: "Updated Activity Name", description: "Updated Activity Description", address: "Updated Activity Address, 01945", tags: ["Updated Activity Tag"], userPrices: [1800.1], averagePrice: 1800.1, minimumPrice: 1800.1, maximumPrice: 1800.1) {
				id
				name
				description
				user {
					name
				}
				destination {
					title
				}
				address
				tags
				userPrices
				averagePrice
				minimumPrice
				maximumPrice
				comments {
					title
					comment
				}
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: updateActivity },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const activity = res.body.data.updateActivity;
			cy.wrap(activity)
				.should('have.property', 'name')
				.should('eq', 'Updated Activity Name');
			cy.wrap(activity)
				.should('have.property', 'description')
				.should('eq', 'Updated Activity Description');
			cy.wrap(activity)
				.should('have.property', 'address')
				.should('eq', 'Updated Activity Address, 01945');
			cy.wrap(activity)
				.should('have.property', 'tags')
				.its('length')
				.should('eq', 1);
			cy.wrap(activity)
				.should('have.property', 'comments')
				.its('length')
				.should('eq', 1);
		});
	});

	it('deletes comment on an activity', () => {
		const deleteComment = `mutation {
			deleteComment(id: "${createdCommentID}", modelName: "activity", modelId: "${createdActivityID}") {
				id
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: deleteComment },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const transit = res.body.data.deleteComment;
		});
	});

	it('successfully has deleted comment', () => {
		const findActivityByIdQuery = `{
			activity(id: "${createdActivityID}") {
				comments {
					title
					comment
				}
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: findActivityByIdQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const activity = res.body.data.activity;
			cy.wrap(activity)
				.should('have.property', 'comments')
				.its('length')
				.should('eq', 0);
		});
	});

	it('likes a transit', () => {
		const toggleTransitLike = `mutation {
			toggleTransitLike(id: "${createdTransitID}", userId: "${createdUserID}") {
				name
				likedBy {
				  id
				  name
				  email
				}
			  }
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: toggleTransitLike },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const transit = res.body.data.toggleTransitLike;
			cy.wrap(transit)
				.should('have.property', 'likedBy')
				.its('length')
				.should('be.gt', 0);
		});
	});

	it('dislikes a transit', () => {
		const toggleTransitLike = `mutation {
			toggleTransitLike(id: "${createdTransitID}", userId: "${createdUserID}") {
				name
				likedBy {
				  id
				  name
				  email
				}
			  }
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: toggleTransitLike },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const transit = res.body.data.toggleTransitLike;
			cy.wrap(transit)
				.should('have.property', 'likedBy')
				.its('length')
				.should('be', 0);
		});
	});

	it('adds tags to a transit & ignores duplicate', () => {
		const addTagsToTransit = `mutation {
			addTransitTags(id: "${createdTransitID}", tags: ["Added Activity Tag", "Boring"]) {
				name
				tags
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addTagsToTransit },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const transit = res.body.data.addTransitTags;
			cy.wrap(transit)
				.should('have.property', 'tags')
				.its('length')
				.should('eq', 3);
		});
	});

	it('adds price to transit', () => {
		const addTransitPrice = `mutation {
			addTransitPrice(id: "${createdTransitID}", price: 1000.45) {
				name
				userPrices
				averagePrice
				minimumPrice
				maximumPrice
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addTransitPrice },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const transit = res.body.data.addTransitPrice;
			cy.wrap(transit)
				.should('have.property', 'minimumPrice')
				.should('eq', 1000.45);
			cy.wrap(transit)
				.should('have.property', 'maximumPrice')
				.should('eq', 1700.1);
			cy.wrap(transit)
				.should('have.property', 'averagePrice')
				.should('eq', 1350.275);
			cy.wrap(transit)
				.should('have.property', 'userPrices')
				.its('length')
				.should('eq', 2);
		});
	});

	it('updates a transit', () => {
		const updateTransit = `mutation {
			updateTransit(id: "${createdTransitID}", user: "${createdUserID}", name: "Updated Transit Name", description: "Updated Transit Description", startDestination: "${createdDestinationID2}", endDestination: "${createdDestinationID}", userPrices: [1800.1], averagePrice: 1800.1, minimumPrice: 1800.1, maximumPrice: 1800.1) {
				name
				description
				startDestination {
					title
					description
				}
				endDestination {
					title
					description
				}
				user {
					name
				}
				userPrices
				averagePrice
				maximumPrice
				minimumPrice
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: updateTransit },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const transit = res.body.data.updateTransit;
			cy.wrap(transit)
				.should('have.property', 'name')
				.should('eq', 'Updated Transit Name');
			cy.wrap(transit)
				.should('have.property', 'description')
				.should('eq', 'Updated Transit Description');
		});
	});

	it('comments on a trip', () => {
		const addComment = `mutation {
			addComment(title: "It was a good trip", comment: "That is all there is to say", user: "${createdUserID}", modelName: "trip", modelId: "${createdTripID}") {
				id
				title
				comment
				user {
					name
					email
				}
				dateCreated
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addComment },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const comment = res.body.data.addComment;
			createdCommentID = comment.id;
			cy.wrap(comment)
				.should('have.property', 'title')
				.should('eq', 'It was a good trip');
		});
	});

	it('likes a trip & has comments', () => {
		const toggleTripLike = `mutation {
			toggleTripLike(id: "${createdTripID}", userId: "${createdUserID}") {
				name
				likedBy {
				  id
				  name
				  email
				}
				comments {
					title
					comment
				}
			  }
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: toggleTripLike },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const trip = res.body.data.toggleTripLike;
			cy.wrap(trip)
				.should('have.property', 'likedBy')
				.its('length')
				.should('be.gt', 0);
			cy.wrap(trip)
				.should('have.property', 'comments')
				.its('length')
				.should('be', 1);
		});
	});

	it('deletes comment on an trip', () => {
		const deleteComment = `mutation {
			deleteComment(id: "${createdCommentID}", modelName: "trip", modelId: "${createdTripID}") {
				id
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: deleteComment },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const comment = res.body.data.deleteComment;
		});
	});

	it('dislikes a trip & shows no comments', () => {
		const toggleTripLike = `mutation {
			toggleTripLike(id: "${createdTripID}", userId: "${createdUserID}") {
				name
				likedBy {
				  id
				  name
				  email
				}
				comments {
					title
					comment
				}
			  }
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: toggleTripLike },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const trip = res.body.data.toggleTripLike;
			cy.wrap(trip)
				.should('have.property', 'likedBy')
				.its('length')
				.should('eq', 0);
			cy.wrap(trip)
				.should('have.property', 'comments')
				.its('length')
				.should('eq', 0);
		});
	});

	it('adds tags to a trip', () => {
		const addTagsToTrip = `mutation {
			addTripTags(id: "${createdTripID}", tags: ["Added Trip Tag"]) {
				name
				tags
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: addTagsToTrip },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const trip = res.body.data.addTripTags;
			cy.wrap(trip)
				.should('have.property', 'tags')
				.its('length')
				.should('eq', 3);
		});
	});

	it('updates a trip', () => {
		const updateTrip = `mutation {
			updateTrip(id: "${createdTripID}", user: "${createdUserID}", name: "Updated Trip Name", description: "Updated Trip Description", destinations: ["${createdDestinationID2}", "${createdDestinationID}"], transits: ["${createdTransitID}"], activities: ["${createdActivityID}"], tags: ["Updated Trip Tag"]) {
				name
				description
				user {
					name
				}
				tags
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: updateTrip },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const trip = res.body.data.updateTrip;
			cy.wrap(trip)
				.should('have.property', 'name')
				.should('eq', 'Updated Trip Name');
			cy.wrap(trip)
				.should('have.property', 'description')
				.should('eq', 'Updated Trip Description');
			cy.wrap(trip)
				.should('have.property', 'tags')
				.its('length')
				.should('eq', 1);
		});
	});

	it('deletes an activity', () => {
		const deleteActivityQuery = `mutation {
			deleteActivity(id: "${createdActivityID}") {
				id
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: deleteActivityQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
		});
	});

	it('deletes first destination', () => {
		const deleteDestinationQuery = `mutation {
			deleteDestination(id: "${createdDestinationID}") {
				id
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: deleteDestinationQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
		});
	});

	it('deletes second destination', () => {
		const deleteDestinationQuery = `mutation {
			deleteDestination(id: "${createdDestinationID2}") {
				id
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: deleteDestinationQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
		});
	});

	it('deletes a user', () => {
		const deleteUserQuery = `mutation {
			deleteUser(id: "${createdUserID}") {
				id
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: deleteUserQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
		});
	});

	it('deletes a transit', () => {
		const deleteTransitQuery = `mutation {
			deleteTransit(id: "${createdTransitID}") {
				id
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: deleteTransitQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
		});
	});

	it('deletes a trip', () => {
		const deleteTripQuery = `mutation {
			deleteTrip(id: "${createdTripID}") {
				id
			}
		}`;

		cy.request({
			url: '/graphql',
			method: 'POST',
			body: { query: deleteTripQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
		});
	});
});
