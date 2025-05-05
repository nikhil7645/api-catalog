const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtPassword = "123456";

mongoose.connect(
  "mongodb://localhost:27017/users"
);

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
});

const app = express();
app.use(express.json());

async function userExists(email, password) {
  // should check in the database
  const existingUser = await User.findOne({email , password}) ;
  return existingUser;
}

app.post("/signup" , async function(req,res){
    const name = req.body.name;
    const email  = req.body.email;
    const password = req.body.password;

    const existingUser = await userExists(email , password);
    if(existingUser){
        return res.status(400).json({
            msg:"User already exists"
        })
    }

    const user = new User({
        name: name,
        email: email,
        password: password
    })

    await user.save();

    res.json({
        msg:"User created succesfully!"
    })
})

app.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await userExists(email, password);
  if (!user) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ email: email }, jwtPassword);
  return res.json({
    token,
  });
});

app.get("/users", async function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const email = decoded.email;
    // return a list of users other than this username from the database

    const users = await User.find({ email: {$ne: email}});
    res.json({users});
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.listen(3000);