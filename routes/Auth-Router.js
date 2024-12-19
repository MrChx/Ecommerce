import express from 'express';
import { loginUser, registerUser } from '../controller/Auth-Controller.js';

const router = express.Router();

router.route('/api/register').post(registerUser);
router.route('/api/login').post(loginUser);

export default router;