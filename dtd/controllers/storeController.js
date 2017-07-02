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
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

// Get all the stores saved in DB
exports.getStores = async (req, res) => {
  // 1. Query the database for a list of all stores
  const stores = await Store.find();	
  res.render('stores', { title: 'Stores', stores });
};

