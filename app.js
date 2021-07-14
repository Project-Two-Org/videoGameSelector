const gameSelectorApp = {};

gameSelectorApp.url = "https://api.rawg.io/api/";
gameSelectorApp.apiKey = "7feeb951031042d2a91e438eb2177a85";

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
  }
  else{
      const selectEl = document.getElementById("platforms");
      data.results.forEach((platform) => {
        const newOptionEl = document.createElement("option");
        newOptionEl.textContent = platform.name;
        newOptionEl.setAttribute("value", platform.id);
        selectEl.append(newOptionEl);
      });
  }
};

gameSelectorApp.fetchGameType("platforms");
gameSelectorApp.fetchGameType("genres");
