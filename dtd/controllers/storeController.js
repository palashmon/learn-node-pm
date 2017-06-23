exports.homePage = (req, res) => {
  res.render('index', { title: 'Home Page' });
};

// GET
exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

// POST
exports.createStore = (req, res) => {
  res.json(req.body);
};