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
        code: 201,
        status: "success",
        data: order,
        message: "Order berhasil dibuat"
    });
});

export const AllOrder = asyncHandler(async(req, res) => {

    if (!req.user) {
        res.status(401);
        throw new Error("tidak memiliki akses silahkan login terlebih dahulu");
    }

    const orders = await Order.find();

    if (!orders || orders.length === 0) {
        res.status(404);
        throw new Error("Data masih kosong");
    }

    return res.status(200).json({
        code: 200,
        status: "success",
        message: "Berhasil menampilkan semua order",
        data: orders
    });
});

export const detailOrder = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            code: 401,
            status: "error",
            message: "tidak memiliki akses silahkan login terlebih dahulu",
        });
    }

    if (!req.params.id) {
        return res.status(400).json({
            code: 400,
            status: "error",
            message: "Harap cantumkan Id Order",
        });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            code: 404,
            status: "error",
            message: "Order tidak ditemukan",
        });
    }

    return res.status(200).json({
        code: 200,
        status: "success",
        data: order,
        message: "Berhasil menampilkan detail order",
    });
});

export const currentUserOrder = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            code: 401,
            status: "error",
            message: "tidak memiliki akses silahkan login terlebih dahulu",
        });
    }

    const orders = await Order.find({ 'user': req.user.id });

    if (orders.length === 0) {
        return res.status(404).json({
            code: 404,
            status: "error",
            message: "User belum melakukan order barang",
        });
    }

    return res.status(200).json({
        code: 200,
        status: "success",
        data: orders,
        message: "Berhasil menampilkan order user",
    });
});