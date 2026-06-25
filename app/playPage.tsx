import { View, Text, BackHandler, TouchableOpacity, Platform, Alert } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { useMainStore } from "@/stateManagement/store";
import * as ScreenOrientation from "expo-screen-orientation";
import { useNavigation } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from "react";

export default function PlayComponent() {
  const navigation = useNavigation();

  const playableUrl = useMainStore((state: any) => state.playUrl);
  const turnOffPlay = useMainStore((state: any) => state.setPlaying);

  // Intercepts navigation requests
//   const handleShouldStartLoad = (request: WebViewNavigation) => {return request.url === playableUrl};

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      function () {
        turnOffPlay(false);
      },
    );

    async function changeOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      );
    }

    async function configureAndroidSystemUI() {
      if (Platform.OS === 'android') await NavigationBar.setVisibilityAsync('hidden'); 
    }

    configureAndroidSystemUI();

    changeOrientation();
    // Cleanup function: Safely reverts to portrait if the component unmounts mid-air
    return () => {
      backHandler.remove();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP,);
      if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  return (
    <View className="absolute inset-0 m-0">
      <WebView
        className="flex-1"
        source={{ uri: playableUrl }}
        style={{ width: "100%", height: "100%" }}
        onShouldStartLoadWithRequest={(request: WebViewNavigation) => {return request.url === playableUrl}}
        setSupportMultipleWindows={false}
        onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        
        if (nativeEvent.statusCode === 404) {
          console.warn('Page not found (404 error detected):', nativeEvent.url);
          // Trigger your custom app-native error screen here
          Alert.alert("PLAY ERROR", "Failded to play!\nGoing Back", [{text: 'OK', onPress: () => console.log("Media player closed!..")}]);
          turnOffPlay(false);
          navigation.goBack();
        }
      }}
      />

      {Platform.OS === "ios" && <TouchableOpacity
        onPress={() => {
          turnOffPlay(false);
          navigation.goBack();
        }}
        className="absolute top-6 left-6 w-12 h-12 bg-black/60 rounded-full items-center justify-center z-50"
      >
        <Text className="text-white text-xl font-bold">✕</Text>
      </TouchableOpacity>
      }
    </View>
  );
}
