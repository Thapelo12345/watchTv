import 'expo-crypto';
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMainStore } from "@/stateManagement/store";
import { useEffect, useState } from "react";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import { Lora_700Bold } from "@expo-google-fonts/lora";
import * as WebBrowser from "expo-web-browser";
import { useTheme } from "@/constants/myTheme";
import UpdateComponent from "@/components/updateComponent";
import Auth from "@/components/authComponent";
import SuperBaseAuth from '@/components/superBaseAuth';
import "../global.css";

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const theme = useTheme();
  // 1. Create your custom theme object
  const MyGlobalCustomTheme = {
    ...DarkTheme, // Base it on DarkTheme to automatically flip native system text defaults
    colors: {
      ...DarkTheme.colors,
      background: theme.background,
    },
  };

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

  useEffect(() => {setShowPlaying(a_show_is_playing);}, [a_show_is_playing]);

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.background,
          }}
        >
          <Text>Loading...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
      <>
      <ThemeProvider value={MyGlobalCustomTheme}>
        <SafeAreaProvider>
          <SafeAreaView
            style={{
              position: "relative",
              flex: 1,
              backgroundColor: theme.background,
            }}
            edges={showPlaying ? ["bottom"] : ["top", "bottom"]}
          >
            <GestureHandlerRootView className="flex-1">
              <Auth />
              <Text
                className={`${showPlaying ? "hidden" : "flex"} underline underline-offset-2  text-blue-400 font-lobster text-6xl text-center mt-2`}
              >
                NestStream
              </Text>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: theme.background },
                }}
              />

              <UpdateComponent />
              <SuperBaseAuth />
            </GestureHandlerRootView>
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
      </>
  );
}