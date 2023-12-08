const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        const connec = await mongoose
            .connect(
                "mongodb+srv://SWE:Password@cluster0.jzyrqzh.mongodb.net/software?retryWrites=true&w=majority"
            )
            .then(() => {
                console.log("Mongo Connection Open!");
            })
            .catch((err) => {
                console.log("Oh no, mongo connection error!");
                console.log(err);
            });
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectdb;
