import { View, Image, Text } from "react-native"

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
        className="w-full h-50"
        source={{uri: imageUrl}}
        />

        <Text>AS</Text>
        <Text className="font-loratext-sm mb-10">{character}</Text>
    </View>
)
}