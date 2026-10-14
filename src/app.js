import express from "express";
import cors from "cors";
import mongoose from "mongoose";

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

app.get("/health/db", (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
  
    res.status(isConnected ? 200 : 503).json({
      success: isConnected,
      database: isConnected ? "connected" : "disconnected",
    });
  });

export default app;