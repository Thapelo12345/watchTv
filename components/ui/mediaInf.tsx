import { Text, View, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { v4 as uuidv4 } from "uuid";
import { router } from "expo-router";
import { useMainStore } from "@/stateManagement/store";
import { PlayIcon, PlusIcon } from "react-native-heroicons/solid";

type PROPS = {
  showHeader: string;
  genres: string[];
  show: any;
};

export default function MediaInfo({ showHeader, genres, show }: PROPS) {
  const setShow = useMainStore((state: any) => state.set_selected_show);

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
        {genres.map((genre) => (
          <Text className="text-white font-lora text-lg" key={uuidv4()}>
            {" "}
            {genre}
          </Text>
        ))}
      </View>

      <View className="p-2flex flex-row">
        <Pressable
          onPress={() => {
            const showType = !show.seriesHeader ? "movie" : "series"
            setShow(show, showType);
            router.navigate("../showInfo");
          }}
        >
          <View className="media-btn-container">
            <PlayIcon color="white" size={20} />
            <Text className="media-btn"> Play</Text>
          </View>
        </Pressable>

        <Pressable>
          <View className="media-btn-container">
            <PlusIcon color="white" size={20} />
            <Text className="media-btn">My List</Text>
          </View>
        </Pressable>
      </View>
    </BlurView>
  );
}
