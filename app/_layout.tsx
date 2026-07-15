import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { Slot } from 'expo-router'
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
import * as WebBrowser from "expo-web-browser";
import "../global.css";

WebBrowser.maybeCompleteAuthSession();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lobster_400Regular,
    Lora_400Regular,
  });

const a_show_is_playing = useMainStore((state: any)=> state.playing)

const [showPlaying, setShowPlaying] = useState(false)
  
 // warming up the browser
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
  
  useEffect(()=>{
    setShowPlaying(a_show_is_playing)
  }, [a_show_is_playing])


  if (!fontsLoaded)  return null; // Keep loading screen up until asset is ready
 
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1}} edges={showPlaying ? ["bottom"] : [ "top", "bottom"]}>

        <GestureHandlerRootView className="flex-1">
          <Auth />
          <Text 
          className={`${showPlaying ? "hidden" : "flex"} bg-[whitesmoke] underline underline-offset-4 text-blue-400 font-lobster text-6xl text-center mt-2`}
          style={{textShadowColor: "rgba(0, 0, 0, 0.75)", textShadowOffset: { width: 2, height: 1}, textShadowRadius: 1, }}       
          >NestStream</Text>
          <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: "whitesmoke" }
            }} />
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
    </ClerkProvider>
  );
}
