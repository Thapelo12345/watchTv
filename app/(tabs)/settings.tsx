import { View, Text } from "react-native"
import { OnlineLoader } from "@/components/onlineLoader"
import AuthForm from "@/components/form"

export default function Movies(){
    return(
        <View>
            <Text className="pageHeaders">Settings Pages</Text>
            {/* <OnlineLoader /> */}
            <AuthForm />
        </View>
    )
}