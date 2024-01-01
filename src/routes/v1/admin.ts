import { Router } from 'express';
import { AdminController } from '../../app/controllers/';
import { isAuthenticated } from '../../app/middleware';

const router = Router();

const adminController = new AdminController();

router.put('/user/:userId/role', isAuthenticated, adminController.changeRole)
router.put('/user/:userId/username', isAuthenticated, adminController.forceChangeUsername)

export default router;