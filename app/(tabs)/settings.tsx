import { View, Text, ScrollView } from "react-native";
import UpdateUserInfor from "@/components/UserInfoUpdate";
import ListContainer from "@/components/list-container";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (
    <View className="flex-1 w-screen h-screen">
      <SafeAreaView style={{ flex: 1, backgroundColor: "whitesmoke" }}>
        <Text className="pageHeaders">Settings Pages</Text>
        <UpdateUserInfor />
        <ListContainer />
      </SafeAreaView>
    </View>
  );
}
