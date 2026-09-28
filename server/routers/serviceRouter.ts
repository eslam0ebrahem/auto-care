import { Router } from 'express';
import {
  getServices,
  addService,
  deleteService,
  updateService,
} from '../controllers/serviceController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getServices);
router.post('/', addService);
router.delete('/:id', deleteService);
router.patch('/:id', updateService);

export default router;
