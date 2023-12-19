import { Router } from 'express';
import { AuthController } from '../../app/controllers/';
import { checkJwt } from '../../app/middleware/'

const router = Router();

const authController = new AuthController();

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/account/status', authController.check)
router.get('/account/profile', checkJwt, authController.fetchProfile)

export default router;