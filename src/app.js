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

// router import
import chatRoutes from "./routes/chat.route.js";
import businessRoutes from "./routes/business.route.js";
import campaignRoutes from "./routes/campaign.route.js";
import conversationRoutes from "./routes/conversation.route.js";

// router declaration
app.use("/api/chat", chatRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/conversations", conversationRoutes);

app.use(errorMiddleware);
export default app;