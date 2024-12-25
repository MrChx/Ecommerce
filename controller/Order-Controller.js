import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../model/Product-Model.js";
import Order from "../model/Order-Model.js";

import logger from "../utils/logger.js";

export const createOrder = asyncHandler(async(req, res) => {
    logger.info("Incoming request body:", req.body);
    const {email, firstName, lastName, phone, cartItems} = req.body;

    const errors = [];
    
    if (!email) errors.push("Harus mengisi email");
    if (!firstName) errors.push("Harus mengisi nama depan");
    if (!lastName) errors.push("Harus mengisi nama belakang");
    if (!phone) errors.push("Harus mengisi nomor telepon");
    
    // Validasi cartItems
    if (!cartItems || !Array.isArray(cartItems)) {
        errors.push("Format keranjang belanja tidak valid");
    } else if (cartItems.length === 0) {
        errors.push("Keranjang belanja masih kosong");
    }

    if (errors.length > 0) {
        res.status(400);
        throw new Error(errors.join(", "));
    }

    let orderItems = [];
    let total = 0;

    for (const item of cartItems) {
        if (!item.productId || !item.quantity) {
            res.status(400);
            throw new Error("Setiap item harus memiliki productId dan quantity");
        }

        const product = await Product.findById(item.productId);
        
        if (!product) {
            res.status(400);
            throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`);
        }

        const orderItem = {
            quantity: item.quantity,
            name: product.name,
            price: product.price,
            productId: product._id
        };

        orderItems.push(orderItem);
        total += item.quantity * product.price;
    }

    const order = await Order.create({
        itemsDetail: orderItems,
        total,
        firstName,
        lastName,
        email,
        phone,
        user: req.user.id
    });
    
    return res.status(201).json({
        status: "success",
        data: order,
        message: "Order berhasil dibuat"
    });
});