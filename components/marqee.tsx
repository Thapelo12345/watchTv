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
    <View className="my-2">
      <Link className="p-2 text-2xl bg-blue-500" href={urlLink as Href}>
        {linkText}
      </Link>

      <Marquee spacing={10} speed={direction} direction="horizontal">
        <View className="flex flex-row ">
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
  );
}
