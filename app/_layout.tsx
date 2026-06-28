import { Stack } from "expo-router";
import { Text } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMainStore } from "@/stateManagement/store";
import { useEffect, useState } from "react"
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Lobster_400Regular } from '@expo-google-fonts/lobster';
import { Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import Auth from "@/components/authComponent";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lobster_400Regular,
    Lora_400Regular,
  });

const a_show_is_playing = useMainStore((state: any)=> state.playing)

const [showPlaying, setShowPlaying] = useState(false)

  useEffect(()=>{
    setShowPlaying(a_show_is_playing)
  }, [a_show_is_playing])

  if (!fontsLoaded)  return null; // Keep loading screen up until asset is ready
 
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1}} edges={showPlaying ? ["bottom"] : [ "top", "bottom"]}>

        <GestureHandlerRootView className="flex-1">
          <Auth />
          <Text 
          className={`${showPlaying ? "hidden" : "flex"} bg-[whitesmoke] text-blue-500 font-lobster text-6xl text-center mt-2`}
          style={{textShadowColor: "rgba(0, 0, 0, 0.75)", textShadowOffset: { width: 5, height: 1}, textShadowRadius: 2, }}       
          >WATCH Tv</Text>
          <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: "whitesmoke" }
            }} />
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
