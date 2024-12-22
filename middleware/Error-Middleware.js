export const unauthorized = (req, res, next) => {
    const error = new Error("Unauthorized access");
    res.status(401);
    next(error);
};

export const notFound = (req, res, next) => {
    const error = new Error(`Path not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors || {})
            .map((item) => item.message)
            .join(', ');
    }

    // Handle Mongoose casting errors (invalid ObjectId)
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 400;
        message = "ID tidak valid";
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Token tidak valid";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token telah kadaluarsa";
    }

    res.status(statusCode).json({
        code: statusCode,
        status: "error",
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};