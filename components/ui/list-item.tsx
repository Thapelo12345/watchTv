import { Text, View, Pressable, StyleSheet } from "react-native";
import { TrashIcon } from "react-native-heroicons/solid";
import { deleteItem, openShow } from "@/utils/list-items-utils";
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from "@/constants/myTheme";

type PROP = {
  itemName: string;
  mainList: string;
  setmodal1: (value: boolean)=> void;
  setModal2: (value: boolean)=> void;
  setLoading: (value: boolean)=> void;
};
export default function ListItem({ itemName, mainList, setmodal1, setModal2, setLoading }: PROP) {

  const theme = useTheme()

  return (
    <View 
    className="flex flex-row items-center justify-center w-[90%] h-10 border-2 border-white m-2 p-2 rounded-lg overflow-hidden"
    style={{boxShadow: "0.5px 0.5px 8px rgba(0,0,0,0.3)"}}
    >
      <LinearGradient
      colors={['#B5E8CF', '#A6C2F7', '#7EDCEC']}
      className="px-4 pt-1"
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
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
           className="text-white z-20 truncate my-auto"
           style={{color:theme.text, textShadowColor: theme.background, textShadowOffset:{width: 0.5, height: 0.5}, textShadowRadius: 1}}
           >{itemName}</Text>
        </Pressable>

        <Pressable
        onPress={ async ()=> {
          setLoading(true)
          const response = await deleteItem(itemName, mainList)
          console.log(response)
          setLoading(false)
        }}
        >
          <TrashIcon size={20} color={theme.text} />
        </Pressable>
      </View>
      </LinearGradient>
    </View>
  );
}
