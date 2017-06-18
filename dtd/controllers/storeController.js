exports.myMiddleware = (req, res, next) => {
	req.name = 'Palash';
	if(req.name === 'Palash'){
		throw Error('Please enter a valid name!');
	}
	next();
};

exports.homePage = (req, res) => {
	console.log(req.name);
  res.render('index', { title: 'Home Page' });
};