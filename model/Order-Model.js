import mongoose from "mongoose";

const {Schema} = mongoose;
const singleProduct = Schema({
    name: {type: String, required: true},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true},
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
});

const orderSchema = new Schema({
    total: {
        type: Number,
        required: true
    },
    itemDetails: [singleProduct],
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "gagal", "berhasil"],
        default: "pending"
    },
    firstName: {
        type: String,
        required: [true, "Harus mengidi nama depan"]
    },
    LastName: {
        type: String,
        required: [true, "Harus mengisi nama belakang"]
    },
    Phone: {
        type: String,
        required: [true, "Harus mengisi nomor telepon"]
    },
    email: {
        type: String,
        required: [true, "Harus mengisi email"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Format email salah"]
    }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;