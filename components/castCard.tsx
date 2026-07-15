import { View, Text } from "react-native"
import { Image } from "expo-image"

type CAST = {
    actorName: string;
    imageUrl: string;
    character: string;
}
export default function CastCard({ actorName, imageUrl, character}:CAST){
    return(
    <View 
    className="cast-card">

        <Text className="font-lora">{actorName}</Text>
        <Image 
        style={{ width: '100%', height: 170, backgroundColor: '#eee' }} 
        placeholder={require("../assets/images/cast-default.png")}
        className="w-full h-50"
        source={{uri: imageUrl}}
        transition={200}
        />

        <Text>AS</Text>
        <Text className="font-loratext-sm mb-10">{character}</Text>
    </View>
)
}