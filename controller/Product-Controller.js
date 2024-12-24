import Product from "../model/Product-Model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import mongoose from "mongoose";

export const createProduct = asyncHandler(async (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({
            code: 400,
            status: "error",
            message: "Nama dan harga produk harus disediakan"
        });
    }

    const newProduct = await Product.create(req.body);
    return res.status(201).json({
        code: 201,
        status: "success",
        message: "Berhasil menambahkan produk",
        data: newProduct
    });
});

 export const getAllProduct = asyncHandler(async (req, res) => {
    try {
        // 1. Filter query parameters
        const queryObj = {...req.query};
        const excludeField = ["page", "limit"];
        excludeField.forEach(field => delete queryObj[field]);

        // 2. Setup pagination
        const page = parseInt(req.query.page) || 1;
        const limitData = parseInt(req.query.limit) || 10;
        const skipData = (page - 1) * limitData;

        // 3. Execute query with pagination
        const totalProducts = await Product.countDocuments(queryObj);
        const query = Product.find(queryObj).skip(skipData).limit(limitData);
        const data = await query;

        // 4. Check if page exists
        if (skipData >= totalProducts && page !== 1) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Halaman tidak ditemukan"
            });
        }

        // 5. Check if data exists
        if (data.length === 0) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Data masih kosong"
            });
        }

        // 6. Success response
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Berhasil mendapatkan data produk",
            meta: {
                page,
                limit: limitData,
                total: totalProducts,
                totalPages: Math.ceil(totalProducts / limitData)
            },
            data
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: error.message
        });
    }
});

export const getProductById = asyncHandler(async (req, res) => {
    const paramsId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(paramsId)) {
        return res.status(400).json({
            code: 400,
            status: "error",
            message: "ID produk tidak valid"
        });
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

    const { name, price } = req.body;

    if (!name || !price) {
        res.status(400);
        throw new Error("Nama dan harga produk harus disediakan");
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
        return res.status(404).json({
            code: 404,
            status: "error",
            message: "Produk tidak ditemukan"
        });
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