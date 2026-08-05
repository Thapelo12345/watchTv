import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/constants/myTheme";
import {ClipboardDocumentListIcon, ListBulletIcon } from "react-native-heroicons/outline";
import { useState } from "react";

export default function ViewShows() {

const [viewList, setViewList ] = useState("all")

  const theme = useTheme();
  return (
    <View
      className={`flex flex-row items-start bg-[${theme.background}] justify-between w-full m-2 px-4 p-2`}
    >
      <Pressable className="view-show-btn"
      onPress={()=> setViewList("all")}
      >
          <ListBulletIcon color={viewList === "all" ? theme.viewActiveColor : theme.text} size={18} />
        <Text
        style={{color: viewList === "all" ? theme.viewActiveColor : theme.text}} 
        >
          All
        </Text>
      </Pressable>
      <Pressable className="view-show-btn"
      onPress={()=> setViewList("myList")}
      >
          <ClipboardDocumentListIcon color={viewList !== "all" ? theme.viewActiveColor : theme.text} size={18} />
        <Text
        style={{color: viewList !== "all" ? theme.viewActiveColor : theme.text}} 
        >
          MyList
        </Text>
      </Pressable>
    </View>
  );
}
