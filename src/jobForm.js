const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    skillsNeeded: {
        type: String, // Array of strings representing required skills
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    location: {
        type: String, // You can adjust this based on your salary structure
        required: true,
    },
    eligibility: {
        type: String,
        required: true,
    },
    applicationLink: {
        type: String,
        required: true,
    },
    logoURL: {
        type: String
    }
});

// Create a model based on the schema
const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
