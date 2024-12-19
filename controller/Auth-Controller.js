import user from "../model/User-Model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";

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