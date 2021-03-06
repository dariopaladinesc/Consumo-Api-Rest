/// +++  REVISAR NOTAS    +++
//2° MANIPULACION DEL DOM.
//3° APPENDCHILD
//4° AXIOS


const apiKey =  "ebef3c4904b620dd2750ccb92c78cdc6"

// Languague



const select = document.getElementById("language-container")
select.addEventListener('change', changeLanguage)

function changeLanguage(){
    let lan; 
    if (select.selectedIndex == 0){
        lan = "es"
        getCategoriesPreview(lan) //ejecuto fn para cambiar idioma de categorias
        console.log("lan: Español")
    }else if(select.selectedIndex == 1){
        lan = "en"
        getCategoriesPreview(lan)
        console.log("lan: Ingles")
    }else if (select.selectedIndex == 2){
        lan = "de"
        getCategoriesPreview(lan)
        console.log("lan: Aleman")
    }else{
        lan = "en"
        getCategoriesPreview(lan)
    }

    return lan 
    
} 



////   AXIOS
const api = axios.create({
    baseURL:"https://api.themoviedb.org/3/",
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    params:{
        "api_key": apiKey,
    },
}); 
const titulo = document.querySelector('.view-section')

function likedMovieList(){
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies; 
   
    if(item){
        movies = item
    }else{
        movies = {}
    }
    
    return movies;
}
function likeMovie(movie){
    
     const likedMovies = likedMovieList()
     if (likedMovies == {}){
        titulo.classList.add('inactive')
    }
     console.log(likedMovies)
     if (likedMovies[movie.id]){
         likedMovies[movie.id] = undefined
         
     }else{
         likedMovies[movie.id] = movie
         // console.log("la pelicula no estaba en ls, deberiamos agregarla")
     }
     localStorage.setItem("liked_movies", JSON.stringify(likedMovies))
}

//  +++++ REPEAT FUNCTIONS  +++++++

//PrincipalMovie. 5° 
function principalMovie(MOVIES, container, clean = true){  //clean sirve para comprobar dependiendo la pagina si limpiamos o no el contenido anterior, con la finalidad de seguir haciendo scroll
    if (clean){
        container.innerHTML = " ";  
    }
    
    MOVIES.forEach(movie => {
        if ((movie.poster_path) == null){
            const movieImg = document.createElement("img"); 
            movieImg.classList.add("imagen");
            movieImg.setAttribute("alt", 'pelicula no encontrada');
            movieImg.setAttribute("src", "https://i.ibb.co/dKGRLmx/fposter-small-wall-texture-product-750x1000.jpg");
            container.appendChild(movieImg);        
        }else{
            const movieImg = document.createElement("img"); 
            movieImg.classList.add("imagen");
            movieImg.setAttribute("alt", movie.title);
            movieImg.setAttribute("data-img", "https://image.tmdb.org/t/p/w300" + movie.poster_path) //cambiamos el atributo a "data-img" para poder usar el lazy loading
            const newContainer = document.createElement("div")
            newContainer.classList.add("nuevo-contenedor");
            const movieBtn = document.createElement('button');
            movieBtn.classList.add("btnMovie")

            newContainer.append(movieImg, movieBtn)
            container.appendChild(newContainer);  
        
            movieImg.addEventListener("click", ()=>{  //al momento de dar click en la img se ejecuta el cambio de hash, (tener en cuenta que es el mismo contenedor donde acabamos de crear la img)
                location.hash = "#movie=" + movie.id
            })
            likedMovieList()[movie.id] && movieBtn.classList.add('btnMovie--liked')
            movieBtn.addEventListener('click', ()=>{ 
                movieBtn.classList.toggle('btnMovie--liked')
                likeMovie(movie);
                getLikedMovies()//para visualizar o quitar las pelis en tiempo real
            })
            observador.observe(movieImg) //ejecutamos la fn, para que observe el contenedor (movieImg = img) y haga lazy
        }   
    })
}

function CATEGORIES(CATEGORY, ContainerCat){
  
    ContainerCat.innerHTML = " " 
    CATEGORY.forEach(category => {
        const categoryButton = document.createElement("button"); 
        categoryButton.classList.add("boton");
        const contentBotton = document.createTextNode(category.name)
        categoryButton.addEventListener("click", () => {
            location.hash = `#categories=${category.id}-${category.name}`;
        })

        //APENDCHILD (buscar en notas)
       categoryButton.appendChild(contentBotton);
       ContainerCat.appendChild(categoryButton)
    })   
}

 // ++   Intersection Observer ++ ///

//creamos la nueva instancia, la var entries lleva todos los parametros de la instancia intersectionObserver, y ya la variable entry es la que se reemplazará por el movieImg
const observador = new IntersectionObserver((entries) =>{
    entries.forEach((entry) => {
        if (entry.isIntersecting){
            const url = entry.target.getAttribute('data-img');//en url estamos   guardando la url de c/movie, ya que con getAtribute almacenamos el atributo que esta en la img, por ello tambien cambiamos el atributo "data-img" en las funciones originales
            entry.target.setAttribute('src',url)//colocamos el atributo src con el link guardado anteriormente
        }    
    })
})



//-----------------------------------------------------------//



