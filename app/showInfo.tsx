import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Pressable,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { BlurView } from "expo-blur";
import SelectComponent from "@/components/selector";
import { PlayIcon } from "react-native-heroicons/solid";
import { router } from "expo-router";
import CastCard from "@/components/castCard";
import { BackHandler, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import { useMainStore } from "@/stateManagement/store";

export default function Infor() {
  const navigation = useNavigation();

  const turnOnPlay = useMainStore((state: any)=> state.setPlaying)

  const seasonOpen = useMainStore((state: any) => state.openSeason),
  episodeOpen = useMainStore((state: any) => state.openEpisode);

  const [season, setSeason] = useState("Season 1");
  const [episode, setEpisode] = useState("Episode 1");
  const [playLoader, setPlayLoader] = useState(false)

  const selected_show = useMainStore((state: any) => state.selectedShow);
  const positionedAt = useMainStore((state: any)=> state.selectedPosition)

  // updating movies or series array
  const editMovies = useMainStore((state: any)=> state.editMovies)
  const editSeries = useMainStore((state: any)=> state.editSeries)

  const typeOfShow = useMainStore((state: any) => state.showType);
  const setPlayingUrl = useMainStore((state: any) => state.setUrl);

  const genres =
    typeOfShow === "series"
      ? selected_show.seriesGenres
      : selected_show.movieGenres;

  const actors =
    typeOfShow === "series"
      ? selected_show.seriesCast
      : selected_show.movieCast;

  
  useEffect(() => {
    if (!seasonOpen && !episodeOpen) return;

    // 1. Android Hard Block
    const onBackPress = () => {
      Alert.alert("Select a SEASON OR EPISODE FIRST!.");
      return true;
    };

    // CAPTURE THE SUBSCRIPTION OBJECT HERE
    const backHandlerSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    // 2. iOS Swipe Disabler
    navigation.setOptions({
      gestureEnabled: false,
    });

    // 3. Navigation Interceptor (Header links & routing calls)
    const beforeRemoveUnsubscribe = navigation.addListener(
      "beforeRemove",
      (e) => {
        e.preventDefault();

        Alert.alert("Discard changes?", "You have unsaved changes.", [
          { text: "Stay", style: "cancel" },
          {
            text: "Leave",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]);
      },
    );

    // Clean up
    return () => {
      // FIX: Call .remove() directly on the saved subscription object
      backHandlerSubscription.remove();

      beforeRemoveUnsubscribe();
      navigation.setOptions({
        gestureEnabled: true,
      });
    };
  }, [seasonOpen, episodeOpen]);

  return (
    <View className="w-screen h-screen">
      <Text className="text-4xl text-center m-2">
        {typeOfShow == "series"
          ? selected_show.seriesHeader
          : selected_show.movieHeader}
      </Text>

      <ScrollView>
        <View>
          <ImageBackground
            className="items-center h-170 w-full relative"
            source={{
              uri:
                typeOfShow == "series"
                  ? selected_show.seriesImageUrl
                  : selected_show.movieImageUrl,
            }}
            resizeMode="cover"
          >

            {/* play button container */}
            <View className="my-[50%] shadow-2xl rounded-full">
            {
              !playLoader ?
             ( <Pressable
              
              onPress={async () => {
                setPlayLoader(true)
                if(typeOfShow !== "series") {
                  let currentUrl = selected_show.playingUrl

                  console.log(currentUrl)
                  if(!currentUrl){

                    const response = await fetch("http://192.168.18.7:5000/update-movie", 
                      {
                      method: "POST",
                      headers: {"Content-Type": "application/json"},
                      body: JSON.stringify(
                        {Title: selected_show.movieHeader})
                    })

                    if(!response.ok){
                      Alert.alert('BAD NETWORK', 'NetworkError!', [{text: 'OK', onPress: () => setPlayLoader(false)}]);
                      return
                    }

                    const data = await response.json()
                    const newUrl = data.playLink

                    if(!newUrl){
                      Alert.alert('SERVER RESPONSE', 'Failed to Get Url!', [{text: 'OK', onPress: () => setPlayLoader(false)}])
                      return
                    }

                    currentUrl = newUrl
                    selected_show.playingUrl = newUrl
                    editMovies(positionedAt, selected_show)
                    
                  }//end of if

                  setPlayingUrl(currentUrl);
                }
                else{
                  const currentSeason = selected_show.seriesSeasons.find((seasonItem: any)=> seasonItem.season == season)
                  const currentEpisode = currentSeason.episodes.find((episodeNUmber: any)=> episodeNUmber.name === episode)
                  // if url not found
                  if(currentEpisode.play == "no url found"){
                    
                    const response = await fetch("http://192.168.18.7:5000/series-url-search", 
                      {method: "POST", 
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                        Title: selected_show.seriesHeader,
                        Season: season,
                        Episode: episode
                        })})
                    if(response.status !== 200) {

                      Alert.alert('Server Notification', 'SERVER ERROR!', [{text: 'OK', onPress: () => setPlayLoader(false)}]);
                      return
                    }

                    const data = await response.json()
                    console.log(`This is data:\n${data}\n`)
                    console.log(`This is the url from th server:\n${data.playLink}`)
                    if(!data.playLink){
                      Alert.alert('PROGRESS', 'URL NOT FOUND!', [{text: 'OK', onPress: () => setPlayLoader(false)}]);
                      return
                    }
                    currentEpisode.play = data.playLink
                    
                    //first have to update the selected show 
                    selected_show.seriesSeasons.forEach((Season: any)=>{
                      if(Season.season === season){
                        Season.episodes.forEach((Episode: any)=>{

                          if(Episode.name === episode){
                            Episode.play = data.playLink
                          }
                        })//end of inner each loop

                      }//end of first if
                    })//end of outer each loop

                    editSeries(positionedAt, selected_show)

                  }//end of if url not FOUND if
                  setPlayingUrl(currentEpisode.play)
                }//end of else 
                turnOnPlay(true)
                setPlayLoader(false)
                router.navigate("../playPage");
              }}
            >
              <PlayIcon className="self-center" color="white" size={80} />
            </Pressable>)
            :
            (<ActivityIndicator size="large" color="#00ff00"/>)
            }
            </View>

            <BlurView
              className="absolute bottom-0 left-0 w-full h-40"
              intensity={90}
              // tint="light"
              tint="dark"
            >
              {/* Langauge display Text */}
              <Text>
                Langauge:
                {typeOfShow == "series"
                  ? selected_show.seriesLanguage
                  : selected_show.movieLanguage}
              </Text>

              {/* Genres section */}
              <View className="flex flex-row w-full">
                <Text>Genres:</Text>
                {genres.map((genre: any) => (
                  <Text key={uuidv4()}> {genre}, </Text>
                ))}
              </View>

              {/* Select Season and Episode */}
              <View>
                {typeOfShow == "series" && (
                  <SelectComponent
                    selectedSeason={season}
                    selectedEpisode={episode}
                    seasonsEpisode={selected_show.seriesSeasons}
                    setSeason={setSeason}
                    setEpisode={setEpisode}
                  />
                )}
              </View>
            </BlurView>
          </ImageBackground>
        </View>

        <Text className="text-2xl text-center">Description</Text>
        <Text className="p-2 text-base text-center leading-relaxed">
          {typeOfShow == "series"
            ? selected_show.seriesDescription
            : selected_show.movieDescription}
        </Text>

        {/* Cast items here */}
        <Text className="text-center text-2xl font-extrabold underline-offset-2 m-2">
          Cast
        </Text>
        <View className="w-full mb-15 flex flex-row flex-wrap items-start justify-evenly">
          {actors.map((actor: any) => (
            <CastCard
              key={uuidv4()}
              actorName={actor.actorRealName}
              imageUrl={actor.actorImage}
              character={actor.actorCharacter}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
