import { Stack } from "expo-router";
import { Text } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMainStore } from "@/stateManagement/store";
import { useEffect, useState } from "react"
import "../global.css";

export default function RootLayout() {
const a_show_is_playing = useMainStore((state: any)=> state.playing)
const [showPlaying, setShowPlaying] = useState(false)

  useEffect(()=>{
    setShowPlaying(a_show_is_playing)
  }, [a_show_is_playing])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1}} edges={showPlaying ? ["bottom"] : [ "top", "bottom"]}>

        <GestureHandlerRootView className="flex-1">
          <Text className={`${showPlaying ? "hidden" : "visible"} text-4xl text-center m-2`}>WATCH Tv</Text>
          <Stack 
          screenOptions={{ headerShown: false }} />
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
