const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index', { title: 'Home Page' });
};

// GET
exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

// POST
exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  res.redirect('/');
};

