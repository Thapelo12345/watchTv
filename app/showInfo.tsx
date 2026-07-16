import { View, Text, ScrollView, Pressable } from "react-native";
import { ImageBackground } from "expo-image";
import "react-native-get-random-values";
import { BlurView } from "expo-blur";
import SelectComponent from "@/components/selector";
import { PlayIcon } from "react-native-heroicons/solid";
import CastSection from "@/components/castSection";
import { ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useMainStore } from "@/stateManagement/store";
import { Play } from "@/utils/showInfo-util";

export default function Infor() {
  const selected_show = useMainStore((state: any) => state.selectedShow);

  const [season, setSeason] = useState("Season 1");
  const [episode, setEpisode] = useState("Episode 1");
  const [showHeader, setShowHeader] = useState(selected_show.seriesHeader);
  const [AddingSeasonOnline, setAddingSeason] = useState(false);
  const [playLoader, setPlayLoader] = useState(false);
  const [showLanguage, setShowLanguage] = useState("Not specified!.");

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

  useEffect(() => {
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
  }, [selected_show]);

  return (
    <View className="w-screen h-screen pb-10">
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
            transition={200} // Fast-fade transition will now work perfectly here!
            contentFit="cover" // Equivalent to resizeMode
          >
            {/* play button container */}
            <View className="m-[50%]  shadow-2xl rounded-full">
              {!playLoader ? (
                <Pressable
                  onPress={async () => {
                    if (AddingSeasonOnline) return;

                    setPlayLoader(true);
                    Play(selected_show, season, episode, setPlayLoader);
                  }}
                >
                  <PlayIcon className="self-center" color="white" size={80} />
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
        <Text className="p-2 text-base font-lora text-center leading-relaxed">
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
