import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";


connectDB()

.then(()=>{
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", ()=>{
        console.log(`Server is running at port : ${PORT}`);
    });
})
.catch((error)=>{
    console.log("Mongo_DB connection failed !!!", error);
});