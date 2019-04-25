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
			expect(users).to.have.lengthOf(1);
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
				.and('eq', 'Josh');
			cy.wrap(user)
				.should('have.property', 'email')
				.and('eq', 'test@gmail.com');
			cy.wrap(user)
				.should('have.property', 'password')
				.and('eq', 'test');
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
