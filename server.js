// Require dotenv config
require('dotenv').config();

// Require constants
const
    express = require('express'),
    app = express(),
    axios = require('axios'),
    ejsLayouts = require('express-ejs-layouts'),
    flash = require('connect-flash'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    path = require('path'),
    bodyParser = require('body-parser'),
    PORT = process.env.PORT || 8888;

// Connect database
require('./db/mongoose');

// Middleware
app.use(express.json()); //Setting express
app.use(express.static('./')); //Setting static paths
app.use(express.static(path.join(__dirname, '/views'))) //Setting static paths to views
app.use(express.static(path.join(__dirname, '/views', '/pages'))) //Setting static paths to views
app.use(logger('dev')) // LOG INCOMING REQUESTS TO TERMINAL
app.use(express.urlencoded({ extended: true })) //INTERPRET STANDARD FORM DATA IN REQUESTS
app.use(flash()); // SET AND RESET FLASH MESSAGES
app.use(methodOverride('/method')) //ALLOW FOR METHOD OVERRIDE ON HTML FOR GET/POST TO BE REPLACED BY PATCH/PUT/DELETE

// EJS CONFIGURATIONS
app.set('view engine', 'ejs');
app.use(ejsLayouts);


// Routes
    // Home route
    app.get('/', ( req, res ) => {
        res.render('./pages/index');
    })
   
    // API Root route
    app.get('/api', ( req, res ) => {
        res.json({ message: `API Root Route`})
    })
    // Users Router
    const usersRouter = require('./routes/usersRouter.js');
    app.use('/users', usersRouter);

// Listening PORT
app.listen(PORT, err => {
    console.log( err || `Server listening on PORT ${PORT}`)
})