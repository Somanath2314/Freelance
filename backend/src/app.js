import express from "express"
import cors from "cors"
const app = express()

// Improved CORS handling
const corsOptions = {
    origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Global error handler:", err.stack);
    res.status(500).json({
        status: "error",
        message: "An internal server error occurred",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Common middlewares
app.use(express.json({limit: "1000kb"}));
app.use(express.urlencoded({extended: true, limit: "1000kb"}));
app.use(express.static("public"));

// Routes
import healthcheckRouter from "./routes/healthcheck.routes.js"
import authRoutes from "./routes/auth.routes.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/auth", authRoutes);

// Catch-all for undefined routes
app.use("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: `Route ${req.originalUrl} not found`
    });
});

export {app}