var cheerio = require('cheerio');
var request = require('request');

//create scrape variable to export, callback function 
var scrape = function(cb) {
    request('https://vice.com/en_us/topic/news', (err, res, html) => {
        const $ = cheerio.load(html);
        //empty array
        var result = [];
        
        $('.grid__wrapper__card').each((i, el) => {
            //grab text and cut off white space
            var head = $(el).find('h2').text().replace(/\s\s+g/, '');
            var summ = $(el).find('div.grid__wrapper__card__text__summary').text();
            var link = $(el).attr('href');
            console.log('----');
            console.log(head);
            console.log(summ);
            console.log(link);
            console.log('----');
            //regex method that cleans up
            if(head && summ && link){
                var headNeat = head.replace(/(\r\n|\r|\t|\s+)/gm," ").trim();
                var summNeat = head.replace(/(\r\n|\r|\t|\s+)/gm," ").trim();
                var linkNeat = head.replace(/(\r\n|\r|\t|\s+)/gm," ").trim();
                
                var dataToAdd = {
                    headline: headNeat,
                    summary: summNeat,
                    link: linkNeat
                };

                result.push(dataToAdd);
            }
        });
        cb(response);
    });
};

module.exports = scrape;