const express = require('express');
const { restart } = require('nodemon');
const router = express.Router()
const Portfolio = require('../models/portfolio')





router.get('/:id', (req, res, next) => {
    Portfolio.findOne({
        owner: req.params.id
    })
    .populate('holdings')
    .then((foundPortfolio) => {
        console.log("This is the found portfolio", foundPortfolio)
        res.json(foundPortfolio)
    })
    .catch((err) => {
        console.log(err)
    })
})





module.exports = router;