const mongoose = require("mongoose")
const uri = process.env.MONG_CONN;
mongoose.connect(uri)
.then(()=>{
    console.log("mongodb connected");
})
.catch((err)=>{
    console.log("Mongodb connection error",err);
})