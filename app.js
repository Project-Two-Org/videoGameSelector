const gameSelectorApp = {};

gameSelectorApp.url = "https://api.rawg.io/api/";
gameSelectorApp.apiKey =
  Math.random() < 0.5
    ? "6e50074dadd14fa6b73a252ddd912030"
    : "7feeb951031042d2a91e438eb2177a85";
// Returns random key, console.log(gameSelectorApp.apiKey);

gameSelectorApp.fetchGameType = (type) => {
  const url = new URL(`${gameSelectorApp.url}${type}`);
  url.search = new URLSearchParams({
    key: gameSelectorApp.apiKey,
  });

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (type === "platforms") {
        gameSelectorApp.displayType(data);
      } else if (type === "genres") {
        gameSelectorApp.displayType(data);
      }
    });
};

gameSelectorApp.displayType = (data) => {
  if (data.count === 19) {
    const selectEl = document.getElementById("genres");
    data.results.forEach((genre) => {
      const newOptionEl = document.createElement("option");
      newOptionEl.textContent = genre.name;
      newOptionEl.setAttribute("value", genre.id);
      selectEl.append(newOptionEl);
    });

    gameSelectorApp.fetchRandomGame();
  } else {
    const selectEl = document.getElementById("platforms");
    data.results.forEach((platform) => {
      const newOptionEl = document.createElement("option");
      newOptionEl.textContent = platform.name;
      newOptionEl.setAttribute("value", platform.id);
      newOptionEl.setAttribute("data-gamesCount", platform.games_count);
      selectEl.append(newOptionEl);
    });
  }
};

gameSelectorApp.fetchRandomGame = () => {
  const formEl = document.querySelector("form");

  formEl.addEventListener("submit", function (e) {
    e.preventDefault();

    document.getElementById("slideShow").classList.add("hide");

    const platformChoiceVal = document.querySelector(
      '[name="platforms"] option:checked'
    ).value;
    console.log(platformChoiceVal);

    // *Note 'gamescount' cannot be camelcase in data-*
    const gamesCountVal = document.querySelector(
      '[name="platforms"] option:checked'
    ).dataset.gamescount;
    console.log(gamesCountVal);

    const genreVal = document.querySelector(
      '[name="genres"] option:checked'
    ).value;
    console.log(genreVal);

    //RANDOM NUMBER <10,000 Games - 250 * 40 = 10,000
    //Added +6 & random *6 to give more options for consoles frequently above page 250 without sacrificing page 0-6
    const randomNum = Math.floor((Math.random() * gamesCountVal) / 40) + 6;

    const randomNumMax250 =
      Math.min(randomNum, 250) - Math.floor(Math.random() * 6);

    //FETCH
    const url = new URL(`${gameSelectorApp.url}games`);
    url.search = new URLSearchParams({
      key: gameSelectorApp.apiKey,
      platforms: `${platformChoiceVal}`,
      genres: `${genreVal}`,
      page_size: 40, //40 is max api will allow
      page: randomNumMax250,
    });

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          const newUrl = new URL(`${gameSelectorApp.url}games`);
          newUrl.search = new URLSearchParams({
            key: gameSelectorApp.apiKey,
            platforms: `${platformChoiceVal}`,
            genres: `${genreVal}`,
            page_size: 40,
            page: 1,
          });
          fetch(newUrl)
            .then((response) => {
              return response.json();
            })
            .then((dataGames) => {
              // console.log("else .then", dataGames.results)
              if (dataGames.results.length >= 1) {
                gameSelectorApp.displayGames(dataGames.results);
              } else {
                throw new Error(
                  "WHOOPS, looks like there's no games for this genre!"
                );
              }
            })
            .catch((error) => {
              alert(
                error,
                "WHOOPS, looks like there's no games for this genre!"
              );
            });
        }
      })
      .then((dataGames) => {
        gameSelectorApp.displayGames(dataGames.results);
        console.log("else .then", dataGames.results);
      });
  });
};

