import Product from "../model/Product-Model.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        return res.status(201).json({
            code: 201,
            status: "success",
            message: "Berhasil menambahkan produk",
            data: newProduct
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: "Terjadi kesalahan saat menambahkan produk",
            error: error.message
        });
    }
});

export const allProduct = asyncHandler(async (req, res) => {
    try {
        const data = await Product.find();
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Berhasil mendapatkan data semua produk",
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: "Terjadi kesalahan saat mendapatkan data semua produk",
            error: error.message
        });
    }
});

export const getProductById = asyncHandler(async (req, res) => {
    const paramsId = req.params.id;
    try {
        const productData = await Product.findById(paramsId);

        if (!productData) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Produk yang anda cari tidak ditemukan"
            });
        }

        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Berhasil mendapatkan data produk",
            data: productData
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: "Terjadi kesalahan saat mendapatkan data produk",
            error: error.message
        });
    }
});
