const API_KEY = "31b3e44229c54504ec1d83b0923331c8";

const LIMIT = 12;

let currentPageNum = 0;
let currentTerm = "";

let formContentElement = document.querySelector(".form-content");
let termElement = document.querySelector("#search-input");
let resultsElement = document.querySelector("#movies-grid");
let searchElement = document.querySelector("#clicker");
let moreResultsButtonElement = document.querySelector("#load-more-movies-btn");

let nowPlayingElement = document.querySelector(".now-playing");

formContentElement.addEventListener("submit", handleFormSubmit);
moreResultsButtonElement.addEventListener("click", showMore);
window.addEventListener("load", loadNowPlaying);

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
    resultsElement.innerHTML += `
    <div class="movie-card">
        <img class="movie-poster" src="https://image.tmdb.org/t/p/original/${setOfMovies[i].poster_path}" alt='movie poster'>
        <p class="movie-votes"><i class="material-icons">star</i>   ${setOfMovies[i].vote_average}</p>
        <p class="movie-title">${setOfMovies[i].title}</p>
    </div>`;
  });
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
  // Remove movies from page
  resultsElement.innerHTML = "";
  nowPlayingElement.innerHTML = " ";
  moreResultsButtonElement.classList.add("hidden");

  const searchTerm = e.target.name.value;
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

  const data = await getNowPlaying();
  displayResults(data);
  moreResultsButtonElement.classList.remove("hidden");
  currentPageNum = 1;
}
