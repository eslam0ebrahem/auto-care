import { Router } from 'express';
import {
  getVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', addVehicle);
router.patch('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;
