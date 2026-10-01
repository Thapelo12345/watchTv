import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { ImageBackground } from "expo-image";
import "react-native-get-random-values";
import { BlurView } from "expo-blur";
import SelectComponent from "@/components/selector";
import { PlayIcon, HeartIcon } from "react-native-heroicons/solid";
import CastSection from "@/components/castSection";
import { useState, useEffect } from "react";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import {
  hasSevenDaysPassed,
  Play,
  upDateLickedShows,
} from "@/utils/showInfo-util";
import { Alert } from "react-native";
import { HeartIcon as HeartOutlineIcon } from "react-native-heroicons/outline";
import { useTheme } from "@/constants/myTheme";
import { useNavigation } from "@react-navigation/native";

export default function Infor() {
  const theme = useTheme();
  const navigation = useNavigation();

  const selected_show = useMainStore((state: any) => state.selectedShow);
  const allMovies = useMainStore((state: any) => state.movies);
  const allSeries = useMainStore((state: any) => state.series);

  // store solid state
  const lickedProgrammes = userStore((state: any) => state.userLiked);
  const infoLocked = useMainStore((state: any) => state.showInfoLocked);

  const activeUser = userStore((state: any) => state.userActive);
  const mainUrl = useMainStore((state: any) => state.baseUrl);

  // store action states
  const setCurrentlyPlaying = useMainStore(
    (state: any) => state.setPlayingProgramme,
  );
  const setSelectedShow = useMainStore((state: any) => state.set_selected_show);

  const editMovie = useMainStore((state: any) => state.editMovies);
  const editSeries = useMainStore((state: any) => state.editSeries);

  const [season, setSeason] = useState("Season 1");
  const [episode, setEpisode] = useState("Episode 1");
  const [showHeader, setShowHeader] = useState(selected_show.seriesHeader);
  const [AddingSeasonOnline, setAddingSeason] = useState(false);
  const [playLoader, setPlayLoader] = useState(false);
  const [showLanguage, setShowLanguage] = useState("Not specified!.");
  const [likedShow, setLikedShow] = useState(false);
  const [load, setLoad] = useState(false);

  const pendingSeasons =
    selected_show?.programmeType == "series"
      ? (selected_show?.programme?.pendingSeasons?.length || 0) !== 0
      : false;
  const genres =
    selected_show?.programme?.movieGenres ||
    selected_show?.programme?.seriesGenres ||
    [];
  const actors =
    selected_show?.programme?.movieCast ||
    selected_show?.programme?.seriesCast ||
    [];

  // useEffect to update movie if it is a movie
  useEffect(() => {
    const movieDetailsUpdate = async () => {
      try {
        setPlayLoader(true);

        console.log("Movie details update runing!..");
        const updateCloudDocument = await fetch(
          `${mainUrl}/movies/update-movie-details`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: selected_show.programme.movieHeader,
            }),
          },
        );

        if (!updateCloudDocument.ok)
          throw new Error("Faile to connect Server!.");

        const movieData = await updateCloudDocument.json();
        if (movieData.message !== "Updated successfully!..")
          throw new Error("Failed to update Movie!.");

        // new movie updates here!.
        const newUpdates = movieData.update;
        const showCopy = selected_show.programme;
        const moviePosition = allMovies.indexOf(selected_show.programme);

        if (newUpdates.newImage) showCopy.movieImageUrl = newUpdates.newImage;
        if (newUpdates.newRating !== 0)
          showCopy.movieRating = newUpdates.newRating;

        showCopy.detailsLastUpdateDate = new Date().toISOString().split("T")[0];

        editMovie(moviePosition, showCopy);
        setSelectedShow(showCopy, "movie");
      } catch (err: unknown) {
        const errMessage =
          err instanceof Error ? err.message : "Fail to update Movie!.";
        Alert.alert("UPDATE ERROR!.", errMessage);
      } finally {
        setPlayLoader(false);
      }
    };

    const seriesDetailsUpdate = async () => {
      try {
        setPlayLoader(true);
        console.log("Cloud Notification!..");

        const updateCloudDocument = await fetch(
          `${mainUrl}/series/update-series-details`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: selected_show.programme.seriesHeader,
            }),
          },
        );

        if (!updateCloudDocument.ok)
          throw new Error("Failed to connect to server!.");

        const cloudData = await updateCloudDocument.json();

        if (cloudData.message !== "Updated successfully!..")
          throw new Error("Failed to update Programme!.");
        const newUpdates = cloudData.update;

        const showPosition = allSeries.indexOf(selected_show.programme);

        if (showPosition === -1)
          throw new Error("Failed to find show on system DataBase!.");
        let updatedShow = selected_show.programme;

        if (newUpdates.newImage)
          updatedShow.seriesImageUrl = newUpdates.newImage;
        if (newUpdates.newRating !== 0)
          updatedShow.seriesRating = newUpdates.newRating;
        if (newUpdates.newSeasons.length !== 0)
          updatedShow.pendingSeasons = [
            ...updatedShow.pendingSeasons,
            ...newUpdates.newSeasons,
          ];

        updatedShow.detailsLastUpdateDate = new Date()
          .toISOString()
          .split("T")[0];

        editSeries(showPosition, updatedShow);
        setSelectedShow(updatedShow, "series");
      } catch (err: unknown) {
        const errMessage =
          err instanceof Error ? err.message : "Fail to update Movie!.";
        Alert.alert("UPDATE ERROR!.", errMessage);
      } finally {
        setPlayLoader(false);
      }
    };

    try {
      if (
        allMovies.find(
          (movie: any) =>
            selected_show.programme.movieHeader === movie.movieHeader,
        )
      ) {
        if (
          !selected_show.programme.detailsLastUpdateDate ||
          hasSevenDaysPassed(selected_show.programme.detailsLastUpdateDate)
        )
          movieDetailsUpdate();
      } //end of if
      else if (
        allSeries.find(
          (series: any) =>
            selected_show.programme.seriesHeader === series.seriesHeader,
        )
      ) {
        if (
          !selected_show.programme.detailsLastUpdateDate ||
          hasSevenDaysPassed(selected_show.programme.detailsLastUpdateDate)
        )
          seriesDetailsUpdate();
      } //end of else if
    } catch (err: unknown) {
      //end of else if
      const errMessage =
        err instanceof Error ? err.message : "Failed to update movie Info!";
      Alert.alert("UPDATE ERROR!.", errMessage);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: infoLocked ? false : true });

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (infoLocked) {
        e.preventDefault();
        Alert.alert(
          "SYSTEM NOTIFICATION",
          "Server Still Processing your request\nPlease be pateint!... ",
        );
      } //end of if
    });

    return unsubscribe;
  }, [navigation, infoLocked]);

  useEffect(() => {
    // checking is the user licked the current show or not and setting the state accordingly
    setLikedShow(
      selected_show.programmeType === "series"
        ? lickedProgrammes.userSeries.includes(
            selected_show.programme.seriesHeader,
          )
        : lickedProgrammes.userMovies.includes(
            selected_show.programme.movieHeader,
          ),
    );
    setShowHeader(selected_show.programme.seriesHeader);
    const mainLanguage =
      selected_show.programme.seriesLanguage ||
      selected_show.programme.movieLanguage;

    if (
      !mainLanguage ||
      mainLanguage[0] === "$" ||
      mainLanguage === "" ||
      !mainLanguage
    )
      setShowLanguage("NOT SPECIFIED");
    else setShowLanguage(mainLanguage);
  }, [selected_show, lickedProgrammes]);

  return (
    <View
      className="w-screen h-screen pb-10"
      style={{ backgroundColor: theme.background }}
    >
      <Text className="text-4xl font-lobster underline underline-offset-2 text-green-600 text-center m-2">
        {selected_show.programmeType == "series"
          ? selected_show.programme.seriesHeader
          : selected_show.programme.movieHeader}
      </Text>

      <ScrollView>
        <View>
          <ImageBackground
            className="items-center h-170 w-full relative"
            source={{
              uri:
                selected_show.programmeType === "series"
                  ? selected_show.programme.seriesImageUrl
                  : selected_show.programme.movieImageUrl,
            }}
            transition={200}
            contentFit="cover"
          >
            {/* play button container */}
            <View
              className="m-[50%] rounded-full"
              style={{ boxShadow: "2px 5px 9px black" }}
            >
              {!playLoader ? (
                <Pressable
                  onPress={async () => {
                    if (AddingSeasonOnline) return;
                    if (!activeUser) {
                      Alert.alert(
                        "APP LOCKED!.",
                        "You have to sign in before Viewing!.",
                      );
                      return;
                    }

                    setPlayLoader(true);
                    Play(selected_show, season, episode, setPlayLoader);

                    selected_show.programmeType === "series"
                      ? setCurrentlyPlaying({
                          programmeName: selected_show.programme.seriesHeader,
                          programmeSeason: { season, episode },
                        })
                      : setCurrentlyPlaying({
                          programmeName: selected_show.programme.movieHeader,
                        });
                  }}
                >
                  <View
                    className="flex items-center justify-center border-2 border-white -mx-10 w-20 h-20 rounded-full"
                    style={{
                      boxShadow:
                        "inset 2px 2px 10px white, inset -2px -8px 10px white, 2px 8px 10px rgba(0, 0, 0, 0.5), -2px -8px 10px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <PlayIcon color="#60a5fa" size={50} />
                  </View>
                </Pressable>
              ) : (
                <ActivityIndicator size="large" color="#00ff00" />
              )}
            </View>

            <BlurView
              className={`flex justify-evenly absolute bottom-0 left-0 w-full ${selected_show.programmeType === "series" ? "h-60" : "h-30"}`}
              intensity={130}
              tint="dark"
            >
              {/* Langauge display Text */}

              {!load ? (
                <View className="flex flex-row justify-between h-fit mb-4 w-full">
                  <View className="flex flex-row">
                    <Text className="text-white font-lora text-2xl">
                      Langauge:
                    </Text>
                    <Text className="bg-green-500 text-2xl text-white mx-4 p-1 font-lora px-4 font-extrabold rounded-lg truncate">
                      {showLanguage}
                    </Text>
                  </View>

                  <Pressable
                    className="mr-10"
                    onPress={() => {
                      if (infoLocked) return;
                      if (!activeUser) {
                        Alert.alert(
                          "APP LOCKED!",
                          "You have to be logged in before saving shows!..",
                        );
                        return;
                      }
                      upDateLickedShows(setLoad, likedShow, selected_show);
                    }}
                  >
                    {likedShow ? (
                      <HeartIcon color="white" size={30} />
                    ) : (
                      <HeartOutlineIcon color="white" size={30} />
                    )}
                  </Pressable>
                </View>
              ) : (
                <ActivityIndicator color="skyBlue" size="large" />
              )}

              {/* Genres section */}
              <View className="flex flex-row w-full">
                <Text className="text-white font-lora text-lg">Genres:</Text>
                {genres.map((genre: string) => (
                  <Text className="text-white text-lg" key={genre}>
                    {" "}
                    {genre},{" "}
                  </Text>
                ))}
              </View>

              {/* Select Season and Episode */}
              <View>
                {selected_show.programmeType === "series" && (
                  <SelectComponent
                    showTitle={showHeader}
                    selectedSeason={season}
                    selectedEpisode={episode}
                    seasonsEpisode={selected_show.programme.seriesSeasons}
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
        <Text
          className="p-2 text-base font-lora text-center leading-relaxed"
          style={{ color: theme.text }}
        >
          {selected_show.pogrameType === "series"
            ? selected_show.programme.seriesDescription
            : selected_show.programme.movieDescription}
        </Text>

        {/* Cast items here */}
        <CastSection castArray={actors} />
      </ScrollView>
    </View>
  );
}
