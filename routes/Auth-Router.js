import express from 'express';
import { getUser, loginUser, logoutUser, registerUser, updateUser } from '../controller/Auth-Controller.js';
import { protectedMiddleware } from '../middleware/authMiddleware.js';
import { allProduct, createProduct, getProductById } from '../controller/Product-Controller.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/get/user').get(protectedMiddleware, getUser);
router.route('/logout').delete(protectedMiddleware, logoutUser);
router.route('/update/user').patch(protectedMiddleware, updateUser);

router.route('/create/product').post(protectedMiddleware, createProduct);
router.route('/get/product').get(protectedMiddleware, allProduct);
router.route('/get/product/:id').get(protectedMiddleware, getProductById);

export default router;