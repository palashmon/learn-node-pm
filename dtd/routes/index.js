const express = require('express');

const router = express.Router();

// Do work here
router.get('/', (req, res) => {
	const obj = { name: 'Palash', age: 100, cool: true};
  //res.send('Hey! It works 🎉🎉🎉');

	// Send json data back as response
	//res.json(obj);

	// Get request query params here using `req`
	// Check if `req.query` is an empty object
	// if(Object.keys(req.query).length === 0)
	// 	res.send('No request query string found...');		
	// else
	// 	res.send(req.query);

  // Using the hello pug file inside the view folder
	res.render('hello', {
		name: 'Palash', age: 100
	});
});

// New route to reverse
router.get('/reverse/:name', (req, res) => {
	const reverse = [...req.params.name].reverse().join('');
	res.send(`Request param name value is: ${req.params.name}<br/>And reverse value is: ${reverse}`);
});

module.exports = router;
