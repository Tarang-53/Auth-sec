require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://0.0.0.0:27017/userDB").then(()=>{
    console.log("Connected with mongoDB successfully.");
}).catch((err)=>{
    console.log(err);
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User",userSchema);

app.post("/register",(req,res)=>{
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        res.send(err);
    });
});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    console.log(password);

    User.findOne({email: username}).then((founded)=>{
        console.log(founded);
        if(founded){
            if(founded.password === password){
                res.render("secrets");
            }
            else{
                res.send("Wrong password!!!");
            }    
        }
        else
            res.send("User doesn't exist!!!");
    }).catch((err)=>{
        console.log(err);
    })
});

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})




app.listen(3000,(req,res)=>{
    console.log("Server is live on port 3000");
})