gameSelectorApp.displayGames = (dataGames) => {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  dataGames.forEach((game) => {
    const newGame = document.createElement("li");

    const gamePhoto = document.createElement("img");
    gamePhoto.setAttribute("src", game.short_screenshots[0].image);
    gamePhoto.setAttribute("alt", `The image of game: ${game.name}`);

    const gameName = document.createElement("p");
    const gameNameForDetails = document.createElement("p");
    gameName.textContent = game.name;
    gameNameForDetails.textContent = game.name;
    gameName.classList.add("name");
    gameNameForDetails.classList.add("name", "nameForDetails");

    // Changed to inner html to select titles for styling
    const gamePlatform = document.createElement("p");
    gamePlatform.innerHTML = "<span class='block'>Platform: </span>";
    for (let i = 0; i < game.platforms.length; i++) {
      gamePlatform.innerHTML += "-" + game.platforms[i].platform.name + "- ";
    }

    const gameGenre = document.createElement("p");
    gameGenre.innerHTML = "<span class='block'>Genre: </span>";
    for (let j = 0; j < game.genres.length; j++) {
      gameGenre.innerHTML += "-" + game.genres[j].name + "- ";
    }

    // Added if statement to change 'null' to N/A (null looks like an error)
    const gameDate = document.createElement("p");
    let gameRelease = game.released;
    if (gameRelease === null) {
      gameRelease = "N/A";
    }
    gameDate.innerHTML =
      "<span class='block'>Released Date: </span>" + gameRelease;

    const displayInfoDiv = document.createElement("div");
    displayInfoDiv.appendChild(gameNameForDetails);
    displayInfoDiv.appendChild(gamePlatform);
    displayInfoDiv.appendChild(gameGenre);
    displayInfoDiv.appendChild(gameDate);
    displayInfoDiv.classList.add("displayInfo", "hide");

    const gameNameDiv = document.createElement("div");
    gameNameDiv.appendChild(gameName);
    gameNameDiv.classList.add("gameNameDiv");

    newGame.appendChild(gamePhoto);
    newGame.appendChild(gameNameDiv);
    newGame.appendChild(displayInfoDiv);

    newGame.addEventListener("click", () => {
      displayInfoDiv.classList.toggle("hide");
      gameNameDiv.classList.toggle("hide");
    });

    gallery.append(newGame);
  });
};

gameSelectorApp.createSlideShow = () => {
  const slideShow = document.getElementById("slideShow");
  const url = new URL(`${gameSelectorApp.url}games`);

  url.search = new URLSearchParams({
    key: gameSelectorApp.apiKey,
    page_size: 10,
  });
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      for (let i = 0; i < 10; i++) {
        const newSlide = document.createElement("li");
        const slideImage = document.createElement("img");
        slideImage.setAttribute("src", data.results[i].background_image);
        slideImage.setAttribute("alt", `Picture of slide number ${i}`);
        // const slideName = document.createElement("p");
        // slideName.textContent = data.results[i].name;
        newSlide.appendChild(slideImage);
        // newSlide.appendChild(slideName);
        newSlide.classList.add("slides");
        newSlide.classList.add('onShow')
        slideShow.append(newSlide);
      }
      const allOfThem = document.querySelectorAll("#slideShow .slides");
      let current = 0;
      console.log(allOfThem[0]);
      let interVal = setInterval(autoSlide, 1000);
      function autoSlide() {
        current = (current + 1) % allOfThem.length;
        if (current >= 10) {
          current === 0;
        }
        allOfThem[current].classList.toggle("onShow");
        console.log(current);
      }
    });
};

gameSelectorApp.init = () => {
  gameSelectorApp.createSlideShow();
  gameSelectorApp.fetchGameType("platforms");
  gameSelectorApp.fetchGameType("genres");
};

document.addEventListener("DOMContentLoaded", function () {
  gameSelectorApp.init();
});
