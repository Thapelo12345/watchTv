import { View, Text, Switch } from "react-native";
import UpdateUserInfor from "@/components/UserInfoUpdate";
import ListContainer from "@/components/list-container";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useColorScheme } from "react-native";
import { Appearance } from 'react-native';

export default function Settings() {

  const Theme = useColorScheme()
  const [isEnabled, setEnable] = useState(true)

  return (
    <View className="flex-1 w-screen h-screen">
      <SafeAreaView style={{ flex: 1, backgroundColor: Theme === "light" ? "whitesmoke" : "#232325" }}>
        <Text className="pageHeaders">Settings Pages</Text>
        <UpdateUserInfor />
        <ListContainer />

        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={()=>{
            setEnable(!isEnabled)
            const currentTheme = Appearance.getColorScheme(); 
            Appearance.setColorScheme(currentTheme === "dark" ? 'light' : 'dark');
          }}
          value={isEnabled}
        />

      </SafeAreaView>
    </View>
  );
}
