import { Alert } from "react-native";
import { useMainStore } from "@/stateManagement/store";
import { router } from "expo-router";

const basedUrl = (useMainStore.getState() as { baseUrl: string}).baseUrl
const positionedAt = (useMainStore.getState() as { selectedPosition : number }).selectedPosition;
// const typeOfShow = (useMainStore.getState() as { showType: string}).showType

const editMovies = (useMainStore.getState() as { editMovies : (pos: number, show: any)=> void }).editMovies
const editSeries = (useMainStore.getState() as { editSeries: (pos: number, show: any)=> void }).editSeries
const setPlayingUrl = (useMainStore.getState() as { setUrl: (value: string)=> void } ).setUrl;
const turnOnPlay = (useMainStore.getState() as { setPlaying: (value: boolean)=> void }).setPlaying

export async function Play(
   showToPlay: any,
   inputSeason: string,
   inputEpisode: string,
    playLoader: (value: boolean)=> void,
  ) {
  
    console.log("Play function runing!..")
    console.log("This is the type of Show: ", showToPlay.programmeType)

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
  }//of if its a series if statement

  else {

    if(!showToPlay || !showToPlay.programme.seriesSeasons){
      Alert.alert("Series Error", "Series has now season and episodes!.", [
      { text: "OK", onPress: () => playLoader(false) },])
      return
    }
     const currentSeason = showToPlay.programme.seriesSeasons.find((seasonItem: any) => seasonItem.season == inputSeason);
     const currentEpisode = currentSeason.episodes.find((episodeNUmber: any) => episodeNUmber.name === inputEpisode);
    // if url not found
    if (currentEpisode.play == "no url found") {
      const response = await fetch(`${basedUrl}/series-url-search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({Title: showToPlay.programme.seriesHeader, Season: inputSeason,Episode: inputEpisode}),
        });

      if (response.status !== 200) {
        Alert.alert("Server Notification", "SERVER ERROR!", [
        { text: "OK", onPress: () => playLoader(false) },]);
        return;}
  
        const data = await response.json();
        console.log(`This is data:\n${data}\n`);
        console.log(`This is the url from th server:\n${data.playLink}`);

      if (!data.playLink) {
        Alert.alert("PROGRESS", "URL NOT FOUND!", [
        { text: "OK", onPress: () => playLoader(false) }]);
        return;}

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
                  
}//end of play function
