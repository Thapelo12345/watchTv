import { View, Image, Text } from "react-native"

type CAST = {
    actorName: string;
    imageUrl: string;
    character: string;
}
export default function CastCard({ actorName, imageUrl, character}:CAST){
    return(
    <View 
    className="items-center w-45 h-70 m-3 p-2">

        <Text>{actorName}</Text>
        <Image 
        className="w-full h-50"
        source={{uri: imageUrl}}
        />

        <Text>AS</Text>
        <Text className="text-sm mb-10">{character}</Text>
    </View>
)
}