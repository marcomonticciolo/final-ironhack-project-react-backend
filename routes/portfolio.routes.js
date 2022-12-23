const express = require("express");
const router = express.Router();
const Portfolio = require("../models/portfolio");
const Stock = require("../models/stock");

const portfolioRouterWithStockData = (STOCK_DATA) => {


  router.get("/", (req, res, next) => {
    Portfolio.findById(req.payload.portfolio)
      .populate("holdings")
      .then((foundPortfolio) => {
        res.json(foundPortfolio);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.post("/:stockId", (req, res, next) => {

    const foundStockFromApi = STOCK_DATA.stocks.find((stock) => stock.s === req.body.symbol)

    Stock.findById(req.params.stockId)
        .then(foundStock => {
            if(foundStock.shares < req.body.shares){
                res.send('insufficient shares')
                return;
            }
            
            foundStock.shares = foundStock.shares - req.body.shares;

            if(foundStock.shares === 0){
                return foundStock.remove();
            } else {
                return foundStock.save();
            }
            
        })
        .then(updatedOrDeletedStock => {
            
            if(updatedOrDeletedStock.shares === 0){
                return Portfolio.findByIdAndUpdate(req.payload.portfolio, {
                    $inc: {
                        balance: +(req.body.shares * foundStockFromApi.b)
                    },
                    $pull: {
                        holdings: req.params.stockId,
                    },
                }, { new: true})
            }

            return Portfolio.findByIdAndUpdate(req.payload.portfolio, {
                $inc: {
                    balance: +(req.body.shares * foundStockFromApi.b)
                }
            }, { new: true})
            
        })
        .then(updatedPortfolio => {
            console.log(updatedPortfolio)
            res.send(updatedPortfolio);
        })
        .catch(err => res.send(err))

    // Portfolio.findById(req.payload.portfolio)
    //     .populate("holdings")
    //     .then((foundPortfolio) => {
    //         const totalShares = foundPortfolio.holdings.reduce((accumulator, currentValue) =>{
    //             if (currentValue.symbol === req.body.symbol){
    //                 return accumulator + currentValue.shares
    //             }
    //             return accumulator
    //         },0)
    //         if(totalShares < req.body.shares){
    //             res.send('insufficient shares')
    //             return;
    //         }
    //         if (totalShares > 0){
    //             const shareBlocks = foundPortfolio.holdings.filter(s => s.symbol === req.body.symbol)
    //             console.log(shareBlocks);

                
    //         }
    //         console.log(totalShares)
    //     })
    //   .catch(err => console.log(err))

      
    })


    return router;

};



module.exports = portfolioRouterWithStockData;
