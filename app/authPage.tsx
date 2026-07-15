import { useAuth, useUser } from "@clerk/expo";
import { AuthView, UserButton } from "@clerk/expo/native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { extractUserInfo } from "@/utils/form-utils";
import { View, ActivityIndicator, Modal, Text } from "react-native";
// import * as WebBrowser from "expo-web-browser";
import AuthForm from "@/components/form";

// WebBrowser.maybeCompleteAuthSession();

export default function AuthPage() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user } = useUser();

  // store states here
  const mainUrl = useMainStore((state: any) => state.baseUrl);
  const isAuthOpen = useMainStore((state: any) => state.isAuthOpen);

  // store functions
  const setIsAuthOpen = useMainStore((state: any) => state.setIsAuthOpen);
  const appIsLoading = useMainStore((state: any) => state.appLoading);
  const initializeCurrentUser = userStore((state: any) => state.initializeUser);

  const [imageUrl, setImageUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // // warming up the browser
  // useEffect(() => {
  //   WebBrowser.warmUpAsync();
  //   return () => {
  //     WebBrowser.coolDownAsync();
  //   };
  // }, []);

  // getting user infor once logged in
  useEffect(() => {
    if (!isSignedIn || !user) return;

    setUserId(user.id);
    setImageUrl(user.imageUrl);
    setUserName(user.username ?? user.firstName ?? "User");
    setUserEmail(user.primaryEmailAddress?.emailAddress ?? "");

    // Auto-dismiss the login modal when successful
    setIsAuthOpen(false);
  }, [isSignedIn, user]);

  return (
    <View className="flex-1 justify-center items-center">
      <Modal
        animationType="slide"
        visible={isAuthOpen}
        presentationStyle="pageSheet"
        onRequestClose={async () => {
          const serverResponse = await fetch(
            `${mainUrl}/user/find-User${userId}`,
            { method: "GET" },
          );

          if (!serverResponse.ok) {
            alert("Server not Responding!.\nCheck network connection and try again!..");
            router.navigate("/(tabs)");
            signOut;
          } else {
            const userdata = await serverResponse.json();

            if (userdata.message === "Successfully FOUND user!..") {
              initializeCurrentUser(extractUserInfo(userdata.matchingUser));
              router.navigate("/(tabs)");
            }

            else console.log("The user was not FOUND!..")
          }

          console.log("Closing the CLERK TAB!..")
          setIsAuthOpen(false);
        }}
      >
        <AuthView />
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
