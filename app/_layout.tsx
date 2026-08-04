import { ClerkProvider } from "@clerk/expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Stack } from "expo-router";
import { Text, Modal } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMainStore } from "@/stateManagement/store";
import { useEffect, useState } from "react";
import { useFonts, Lobster_400Regular } from "@expo-google-fonts/lobster";
import { Lora_700Bold } from "@expo-google-fonts/lora";
import Auth from "@/components/authComponent";
import { AuthView } from "@clerk/expo/native";
import * as WebBrowser from "expo-web-browser";
import "../global.css";

WebBrowser.maybeCompleteAuthSession();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey)
  throw new Error("Add your Clerk Publishable Key to the .env file");

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};



export default function RootLayout() {

  const Theme = useMainStore((state: any)=> state.theme)
  // 1. Create your custom theme object
const MyGlobalCustomTheme = {
  ...DarkTheme, // Base it on DarkTheme to automatically flip native system text defaults
  colors: {
    ...DarkTheme.colors,
    background: Theme === "light" ? "whitesmoke" : "#232325", 
  },
};

  const [fontsLoaded] = useFonts({
    Lobster_400Regular,
    Lora_700Bold,
  });

  const a_show_is_playing = useMainStore((state: any) => state.playing);

  const [openClerk, setOpenclerk] = useState(false)
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
            style={{ flex: 1, backgroundColor: Theme === "light" ? "whitesmoke" : "#232325" }}
            edges={showPlaying ? ["bottom"] : ["top", "bottom"]}
          >
            <GestureHandlerRootView className="flex-1">
              <Auth openCloseClerk={setOpenclerk}/>
              <Text
                className={`${showPlaying ? "hidden" : "flex"} underline underline-offset-2  text-blue-400 font-lobster text-6xl text-center mt-2`}
              >
                NestStream
              </Text>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "whitesmoke" },
                }}
              />

              <Modal
                animationType="slide"
                visible={openClerk}
                presentationStyle="pageSheet"
              >
                <AuthView
                  mode="signInOrUp"
                  isDismissible={true}
                  onDismiss={() => setOpenclerk(false)}
                />
              </Modal>
            </GestureHandlerRootView>
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
