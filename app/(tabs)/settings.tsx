import { View, Text, Switch } from "react-native";
import UpdateUserInfor from "@/components/UserInfoUpdate";
import ListContainer from "@/components/list-container";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeToggle from "@/components/ui/themeToogle";
import { useTheme } from "@/constants/myTheme";
import { useEffect } from "react";
import { userStore } from "@/stateManagement/userStore";
import { usePathname } from 'expo-router';
import { router } from "expo-router";

export default function Settings() {
  const theme = useTheme();
  const pathname = usePathname();

  const activeUser = userStore((state: any)=> state.userActive)

  useEffect(() => {
    if(pathname === "/settings" && !activeUser) router.navigate("/")
  }, [activeUser]);

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
