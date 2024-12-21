import Product from "../model/Product-Model.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body)

    return res.status(201).json({
        message: "Berhasil menambahkan produk",
        data: newProduct
    })
});