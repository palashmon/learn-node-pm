const express = require('express');
const storeController = require('../controllers/storeController');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

// Show saved stores on Home page & stores page
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

// Add routes for adding a new store
router.get('/add', storeController.addStore);

// Upload & resize images first, if any file was uploaded
// then create or update store
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/stores/:id/edit', catchErrors(storeController.editStore));

module.exports = router;
