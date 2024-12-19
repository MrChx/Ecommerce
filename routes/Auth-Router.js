import express from 'express';
import { getUser, loginUser, logoutUser, registerUser } from '../controller/Auth-Controller.js';
import { protectedMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/get/user').get(protectedMiddleware, getUser);
router.route('/logout').delete(protectedMiddleware, logoutUser);

export default router;