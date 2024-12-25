// route.js
import express from 'express';
import { getUser, loginUser, logoutUser, registerUser, updateUser } from '../controller/Auth-Controller.js';
import { adminMiddleware, protectedMiddleware } from '../middleware/authMiddleware.js';
import { createProduct, deleteProduct, Fileupload, getAllProduct, getProductById, updateProduct } from '../controller/Product-Controller.js';
import { createOrder } from '../controller/Order-Controller.js';
import { uploadImage } from '../utils/uploadFileHandler.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/get/user').get(protectedMiddleware, getUser);
router.route('/logout').delete(protectedMiddleware, logoutUser);
router.route('/update/user').patch(protectedMiddleware, updateUser);

router.route('/create/product').post(protectedMiddleware, adminMiddleware, createProduct);
router.route('/get/product').get(getAllProduct);
router.route('/get/product/:id').get(getProductById);
router.route('/update/product/:id').patch(protectedMiddleware, adminMiddleware, updateProduct);
router.route('/delete/product/:id').delete(protectedMiddleware, adminMiddleware, deleteProduct);
router.route('/file-upload').post(protectedMiddleware, adminMiddleware, uploadImage.single('image'), Fileupload);

router.route('/create/order').post(protectedMiddleware, createOrder);

export default router;