import { Text, View, Pressable } from "react-native";
import { TrashIcon } from "react-native-heroicons/solid";
import { deleteItem, openShow } from "@/utils/list-items-utils";

type PROP = {
  itemName: string;
  mainList: string;
  setmodal1: (value: boolean)=> void;
  setModal2: (value: boolean)=> void;
};
export default function ListItem({ itemName, mainList, setmodal1, setModal2 }: PROP) {
  return (
    <View className="flex flex-row items-center justify-between w-[90%] h-10 border-2 border-white m-2 px-4">
      <View className="flex flex-row gap-2 justify-between w-full">
        <Pressable 
        className=" w-[90%]"
        onPress={()=> {
          setModal2(false)
          setmodal1(false)
          openShow(itemName)
        }}
        >
          <Text className="text-white z-20 truncate">{itemName}</Text>
        </Pressable>

        <Pressable
        onPress={()=> deleteItem(itemName, mainList)}
        >
          <TrashIcon size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
