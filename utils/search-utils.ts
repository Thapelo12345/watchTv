import { useMainStore } from "../stateManagement/store";
import { Alert } from "react-native";

// main store states here
const mainUrl = (useMainStore.getState() as { baseUrl: string }).baseUrl;
const CloudSearch = (useMainStore.getState() as { onlineSearch: boolean })
  .onlineSearch;
const movies = (useMainStore.getState() as { movies: any }).movies;
const series = (useMainStore.getState() as { series: any }).series;

// main store functions here
const addSeriesItem = (
  useMainStore.getState() as { addSeries: (value: any) => void }
).addSeries;
const addMovieItem = (
  useMainStore.getState() as { addMovie: (value: any) => void }
).addMovie;

const addToSearchResults = (
  useMainStore.getState() as { addSearchResults: (value: any) => void }
).addSearchResults;
const removeElement = (
  useMainStore.getState() as { removeSearchResults: (value: any) => void }
).removeSearchResults;
const emptyResults = (
  useMainStore.getState() as { clearSearchResults: () => void }
).clearSearchResults;
const switchSearch = (useMainStore.getState() as { setSearching: () => void })
  .setSearching;
const switchOnlineSearch = (
  useMainStore.getState() as { setOnlineSearch: () => void }
).setOnlineSearch;

function showPosition(tvProgramme: any) {
  const currentMovies = (useMainStore.getState() as { movies: any }).movies;
  const currentSeries = (useMainStore.getState() as { series: any }).series;
  return currentMovies.indexOf(tvProgramme) == -1
    ? currentSeries.indexOf(tvProgramme)
    : currentMovies.indexOf(tvProgramme);
}

async function search(characters: string, showType: string) {
  const currentMovies = (useMainStore.getState() as { movies: any }).movies;
  const currentSeries = (useMainStore.getState() as { series: any }).series;

  const searchOn = (useMainStore.getState() as { searching: boolean })
    .searching;
  const matchingShows = (useMainStore.getState() as { searchResults: any })
    .searchResults;

  if (characters === "" && searchOn) {
    emptyResults();
    switchSearch(); // here i am turning of searching mode because the user has cleared the search input, so we don't need to search anymore
    return;
  } else if (characters !== "" && !searchOn) switchSearch(); //here i am turning on searching mode because the user has entered some characters in the search input, so we need to search for matching shows

  const enteredText = characters.trim().toLowerCase();
  const showArray = showType === "series" ? currentSeries : currentMovies;

  for (const show of showArray) {
    const selectedText =
      showType === "series" ? show.seriesHeader : show.movieHeader;

    if (!selectedText) {
      console.error(`This is the value of selected text: ${selectedText}`);
      break;
    }
    const showHeader = selectedText.toLowerCase();

    let valid = true;

    for (let i = 0; i < enteredText.length; i++) {
      if (enteredText[i] !== showHeader[i]) {
        valid = false;
        break;
      }
    } //end of 4 loop

    if (valid) {
      if (matchingShows.indexOf(show) === -1) addToSearchResults(show);
    } else if (!valid && matchingShows.indexOf(show) !== -1) {
      removeElement(show);
    }
  } //end of each loop
} //end of search function

async function onlineSearch(programmeType: string, userInput: string) {
  if (
    CloudSearch ||
    userInput === "" ||
    doIhaveTheShow(userInput, programmeType)
  )
    return;

  // switching on the online search mode to show the loader
  switchOnlineSearch();
  const response = await fetch(
    `${mainUrl}/${programmeType === "series" ? "series" : "movies"}/find-show`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Title: userInput, showType: programmeType }),
    },
  );

  if (!response.ok) {
    Alert.alert(
      "BROBLEM WITH THE SERVER",
      "failed to connect with server!...",
      [
        // clicking ok will turn off the online search mode and hide the loader
        { text: "OK", onPress: () => switchOnlineSearch() },
      ],
    );
    return;
  } //end of if response not ok

  const data = await response.json();
  if (data.message == "Failed to find show!..") {
    Alert.alert("ONLINE RESPONSE", data.message.toUpperCase(), [
      { text: "OK", onPress: () => switchOnlineSearch() },
    ]);
    return;
  } //end if data message says fail

  const newerShow = data.showData;

  // here i am just adding the new found series or movie to the main arrays
  programmeType === "series"
    ? addSeriesItem(newerShow)
    : addMovieItem(newerShow);

  console.log("Calling search after receiving the new show from the server !.");
  addToSearchResults(newerShow);
  //  switching off the online search mode to hide the loader
  switchOnlineSearch();
} //end of online search function

const doIhaveTheShow = (userText: string, typeOfProgramme: string) => {
  let getShow: any = undefined;

  // searching both array's if the show exist locally
  if (typeOfProgramme === "series") {
    getShow = series.find(
      (Series: any) =>
        Series.seriesHeader.trim().toLowerCase() ===
        userText.trim().toLowerCase(),
    );
  } else {
    getShow = movies.find(
      (Movie: any) =>
        Movie.movieHeader.trim().toLowerCase() ===
        userText.trim().toLowerCase(),
    );
  }
  return getShow !== undefined;
};

export { search, showPosition, onlineSearch };
