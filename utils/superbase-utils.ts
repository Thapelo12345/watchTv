import { supabase } from "@/lib/lib/supabase";
import { Alert } from "react-native";
import { userStore } from "@/stateManagement/userStore";
import { useMainStore } from "@/stateManagement/store";
import { extractUserInfo } from "./auth-utils";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

const initializeCurrentUser = (userStore.getState() as { initializeUser: (value: any) => void }).initializeUser;
const verifiedUserHasData = (userStore.getState() as { setUserInitialized: (value: boolean) => void }).setUserInitialized;

const setActiveUser = (
  userStore.getState() as { setUserActive: (value: boolean) => void }
).setUserActive;
const setOpenAuthModal = (
  useMainStore.getState() as { setOpenAuthModal: (value: boolean) => void }
).setOpenAuthModal;

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;

  // Trim whitespace
  email = email.trim();

  // Reasonable email regex (RFC 5322 simplified)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Basic checks
  if (email.length > 254) return false; // Max total length
  if (email.includes("..")) return false; // No consecutive dots
  if (email.startsWith(".") || email.endsWith(".")) return false;

  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return false;
  if (localPart.length > 64) return false; // Max local part length

  return emailRegex.test(email);
}

async function facebookLogin() {
  const mainUrl = (useMainStore.getState() as { baseUrl: string }).baseUrl;
  const redirectUrl = Linking.createURL("", { scheme: "watchtv" });

  try{

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
      queryParams: { scope: "public_profile,email" },
    },
  });

  if (error) throw new Error("Error signing in with Facebook:");

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type === "success" && result.url) {
      const hash = result.url.split("#")[1];
      if (!hash) throw new Error("No session data found in redirect URL");

      const params = Object.fromEntries(hash.split("&").map((param) => param.split("=")));

      const accessToken = params.access_token;
      const refreshToken = params.refresh_token;

      if (!accessToken || !refreshToken) throw new Error("Failed to Get access token");

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      
      const {data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Failed To Get User Information!.");

      const metadata = user.user_metadata;

      const findUserServer = await fetch(`${mainUrl}/user/find-User${metadata.provider_id}`, {method: "GET",});

      if(!findUserServer.ok) throw new Error("Failed to send to server!.")
      const serverData = await findUserServer.json()

      if(serverData.message === "Failed to find User!.."){
        const newUser = await fetch(`${mainUrl}/user/new-user`,{
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            name: metadata.full_name,
            id: metadata.provider_id, 
            email: metadata.email,
            image: null,
            imageId: ""
          })
      })

      if(!newUser.ok) throw new Error("Failed to connect to Server!..")

      const newUserData = await newUser.json()

      if(newUserData.message !== "User created successfully!..") throw new Error("Failed to Create new user!.")

      initializeCurrentUser(extractUserInfo(newUserData.newUser));
      verifiedUserHasData(true);
      }//end of if statement

      else {
      initializeCurrentUser(extractUserInfo(serverData.matchingUser));
      verifiedUserHasData(true);
      }//end of else

      setActiveUser(true);
      setTimeout(() => {setOpenAuthModal(false)}, 1500);

      if (sessionError) throw new Error(sessionError.message);
    } //end of inner if
  }
}
catch(err: unknown){
  const errMessage = err instanceof Error ? err.message : "The Is FACEBOOK AUTH ERROR!."
  Alert.alert("FACEBOOK ERROR!..", errMessage)
}
} //end of facebook login

export { isValidEmail, facebookLogin };
