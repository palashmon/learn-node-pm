const express = require('express');
const storeController = require('../controllers/storeController');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', storeController.homePage);

// Add routes for adding a new store
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;
