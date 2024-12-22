import express from 'express';
import { getUser, loginUser, logoutUser, registerUser, updateUser } from '../controller/Auth-Controller.js';
import { adminMiddleware, protectedMiddleware } from '../middleware/authMiddleware.js';
import { allProduct, createProduct, deleteProduct, getProductById, updateProduct } from '../controller/Product-Controller.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/get/user').get(protectedMiddleware, getUser);
router.route('/logout').delete(protectedMiddleware, logoutUser);
router.route('/update/user').patch(protectedMiddleware, updateUser);

router.route('/create/product').post(protectedMiddleware, adminMiddleware, createProduct);
router.route('/get/product').get(allProduct);
router.route('/get/product/:id').get(getProductById);
router.route('/update/product/:id').patch(protectedMiddleware, adminMiddleware, updateProduct);
router.route('/delete/product/:id').delete(protectedMiddleware, adminMiddleware, deleteProduct);

export default router;