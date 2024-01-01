import { Router } from 'express';
import { AuthController } from '../../app/controllers/';
import { isAuthenticated } from '../../app/middleware/'

const router = Router();

const authController = new AuthController();

router.get('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/callback', authController.callback)
router.get('/profile', isAuthenticated, authController.fetchProfile)
router.get('/dashboard', isAuthenticated, authController.viewDashboard)

export default router;