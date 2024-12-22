import user from "../model/User-Model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../model/User-Model.js";

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "6d" });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const isDev = process.env.NODE_ENV === 'development';

    const cookieOptions = {
        expires: new Date(
            Date.now() + 6 * 24 * 60 * 60 * 1000 
        ),
        httpOnly: true,
        secure: !isDev
    };

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

export const registerUser = asyncHandler(async(req, res, next) => {
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        const error = new Error('Harap memasukan username, email dan password');
        error.statusCode = 400;
        return next(error);
    }

    const isOwner = (await user.countDocuments()) === 0;
    const role = isOwner ? 'owner' : 'user';

    const createUser = await user.create({
        name,
        email,
        password,
        role
    });

    createSendToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async(req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400)
        throw new Error("Email atau password tidak boleh kosong")
    }

    const userData = await User.findOne({
        email: req.body.email
    })

    if (userData && (await userData.comparePassword(req.body.password))){
        createSendToken(userData, 200, res)
    } else {
        res.status(401)
        throw new Error("Email atau password salah")
    }
});

export const getUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).select("-password") 

    if (user) {
        return res.status(200).json({
            user
        })
    } else {
        res.status(404);
        throw new Error("User tidak ditemukan")
    }
});

export const logoutUser = async (req, res) => {
    res.cookie('jwt', "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV !== 'development', 
        sameSite: 'strict',
        path: '/'
    })

    res.status(200).json({
        status: "success",
        message: "Logout berhasil"
    });
};

export const updateUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Harap isi format update dengan sesuai'
        });
    }

    // Find user by ID and update
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, email, password },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User tidak ditemukan'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
