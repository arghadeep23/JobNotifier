const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const connectdb = require("./db");
const collection = require("./signup");
const job = require("./jobForm");
const templatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicPath));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "not_a_good_secret"
    })
);
// creating a requireLogin middleware
const requireLogin = (req, res, next) => {
    if (!req.session.user_id)
        res.redirect("login")
    else
        next()
}
connectdb();
app.get("/jobForm", (req, res) => {
    res.render("jobForm");
});
app.get("/", (req, res) => {
    res.render("login");
});

app.get('/jobs', requireLogin, async (req, res) => {
    try {
        // Retrieve all job postings from MongoDB
        const jobs = await job.find(); // Assuming 'Job' is your Mongoose model
        res.render('jobs', { jobs }); // 'jobs' is an array of job postings
    } catch (err) {
        // Handle any errors that occur during fetching job postings
        console.error(err);
        res.status(500).send('Server Error');
    }
});
app.get('/jobs2', async (req, res) => {
    try {
        // Retrieve all job postings from MongoDB
        const jobs = await job.find(); // Assuming 'Job' is your Mongoose model

        // Render your Handlebars template and pass the 'jobs' data to it
        res.render('jobs2', { jobs }); // 'jobs' is an array of job postings
    } catch (err) {
        // Handle any errors that occur during fetching job postings
        console.error(err);
        res.status(500).send('Server Error');
    }
});
app.get('/jobForm2', (req, res) => {
    res.render("jobForm2")
})
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/home", requireLogin, (req, res) => {
    console.log(req.session.user_id)
    console.log(typeof (req.session.user_id))
    res.render("home");
});

app.post("/signup", async (req, res) => {
    const data = {
        firstName: req.body.first_name,
        lastName: req.body.second_name,
        email: req.body.email,
        password: req.body.password,
    };
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(data.password, salt)
    data.password = hash;
    // await collection.insertMany([data]);
    const user = new collection(data)
    await user.save();
    req.session.user_id = user._id;
    res.render("home");
});
app.post("/jobForm", async (req, res) => {
    const data = {
        companyName: req.body.companyName,
        jobTitle: req.body.jobTitle,
        skillsNeeded: req.body.skillsNeeded,
        jobDescription: req.body.jobDescription,
        location: req.body.location,
        eligibility: req.body.eligibility,
        applicationLink: req.body.applicationLink,
        logoURL: req.body.logoURL
    };
    await job.insertMany([data]);
    res.render("jobForm2");
})
app.post("/jobForm2", async (req, res) => {
    try {
        const mostRecentJob = await job.findOne().sort({ _id: -1 }); // Get the latest job
        const data = {
            salary: req.body.salary,
            experience: req.body.experience,
            jobType: req.body.jobType
        }
        if (mostRecentJob) {
            mostRecentJob.salary = data.salary;
            mostRecentJob.experience = data.experience;
            mostRecentJob.jobType = data.jobType;
            await mostRecentJob.save();
        }
        res.render("jobForm");
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
app.get("/secret", requireLogin, (req, res) => {
    res.send("This is secret, you can't see unless you are logged in!");
})
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        const result = await bcrypt.compare(req.body.password, check.password);
        if (result) {
            req.session.user_id = check._id;
            // res
            //     .status(201)
            //     .render("home", { naming: `${req.body.password}+${req.body.email}` });
            res.redirect("home")
        } else {
            res.redirect("login");
        }
    } catch (e) {
        res.send("e");
    }
});
app.get("/logout", (req, res) => {
    res.render("logout")
})
app.post("/logout", (req, res) => {
    req.session.user_id = null;
    res.render("login");
})
app.get("/profile", requireLogin, async (req, res) => {
    console.log("Came to profile")
    const user = await collection.findById(req.session.user_id)
    res.render("profile", { user })
})
app.listen(4200, () => {
    console.log("Server running at port 4200");
});
