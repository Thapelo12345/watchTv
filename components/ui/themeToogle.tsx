import { View, Text, Switch } from "react-native";
import { SunIcon, MoonIcon } from "react-native-heroicons/outline";
import { Appearance } from "react-native";
import { useTheme } from "@/constants/myTheme";
import { useColorScheme } from "react-native";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const themeSchema = useColorScheme();
  const theme = useTheme();
  const [darkAnable, setEnable] = useState(false);

//   useEffect(() => {
//     Appearance.setColorScheme(!darkAnable ? "light" : "dark");
//     console.log("This is the current theme MODE: ", Appearance.getColorScheme())
//     console.log("This is the theme schema: ", themeSchema)

//   }, [darkAnable]);

useEffect(() => {

    console.log("This is the value of the schema: ", themeSchema)
    setEnable(themeSchema === "dark");
  }, [themeSchema]);

  const toggleTheme = (newValue: boolean): void => {
    setEnable(newValue);
    Appearance.setColorScheme(newValue ? "dark" : "light");
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
        value={darkAnable}
        trackColor={{ false: "#767577", true: "gray" }}
        thumbColor={darkAnable ? "white" : "cyan"}
        ios_backgroundColor="#3e3e3e"
        // onValueChange={() =>  setEnable((prev)=> !prev)}
        onValueChange={toggleTheme}
      />
    </View>
  );
}
