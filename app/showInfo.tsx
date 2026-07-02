import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { ImageBackground } from 'expo-image';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { BlurView } from "expo-blur";
import SelectComponent from "@/components/selector";
import { PlayIcon } from "react-native-heroicons/solid";
import { router } from "expo-router";
import CastCard from "@/components/castCard";
import { Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import { useMainStore } from "@/stateManagement/store";

export default function Infor() {
  const navigation = useNavigation();

  const turnOnPlay = useMainStore((state: any) => state.setPlaying);

  const mainUrl = useMainStore((state: any) => state.baseUrl);
  const selected_show = useMainStore((state: any) => state.selectedShow);

  const [season, setSeason] = useState("Season 1");
  const [episode, setEpisode] = useState("Episode 1");
  const [showHeader, setShowHeader] = useState(selected_show.seriesHeader)
  const [AddingSeasonOnline, setAddingSeason] = useState(false)
  const [playLoader, setPlayLoader] = useState(false);
  const [showLanguage, setShowLanguage] = useState("Not specified!.")

  const positionedAt = useMainStore((state: any) => state.selectedPosition);

  const typeOfShow = useMainStore((state: any) => state.showType);
  const pendingSeasons = typeOfShow == "series" ? selected_show.pendingSeasons.length !== 0 : false

  // updating movies or series array
  const editMovies = useMainStore((state: any) => state.editMovies);
  const editSeries = useMainStore((state: any) => state.editSeries);

  const setPlayingUrl = useMainStore((state: any) => state.setUrl);

  const genres =
    typeOfShow === "series"
      ? selected_show.seriesGenres
      : selected_show.movieGenres;

  const actors =
    typeOfShow === "series"
      ? selected_show.seriesCast
      : selected_show.movieCast;

    useEffect(()=>{
      console.log("This is the header:", selected_show.seriesHeader)
      setShowHeader(selected_show.seriesHeader)

      const mainLanguage = typeOfShow == "series"
      ? selected_show.seriesLanguage
      : selected_show.movieLanguage

      if(mainLanguage[0] === "$" || mainLanguage === "" || !mainLanguage) setShowLanguage("NOT SPECIFIED")
      else setShowLanguage(mainLanguage)


    }, [selected_show])

  return (
    <View className="w-screen h-screen">
      <Text className="text-4xl font-lobster underline underline-offset-2 text-green-600 text-center m-2">
        {typeOfShow == "series"
          ? selected_show.seriesHeader
          : selected_show.movieHeader}
      </Text>

      <ScrollView>
        <View>
          <ImageBackground
            className="items-center h-170 w-full relative"
            source={{uri: typeOfShow == "series" ? selected_show.seriesImageUrl: selected_show.movieImageUrl}}
            transition={200} // Fast-fade transition will now work perfectly here!
            contentFit="cover" // Equivalent to resizeMode
          >
            {/* play button container */}
            <View className="m-[50%]  shadow-2xl rounded-full">
              {!playLoader ? (
                <Pressable
                  onPress={async () => {
                    if(AddingSeasonOnline) return

                    setPlayLoader(true);
                    if (typeOfShow !== "series") {
                      let currentUrl = selected_show.playingUrl;

                      if (!currentUrl) {
                        const response = await fetch(
                          `${mainUrl}/update-movie`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              Title: selected_show.movieHeader,
                            }),
                          },
                        );

                        if (!response.ok) {
                          Alert.alert("BAD NETWORK", "NetworkError!", [
                            { text: "OK", onPress: () => setPlayLoader(false) },
                          ]);
                          return;
                        }

                        const data = await response.json();
                        const newUrl = data.playLink;

                        if (!newUrl) {
                          Alert.alert("SERVER RESPONSE", "Failed to Get Url!", [
                            { text: "OK", onPress: () => setPlayLoader(false) },
                          ]);
                          return;
                        }

                        currentUrl = newUrl;
                        selected_show.playingUrl = newUrl;
                        editMovies(positionedAt, selected_show);
                      } //end of if

                      setPlayingUrl(currentUrl);
                    } else {
                      const currentSeason = selected_show.seriesSeasons.find(
                        (seasonItem: any) => seasonItem.season == season,
                      );
                      const currentEpisode = currentSeason.episodes.find(
                        (episodeNUmber: any) => episodeNUmber.name === episode,
                      );
                      // if url not found
                      if (currentEpisode.play == "no url found") {
                        const response = await fetch(
                          `${mainUrl}/series-url-search`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              Title: selected_show.seriesHeader,
                              Season: season,
                              Episode: episode,
                            }),
                          },
                        );
                        if (response.status !== 200) {
                          Alert.alert("Server Notification", "SERVER ERROR!", [
                            { text: "OK", onPress: () => setPlayLoader(false) },
                          ]);
                          return;
                        }

                        const data = await response.json();
                        console.log(`This is data:\n${data}\n`);
                        console.log(
                          `This is the url from th server:\n${data.playLink}`,
                        );
                        if (!data.playLink) {
                          Alert.alert("PROGRESS", "URL NOT FOUND!", [
                            { text: "OK", onPress: () => setPlayLoader(false) },
                          ]);
                          return;
                        }
                        currentEpisode.play = data.playLink;

                        //first have to update the selected show
                        selected_show.seriesSeasons.forEach((Season: any) => {
                          if (Season.season === season) {
                            Season.episodes.forEach((Episode: any) => {
                              if (Episode.name === episode) {
                                Episode.play = data.playLink;
                              }
                            }); //end of inner each loop
                          } //end of first if
                        }); //end of outer each loop

                        editSeries(positionedAt, selected_show);
                      } //end of if url not FOUND if
                      setPlayingUrl(currentEpisode.play);
                    } //end of else
                    turnOnPlay(true);
                    setPlayLoader(false);
                    router.navigate("../playPage");
                  }}
                >
                  <PlayIcon className="self-center" color="white" size={80} />
                </Pressable>
              ) : (
                <ActivityIndicator size="large" color="#00ff00" />
              )}
            </View>

            <BlurView
              className={`flex justify-evenly absolute bottom-0 left-0 w-full ${typeOfShow == "series"? "h-60" :"h-30"}`}
              intensity={90}
              tint="dark"
            >
              {/* Langauge display Text */}

              <View className="flex flex-row">
                <Text className="text-white font-lora text-2xl">Langauge:</Text>
                <Text className="bg-green-500 text-2xl text-white mx-4 p-1 font-lora px-4 font-extrabold rounded-lg truncate">
                  {showLanguage}
                </Text>
              </View>

              {/* Genres section */}
              <View className="flex flex-row w-full">
                <Text className="text-white font-lora text-lg">Genres:</Text>
                {genres.map((genre: string) => (
                  <Text className="text-white text-lg" key={genre}>
                    {" "}{genre},{" "}
                  </Text>
                ))}
              </View>

              {/* Select Season and Episode */}
              <View>
                {typeOfShow == "series" && (
                  <SelectComponent
                    showTitle={showHeader}
                    selectedSeason={season}
                    selectedEpisode={episode}
                    seasonsEpisode={selected_show.seriesSeasons}
                    pendingSeasons={pendingSeasons}
                    addingSeaon={AddingSeasonOnline}
                    setaddingSeason={setAddingSeason}
                    setSeason={setSeason}
                    setEpisode={setEpisode}
                  />
                )}
              </View>
            </BlurView>
          </ImageBackground>
        </View>

        <Text className="text-4xl text-green-600 underline underline-offset-2 font-lobster text-center">
          Description
        </Text>
        <Text className="p-2 text-base font-lora text-center leading-relaxed">
          {typeOfShow == "series"
            ? selected_show.seriesDescription
            : selected_show.movieDescription}
        </Text>

        {/* Cast items here */}
        <Text className="text-center font-lobster text-green-500 text-4xl m-2">
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
