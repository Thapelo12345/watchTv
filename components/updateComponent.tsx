import { View, Text, ActivityIndicator } from "react-native"
import { useMainStore } from "@/stateManagement/store"

export default function UpdateComponent(){
    // store static state 
    const isTheAppRunningUpdates = useMainStore((state: any)=> state.appUpdating)
    const updateMessage = useMainStore((state: any)=> state.appUpdateMessage)

    return(
    <View className="flex flex-col items-center justify-center gap-6 absolute inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)]"
    style={{display: isTheAppRunningUpdates ? "flex" : "none"}}
    >
        <ActivityIndicator color={"white"}  size={"large"}/>
        <View className="">
            <Text className="text-white text-[30px]">APP UPDATING!...</Text>
            <Text className="text-white">please be patient!...</Text>
            <Text className="text-white text-[20px] mt-10">{updateMessage}</Text>
        </View>
    </View>)
}