import { Text, View, Pressable, StyleSheet } from "react-native";
import { TrashIcon } from "react-native-heroicons/solid";
import { deleteItem, openShow } from "@/utils/list-items-utils";
import LinearGradient from 'react-native-linear-gradient';

type PROP = {
  itemName: string;
  mainList: string;
  setmodal1: (value: boolean)=> void;
  setModal2: (value: boolean)=> void;
};
export default function ListItem({ itemName, mainList, setmodal1, setModal2 }: PROP) {
  return (
    <View 
    className="flex flex-row items-center justify-center w-[90%] h-10 border-2 border-white m-2 p-2 rounded-lg overflow-hidden"
    style={{boxShadow: "2px 2px 8px black"}}
    >
      <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      className="px-4 pt-1"
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}   // Left side
        end={{ x: 1, y: 0 }}
      >
      <View className="flex flex-row items-center gap-2 justify-center w-full">
        <Pressable 
        className=" w-[90%]"
        onPress={()=> {
          setModal2(false)
          setmodal1(false)
          openShow(itemName)
        }}
        >
          <Text
          numberOfLines={1} 
          ellipsizeMode="tail"
           className="text-white z-20 truncate my-auto">{itemName}</Text>
        </Pressable>

        <Pressable
        onPress={()=> deleteItem(itemName, mainList)}
        >
          <TrashIcon size={20} color="white" />
        </Pressable>
      </View>
      </LinearGradient>
    </View>
  );
}
