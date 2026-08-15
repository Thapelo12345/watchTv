import { View, Switch } from "react-native";
import { SunIcon, MoonIcon } from "react-native-heroicons/outline";
import { useTheme } from "@/constants/myTheme";
import { userStore } from "@/stateManagement/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function ThemeToggle() {

  // store static states
  const currentTheme = userStore((state: any)=> state.userTheme)

  // store function state
  const setTheme = userStore((state: any)=> state.setUserTheme)

  const theme = useTheme();
  const isDarkMode = currentTheme === "dark";

 const toggleTheme = (newValue: boolean) => {
    const nextTheme = newValue ? "dark" : "light";
    // 1. Force the UI to update IMMEDIATELY (Zero visual lag)
    setTheme(nextTheme);

    // 2. Fire and forget the disk operation asynchronously
    AsyncStorage.setItem("THEME", nextTheme).catch((error) => {
      console.error("Failed to save theme to storage:", error);
    });
  }


  return (
    <View
      className="flex  m-4  p-2 border-2 border-white w-20 rounded-lg"
      style={{boxShadow: theme.settingsShadow}}
    >
      <View className="flex flex-row justify-between items-center">
        <SunIcon
          className="border border-white m-2"
          color={theme.text}
          size={20}
        />
        <MoonIcon
          className="border border-white m-2"
          color={theme.text}
          size={20}
        />
      </View>
      <Switch
        value={isDarkMode}
        trackColor={{ false: "#767577", true: "gray" }}
        thumbColor={isDarkMode ? "white" : "cyan"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
      />
    </View>
  );
}
