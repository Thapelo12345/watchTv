import { View, Text} from "react-native"
import AuthForm from "@/components/form"
import { useMainStore} from "@/stateManagement/store"  

export default function AuthPage(){
    const userStatus = useMainStore((state: any)=> state.userStatus)
    return(
        <View>
            <AuthForm />
        </View>
    )
}   