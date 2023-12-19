import { Router } from 'express';
import { AdminController } from '../../app/controllers/';
import { checkJwt } from '../../app/middleware';

const router = Router();

const adminController = new AdminController();

router.put('/user/:userId/role', checkJwt, adminController.changeRole)
router.put('/user/:userId/username', checkJwt, adminController.forceChangeUsername)

export default router;