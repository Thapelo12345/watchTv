import { View } from "react-native";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { Image } from "expo-image";

type PROPS = {inputUrl?: string};

export default function ImageUpdate({ inputUrl }: PROPS) {
  return (
    <View className="border-2 border-white rounded-full overflow-hidden m-2 flex flex-row w-fit gap-2 p-0.4 items-center">
      {inputUrl === "" ? (
        <UserCircleIcon size={110} color="blue" />
      ) : (
        <Image
          className="rounded-full mt-1"
          source={
            inputUrl === ""
              ? require("../assets/images/cast-default.png")
              : { uri: inputUrl }
          } // Placeholder image URL
          placeholder={require("../assets/images/cast-default.png")}
          style={{ width: 95, height: 95 }}
          contentFit="cover"
        />
      )}
    </View>
  );
}
