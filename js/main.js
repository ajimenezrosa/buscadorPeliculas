
var form = document.getElementById("formBuscar");

if(form){
    form.addEventListener("submit",function(event){
        var texto = document.getElementById("textBuscar").value;
        
        getPeliculas(texto);
        event.preventDefault();
    });
}


function getPeliculas(texto){
    var peliculas = document.getElementById('peliculas');
    peliculas.innerHTML = "";
    var key = localStorage.getItem(texto);
    if(key){
        peliculas.innerHTML = crearPeliculas(JSON.parse(key));
    }else{
        
        axios.get('http://localhost:8081/movies/'+texto)
        .then(function (response) {
            let data = response.data;
            peliculas.innerHTML = crearPeliculas(data);
            localStorage.setItem(texto,JSON.stringify(data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    

}

function getPelicula(){
    var id = localStorage.getItem("idPelicula");
    var pelicula = document.getElementById('pelicula');

    axios.get('http://localhost:8081/movie/'+id)
    .then(function (response) {
        let data = response.data;
        pelicula.innerHTML = crearPelicula(data);
    })
    .catch(function (error) {
        console.log(error);
    });

    
    

}

function crearPelicula(data){
    let output = '';
    if(data.length != 0){
        let movie = data[0];
        console.log(obtenerGeneros(movie.gen));
        output += `

                <div class="row">
                    <div class="col-md-4">
                        <img src="${movie.img}">
                    </div>
                    <div class="col-md-8">
                        <h1 class="">${movie.title}</h1>
                        <p class=""><strong>Descripcion: </strong> ${movie.desc}</p>
                        <p class=""><strong>Genero: </strong>${obtenerGeneros(movie.gen)}</p>
                        <p class=""><strong>Duracion: </strong>${movie.runtime}</p>
                        <p class=""><strong>Año: </strong>${movie.anio}</p>
                        <p class=""><strong>Rating: </strong>${movie.ratings}</p>
                        <p class=""><strong>Director: </strong>${movie.director}</p>
                        <p class=""><strong>Actores:  </strong>${movie.actor}</p>
                        <a href="index.html" class="btn btn-primary">Volver</a>
                        <a href="http://www.imdb.com/title/${movie.id}/?ref_=adv_li_i" target="_blank" class="btn btn-primary">Ver imdb</a>
                    </div>
                </div>

        `;

    }else{
        output = `
            <div class="alert alert-dismissible alert-info" role="alert">
                No se encontraron peliculas...
            </div>
        `;
    }

    return output;
}

function crearPeliculas(data){
    let output = '';
    if(data.length != 0){
        for(let i=0;i<data.length;i++){
            let movie = data[i];
            output += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img class="" src="${movie.img}" alt="Card image cap">
                        <h4 class="">${movie.title}</h4>
                        <p class="">${movie.anio}</p>
                        <p class="">${movie.ratings}</p>
                        <a onClick="detallePelicula('${movie.id}')" href="#" class="btn btn-primary">Detalles</a>
                    </div>
                </div>
            `;
        };
    }else{
        output = `
            <div class="alert alert-dismissible alert-info" role="alert">
                No se encontraron peliculas...
            </div>
        `;
    }

    return output;
}

function detallePelicula(id){
    localStorage.setItem("idPelicula",id);
    window.location = 'pelicula.html';
    return false;
}

function obtenerGeneros(t){
    let a = [];
    let z=0;
    for(let i=0;i<t.length;i++){
        
        if(t[i].charCodeAt()>64 && t[i].charCodeAt()<91){
            
            a[z]=", ";
            z++;
            a[z] = t[i];                    
            z++;

        }else{
            a[z] = t[i];
            z++;
        }
        
    }
    a.shift();
    return a.join('')
}

setInterval(function(){
    localStorage.clear()
},1000*3600)
