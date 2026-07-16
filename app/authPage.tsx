import { useAuth, useUser } from "@clerk/expo";
import { AuthView, UserButton } from "@clerk/expo/native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { extractUserInfo } from "@/utils/form-utils";
import { View, ActivityIndicator, Modal, Text } from "react-native";
import AuthForm from "@/components/form";

export default function AuthPage() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user } = useUser();

  // store states here
  const mainUrl = useMainStore((state: any) => state.baseUrl);
  const isAuthOpen = useMainStore((state: any) => state.isAuthOpen);
  const appIsLoading = useMainStore((state: any) => state.appLoading);

  // store functions
  const toggleAppLoading = useMainStore((state: any)=> state.switchAppLoding)
  const setIsAuthOpen = useMainStore((state: any) => state.setIsAuthOpen);
  const initializeCurrentUser = userStore((state: any) => state.initializeUser);

  const [imageUrl, setImageUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  // getting user infor once logged in
  useEffect(() => {
    if (!isSignedIn || !user) return;

    setUserId(user.id);
    setImageUrl(user.imageUrl);
    setUserName(user.username ?? user.firstName ?? "User");
    setUserEmail(user.primaryEmailAddress?.emailAddress ?? "");

    if(!appIsLoading) toggleAppLoading()
    // checking if user data is availible on cloud
    const getUserdata = async ()=>{
    const serverResponse = await fetch(`${mainUrl}/user/find-User${user.id}`, {method: "GET"})

      if(!serverResponse.ok){
        alert("Cant connect to Server!.\nChecking network connection and Try again!..")
        router.navigate("/(tabs)")
        signOut
      }

     else { 
      const userData = await serverResponse.json()

      if(userData.message === "Successfully FOUND user!.."){
        initializeCurrentUser(extractUserInfo(userData.matchingUser))
        router.navigate("/(tabs)")
      }//end of inner if
    }//end of else

    if(appIsLoading) toggleAppLoading()
    }//end of getUserdata inline function

  getUserdata()
  setIsAuthOpen(false);

  }, [isSignedIn]);

  return (
    <View className="flex-1 justify-center items-center">
      <Modal
        animationType="slide"
        visible={isAuthOpen}
        presentationStyle="pageSheet"
      >
        <AuthView 
        mode="signInOrUp"
        isDismissible={true}
        onDismiss={() => {  
          setIsAuthOpen(false);     
          router.navigate("/(tabs)")         
          }}
        />
      </Modal>

      {/* Only render the form when you actually have the user ID loaded */}
      {userId && !appIsLoading ? (
        <AuthForm
          userName={userName}
          userId={userId}
          userImage={imageUrl}
          userEmail={userEmail}
        />
      ) : (
        <ActivityIndicator size="small" color="#0000ff" />
      )}
    </View>
  );
}
