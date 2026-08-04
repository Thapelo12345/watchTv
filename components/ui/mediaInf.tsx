import { Text, View, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { v4 as uuidv4 } from "uuid";
import { router } from "expo-router";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore"
import { PlayIcon, PlusIcon, HeartIcon } from "react-native-heroicons/solid";
import { useState } from "react";
import { addRemoveLikedProgramme } from "@/utils/media-utils";
import { useAuth } from "@clerk/expo";
import { Alert } from "react-native";

type PROPS = {
  folder: string;
  showHeader: string;
  genres: string[];
  show: any;
};

export default function MediaInfo({
  folder,
  showHeader,
  genres,
  show,
}: PROPS) {

  const { isLoaded, isSignedIn } = useAuth()
  const setShow = useMainStore((state: any) => state.set_selected_show);

  // store states
  const likedShows = userStore((state: any)=> state.userLiked)

  const lickedUnlicked = likedShows.userSeries.includes(showHeader) || likedShows.userMovies.includes(showHeader)
  const [waitForserver, setWaitForServer] = useState(false);

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
        {genres !== undefined && genres.map((genre) => (
          <Text className="text-white font-lora text-lg" key={uuidv4()}>
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
            if(!isLoaded) return

            if(!isSignedIn){
              Alert.alert("APP LOCKED!.", "Cant Add Shows Without an account!.",
                [{text: "OK", onPress: ()=> console.log("Locked!")}]
              )
              return
            }
            if (waitForserver) return;

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
