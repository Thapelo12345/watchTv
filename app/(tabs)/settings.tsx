import { View, Text } from "react-native"
import { OnlineLoader } from "@/components/onlineLoader"
import { AuthView, UserButton} from '@clerk/expo/native'
import AuthForm from "@/components/form"
import { useRef, useState } from "react"


export default function Movies(){

    const [testName, setTestName] = useState("mike")
    return(
        <View className="flex-1 w-screen h-screen">
            <Text className="pageHeaders">Settings Pages</Text>
            {/* <OnlineLoader /> */}

<AuthForm 
        userName={testName} 
        userId='' 
        userImage=''
        userEmail='' 
      />
        </View>
    )
}