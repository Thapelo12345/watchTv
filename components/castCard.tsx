import { View, Text } from "react-native"
import { Image } from "expo-image"
import { useTheme } from "@/constants/myTheme"

type CAST = {
    actorName: string;
    imageUrl: string;
    character: string;
}
export default function CastCard({ actorName, imageUrl, character}:CAST){
    const theme = useTheme()

    return(
    <View 
    className="cast-card"
    style={{
        backgroundColor: theme.castBackground,
        boxShadow: theme.castShadow
    }}
    >

        <Text className="font-lora"
        style={{color: theme.text}}
        >{actorName}</Text>
        <Image 
        style={{ width: '100%', height: 170, backgroundColor: '#eee' }} 
        placeholder={require("../assets/images/cast-default.png")}
        className="w-full h-50"
        source={{uri: imageUrl}}
        transition={200}
        />

        <Text
        style={{color: theme.text}}
        >AS</Text>
        <Text className="font-loratext-sm mb-10"
        style={{color: theme.text}}
        >{character}</Text>
    </View>
)
}