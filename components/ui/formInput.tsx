import { View, Text, TextInput } from "react-native";
import { useRef, useEffect } from "react";

type PROPS = {
  label: string;
  defaultValue?: string;
  sendUserName: (value: string)=> void;
};
export default function FormInput({ label, defaultValue, sendUserName }: PROPS) {

  const user = useRef(defaultValue)

  useEffect(()=>{user.current = defaultValue}, [defaultValue])

  return (
    <View className="flex flex-row items-center justify-items-start gap-x-2 w-full h-fit m-2 p-2 rounded-lg">
      <Text
        className="text-lg text-[20px] font-extrabold text-white font-lora"
        
      >
        {" "}
        {label}
      </Text>
      <TextInput
        className="input-text text-[20px]"
        onChangeText={(text) => sendUserName(text)}
        value={defaultValue}
        placeholder={`Please enter your  ${label}...`}
      />
    </View>
  );
}
