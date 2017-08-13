var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var cors = require('cors')

app.use(cors());

/* 
* Obtener datos de pelicula en base a un id de imbd 
* @param {String} q         texto a buscar
* @returns {array} elarray de json con peliculas
*/
app.get('/movie/:Id', function(req, res){
    var movies = [];
    var id =  req.params.Id;
    var url = 'http://www.imdb.com/title/'+id+'/?ref_=adv_li_i';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            $('#title-overview-widget').filter(function(){
                 var data = $(this);

                var id = $('.ribbonize', data).attr('data-tconst'); // lister-top-right
                var img =  $('img', data).attr('src');
                var imgURL = img.split(".");
                imgURL[3] = "_V1_SY1000_CR0,0,690,1000_AL_";
                //"._V1_UX182_CR0,0,182,268_AL_.jpg";
                //_V1_SY1000_CR0,0,690,1000_AL_.jpg
                img = imgURL.join(".");
                var anio = $('#titleYear', data).text();//lister-item-year 
                var title = $('.title_wrapper h1', data).text();
                var gen = $('span[itemprop="genre"]', data).text(); //genre
                var ratings = $('span[itemprop="ratingValue"]', data).text(); //ratings-bar
                var desc = $('div[itemprop="description"]', data).text(); //ratings-bar
                var director = $('span[itemprop="director"]', data).text(); //ratings-bar
                var actor = $('span[itemprop="actors"]', data).text(); //ratings-bar
                var runtime = $('time', data).text(); //ratings-bar


               movies.push({
                   id: id,
                   anio:anio,
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
            
            res.send( JSON.stringify(movies))
        }
    });
});

/* 
* Obtener datos de peliculas en base a una busqueda realizada en imdb 
* @param {String} q         texto a buscar
* @returns {array} elarray de json con peliculas
*/
app.get('/movies/:q', function(req, res){
    var movies = [];
    var q =  req.params.q;
    var url = 'http://www.imdb.com/search/title?title='+q+'&view=simple';
    console.log(url);
    request(url, function(error, response, html){

        if(!error){

            var $ = cheerio.load(html);

            $('.lister-item.mode-simple').filter(function(){
                var data = $(this);

                var id = $('.ribbonize', data).attr('data-tconst'); // lister-top-right

                var img =  $('.lister-item-image img', data).attr('loadlate');
                var imgURL = img.split(".");
                imgURL[3] = "_V1_UX182_CR0,0,182,268_AL_";
                //"._V1_UX182_CR0,0,182,268_AL_.jpg";
                //_V1_SY1000_CR0,0,690,1000_AL_.jpg
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

            res.send( JSON.stringify(movies))
        }
    });
    
});


app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;