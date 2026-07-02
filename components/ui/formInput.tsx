import { View, Text, TextInput, KeyboardTypeOptions } from "react-native";

type PROPS ={
    label: string;
    // value: string;
    // inputType: KeyboardTypeOptions;
}
export default function FormInput({label }: PROPS){
    return(
        <View className="border border-red-500 flex flex-row items-center justify-items-start gap-x-2 w-full h-fit m-2 p-2 rounded-lg">
            <Text className="text-lg font-lora"> {label}</Text>
            <TextInput
            className="flex-1 border m-1 p-4 truncate h-fit rounded-lg overflow-hidden "
          onChangeText={()=>{}}
        //   value={number}
          placeholder={`Please enter ${label}...`}
        //   keyboardType={inputType}
        />
        </View>
    )
}