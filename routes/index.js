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

// This is used to get full details about a store based on slug value
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

// This is used to display tag view 
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

module.exports = router;
