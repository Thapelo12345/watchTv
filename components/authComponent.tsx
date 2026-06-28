import { View, Text, Pressable } from "react-native";
import { UserCircleIcon } from "react-native-heroicons/solid";

export default function Auth(){
return(
    <View className="flex flex-row justify-end gap-x-4 items-end bg-blue-400 w-full h-fit p-2">
    <UserCircleIcon color="white" size={30} />

    <Pressable>
        <Text className="auth-btn">SignUp</Text>
    </Pressable>
    <Pressable>
        <Text className="auth-btn">LogIn</Text>
    </Pressable>
    </View>
)
}