import { View, Text } from "react-native";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { Image } from "expo-image";

type PROPS = { inputUrl?: string };

export default function ImageUpdate({ inputUrl }: PROPS) {
  return (
    <View className="flex items-center w-[400px]">
      <View className="w-[35%] p-2 bg-blue-50 rounded-full m-2 h-40">
        <View className="flex items-center justify-center w-full h-full bg-blue-50 rounded-full overflow-hidden">
          <Image
            className="bg-blue-200 h-full rounded mt-1"
            source={
              !inputUrl
                ? require("../assets/images/cast-default.png")
                : { uri: inputUrl }
            }
            placeholder={require("../assets/images/cast-default.png")}
            style={{ width: 125, height: 125 }}
            contentFit="cover"
          />
        </View>

        <Text
          className="absolute text-white font-extrabold top-1/2 left-38 bg-blue-50 rounded-tr-2xl rounded-br-2xl p-2 text-lg -z-10"
          style={{
            textShadowColor: "black",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 0.5,
          }}
        >
          Press
        </Text>
      </View>
    </View>
  );
}
