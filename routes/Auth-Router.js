import express from 'express';
import { getUser, loginUser, logoutUser, registerUser, updateUser } from '../controller/Auth-Controller.js';
import { protectedMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/get/user').get(protectedMiddleware, getUser);
router.route('/logout').delete(protectedMiddleware, logoutUser);
router.route('/update/user').patch(protectedMiddleware, updateUser);

export default router;