import express from 'express';
import { registerUser } from '../controller/Auth-Controller.js';

const router = express.Router();

router.route('/api/register').post(registerUser);

export default router;