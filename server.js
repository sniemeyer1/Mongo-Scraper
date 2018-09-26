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
    
    $('.grid__wrapper__card').each((i, element) => {
      let newArticle = ({
        url: $(element).attr('href'),
        headline: $(element).find('h2').text().trim(),
        summary : $(element).find('div.grid__wrapper__card__text__summary').text().trim(),
      });
        console.log(newArticle);
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

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//morgan logger to log requests
//app.use(logger("dev"));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//setting static path
//app.use(express.static(path.join(__dirname, 'public')));

//home route
app.get('/', function (req, res) {
  Article.find({}, function(err, articles){
    if(err){
      console.log(err)
    }
    res.render('index', {
      headline: 'Articles',
      summary: '',
      url: ""
    });
});

//add route
// app.get('/', function (req, res) {
//   res.render('index', {
//     content: "this is some content",
//     published: false,
//     people: people
//   });
// }); 


// app.get("/scrape", function(req, res) {
//   // First, we grab the body of the html with request
//   axios.get("https://www.vice.com/en_us/topic/news").then(function(response) {
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);

//     // Now, we grab every h2 within an article tag, and do the following:
//     $("article h2").each(function(i, element) {
//       // Save an empty result object
//       var result = {};

//       // Add the text and href of every link, and save them as properties of the result object
//       result.title = $(this)
//         .children("a")
//         .text();
//       result.link = $(this)
//         .children("a")
//         .attr("href");

//       // Create a new Article using the `result` object built from scraping
//       db.Article.create(result)
//         .then(function(dbArticle) {
//           // View the added result in the console
//           console.log(dbArticle);
//         })
//         .catch(function(err) {
//           // If an error occurred, send it to the client
//           return res.json(err);
//         });
//     })

 
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

})