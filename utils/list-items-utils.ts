import { userStore } from "@/stateManagement/userStore";
import { useMainStore } from "@/stateManagement/store";
import { router } from "expo-router";
import { Alert } from "react-native";

const mainUrl = (useMainStore.getState() as { baseUrl: string }).baseUrl;

const removeMovie = (
  userStore.getState() as { removeLikedMovies: (value: string) => void }
).removeLikedMovies;
const removeSeries = (
  userStore.getState() as { removeLikedSeries: (value: string) => void }
).removeLikedSeries;
const removeWatchHistory = (
  userStore.getState() as { removeWatchShow: (value: string) => void }
).removeWatchShow;
const removeUnfinishedShows = (
  userStore.getState() as { removeContinueWatch: (value: string) => void }
).removeContinueWatch;

const displayShow = (useMainStore.getState() as {set_selected_show: (value1: any, value2: string)=> void}).set_selected_show

async function deleteItem(itemName: string, targetList: string) {
 // store state's here
const mainID = (userStore.getState() as { userId: string }).userId;
const userLikedShows = (userStore.getState() as {userLiked: any}).userLiked
const continueToWatch = (userStore.getState() as {continueWatching: string[]}).continueWatching
const history = (userStore.getState() as {watchHistory: string[]}).watchHistory

  try {
    if (targetList === "Movies" || targetList === "Series") {
      const newLickedShows = {
        userSeries:
          targetList === "Series" ? userLikedShows.userSeries.filter((showName: string) => showName !== itemName)
            : userLikedShows.userSeries,
        userMovies: targetList === "Movies" ? userLikedShows.userMovies.filter((showName: string) => showName !== itemName)
            : userLikedShows.userMovies,
      };

      const serverResponse = await fetch(`${mainUrl}/user/update-userLikes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: mainID,
          userLikes: newLickedShows,
        }),
      });

      if (!serverResponse.ok)
        throw new Error(
          "Failed to Connect to Server!.\nCheck Your Internet Connection!.",
        );

      const data = await serverResponse.json();

      if (data.message !== "Update was successfully!.")
        throw new Error("FAILED to Update the cloud!.");

      targetList === "Movies" ? removeMovie(itemName) : removeSeries(itemName);
    } 
    else if (targetList === "Continue to Watch") {
      const upDatelist = continueToWatch.filter(
        (showName: string) => showName !== itemName,
      );

      const serverResponse = await fetch(
        `${mainUrl}/user/update-continue-watch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: mainID,
            continueWatch: upDatelist,
          }),
        },
      );

      if (!serverResponse.ok) throw new Error("Cant Connect To Server!.");

      const data = await serverResponse.json();

      if (data.message !== "Cloud Updated SuccessFully!..")
        throw new Error(" Failed To Send data to Cloud!..");
      removeWatchHistory(itemName);
    } else if (targetList === "Watch History") {
      const upDatedList = history.filter(
        (showName: string) => showName !== itemName,
      );

      const serverRespnse = await fetch(`${mainUrl}/user/update-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: mainID,
          history: upDatedList,
        }),
      });

      if (!serverRespnse.ok)
        throw new Error(
          "FAILED To Connect Server!.\nCheck Your Internet Connection!.",
        );

      const data = await serverRespnse.json();

      if (data.message !== "Cloud SuccessFully Updated!.")
        throw new Error("Failed to update Cloud Data!.");

      removeUnfinishedShows(itemName);
    }

    return "deleted Successfully"
  } catch (err: unknown) {
    const errMessage =
      err instanceof Error ? err.message : "unknown server error!.";
    Alert.alert("SERVER ERROR!.", errMessage, [
      { text: "OK", onPress: () => {
        console.log(errMessage)
        return "Failed to Delete"
      } },
    ]);
  }
} //end of delete item functions

function openShow(itemName: string){

    const allShows = [...(useMainStore.getState() as {movies: any}).movies, ...(useMainStore.getState() as {series: any}).series]
    const selectedShows = allShows.find((show)=> show.movieHeader === itemName || show.seriesHeader === itemName)
    const showType = selectedShows.movieHeader ? "movies" : "series"

    displayShow(selectedShows, showType)
    router.navigate("/showInfo")
}

export { deleteItem, openShow }
