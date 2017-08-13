var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var cors = require('cors')

 
app.use(cors());


var movies = [];

app.get('/movie/:Id', function(req, res){

    var id =  req.params.Id;
    var url = 'http://www.imdb.com/title/'+id+'/?ref_=adv_li_i';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            $('.lister-item.mode-advanced').filter(function(){
                 var data = $(this);

                var id = $('.ribbonize', data).attr('data-tconst'); // lister-top-right
                var img =  $('.lister-item-image img', data).attr('src');
                var anio = $('.lister-item-year', data).text();//lister-item-year 
                var title = $('.lister-item-header a', data).text();
                var gen = $('.lister-item-content p span.genre', data).text(); //genre
                var ratings = $('.ratings-bar span', data).next().text(); //ratings-bar
                var desc = $('.ratings-bar', data).next().text(); //ratings-bar
                var director = $('.ratings-bar', data).next().next().text(); //ratings-bar
                var actor = $('.ratings-bar', data).next().next().text(); //ratings-bar
                var runtime = $('.lister-item-content p span.runtime', data).text(); //ratings-bar


               movies.push({
                   id: id,
                   title: title,
                   gen: gen,
                   desc:desc,
                   ratings: ratings,
                   img: img,
                   runtime: runtime,
                   actor: actor,
                   director: director
               });
            });


        }
    });
});

app.get('/movies/:q', function(req, res){
    var q =  req.params.q;
    var url = 'http://www.imdb.com/search/title?title='+q+'&view=simple';
    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            $('.lister-item.mode-simple').filter(function(){
                var data = $(this);

                var id = $('.ribbonize', data).attr('data-tconst'); // lister-top-right

                var img =  $('.lister-item-image img', data).attr('loadlate');
                var imgURL = img.split(".");
                imgURL[3] = "._V1_UX182_CR0,0,182,268_AL_.jpg";
                img = imgURL.join(".");
                
                var anio = $('.lister-item-year', data).text();//lister-item-year 
                var title = $('.lister-item-header a', data).text();
                var ratings = $('.col-imdb-rating', data).text(); //ratings-bar


               movies.push({
                   id: id,
                   title: title,
                   anio: anio,
                   ratings: ratings,
                   img: img
               });
                
            });
            /*
            fs.writeFile('output.json', JSON.stringify(movies, null, 4), function(err){

                console.log('File successfully written! - Check your project directory for the output.json file');

            });
            */
            
            res.send( JSON.stringify(movies))
        }
    });
    
});


app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;