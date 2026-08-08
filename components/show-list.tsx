import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { XCircleIcon } from "react-native-heroicons/solid";
import ListItem from "./ui/list-item";
import { useContext, useState, useEffect } from "react";
import { lickedModal } from "@/Content/listContent";
import { Alert } from "react-native";
import { useTheme } from "@/constants/myTheme";

type PROPS = {
  ActionIcon: React.ComponentType<{ color?: string; size?: number }>;
  listName: string;
  listArray: string[];
};

export default function ShowList({ ActionIcon, listName, listArray }: PROPS) {
  const theme = useTheme();

  const [loader, setLoader] = useState(false);

  const { modalOpen, setModal } = useContext(lickedModal);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (listArray.length === 0) setOpenModal(false);
  }, [listArray]);

  return (
    <View
      className="border-4 w-[50%] border-white m-2 p-2 shadow-lg rounded-lg"
      style={{
        boxShadow: theme.settingsShadow,
      }}
    >
      <Pressable
        className="flex flex-row gap-2"
        onPress={() => {
          if (!modalOpen) {
            if (listArray.length === 0) {
              Alert.alert(
                "DATA NOTIFICATION",
                `No ${listName} data availiable`,
                [{ text: "OK", onPress: () => console.log("Canceled!") }],
              );
              return;
            }
            setOpenModal(true);
            setModal(true);
          }
        }}
      >
        <ActionIcon color="#60a5fa" size={20} />
        <Text className="text-center" style={{ color: theme.text }}>
          {listName}
        </Text>
      </Pressable>

      <View
        className={`${openModal ? "visible" : "hidden"} absolute left-30 -top-8 w-74 h-72 z-20 p-2 rounded-lg`}
      >
        <Pressable
          onPress={() => {
            setOpenModal(false);
            setModal(false);
          }}
        >
          <XCircleIcon color={theme.text} size={25} />
        </Pressable>

        {loader ? (
          <ActivityIndicator color={theme.text} size={"large"}/>
        ) : (<ScrollView className="flex-1">
          {listArray.map((item, index) => (
            <ListItem
              key={index}
              itemName={item}
              mainList={listName}
              setmodal1={setOpenModal}
              setModal2={setModal}
              setLoading={setLoader}
            />
          ))}
        </ScrollView>)}

      </View>
    </View>
  );
}
