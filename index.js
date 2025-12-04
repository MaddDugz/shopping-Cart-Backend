const express = require('express');
// const serverless = require('serverless-http');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const dotenv = require('dotenv').config(); 
const cors = require('cors')
const PASSWORD = process.env.MY_PASSWORD // my db password
const PORT = process.env.PORT // my port number
const FRONTEND = process.env.FRONT_END // my frontend

// Routes links
const User = require('./routes/User.js');
const Product = require('./routes/productsRoute.js');

// Serve images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// middleWare 
app.use(express.json()); // allow json req
app.use(express.urlencoded({ extended: true })); // allow form req
app.use(cors({   //allow access from my frontend
  origin: FRONTEND,
  credentials: true
}));


//Routes
app.use('/', User);
app.use('/', Product);
app.get('/', (req, res) =>{
  res.send('Hello')
})


//connect to mongodb
mongoose.connect(`mongodb+srv://root:${PASSWORD}@crudapp.ousnukm.mongodb.net/Shopping-cart?appName=CRUDapp`)
.then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log('Server is running on port 3000')
    })
})

.catch(err => console.error('Error:' + err.message))

// module.exports = serverless(app);