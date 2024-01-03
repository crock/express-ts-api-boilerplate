import { Router } from 'express';
import { AuthController } from '../../../app/controllers';
import { isAuthenticated } from '../../../app/middleware'

const router = Router();

const authController = new AuthController();

router.get('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/callback', authController.callback)
router.get('/profile', isAuthenticated, authController.fetchProfile)
router.post('/api-access/request', isAuthenticated, authController.requestApiAccess)
router.post('/api-access/revoke', isAuthenticated, authController.revokeApiAccess)

export default router;