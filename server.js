const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');

// always require and configure near the top 
require('dotenv').config()

// connect to database 
require('./config/database')
   
const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
    app.use(express.static(path.join(__dirname, 'build')));
} else {
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(express.static(path.join(__dirname, 'public')));
}
   
app.use(logger('dev'));
app.use(express.json());
// Configure both serve-favicon & static middleware
// to serve from the production 'build' folder
// app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
// app.use(express.static(path.join(__dirname, 'build')));

app.use(require('./config/checkToken'))

// Put API routes here, before the "catch all" route
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profiles', require('./routes/api/profiles'))
app.use('/api/relation', require('./routes/api/relation'))
app.use('/api/gear', require('./routes/api/gear'))
app.use('/api/coffee-bean', require('./routes/api/coffeeBean'))
app.use('/api/recipe', require('./routes/api/recipe'))
app.use('/api/recipe/version', require('./routes/api/recipeVersion'));

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX requests
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

app.listen(port, function() {
console.log(`Express app running on port ${port}`)
});