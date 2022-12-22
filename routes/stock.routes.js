const express = require("express");
const Stock = require("../models/stock");
const router = express.Router();
const Portfolio = require("../models/portfolio");

const routerWithStockData = (STOCK_DATA) => {
  router.post("/", (req, res, next) => {
    const foundStock = STOCK_DATA.stocks.find((stock) => stock.s === req.body.symbol);

    Portfolio.findById(req.payload.portfolio)
    .then((foundPortfolio) => {
      if(foundPortfolio.balance <= 0){
        console.log('insufficient funds')
        res.send('insufficient funds')
        return

      } else {
        Stock.create({
          symbol: req.body.symbol,
          price: foundStock.a,
          shares: req.body.shares,
          date: req.body.date
        })
          .then((boughtStock) => {
            return Portfolio.findByIdAndUpdate(
              req.payload.portfolio,
              {
                $inc: {
                    balance: -(boughtStock.shares * boughtStock.price)
                },
                $push: {
                  holdings: boughtStock._id,
                },
              },
              { new: true }
            );
          })
          .then((updatedPortfolio) => {
            res.json(updatedPortfolio);
          })
          .catch((err) => res.send(err));

      }
    })
  });


  return router;
};

module.exports = routerWithStockData;
