describe('GraphQL Live Server:', () => {
	let createdUserID;
	let createdDestinationID;
	let createdActivityID;

	it('creates a user', () => {
		const addUserQuery = `mutation {
			addUser(name: "Josh", email: "test@gmail.com", password: "test") {
				  id
				  name
				  email
				  password
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

	it('deletes a destination', () => {
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
});
