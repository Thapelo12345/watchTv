import { View, Pressable, Text } from "react-native";
import FormInput from "./ui/formInput";
import { useMainStore } from "@/stateManagement/store";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { useState, useEffect } from "react";

export default function AuthForm(){
    const userStatus = useMainStore((state: any)=> state.userStatus)
    const [userActivity, setUserActivity] = useState(userStatus)

    function handleUserActivityChange(newStatus: string) {
        setUserActivity(newStatus);
      }
    useEffect(()=>{
       if(userStatus === "signUp" || userStatus === "signIn") {
        const btnText = userStatus === "signUp" ? "LogIn" : "Register";
           handleUserActivityChange(userStatus);
       }
    }, [userStatus])
    return(

        <View className="border flex-col items-center w-[90%] p-2 m-auto">

        <UserCircleIcon size={100} color="black" className="mx-auto my-4"/>
    <View className=" flex flex-col items-start my-1/2 gap-2 rounded-lg">
    <FormInput label="Name" />
    <FormInput label="Email" />
    <FormInput label="Password"/>
    
    {userStatus === "signUp" && <FormInput label="Re-Enter password" />}

<View className="flex flex-row items-center justify-evenly m-2 gap-2">
    <Pressable>
        <Text className="form-btn">Submit</Text>
    </Pressable>

    <Pressable>
        <Text className="form-btn">
            Cancel
        </Text>
    </Pressable>

    <Pressable>
        <Text className="form-btn">
            {userActivity}
        </Text>
    </Pressable>
</View>
    
    </View>
    </View>)
}