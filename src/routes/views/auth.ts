import { Router } from 'express';
import { AuthController } from '../../app/controllers';
import { isAuthenticated } from '../../app/middleware'

const router = Router();

const authController = new AuthController();

router.get('/dashboard', isAuthenticated, authController.viewDashboard)

export default router;