import { Alert } from "react-native";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { router } from "expo-router";

const basedUrl = (useMainStore.getState() as { baseUrl: string }).baseUrl;
const positionedAt = (useMainStore.getState() as { selectedPosition: number })
  .selectedPosition;

// store action state's
const editMovies = (
  useMainStore.getState() as { editMovies: (pos: number, show: any) => void }
).editMovies;
const editSeries = (
  useMainStore.getState() as { editSeries: (pos: number, show: any) => void }
).editSeries;
const setPlayingUrl = (
  useMainStore.getState() as { setUrl: (value: string) => void }
).setUrl;
const turnOnPlay = (
  useMainStore.getState() as { setPlaying: (value: boolean) => void }
).setPlaying;

// movies licked
const addingMovie = (
  userStore.getState() as { addLikedMovies: (value: string) => void }
).addLikedMovies;
const removeMovie = (
  userStore.getState() as { removeLikedMovies: (value: string) => void }
).removeLikedMovies;

// series licked
const addingSeries = (
  userStore.getState() as { addLikedSeries: (value: string) => void }
).addLikedSeries;
const removeSeries = (
  userStore.getState() as { removeLikedSeries: (value: string) => void }
).removeLikedSeries;

async function Play(
  showToPlay: any,
  inputSeason: string,
  inputEpisode: string,
  playLoader: (value: boolean) => void,
) {
  console.log("Play function runing!..");
  console.log("This is the type of Show: ", showToPlay.programmeType);

  if (showToPlay.programmeType !== "series") {
    let currentUrl = showToPlay.programme.playingUrl;

    if (!currentUrl) {
      const response = await fetch(`${basedUrl}/update-movie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title: showToPlay.programme.movieHeader,
        }),
      });
      if (!response.ok) {
        Alert.alert("BAD NETWORK", "NetworkError!", [
          { text: "OK", onPress: () => playLoader(false) },
        ]);
        return;
      }
      const data = await response.json();
      const newUrl = data.playLink;
      if (!newUrl) {
        Alert.alert("SERVER RESPONSE", "Failed to Get Url!", [
          { text: "OK", onPress: () => playLoader(false) },
        ]);
        return;
      }
      currentUrl = newUrl;
      showToPlay.programme.playingUrl = newUrl;
      editMovies(positionedAt, showToPlay);
    } //end of if
    setPlayingUrl(currentUrl);
  } //of if its a series if statement
  else {
    if (!showToPlay || !showToPlay.programme.seriesSeasons) {
      Alert.alert("Series Error", "Series has now season and episodes!.", [
        { text: "OK", onPress: () => playLoader(false) },
      ]);
      return;
    }
    const currentSeason = showToPlay.programme.seriesSeasons.find(
      (seasonItem: any) => seasonItem.season == inputSeason,
    );
    const currentEpisode = currentSeason.episodes.find(
      (episodeNUmber: any) => episodeNUmber.name === inputEpisode,
    );
    // if url not found
    if (currentEpisode.play == "no url found") {
      const response = await fetch(`${basedUrl}/series-url-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title: showToPlay.programme.seriesHeader,
          Season: inputSeason,
          Episode: inputEpisode,
        }),
      });

      if (response.status !== 200) {
        Alert.alert("Server Notification", "SERVER ERROR!", [
          { text: "OK", onPress: () => playLoader(false) },
        ]);
        return;
      }

      const data = await response.json();
      if (!data.playLink) {
        Alert.alert("PROGRESS", "URL NOT FOUND!", [
          { text: "OK", onPress: () => playLoader(false) },
        ]);
        return;
      }

      currentEpisode.play = data.playLink;

      //first have to update the selected show
      showToPlay.programme.seriesSeasons.forEach((Season: any) => {
        if (Season.season === inputSeason) {
          Season.episodes.forEach((Episode: any) => {
            if (Episode.name === inputEpisode) {
              Episode.play = data.playLink;
            }
          }); //end of inner each loop
        } //end of first if
      }); //end of outer each loop

      editSeries(positionedAt, showToPlay);
    } //end of if url not FOUND if
    setPlayingUrl(currentEpisode.play);
  } //end of else

  turnOnPlay(true);
  playLoader(false);
  router.navigate("../playPage");
} //end of play function

async function upDateLickedShows(
  setUpLoader: (value: boolean) => void,
  isTheShowedLiked: boolean,
  choosenShow: any,
) {
  setUpLoader(true);
  const userID = (userStore.getState() as { userId: string }).userId;
  const lickedShows = (userStore.getState() as { userLiked: any }).userLiked;

  if (isTheShowedLiked) {
    // this removes an element from the list
    choosenShow.programmeType !== "series" ?
    removeMovie(choosenShow.programme.movieHeader) :
    removeSeries(choosenShow.programme.seriesHeader)

  } 
  else {
    // adding to users liked show
    choosenShow.programmeType !== "series" ?
    addingMovie(choosenShow.programme.movieHeader) :
    addingSeries(choosenShow.programme.seriesHeader)

  }

  try{
    const updateCloud = await fetch(`${basedUrl}/user/update-userLikes`, {
      method: "POST",
      headers:{ "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userID,
        userLikes: lickedShows
      })
    })

    if(!updateCloud.ok) throw new Error("Failed to Connect to CLOUD!...")

      const data = await updateCloud.json()
      if(data.message !== "Update was successfully!.") throw new Error(data.message)

        console.log("SHOW ADDED SUCCESSFULLY!...")
  }//end of try Here!.

  catch(err: unknown){console.log(err instanceof Error ? err.message : "unknown server Error!...")}
  finally{setUpLoader(false)}


} //end of update licked shows functions

export { Play, upDateLickedShows };