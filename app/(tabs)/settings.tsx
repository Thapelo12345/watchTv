import { View, Text } from "react-native"
import { OnlineLoader } from "@/components/onlineLoader"

export default function Movies(){
    return(
        <View>
            <Text className="pageHeaders">Settings Pages</Text>
            <OnlineLoader />
        </View>
    )
}