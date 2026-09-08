import { Modal, View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { AuthView } from "@clerk/expo/native";
import 'expo-crypto';

type PROPS = {
setOpenAth: (value: boolean) => void;
openAth: boolean;
}
export default function ClerkComponent({ openAth, setOpenAth }: PROPS) {

  return (
    <Modal
      visible={openAth}
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <AuthView 
        mode="signInOrUp"
        isDismissible={true}
        onDismiss={() => setOpenAth(false)}
      />
      </View>
      
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff", // Prevents a black screen or transparent bleed-through
  },
  nativeAuth: {
    flex: 1,
    width: "100%",
  },
});