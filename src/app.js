import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//rought checking
app.get("/", (req, res)=>{
    res.status(200).json({
        success: true,
        message: "AI sales buddy API is running",
    });
});

// Health check route
app.get("/health/db", (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
  
    res.status(isConnected ? 200 : 503).json({
      success: isConnected,
      database: isConnected ? "connected" : "disconnected",
    });
});

// route import
import chatRoutes from "./routes/chat.route.js";

// router declaration
app.use("/api/chat", chatRoutes);


app.use(errorMiddleware);
export default app;