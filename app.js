import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/Error-Middleware.js";
import cookieParser from "cookie-parser";
import router from "./routes/route.js";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const databaseUri = process.env.DATABASE;

// Middleware
app.use(express.json());
app.use(ExpressMongoSanitize());
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Database Connection
mongoose
    .connect(databaseUri, { 
        
    })
    .then(() => console.log("Connected to the database"))
    .catch(err => console.error("Failed to connect to the database:", err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});