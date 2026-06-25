import { View, Pressable, Text, ScrollView, FlatList, Modal } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { BlurView } from "expo-blur";
import { useState, useEffect } from "react";
import { useMainStore } from "@/stateManagement/store";

type PROPS = {
  showType: string;
  open: boolean;
  list: string[];
  setSelected: (vlaue: string) => void;
};
export default function DropDown({showType, open, list, setSelected }: PROPS) {

  const openSeason = useMainStore((state: any) => state.openCloseSeason),
   openEpisode = useMainStore((state: any) => state.openCloseEpisode);

  const [openDrop, setDrop] = useState(false)

  useEffect(()=>{setDrop(open)}, [open])

  return (
    <View className={
      `${openDrop ? "visible max-h-60" : "hidden h-0"} absolute top-15 left-0 w-40 z-20 pb-10 transition-all duration-160`
    }>
      <BlurView
              className="left-0 w-full h-full"
              intensity={50}
              tint="dark"
            >
       <ScrollView 
        nestedScrollEnabled={true} /* Essential: Stops the parent screen from stealing your scroll track */
        showsVerticalScrollIndicator={true}
      >
      {
        list.map((item)=> (
          <Pressable
          className="bg-blue-500 px-4 m-1 p-2 rounded-lg"
          key={uuidv4()}
          onPress={()=>{
            setSelected(item)
            showType == "season" ? openSeason(false) :
            openEpisode(false)
          }}
          >
            <Text>{item}</Text>
          </Pressable>
        ))
      }
</ScrollView>
</BlurView>

    </View>
  );
}
