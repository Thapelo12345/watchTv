import { useMainStore } from "../stateManagement/store";
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

export function showPosition(tvProgramme: any) {
  const currentMovies = (useMainStore.getState() as { movies: any }).movies;
  const currentSeries = (useMainStore.getState() as { series: any }).series;
  return currentMovies.indexOf(tvProgramme) == -1
    ? currentSeries.indexOf(tvProgramme)
    : currentMovies.indexOf(tvProgramme);
}

export async  function search(characters: string, showType: string) {

  const currentMovies = (useMainStore.getState() as { movies: any }).movies;
  const currentSeries = (useMainStore.getState() as { series: any }).series;

  const searchOn = (useMainStore.getState() as { searching: boolean }).searching;
  const matchingShows = (useMainStore.getState() as { searchResults: any }).searchResults;

  if (characters === "" && searchOn) {
    emptyResults();
    switchSearch();// here i am turning of searching mode because the user has cleared the search input, so we don't need to search anymore
    return;
  } else if (characters !== "" && !searchOn) switchSearch();//here i am turning on searching mode because the user has entered some characters in the search input, so we need to search for matching shows

  const enteredText = characters.trim().toLowerCase();
  const showArray = showType === "series" ? currentSeries : currentMovies;

  for (const show of showArray) {
    const selectedText = showType === "series" ? show.seriesHeader : show.movieHeader;

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
