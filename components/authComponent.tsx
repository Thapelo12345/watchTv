import { View, Text, Pressable } from "react-native";
import { usePathname } from "expo-router";
import { Image } from "expo-image"
import { useAuth } from '@clerk/expo'
import { UserCircleIcon } from "react-native-heroicons/solid";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { router } from "expo-router";
import { extractUserInfo } from "@/utils/form-utils";
import { useEffect } from "react";

export default function Auth(){

    const { isSignedIn, userId, signOut } = useAuth()
    const pathName = usePathname()

    // store states
    const userName = userStore((state: any)=> state.userName)
    const initializeCurrentUser = userStore((state: any)=> state.initializeUser)
    const profileImage = userStore((state: any)=> state.profilePicture)

    const mainUrl = useMainStore((state: any)=> state.baseUrl)
    const mediaFilePlaying = useMainStore((state: any)=> state.playing)

    const gettingUserdata = async ()=>{
    const serverResponse = await fetch(`${mainUrl}/user/find-User${userId}`,{ method: "GET" });
    if(!serverResponse.ok){
        alert("No respone from the server\nPlease check internet connection!..")
        return 
    }

    const data = await serverResponse.json()
     if(data.message !== "Successfully FOUND user!.."){
        alert("Cant retrive user data!..")
        return
     }

     return data.matchingUser
    }

    useEffect(()=>{

    if(isSignedIn && !userName && pathName !== "/authPage"){
 const fetchAndInit = async () => {
    const cloudUser = await gettingUserdata();
    if (!cloudUser) {
        console.error("Cant get User!..");
        return;
        }
        initializeCurrentUser(extractUserInfo(cloudUser));
    };
    fetchAndInit();
    }
    
    }, [isSignedIn])

return(
    <View className={`${mediaFilePlaying ? "hidden" : "visible"} flex flex-row items-center justify-end w-[99%] mx-0.5 rounded-lg gap-x-4 items-en bg-blue-400 h-14 p-2`}>

{isSignedIn && <Text className="text-white mr-11 text-[17px] font-extrabold">{userName}</Text>}

    <View className="border border-white overflow-hidden flex items-center justify-center rounded-full w-10 h-full">

    {!isSignedIn || !profileImage?.imageUrl
    ? (<UserCircleIcon color="white" size={30} />):
    (
    <Image 
    style={{width: 30, aspectRatio: 1}}
    source={{uri: profileImage.imageUrl}}
    placeholder={require("../assets/images/cast-default.png")}
    accessibilityLabel="User image"
    transition={20}
    contentFit="cover"
    />
    )
    }

    </View>

<Pressable
    onPress={()=> {

        if(!isSignedIn){
        router.navigate("/authPage")
        useMainStore.setState({isAuthOpen: true})
        }
        
        else signOut()
    }}
    >
        <Text className="auth-btn">
        { isSignedIn ? "logOut" : "SignIn"}
        </Text>
</Pressable>

    </View>
)
}