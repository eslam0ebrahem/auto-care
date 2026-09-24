const router = require('express').Router();
const controller = require('../controllers/serviceController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.use(authMiddleware);

router.get('/', controller.getServices);
router.post('/', controller.addService);
router.delete('/:id', controller.deleteService);
router.patch('/:id', controller.updateService);

module.exports = router;