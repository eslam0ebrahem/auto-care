const router = require('express').Router();
const controller = require('../controllers/vehicleController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.use(authMiddleware);

router.get('/', controller.getVehicles);
router.get('/:id', controller.getVehicleById);
router.post('/', controller.addVehicle);
router.patch('/:id', controller.updateVehicle);
router.delete('/:id', controller.deleteVehicle);

module.exports = router;