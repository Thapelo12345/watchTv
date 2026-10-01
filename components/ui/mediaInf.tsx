import { Text, View, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { PlayIcon, PlusIcon, HeartIcon } from "react-native-heroicons/solid";
import { useState } from "react";
import { addRemoveLikedProgramme } from "@/utils/media-utils";

type PROPS = {
  folder: string;
  showHeader: string;
  genres: string[];
  show: any;
};

export default function MediaInfo({ folder, showHeader, genres, show }: PROPS) {
  const setShow = useMainStore((state: any) => state.set_selected_show);

  // store states
  const likedShows = userStore((state: any) => state.userLiked);
  const activeUser = userStore((state: any) => state.userActive);

  const lickedUnlicked =
    likedShows.userSeries.includes(showHeader) ||
    likedShows.userMovies.includes(showHeader);
  const [waitForserver, setWaitForServer] = useState(false);
  const safeGenres = Array.isArray(genres) ? genres : [];

  return (
    <BlurView
      className="absolute flex flex-col justify-evenly bottom-0 left-0 w-full h-50"
      intensity={95}
      tint="dark"
    >
      <Text className="text-white font-lobster text-4xl m-2 mx-4 truncate">
        {showHeader}
      </Text>

      <View className="flex flex-row mx-4">
        {safeGenres.map((genre, index) => (
          <Text
            className="text-white font-lora text-lg"
            key={`${genre}-${index}`}
          >
            {" "}
            {genre}
          </Text>
        ))}
      </View>

      <View className="p-2flex flex-row">
        <Pressable
          onPress={() => {
            const showType = !show.seriesHeader ? "movie" : "series";
            setShow(show, showType);
            router.navigate("../showInfo");
          }}
        >
          <View className="media-btn-container">
            <PlayIcon color="white" size={20} />
            <Text className="media-btn"> Play</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={async () => {
            if (waitForserver || !activeUser) return;

            setWaitForServer(true);

            const finish = await addRemoveLikedProgramme(
              showHeader,
              folder,
              lickedUnlicked ? "remove" : "add",
            );
            if (finish === "update done") setWaitForServer(false);
          }}
        >
          <View className="media-btn-container">
            {lickedUnlicked ? (
              <HeartIcon color="white" size={20} />
            ) : (
              <PlusIcon color="white" size={20} />
            )}
            <Text className="media-btn">My List</Text>
          </View>
        </Pressable>
      </View>
    </BlurView>
  );
}
