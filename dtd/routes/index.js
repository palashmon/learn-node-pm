const express = require('express');
const storeController = require('../controllers/storeController');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

// Show saved stores on Home page & stores page
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

// Add routes for adding a new store
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;
