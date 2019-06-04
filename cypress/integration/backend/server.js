describe('GraphQL Live Server:', () => {
	let createdUserID;
	let createdDestinationID;
	let createdDestinationID2;
	let createdActivityID;
	let createdUserAtTime;
	let createdTransitID;

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
				.and('eq', 'test');
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
				.and('eq', 'test1234');
		});
	});

	it('adds a destination', () => {
		const addDestinationQuery = `mutation {
			addDestination(title: "Test Destination", description: "It is a test. It is awesome if it works", user: "${createdUserID}") {
				id
				title
				user {
					id
					name
					email
				}
				description
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
			cy.wrap(destinationData).should('have.property', 'user');
		});
	});

	it('adds a second destination', () => {
		const addDestinationQuery = `mutation {
			addDestination(title: "Test Destination 2", description: "It is a test. It is awesome if it works", user: "${createdUserID}") {
				id
				title
				user {
					id
					name
					email
				}
				description
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
			cy.wrap(destinationData).should('have.property', 'user');
		});
	});

	it('adds an activity', () => {
		const addActivityQuery = `mutation {
			addActivity(name: "Test activity", description: "This is a test activity", user: "${createdUserID}", destination: "${createdDestinationID}", address: "Test Address") {
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
				}
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
			addTransit(name: "Test Transit", description: "Test Transit Description", user: "${createdUserID}", startDestination: "${createdDestinationID}", endDestination: "${createdDestinationID2}") {
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
				.and('eq', 'test1234');
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

	it('likes a destination', () => {
		const likeDestinationQuery = `mutation {
			toggleDestinationLike(id: "${createdDestinationID}", userId: "${createdUserID}") {
				title
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
			body: { query: likeDestinationQuery },
			failOnStatusCode: false,
		}).then(res => {
			cy.log(res);
			const destination = res.body.data.toggleDestinationLike;
			cy.wrap(destination)
				.should('have.property', 'likedBy')
				.its('length')
				.should('be.gt', 0);
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
		});
	});

	it('updates a destination', () => {
		const updateDestination = `mutation {
			updateDestination(id: "${createdDestinationID}", user: "${createdUserID}", title: "Updated Destination Title", description: "Updated destination description") {
				title
				description
				user {
					name
				}
				dateCreated
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
				.should('be', 0);
		});
	});

	it('updates an activity', () => {
		const updateActivity = `mutation {
			updateActivity(id: "${createdActivityID}", user: "${createdUserID}", name: "Updated Activity Name", description: "Updated Activity Description", address: "Updated Activity Address, 01945") {
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
		});
	});

	// it('updates a transit', () => {
	// 	const updateTransit = `mutation {
	// 		updateTransit(id: "${createdTransitID}", user: "${createdUserID}", name: "Updated Transit Name", description: "Updated Transit Description", startDestination: "${createdDestinationID2}", endDestination: "${createdDestinationID}") {
	// 			name
	// 			description
	// 			startDestination {
	// 				title
	// 			}
	// 			endDestination {
	// 				title
	// 			}
	// 	}`;

	// 	cy.request({
	// 		url: '/graphql',
	// 		method: 'POST',
	// 		body: { query: updateTransit },
	// 		failOnStatusCode: false,
	// 	}).then(res => {
	// 		cy.log(res);
	// 		const transit = res.body.data.updateTransit;
	// 		cy.wrap(transit)
	// 			.should('have.property', 'name')
	// 			.should('eq', 'Updated Transit Name');
	// 		cy.wrap(transit)
	// 			.should('have.property', 'description')
	// 			.should('eq', 'Updated Transit Description');
	// 		cy.wrap(transit)
	// 			.should('have.property', 'startDestination')
	// 			.should('eq', createdDestinationID2);
	// 		cy.wrap(transit)
	// 			.should('have.property', 'endDestination')
	// 			.should('eq', createdDestinationID);
	// 	});
	// });

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
});
