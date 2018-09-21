var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var exphbs  = require('express-handlebars');
//var mongoose = require("mongoose");
// var axios = require("axios");
// var cheerio = require("cheerio");

//requiring all models
// var db = require("./models");

var PORT = 3000;

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//morgan logger to log requests
//app.use(logger("dev"));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//setting static path
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.send('Hellooo World')
}); 
 
app.listen(PORT, function(){
    console.log("...Listening on Port 3000...");
})