import { View, Modal, Text, Pressable, Image } from "react-native";
import { Alert } from "react-native";
import { facebookLogin } from "@/utils/superbase-utils";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/lib/lib/supabase";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { extractUserInfo } from "@/utils/auth-utils";

export default function SuperBaseAuth() {
  GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_ID });

  // store static state
  const openAuthModal = useMainStore((state: any) => state.openAuthModal);
  const mainUrl = useMainStore((state: any) => state.baseUrl);

  // store main state action
  const setOpenAuthModal = useMainStore((state: any) => state.setOpenAuthModal);
  const activedUser = userStore((state: any) => state.setUserActive);

  const initializeCurrentUser = userStore((state: any) => state.initializeUser);
  const verifiedUserHasData = userStore(
    (state: any) => state.setUserInitialized,
  );

  return (
    <Modal animationType="slide" transparent={true} visible={openAuthModal}>
      <View className="absolute inset-0 w-screen h-260 bg-[rgba(0,0,0,0.9)] z-50 overflow-hidden">
        <Text className="text-white text-2xl text-center mt-20">
          Nest Stream Authenification
        </Text>

        <View className="flex-1 items-center justify-center gap-10 w-full h-full">
          <Image
            className="w-40 h-40 rounded-full"
            source={require("../assets/images/appstore.png")}
          />

          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={async () => {
              try {
                await GoogleSignin.hasPlayServices();
                const response = await GoogleSignin.signIn();
                if (isSuccessResponse(response)) {
                  const idToken = response.data.idToken;
                  if (!idToken)
                    throw new Error(
                      "Google Sign-In succeeded, but no ID token was returned.",
                    );
                  const { error } = await supabase.auth.signInWithIdToken({
                    provider: "google",
                    token: idToken,
                  });
                  if (error) throw new Error("Failed to Login with Google!.");

                  // getting google user's data
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();
                  if (!user)
                    throw new Error("Failed To Get User Information!.");

                  const metadata = user.user_metadata;
                  const findUserServer = await fetch(
                    `${mainUrl}/user/find-User${metadata.provider_id}`,
                    { method: "GET" },
                  );

                  if(!findUserServer.ok) throw new Error("Failed To send Server!.")

                  const serverData = await findUserServer.json();

                  if (serverData.message === "Failed to find User!..") {
                    const newUser = await fetch(`${mainUrl}/user/new-user`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: metadata.full_name,
                        id: metadata.provider_id,
                        email: metadata.email,
                        image: metadata.avatar_url,
                        imageId: "",
                      }),
                    });

                    if(!newUser.ok) throw new Error("Fail to connect to server!..")

                    const newUserData = await newUser.json();
                    
                    if (newUserData.message !== "User created successfully!..") throw new Error("Failed to Create new user!.");

                    initializeCurrentUser(extractUserInfo(newUserData.newUser));
                    verifiedUserHasData(true);
                  } //end of if
                  else {
                    initializeCurrentUser(
                      extractUserInfo(serverData.matchingUser),
                    );
                    verifiedUserHasData(true);
                  } //end of else

                  activedUser(true);
                  setOpenAuthModal(false);
                }
              } catch (err: unknown) {
                const errMessage =
                  err instanceof Error
                    ? err.message
                    : "Failed to Login with Google!.";
                Alert.alert("GOOGLE ERROR!.", errMessage);
              } //end of catch
            }}
          />

          <Pressable onPress={() => facebookLogin()}>
            <View className="flex flex-row w-86 h-10 bg-blue-400 p-0.3">
              <View className="flex items-center justify-center w-12 bg-white h-full">
                <Image
                  className="h-3 w-3 bg-white p-4"
                  source={require("../assets/icons/facebook.png")}
                />
              </View>
              <Text className="text-white text-center m-auto">
                Sign In with Facebook
              </Text>
            </View>
          </Pressable>

          <Pressable onPress={() => setOpenAuthModal(false)}>
            <Text className="p-2 px-4 border border-white text-lg text-white w-fit rounded-lg">
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
