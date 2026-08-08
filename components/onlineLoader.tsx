import { View, Text, ActivityIndicator } from "react-native"
import { useTheme } from "@/constants/myTheme"
import { useEffect } from "react"
import LinearGradient from 'react-native-linear-gradient';
import TextAnimation from "./ui/textAnimation";
import { BackHandler } from 'react-native';

export function OnlineLoader(){
    const theme = useTheme()

useEffect(()=>{
const onBackPress = () => {return true};
const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
return () => subscription.remove();
}, [])

    return(
        <View className="flex items-center py-auto w-full h-full">
            <LinearGradient
            className="flex-1 items-center py-40 w-full"
            start={{x: 0, y: 0}} end={{x: 0, y: 1}} 
            colors={[theme.background,'#53B5EE']} 
            >    
            <ActivityIndicator size="large" color={theme.activeLoaderColor} />
            <TextAnimation />
            </LinearGradient>
        </View>
    )
}