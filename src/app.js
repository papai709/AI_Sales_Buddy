import express from "express";
import cors from "cors";

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

export default app;