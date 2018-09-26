var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');

// var axios = require("axios");
var cheerio = require('cheerio');
var request = require('request');

//make request, take in url, take in function: error, response, html
//if no error and response status code is 200, then log html
request('https://vice.com/en_us/topic/news', (error, response, html) => {
  if (!error && response.statusCode == 200) {
    //console.log(html);
    const $ = cheerio.load(html);
    
//     $('.grid__wrapper__card').each((i, el) => {
//       let newArticle = ({
//         url: $(el).attr('href'),
//         headline: $(el).find('h2').text().trim(),
//         summary : $(el).find('div.grid__wrapper__card__text__summary').text().trim(),
//       });
//         console.log(newArticle);
//       });        
//   }
// });

      $('.grid__wrapper__card').each((i, el) => {
        const headline = $(el).find('h2').text().replace(/\s\s+g/, '');
        const summary = $(el).find('div.grid__wrapper__card__text__summary').text();
        const url = $(el).attr('href');
        console.log('----');
        console.log(headline);
        console.log(summary);
        console.log(url);
        console.log('----');
        });
         
}
});

var PORT = 3000;

var app = express();

//requiring all models
var Article = require('./models/article');

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
//Set Promise object for the ORM
//mongoose.Promise = Promise;
mongoose.Promise = global.Promise;
//Connect to the Mongoose ORM
mongoose.connect(MONGODB_URI);

//mongoose.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true });

var db = mongoose.connection;

db.once('open', function(){
  console.log('connected to MongoDB');
});

db.on('error', function(err){
 console.log(err);
});

app.set('views', path.join(__dirname, '/views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//morgan logger to log requests
//app.use(logger("dev"));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//setting static path
app.use(express.static(path.join(__dirname, '/public')));

//home route
// app.get('/', function (req, res) {
//   Article.find({}, function(err, articles){
//     if(err){
//       console.log(err)
//     }
//     res.render('index', {
//       headline: 'Articles',
//       summary: '',
//       url: ""
//     });
// });

//add route
app.get('/', function (req, res) {
  res.render('index');
}); 

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
