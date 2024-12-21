import mongoose from "mongoose";

const {Schema} = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Nama product harus di isi"],
        unique: true
    },
    price: {
        type: Number,
        required: [true, "Harga product harus di isi"],
    },
    description: {
        type: String,
        required: [true, "Deskripsi harus di isi"],
    },
    image: {
        type: String,
        default: null
    },
    category: {
        type: String,
        required: [true, "Kategori harus di isi"],
        enum: ["sepatu", "kemeja", "baju", "celana"]
    },
    stock: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true 
});


const Product = mongoose.model("Product", productSchema);
export default Product;