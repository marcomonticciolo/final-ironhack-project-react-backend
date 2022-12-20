const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Portfolio = require('../models/portfolio')
const bcryptjs = require("bcryptjs");
const jwt= require('jsonwebtoken');
const { isAuthenticated }=require('../middleware/jwt')




router.post("/signup", (req, res, next) => {
    console.log("MADE IT TO SIGNUP ROUTE")
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({
      error: {
        message: "Missing email, name, or password",
      },
    });
  }

  bcryptjs
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
        email,
        password: hashedPassword,
        username,
      });
    })
    .then((createdUser) => {
      console.log("made it to line 34", createdUser._id)
      return Portfolio.create({
        name: "Holdings",
        owner: createdUser._id
      });
    })
    .then((createdPortfolio) => {
      console.log("made it to line 41")
       return User.findByIdAndUpdate(createdPortfolio.owner, {
        portfolio: createdPortfolio._id
      })
    })
    .then((updatedUser) => {
      console.log("made it to line 47")
      res.json(updatedUser)
    })
    .catch((err) => res.send(err));
});

router.post("/login", (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password ) {
      return res.json({
        error: {
          message: "Missing form fields",
        },
      });
    }
  
    let myUser;
    User.findOne({ username })
      .then((foundUser) => {
        if (!foundUser) {
          return Promise.reject("Invalid email");
        }
        myUser = foundUser;
        return bcryptjs.compare(password, foundUser.password);
      })
      .then((isValidPassword) => {
        if (!isValidPassword) {
          return Promise.reject("invalid password");
        }
        const payload = {
          _id: myUser._id,
          username: myUser.username,
          portfolio: myUser.portfolio
        };
  
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.json({
          authToken: authToken,
        });
      })
      .catch((err) => res.send(err));
  });
  
  router.get("/verify",isAuthenticated, (req, res, next) => {
    res.json(req.payload)
  });
  

module.exports = router;