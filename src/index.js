import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";


connectDB()

.then(()=>{
    app.listen(process.env.PORT || 5050, ()=>{
        console.log(`Server is running at port : ${process.env.PORT || 5050}`);
    });
})
.catch((error)=>{
    console.log("Mongo_DB connection failed !!!", error);
});