# E-commerce Backend Project

## Overview
This is an **E-commerce backend application** built using **Express.js**, **MongoDB**, and integrated with **Midtrans** for payment gateway support. The project provides a foundation for managing products, orders, and users efficiently with robust middleware and utilities.

## Features
- User Authentication & Authorization
- Product Management (CRUD)
- Order Management (CRUD)
- Payment Gateway Integration (Midtrans)
- Centralized Error Handling
- Logging System
- File Upload Handling

---

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime for backend development.
- **Express.js**: Web framework for building REST APIs.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: ODM library for MongoDB.

### Utilities
- **Winston**: Logging library.
- **Multer**: Middleware for handling file uploads.
- **Midtrans**: Payment gateway integration.

---

## Installation & Setup

### Prerequisites
1. **Node.js** and **npm** installed.
2. **MongoDB** instance running.
3. **Midtrans** account and API keys.

### Steps
1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate to the project directory:
   ```bash
   cd ecommerce-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables by creating a `.env` file:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   MIDTRANS_SERVER_KEY=your_midtrans_server_key
   MIDTRANS_CLIENT_KEY=your_midtrans_client_key
   ```
5. Run the application:
   ```bash
   npm start
   ```

The server should now be running at `http://localhost:3000`.

---

## File Structure
```
├── controller
│   └── Product-Controller.js
├── logs
│   ├── combined.log
│   └── error.log
├── middleware
│   ├── asyncHandler.js
│   ├── authMiddleware.js
│   └── Error-Middleware.js
├── model
│   ├── Order-Model.js
│   ├── Product-Model.js
│   └── User-Model.js
├── node_modules
├── public
├── routes
│   └── route.js
├── utils
│   ├── logger.js
│   └── uploadFileHandler.js
├── .env
├── .gitignore
├── app.js
├── package-lock.json
└── package.json
```

## API Documentation
https://documenter.getpostman.com/view/38348317/2sAYJ6CKyN

---

## Key Components

### `controller`
Handles the business logic for different resources such as products and orders.

### `middleware`
Contains reusable middleware functions for error handling, authentication, and asynchronous operations.

### `model`
Defines the Mongoose schemas for `User`, `Product`, and `Order`.

### `routes`
Defines the API endpoints and maps them to the corresponding controllers.

### `utils`
Provides utility functions such as logging and file handling.

### `logs`
Stores the application logs, both combined and error-specific, for debugging and monitoring purposes.

### `public`
Placeholder for serving static files if needed.

---


