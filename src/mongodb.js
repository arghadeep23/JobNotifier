const mongoose = require('mongoose')

const connectdb = async()=>{
    try{
        const connec = await mongoose.connect('mongodb+srv://SWE:Password@cluster0.jzyrqzh.mongodb.net/software?retryWrites=true&w=majority')
        console.log("MongoDB connected!")
    }
    catch(err){
        console.log(err);
    }
}

const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection = new mongoose.model("Collection1",LoginSchema)

module.exports = {connectdb,collection}