const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
	res.send('Hello World');
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
	console.log('Express app listening on port ' + port + '')
);
