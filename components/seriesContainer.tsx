import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StarIcon } from "react-native-heroicons/solid";
import { useMainStore } from "@/stateManagement/store";
import { showPosition } from "@/utils/search-utils";
import { useTheme } from "@/constants/myTheme";
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

  const theme = useTheme()
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
      <View className="card"
      style={{
        backgroundColor: theme.cardBackground,
        boxShadow: theme.cardShadow
      }}
      >
        <Image
          style={{ width: "100%", height: 160, backgroundColor: "#eee" }}
          source={{ uri: imageUrl }}
          placeholder={require("../assets/images/series-defualt.png")}
          accessibilityLabel="Series image"
          transition={300}
          contentFit="cover"
        />

        <View className="mx-2">
          <Text numberOfLines={1} className="font-lora font-extrabold truncate"
          style={{
            color: theme.text
          }}
          >
            {title}
          </Text>
          <Text
          style={{
            color: theme.text
          }}
          >
            <StarIcon color="gold" size={10} /> {rate}
          </Text>
          <Text
          style={{
            color: theme.text
          }}
          > {seriesYear}</Text>
        </View>
      </View>
    </Pressable>
  );
}
