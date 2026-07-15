import { View, Text, ActivityIndicator} from "react-native";
import { Image } from "expo-image"
import { Link, Href } from "expo-router";
import { Marquee } from "@animatereactnative/marquee";
import { useState } from "react";

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

  const [imageLoader, setImageLoader] = useState(true)
  
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
        <View className="border2 border-red-500 flex flex-row mb-10">
          {imagesArray.map((imageUrl, index) => (
            <Image
              key={index}
              cachePolicy="memory"
              style={{ width: 150, height: 300, borderRadius: 10, marginHorizontal: 5 }}
              source={{ uri: imageUrl.imageUrl }}
            />
          ))}
        </View>
      </Marquee>
        </View>

    </View>
  );
}
