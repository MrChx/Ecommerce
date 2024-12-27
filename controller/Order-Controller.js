import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../model/Product-Model.js";
import Order from "../model/Order-Model.js";
import logger from "../utils/logger.js";
import midtransClient from "midtrans-client";
import dotenv from "dotenv";
dotenv.config();

// Validasi server key
if (!process.env.MIDTRANS_SERVER_KEY) {
    throw new Error('MIDTRANS_SERVER_KEY is not set in environment variables');
}

// Inisialisasi Snap dengan error handling
let snap;
try {
    snap = new midtransClient.Snap({
        isProduction: true,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY
    });
} catch (error) {
    console.error('Error initializing Midtrans:', error);
    throw error;
}

// Fungsi untuk memvalidasi konfigurasi
const validateMidtransConfig = async () => {
    try {
        // Test configuration dengan transaksi minimal
        const testParam = {
            transaction_details: {
                order_id: `test-${Date.now()}`,
                gross_amount: 10000
            }
        };
        await snap.createTransaction(testParam);
        console.log('Midtrans configuration is valid');
        return true;
    } catch (error) {
        console.error('Midtrans configuration error:', error);
        return false;
    }
};

export { snap, validateMidtransConfig };

export const createOrder = asyncHandler(async(req, res) => {
    logger.info("Incoming request body:", req.body);
    const {email, firstName, lastName, phone, cartItems} = req.body;

    const errors = [];
    
    if (!email) errors.push("Harus mengisi email");
    if (!firstName) errors.push("Harus mengisi nama depan");
    if (!lastName) errors.push("Harus mengisi nama belakang");
    if (!phone) errors.push("Harus mengisi nomor telepon");
    
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
    let orderMidtrans = [];
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
            product: product._id
        };

        const orderItemMidtrans = {
            id: product._id.toString(),
            name: product.name.substring(0, 50), // Midtrans has character limit
            price: product.price,
            quantity: item.quantity
        };

        orderItems.push(orderItem);
        orderMidtrans.push(orderItemMidtrans);
        total += item.quantity * product.price;
    }

    const order = await Order.create({
        itemsDetail: orderItems,
        total,
        firstName,
        lastName,
        email,
        phone,
        user: req.user._id,
        status: 'pending'
    });

    let parameter = {
        transaction_details: {
            order_id: order._id.toString(),
            gross_amount: total
        },
        credit_card: {
            secure: true
        },
        item_details: orderMidtrans,
        customer_details: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone
        }
    };

    const token = await snap.createTransaction(parameter);
    
    return res.status(201).json({
        code: 201,
        status: "success",
        data: order,
        message: "Order berhasil dibuat",
        token: token.token
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

export const notifPayment = asyncHandler(async (req, res) => {
    try {
        const notification = await snap.transaction.notification(req.body);
        const orderId = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        logger.info(`Pemberitahuan pembayaran diterima. Order ID: ${orderId}, Transaksi status: ${transactionStatus}, Status: ${fraudStatus}`);

        const orderData = await Order.findById(orderId);

        if (!orderData) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Order dengan ID " + orderId + " tidak ditemukan",
            });
        }

        if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
            if (fraudStatus === 'accept') {
                // Update stock for each product
                for (const item of orderData.itemsDetail) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        product.stock -= item.quantity;
                        await product.save();
                    }
                }
                orderData.status = "success";
            }
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            orderData.status = "failed";
        } else if (transactionStatus === 'pending') {
            orderData.status = "pending";
        }

        await orderData.save();
        
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Proses notifikasi pembayaran berhasil",
        });
    } catch (error) {
        logger.error("Prosses pembayaran error:", error);
        return res.status(500).json({
            code: 500,
            status: "error",
            message: "Notifikasi pembayaran gagal"
        });
    }
});