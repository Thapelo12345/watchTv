import { View, Pressable, Text, ScrollView, FlatList, Modal } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { BlurView } from "expo-blur";

type PROPS = {
  open: boolean;
  list: string[];
  closeDropDown: (value: boolean)=> void;
  setSelected: (vlaue: string) => void;
};
export default function DropDown({open, list, closeDropDown, setSelected }: PROPS) {

  return (
    <View className={
      `${open ? "visible max-h-60" : "hidden h-0"} absolute top-14 left-0 w-40 z-20 py-2`
    }>
      <BlurView
              className="left-0 w-full h-full"
              intensity={1}
              tint="dark"
            >
       <ScrollView 
        nestedScrollEnabled={true} /* Essential: Stops the parent screen from stealing your scroll track */
        showsVerticalScrollIndicator={false}
      >
      {
        list.map((item)=> (
          <Pressable
          className="scroll-items"
          key={item}
          onPress={()=>{
            setSelected(item)
            closeDropDown(false)
          }}
          >
            <Text className="text-white"
            style={{textDecorationColor: "black", textShadowOffset: {width: 1, height: 1}, textShadowRadius: 1}}
            >{item}</Text>
          </Pressable>
        ))
      }
</ScrollView>
</BlurView>

    </View>
  );
}
