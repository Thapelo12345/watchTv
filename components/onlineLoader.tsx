import { View, Text, ActivityIndicator } from "react-native"
import LoadingScreen from "./animations/loading";


export function OnlineLoader(){
    return(
        <View className="border m-auto flex items-center justify-center w-1/2 h-1/2">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Search the WEB!...</Text>
        </View>
    )
}