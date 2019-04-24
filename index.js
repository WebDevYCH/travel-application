const app = require('./server/server');

const port = process.env.PORT || 5000;
app.listen(port, () =>
	console.log(
		`Please visit application at http://localhost:${port}
You may test GraphQL queries at http://localhost:${port}/graphql`
	)
);
