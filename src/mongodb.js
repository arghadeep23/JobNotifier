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
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

const collection = new mongoose.model("Collection1",LoginSchema)

module.exports = {connectdb,collection}