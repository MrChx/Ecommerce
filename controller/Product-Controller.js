import Product from "../model/Product-Model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import mongoose from "mongoose";

export const createProduct = asyncHandler(async (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        res.status(400);
        throw new Error("Nama dan harga produk harus disediakan");
    }

    const newProduct = await Product.create(req.body);
    return res.status(201).json({
        code: 201,
        status: "success",
        message: "Berhasil menambahkan produk",
        data: newProduct
    });
});

export const allProduct = asyncHandler(async (req, res) => {
    const data = await Product.find();
    return res.status(200).json({
        code: 200,
        status: "success",
        message: "Berhasil mendapatkan data semua produk",
        data: data
    });
});

export const getProductById = asyncHandler(async (req, res) => {
    const paramsId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(paramsId)) {
        res.status(400);
        throw new Error("ID produk tidak valid");
    }

    const productData = await Product.findById(paramsId);

    if (!productData) {
        res.status(404);
        throw new Error("Produk yang anda cari tidak ditemukan");
    }

    return res.status(200).json({
        code: 200,
        status: "success",
        message: "Berhasil mendapatkan data produk",
        data: productData
    });
});

export const updateProduct = asyncHandler(async(req, res) => {
    const paramsId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(paramsId)) {
        res.status(400);
        throw new Error("ID produk tidak valid");
    }

    const dataUpdate = await Product.findByIdAndUpdate(
        paramsId,
        req.body,
        {
            runValidators: true,
            new: true
        }
    );

    if (!dataUpdate) {
        res.status(404);
        throw new Error("Produk tidak ditemukan");
    }

    return res.status(200).json({
        code: 200,
        status: "success",
        message: "Berhasil memperbarui produk",
        data: dataUpdate
    });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const paramsId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(paramsId)) {
        res.status(400);
        throw new Error("ID produk tidak valid");
    }

    const product = await Product.findByIdAndDelete(paramsId);
    
    if (!product) {
        res.status(404);
        throw new Error("Produk tidak ditemukan");
    }

    return res.status(200).json({
        code: 200,
        status: "success",
        message: "Berhasil menghapus produk"
    });
});

export const Fileupload = asyncHandler(async(req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error("Tidak ada file yang diupload");
    }

    const imageFileName = req.file.filename;
    const pathImageFile = `/uploads/${imageFileName}`;

    res.status(200).json({
        code: 200,
        status: "success",
        message: "Foto berhasil diupload",
        data: {
            fileName: imageFileName,
            path: pathImageFile,
            mimeType: req.file.mimetype
        }
    });
});