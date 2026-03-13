import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import cors from "cors";
import authRouter from "./routers/user.route.js";
import AiRouter from "./routers/AI.route.js";

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,                  // ← required for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/auth/v1', authRouter);
app.use('/ai/v1', AiRouter);

app.use((err, req, res, next) => {
    console.error('Original error:', err.cause || err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';
    res.status(statusCode).json({ success: false, message, statusCode });
});

export default app;