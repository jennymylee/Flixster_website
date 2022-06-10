const API_KEY = "31b3e44229c54504ec1d83b0923331c8";

const LIMIT = 12;

let currentPageNum = 0;
let currentTerm = "";

let posterMovieIdHash = new Object();

let formContentElement = document.querySelector(".form-content");
let termElement = document.querySelector("#search-input");
let resultsElement = document.querySelector("#movies-grid");
let searchElement = document.querySelector("#clicker");
let moreResultsButtonElement = document.querySelector("#load-more-movies-btn");
let closeButtonElement = document.querySelector("#close-search-btn");
let nowPlayingElement = document.querySelector(".now-playing");
let moviePosterElement = document.querySelector(".movie-poster");
let closePopup = document.getElementById("popupclose");
let overlay = document.getElementById("overlay");
let popup = document.getElementById("popup");
let popUpContent = document.querySelector(".popupcontent");
const body = document.querySelector("body");
let backToTopElement = document.querySelector("#back-to-top");
let searchingForElement = document.querySelector(".searching-for");

formContentElement.addEventListener("submit", handleFormSubmit);
moreResultsButtonElement.addEventListener("click", showMore);
closeButtonElement.addEventListener("click", loadNowPlaying);
backToTopElement.addEventListener("click", () => {
  window.scrollTo(0, 0);
});
window.addEventListener("load", loadNowPlaying);

closePopup.onclick = function () {
  overlay.style.display = "none";
  popup.style.display = "none";
  // Enable scroll
  body.style.overflow = "auto";
};

async function getResults(term) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${term.toLowerCase()}`
  );
  const jsonResponse = await response.json();

  return jsonResponse;
}

async function getNowPlaying() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
  );
  const jsonResponse = await response.json();

  return jsonResponse;
}

function displayResults(res) {
  let offset = currentPageNum * LIMIT;

  setOfMovies = res.results.slice(offset, offset + LIMIT);

  setOfMovies.forEach((movie, i) => {
    posterMovieIdHash[
      `https://image.tmdb.org/t/p/original/${setOfMovies[i].poster_path}`
    ] = setOfMovies[i].id;

    let imgSrc = `https://image.tmdb.org/t/p/original/${setOfMovies[i].poster_path}`;
    if (!setOfMovies[i].poster_path) {
      imgSrc =
        "https://www.kirkstall.com/wp-content/uploads/2020/04/image-not-available-png-8.png";
    }
    resultsElement.innerHTML += `
    <div class="movie-card">
        <img class="movie-poster" onclick="popUp('https://image.tmdb.org/t/p/original/${setOfMovies[i].poster_path}')" src=${imgSrc} alt='movie poster'>
        <p class="movie-votes"><i class="material-icons">star</i>   ${setOfMovies[i].vote_average} / 10</p>
        <p class="movie-title">${setOfMovies[i].title}</p>
    </div>`;
  });
}

async function popUp(src) {
  window.scrollTo(0, 0);
  overlay.style.display = "block";
  popup.style.display = "block";

  let movieId = posterMovieIdHash[src];
  movieData = await getMovieDetails(movieId);
  movieVideo = await getMovieVideo(movieId);

  popUpContent.innerHTML = `<h2 class="movie-popup-title">${movieData.title}</h2>`;

  if (movieData.backdrop_path) {
    popUpContent.innerHTML += `
    <img class="movie-backdrop" src="https://image.tmdb.org/t/p/original/${movieData.backdrop_path}" alt="movie backdrop">
    <iframe width="100%" height="500px%" src="https://www.youtube.com/embed/${movieVideo.results[1].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }
  popUpContent.innerHTML += `
  <p class="movie-popup-info">${movieData.overview}</p>
  <p class="movie-popup-info">Release Date: ${movieData.release_date}</p>
  <p class="movie-popup-info">Runtime: ${movieData.runtime} minutes</p>`;

  //disable scroll
  body.style.overflow = "hidden";
}

async function getMovieVideo(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const jsonResponse = await response.json();

  return jsonResponse;
}

async function getMovieDetails(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );
  const jsonResponse = await response.json();

  return jsonResponse;
}

async function showMore(e) {
  e.preventDefault();

  let data = "";
  if (currentTerm) {
    data = await getResults(currentTerm);
  } else {
    data = await getNowPlaying();
  }

  displayResults(data);

  currentPageNum = currentPageNum + 1;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  currentPageNum = 0;
  closeButtonElement.classList.remove("hidden");
  // Remove movies from page
  resultsElement.innerHTML = "";
  nowPlayingElement.classList.add("hidden");
  moreResultsButtonElement.classList.add("hidden");
  searchingForElement.classList.remove("hidden");

  const searchTerm = e.target.name.value;
  searchingForElement.innerHTML = `Searching for "${searchTerm}"`;
  currentTerm = searchTerm;

  const data = await getResults(searchTerm);
  displayResults(data);

  // Unhide show more button
  moreResultsButtonElement.classList.remove("hidden");
  currentPageNum = 1;

  // Clear input text box
  termElement.value = "";
}

async function loadNowPlaying(e) {
  e.preventDefault();
  currentTerm = "";
  currentPageNum = 0;
  resultsElement.innerHTML = "";
  nowPlayingElement.classList.remove("hidden");
  searchingForElement.classList.add("hidden");
  const data = await getNowPlaying();
  displayResults(data);
  moreResultsButtonElement.classList.remove("hidden");
  closeButtonElement.classList.add("hidden");
  currentPageNum = 1;
}
