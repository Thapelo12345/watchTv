import { View, Text, Image } from "react-native";
import { Link, Href } from "expo-router";
import { Marquee } from "@animatereactnative/marquee";

type PROP = {
  linkText: string;
  urlLink: string;
  direction: number;
  imagesArray: { id: string; imageUrl: string }[];
};

export default function MarqeeComponent({
  linkText,
  urlLink,
  direction,
  imagesArray,
}: PROP) {
  return (
    <View className="my-2 w-full">
      <Link 
       href={urlLink as Href}
      >
        <Text
        className="text-blue-500 rounded-2xl px-4 ml-4 text-start p-2 text-4xl font-lobster underline underline-offset-2"
        >{linkText}</Text>
      </Link>

<View pointerEvents="none">
      <Marquee spacing={10} speed={direction} direction="horizontal">
        <View className="flex flex-row mb-10">
          {imagesArray.map((imageUrl) => (
            <Image
              className="flex flex-row m-1 w-40 h-70 rounded-lg"
              key={imageUrl.id}
              source={{ uri: imageUrl.imageUrl }}
            />
          ))}
        </View>
      </Marquee>
        </View>

    </View>
  );
}
