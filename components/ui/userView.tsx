import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/constants/myTheme";
import {
  ClipboardDocumentListIcon,
  ListBulletIcon,
} from "react-native-heroicons/outline";
import { useState, useEffect } from "react";
import { userStore } from "@/stateManagement/userStore";

export default function ViewShows() {
  const theme = useTheme();

  const setViewing = userStore((state: any) => state.setPrefferendView);
  const onView = userStore((state: any) => state.userPrefferendView);
  const [viewList, setViewList] = useState(onView);

  useEffect(() => {
    setViewList(onView);
  }, [onView]);

  return (
    <View
      className={`flex flex-row items-start bg-[${theme.background}] justify-between w-full m-2 px-4 p-2`}
    >
      <Pressable className="view-show-btn" onPress={() => setViewing("all")}>
        <ListBulletIcon
          color={viewList === "all" ? theme.viewActiveColor : theme.text}
          size={18}
        />
        <Text
          style={{
            color: viewList === "all" ? theme.viewActiveColor : theme.text,
          }}
        >
          All
        </Text>
      </Pressable>
      <Pressable className="view-show-btn" onPress={() => setViewing("myList")}>
        <ClipboardDocumentListIcon
          color={viewList !== "all" ? theme.viewActiveColor : theme.text}
          size={18}
        />
        <Text
          style={{
            color: viewList !== "all" ? theme.viewActiveColor : theme.text,
          }}
        >
          MyList
        </Text>
      </Pressable>
    </View>
  );
}
