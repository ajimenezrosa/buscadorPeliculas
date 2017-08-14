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
            /* Libreria para parsear HTML "cheerio" */
            var $ = cheerio.load(html);

            $('#title-overview-widget').filter(function(){
                
                var data = $(this);
                /* Obtengo datos parseando el html */
                var id = $('.ribbonize', data).attr('data-tconst');
               
                var img =  $('img', data).attr('src');
                /* Obtengo img y selecciono una extension de tamanio mayor */
                var imgURL = img.split(".");
                imgURL[3] = "_V1_SY1000_CR0,0,690,1000_AL_";
                img = imgURL.join(".");
                /* 
                *   _V1_UX182_CR0,0,182,268_AL_.jpg
                *   _V1_SY1000_CR0,0,690,1000_AL_.jpg
                */
                
                var anio = $('#titleYear', data).text(); 
                var title = $('.title_wrapper h1', data).text();
                var gen = $('span[itemprop="genre"]', data).text(); 
                var ratings = $('span[itemprop="ratingValue"]', data).text(); 
                var desc = $('div[itemprop="description"]', data).text(); 
                var director = $('span[itemprop="director"]', data).text();
                var actor = $('span[itemprop="actors"]', data).text(); 
                var runtime = $('time', data).text(); 

                /* agrego objeto json al array de peliculas  */
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

    request(url, function(error, response, html){

        if(!error){

            var $ = cheerio.load(html);

            $('.lister-item.mode-simple').filter(function(){
                var data = $(this);
                var id = $('.ribbonize', data).attr('data-tconst'); 

                var img =  $('.lister-item-image img', data).attr('loadlate');
                var imgURL = img.split(".");
                imgURL[3] = "_V1_UX182_CR0,0,182,268_AL_";
                img = imgURL.join(".");
                
                var anio = $('.lister-item-year', data).text(); 
                var title = $('.lister-item-header a', data).text();
                var ratings = $('.col-imdb-rating', data).text();

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
console.log('Servidor API corriendo en puerto 8081');
exports = module.exports = app;