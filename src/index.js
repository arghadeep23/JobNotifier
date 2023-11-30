const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const {connectdb,collection} = require("./mongodb")

const templatePath = path.join(__dirname,'../templates')
const publicPath = path.join(__dirname, '../public');
app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatePath)
app.use(express.urlencoded({extended:false}))
app.use(express.static(publicPath));
connectdb()

app.get("/",(req,res)=>{
    res.render("login")
})

app.get("/signup",(req,res)=>{
    res.render("signup")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/home",(req,res)=>{
    res.render("home")
})

app.post("/signup", async(req,res)=>{
    
    const data = {
        firstName:req.body.first_name,
        lastName:req.body.second_name,
        email:req.body.email,
        password:req.body.password
    }

    await collection.insertMany([data])

    res.render("home")
})

app.listen(4200,()=>{
    console.log("Server running at port 4200")
})