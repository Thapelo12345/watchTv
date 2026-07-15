import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StarIcon } from "react-native-heroicons/solid";
import { useMainStore } from "@/stateManagement/store";
import { showPosition } from "@/utils/search-utils";
import { useEffect } from "react";

type PROPS = {
  program: any;
  title: string;
  seriesYear: number;
  rate: number;
  imageUrl: string;
};

export default function SeriesContainer({
  program,
  title,
  seriesYear,
  rate,
  imageUrl,
}: PROPS) {
  const setShow = useMainStore((state: any) => state.set_selected_show);
  const savePosition = useMainStore((state: any) => state.getSelectedPosition);

  useEffect(() => {
    savePosition(showPosition(program));
  }, []);

  return (
    <Pressable
      onPress={() => {
        setShow(program, "series");
        router.navigate("../showInfo");
      }}
    >
      <View className="card">
        <Image
          style={{ width: "100%", height: 160, backgroundColor: "#eee" }}
          source={{ uri: imageUrl }}
          placeholder={require("../assets/images/series-defualt.png")}
          accessibilityLabel="Series image"
          transition={200}
          contentFit="cover"
        />

        <View className="mx-2">
          <Text numberOfLines={1} className="font-lora font-extrabold truncate">
            {title}
          </Text>
          <Text>
            <StarIcon color="gold" size={10} /> {rate}
          </Text>
          <Text> {seriesYear}</Text>
        </View>
      </View>
    </Pressable>
  );
}
