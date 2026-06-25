import { Text, View, Image, Pressable } from "react-native";
import { router } from 'expo-router';
import { StarIcon } from "react-native-heroicons/solid";
import { useMainStore } from "@/stateManagement/store";
import { showPosition } from "@/utils/util";
import { useEffect } from "react";

type PROPS = {
  program: any;
  title: string;
  movieYear: number;
  rate: number;
  imageUrl: string;
};

export default function MovieContainer({ program, title, movieYear, rate, imageUrl }: PROPS) {
  const setShow = useMainStore((state: any)=> state.set_selected_show)
  const savePosition = useMainStore((state: any)=> state.getSelectedPosition)

  useEffect(()=> {savePosition(showPosition(program))}, [])

  return (
    <Pressable
    onPress={()=>{
      setShow(program, "movie")
      router.navigate("../showInfo")
    }}
    >
    <View className="card">
      <Image className="w-full h-40" source={{ uri: imageUrl }} resizeMode="cover" />

      <View className="mx-2">
        <Text numberOfLines={1} className="truncate">
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
