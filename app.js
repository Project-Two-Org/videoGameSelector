const gameSelectorApp = {};

gameSelectorApp.url = "https://api.rawg.io/api/";
gameSelectorApp.apiKey = Math.random() < 0.5 ? "6e50074dadd14fa6b73a252ddd912030" : "7feeb951031042d2a91e438eb2177a85";
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
  if(data.count === 19){
      const selectEl = document.getElementById("genres");
      data.results.forEach((genre) => {
        const newOptionEl = document.createElement("option");
        newOptionEl.textContent = genre.name;
        newOptionEl.setAttribute("value", genre.id);
        selectEl.append(newOptionEl);
      });

      gameSelectorApp.fetchRandomGame();
  }
  else{
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
    const formEl = document.querySelector('form');

    formEl.addEventListener('submit', function (e) {
        e.preventDefault();

        const platformChoiceVal = document.querySelector('[name="platforms"] option:checked').value;
        console.log(platformChoiceVal)

        // *Note 'gamescount' cannot be camelcase in data-*
        const gamesCountVal = document.querySelector('[name="platforms"] option:checked').dataset.gamescount;
        console.log(gamesCountVal)

        const genreVal = document.querySelector('[name="genres"] option:checked').value;
        console.log(genreVal)

        //RANDOM NUMBER <10,000 Games - 250 * 40 = 10,000
        const randomNum = (Math.floor(Math.random() * gamesCountVal/40)) + 6;

        const randomNumMax250 = Math.min(randomNum, 250) - Math.floor(Math.random() * 6);

        //FETCH
        const url = new URL(`${gameSelectorApp.url}games`);
        url.search = new URLSearchParams({
            key: gameSelectorApp.apiKey,
            platforms: `${platformChoiceVal}`,
            page_size: 40, //40 is max api will allow
            page: randomNumMax250
        });

        fetch(url)
        .then( (response) => {
            return response.json();
        })
        .then( (dataGames) => {
            console.log("Random page of games", dataGames.results)
            gameSelectorApp.displayGames(dataGames);

        });
    })

}


gameSelectorApp.displayGames = (dataGames) => {

    const singleRandomGame = dataGames.results[Math.floor(Math.random() * dataGames.results.length)];

    console.log("single random game", singleRandomGame);
    


}


gameSelectorApp.init = () => {
    gameSelectorApp.fetchGameType("platforms");
    gameSelectorApp.fetchGameType("genres");
}

document.addEventListener('DOMContentLoaded', function() {
    gameSelectorApp.init();
})