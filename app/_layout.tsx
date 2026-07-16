import { ClerkProvider } from "@clerk/expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMainStore } from "@/stateManagement/store";
import { useEffect, useState } from "react";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import { Lora_700Bold } from "@expo-google-fonts/lora";
import Auth from "@/components/authComponent";
import * as WebBrowser from "expo-web-browser";
import "../global.css";

WebBrowser.maybeCompleteAuthSession();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// 1. Create your custom theme object
const MyGlobalCustomTheme = {
  ...DarkTheme, // Base it on DarkTheme to automatically flip native system text defaults
  colors: {
    ...DarkTheme.colors,
    background: "whitesmoke", // 👈 Change this to your exact global background hex color!
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lobster_400Regular,
    Lora_700Bold,
  });

  const a_show_is_playing = useMainStore((state: any) => state.playing);

  const [showPlaying, setShowPlaying] = useState(false);

  // warming up the browser
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  useEffect(() => {
    setShowPlaying(a_show_is_playing);
  }, [a_show_is_playing]);

  if (!fontsLoaded) return null; // Keep loading screen up until asset is ready

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider value={MyGlobalCustomTheme}>
        <SafeAreaProvider>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: 'whitesmoke' }}
            edges={showPlaying ? ["bottom"] : ["top", "bottom"]}
          >
            <GestureHandlerRootView className="flex-1">
              <Auth />
              <Text
                className={`${showPlaying ? "hidden" : "flex"}  text-blue-400 font-lobster text-6xl text-center mt-2`}
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.75)",
                  textShadowOffset: { width: 2, height: 1 },
                  textShadowRadius: 1,
                }}
              >
                NestStream
              </Text>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "whitesmoke" },
                }}
              />
            </GestureHandlerRootView>
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
