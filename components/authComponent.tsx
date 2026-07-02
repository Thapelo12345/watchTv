import { View, Text, Pressable } from "react-native";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { useMainStore } from "@/stateManagement/store";
import { router } from "expo-router";

export default function Auth(){
    const mediaFilePlaying = useMainStore((state: any)=> state.playing)
return(
    <View className={`${mediaFilePlaying ? "hidden" : "visible"} flex flex-row justify-end w-[99%] mx-0.5 rounded-lg gap-x-4 items-en bg-blue-400 h-fit p-2`}>
    <UserCircleIcon color="white" size={30} />

    <Pressable
    onPress={()=> {
        router.navigate("/authPage")
        useMainStore.setState({userStatus: "signUp"})
    }}
    >
        <Text className="auth-btn">SignUp</Text>
    </Pressable>
    <Pressable
    onPress={()=> {
        router.navigate("/authPage")
        useMainStore.setState({userStatus: "logIn"})
    }}
    >
        <Text className="auth-btn">LogIn</Text>
    </Pressable>
    </View>
)
}