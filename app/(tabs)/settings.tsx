import { View, Text, Switch } from "react-native";
import UpdateUserInfor from "@/components/UserInfoUpdate";
import ListContainer from "@/components/list-container";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ThemeToggle from "@/components/ui/themeToogle";

import { useTheme } from "@/constants/myTheme";

export default function Settings() {
  const theme = useTheme();

  return (
    <View className="flex-1 w-screen h-screen">
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >
        <Text className="pageHeaders">Settings Pages</Text>
        <UpdateUserInfor />
        <ListContainer />
        <ThemeToggle />
        
      </SafeAreaView>
    </View>
  );
}
