import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StarIcon } from "react-native-heroicons/solid";
import { useMainStore } from "@/stateManagement/store";
import { showPosition } from "@/utils/search-utils";
import { useEffect } from "react";

type PROPS = {
  program: any;
  title: string;
  movieYear: number;
  rate: number;
  imageUrl: string;
};

export default function MovieContainer({
  program,
  title,
  movieYear,
  rate,
  imageUrl,
}: PROPS) {
  const setShow = useMainStore((state: any) => state.set_selected_show);
  const savePosition = useMainStore((state: any) => state.getSelectedPosition);

  useEffect(() => {savePosition(showPosition(program));}, []);

  return (
    <Pressable
      onPress={() => {
        setShow(program, "movie");
        router.navigate("../showInfo");
      }}
    >
      <View className="card">
        <Image
          style={{ width: "100%", height: 160, backgroundColor: "#eee" }}
          source={{ uri: imageUrl }}
          placeholder={require("../assets/images/movies-default.png")}
          accessibilityLabel="Movie image"
          transition={200}
          contentFit="cover"
        />

        <View className="mx-2">
          <Text numberOfLines={1} className="font-lora font-extrabold truncate">
            {title}
          </Text>
          <Text>
            <StarIcon color="gold" size={14} />
            {rate}
          </Text>
          <Text>{movieYear}</Text>
        </View>
      </View>
    </Pressable>
  );
}
