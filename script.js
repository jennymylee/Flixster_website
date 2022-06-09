const API_KEY = "31b3e44229c54504ec1d83b0923331c8";
// const API_KEY = "nOjzgnRK5wSxGHruvjd3HVSux7Zxk46H";
const LIMIT = 12;
let currentPageNum = 0;

let currentTerm = "";

let formContentElement = document.querySelector(".form-content");
let termElement = document.querySelector("#search-input");
let resultsElement = document.querySelector("#movies-grid");
let searchElement = document.querySelector("#clicker");
let moreResultsButtonElement = document.querySelector("#load-more-movies-btn");

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
  console.log(jsonResponse.results);
  return jsonResponse;
}

function displayResults(res) {
  let offset = currentPageNum * LIMIT;
  console.log("cpn:", currentPageNum);
  console.log("offset:", offset);

  setOfMovies = res.results.slice(offset, offset + LIMIT);

  setOfMovies.forEach((movie, i) => {
    console.log(setOfMovies[i].poster_path);
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
  console.log(currentTerm);
  //   const data = await getResults(currentTerm);
  //   displayResults(data);
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
  // Remove gifs from page
  resultsElement.innerHTML = "";
  moreResultsButtonElement.classList.add("hidden");

  const searchTerm = e.target.name.value;
  currentTerm = searchTerm;

  const data = await getResults(searchTerm);

  //   displayResults(data);
  //   const data = await getNowPlaying();
  displayResults(data);
  // Unhide show more button
  moreResultsButtonElement.classList.remove("hidden");
  currentPageNum = 1;

  // Clear input text box
  termElement.value = "";
}

async function loadNowPlaying(e) {
  e.preventDefault();
  console.log("onload");
  const data = await getNowPlaying();
  displayResults(data);
  moreResultsButtonElement.classList.remove("hidden");
  currentPageNum = 1;
}
