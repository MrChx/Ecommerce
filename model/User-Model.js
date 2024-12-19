import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import validator from 'validator';

const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Nama harus di isi"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email harus di isi"],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Harus berformat @gmail.com"
        }
    },
    password: {
        type: String,
        required: [true, "Password harus di isi"],
        minlength: [8, "Password minimal 8 karakter"]
    },
    role: {
        type: String,
        enum: ["user", "owner"],
        default: "user"
    }
}, {
    timestamps: true 
});
userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (reqBody) {
    return await bcrypt.compare(reqBody, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;