async function getTrendingPreview(){
    const { data } = await api("trending/movie/day")

    const movies = data.results;
    const trendingPreview = document.querySelector("#trend-section-container .trend-container-figures");
    trendingPreview.innerHTML = " "; 

    movies.forEach(movie => {
        //DOM (Buscar Notas)

        const movieContainer = document.createElement("div"); 
        movieContainer.classList.add("figure-container--movie-list"); //le agregamos la clase de esta misma etiqueta, misma clase que esta en el html
         
        const movieImg = document.createElement("img"); 
        movieImg.classList.add("imgMovie");
        movieImg.setAttribute("alt", movie.title); 
        movieImg.setAttribute("data-img", "https://image.tmdb.org/t/p/w300" + movie.poster_path);
        
        movieImg.addEventListener("click", ()=>{ //Fn para que al darle click en la pelicula nos lleva a la pag movie description
            location.hash = "#movie=" + movie.id
        })
        observador.observe(movieImg) //ejecutamos la fn observador y la estamos observando, colocandole con su respectivo contenedor

        const titleMovieContainer = document.createElement("div"); //etq contenedor del titulo de la movie y la calificacion
        titleMovieContainer.classList.add("description-movie");
        const titleMovie = document.createElement("p");
        titleMovie.classList.add("titleOfMovie");
        const textP = document.createTextNode(movie.original_title) //estamos añadiendo un texto a la etiqueta p

        const movieBtn = document.createElement('button');
        movieBtn.classList.add("btnMovie")
        likedMovieList()[movie.id] && movieBtn.classList.add('btnMovie--liked')
        movieBtn.addEventListener('click', ()=>{
            movieBtn.classList.toggle('btnMovie--liked')
            likeMovie(movie);
            getLikedMovies()//para visualizar en tiempo real cuando damos like a alguna pelicula
        })

        //APPENDCHILD
        movieContainer.appendChild(movieImg); //movieContainer es una etq div padre que contiene la etq im(movieImg)
        trendingPreview.appendChild(movieContainer); //TrendigPreview es la etiqueta contenedor padre de todos los elementos
        titleMovie.appendChild(textP);//Estamos agregando el texto a la etq p
        titleMovieContainer.appendChild(titleMovie); //la etq p(titleMovie) es hija del contenedor div
        movieContainer.appendChild(titleMovieContainer); //finalmente agregamos toda la estructura del titulo de la pelicula y puntuacion al contenedor padre div
        movieContainer.appendChild(movieBtn); 
    })
    
}

async function getCategoriesPreview(lan){


    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=${lan}`)
    const data = await res.json();
    
    const categories = data.genres;
    const categoriesPreview = document.querySelector(".categories-section .categories-section--list")
    CATEGORIES(categories, categoriesPreview)
    
}
 
async function getTrends(){
    const { data } = await api("trending/movie/day", {
        params:{
            "api_key": apiKey,
        },
    })
    const moviess = data.results;
    principalMovie(moviess, movieCategory, true)
    
    
}
async function getPagesTrend(){ //Fn para paginacion. 6° 
    const {scrollTop, clientHeight, scrollHeight}= document.documentElement; //desestructuramos,es como decir c/var añadirle el document.doc
    const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 15 // Comprobacion 7°

    if(scrollIsBottom){
        page += 1 // contador || page++

    const { data } = await api("trending/movie/day", {
        params:{
            page: page,
        }, 
    })
    const movies = data.results;
    principalMovie(movies, movieCategory, false)
   
    }

}

async function getMovieCategory(id){
    const { data } = await api("discover/movie", {
        params: {
            with_genres: id,
        }
    })
    console.log(data)
    const movies = data.results;
    principalMovie(movies, movieCategory)
    
}
function getPagesCategory(id){
    return async () =>{
        const {scrollTop, clientHeight, scrollHeight}= document.documentElement; 
        const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 15 // 7°
    
        if(scrollIsBottom){
            page += 1 // contador || page++
    
        const { data } = await api("discover/movie", {
            params:{
                with_genres: id,
                page: page,
            }, 
        })
        const movies = data.results;
        principalMovie(movies, movieCategory, false)   
        }
    }
}

async function getMovieSearch(query){
    const { data } = await api("search/movie", {
        params: {
            query, /// la propiedad en la docAPI se llama query y nuestro valor de esa propiedad tiene el mismo nombre, xloq es suf colocar directamente
        }
    })

    const movies = data.results;
    if (movies.length != 0){
        principalMovie(movies, searchSection1, true)
        titleTrends1.innerHTML = "Resultados de: " + query;
        searchSection1.classList.remove('inactive')
    }else{
        titleTrends1.innerHTML = 'No se encontró lo que estabas buscando, prueba con una palabra clave'
        searchSection1.classList.add('inactive')
    }
    
    
}
function getPagesSearch(query){
    return async function() {
        const {scrollTop, clientHeight, scrollHeight}= document.documentElement; 
        const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 15 // 7°
    
        if(scrollIsBottom){
            page += 1 // contador || page++
    
        const { data } = await api("search/movie", {
            params:{
                query,
                page: page,
            }, 
        })
        const movies = data.results;
     
        principalMovie(movies, searchSection1, false)
       
        }
    }
}

async function getMovieById(id){
    const { data: movie } = await api("movie/" + id, {
        params:{
            "api_key": apiKey,
            'language': changeLanguage() //seleccion de idioma
        }, 
    })
    const PosterMovie = "https://image.tmdb.org/t/p/w500" + movie.poster_path; 
    movieSection.style.backgroundImage = `url(${PosterMovie})`; 
    titleMovie.innerHTML= movie.title;
    description.innerHTML= movie.overview;
    vote.innerHTML= "⭐ " + movie.vote_average; 
    
    CATEGORIES(movie.genres, listCategories);
    getSimilarsMovies(id);
}

async function getSimilarsMovies(id){
    const { data: movie } = await api(`movie/${id}/similar`)
    const relatedMovies = movie.results;
    principalMovie(relatedMovies, similarMovieList)
}

function getLikedMovies(){
    const likedMovies = likedMovieList()
    const moviesArray = Object.values(likedMovies)
    principalMovie(moviesArray, viewContainerFigures, true);
}


