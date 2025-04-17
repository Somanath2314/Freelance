import express from "express"
import cors from "cors"
const app=express()

app.use(cors({
    origin: "http://localhost:3000",  // Your frontend URL
    credentials: true
}))
import cookieParser from "cookie-parser";

// Add this before your routes
app.use(cookieParser());
//common middlewares
app.use(express.json({limit:"1000kb"}))
app.use(express.urlencoded({extended:true,limit:"1000kb"}))
app.use(express.static("public"))

import healthcheckRouter from "./routes/healthcheck.routes.js"
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js"; 
import orderRoutes from "./routes/order.routes.js";

app.use("/api/v1/healthcheck",healthcheckRouter)
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/employee",employeeRoutes) 
app.use("/api/v1/order", orderRoutes)


export {app}