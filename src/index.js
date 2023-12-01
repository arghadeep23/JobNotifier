const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const connectdb = require("./db");
const collection = require("./signup");
const job = require("./jobForm");
const templatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicPath));
connectdb();
app.get("/jobForm", (req, res) => {
    res.render("jobForm");
});
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/home", (req, res) => {
    res.render("home");
});

app.post("/signup", async (req, res) => {
    const data = {
        firstName: req.body.first_name,
        lastName: req.body.second_name,
        email: req.body.email,
        password: req.body.password,
    };

    await collection.insertMany([data]);

    res.render("home");
});
app.post("/jobForm", async (req, res) => {
    const data = {
        companyName: req.body.companyName,
        jobTitle: req.body.jobTitle,
        skillsNeeded: req.body.skillsNeeded,
        jobDescription: req.body.jobDescription,
        salary: req.body.salary,
        eligibility: req.body.eligibility,
        applicationLink: req.body.applicationLink,
        logoURL: req.body.logoURL
    };
    await job.insertMany([data]);
    res.render("home");
})
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if (check.password === req.body.password) {
            res
                .status(201)
                .render("home", { naming: `${req.body.password}+${req.body.email}` });
        } else {
            res.send("incorrect password");
        }
    } catch (e) {
        res.send("wrong details");
    }
});

app.listen(4200, () => {
    console.log("Server running at port 4200");
});
