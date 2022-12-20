require('dotenv').config()

const starterData = require('./starter-data.json')

const compression = require('compression')

var cron = require('node-cron');
const axios = require("axios")

const { isAuthenticated } = require('./middleware/jwt')

const cors = require('cors')
const mongoose =require('mongoose')
const express = require('express')

const PORT= process.env.PORT;
const myApiKey = process.env.API_KEY

let STOCK_DATA = starterData;

const app = express();

app.use(compression())

app.use(cors());

app.use(express.json())


const authRouter = require("./routes/auth.routes");

const stockRouter = require('./routes/stock.routes')(STOCK_DATA);

const portfolioRouter = require('./routes/portfolio.routes')





app.use('/auth', authRouter)




app.get('/api/stocks/all', (req, res, next) => {
    res.json(STOCK_DATA)
})



app.use('/stocks', isAuthenticated, stockRouter)
app.use('/portfolio', isAuthenticated, portfolioRouter)


mongoose.connect(process.env.MONGODB_URI)
.then(x => {
    console.log('connnected to DB', x.connections[0].name)
    let myServer = app.listen(PORT, () => {
        console.log('server started on PORT' + PORT)
    })

    var stockTask = cron.schedule('*/1 9-20 * * 1-5 ', () =>  {
        axios.get(`https://api.finage.co.uk/snapshot/stock?apikey=${myApiKey}`)
        // axios.get('https://dog-api.kinduff.com/api/facts')
          .then(r => {
      
            console.log('this is the stock data', r.data)
      
            STOCK_DATA = r.data.lastQuotes;
    
          })
          .catch(err => console.log(err)) 
          
      
      }, {
          scheduled: false
      });
    
      
    stockTask.start();

    process.on('SIGTERM', () => {
        console.log('shutting down...');
        myServer.close(() => {
          console.log('server closed');
          stockTask.stop()
          console.log('stockTask stopped')
        });
      })

      process.on('SIGINT', () => {
        console.log('shutting down...');
        myServer.close(() => {
          console.log('server closed');
          stockTask.stop()
          console.log('stockTask stopped')
        });
      })
      
      //nodemon sends this when shutting down
      process.on('SIGUSR2', () => {
        console.log('shutting down...');
        myServer.close(() => {
            console.log('server closed');
            stockTask.stop()
            console.log('stockTask stopped')
        });
      });

})
.catch(err => console.log('error starting server',err))




 