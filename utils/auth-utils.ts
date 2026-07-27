import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { router } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "@clerk/expo";

// store sates here
const mainUrl = (useMainStore.getState() as { baseUrl: string }).baseUrl;

// store function states here
const initializeCurrentUser = (
  userStore.getState() as { initializeUser: (value: any) => void }
).initializeUser;
const verifiedUserHasData = (
  userStore.getState() as { setUserInitialized: (value: boolean) => void }
).setUserInitialized;

function extractUserInfo(data: any){
  return {
    userId: data.userId,
    profilePicture: data.profilePicture,
    email: data.email,
    userName: data.userName,
    joinedDate: data.joinedDate,
    paymentMethod: data.paymentMethod,
    daysLeft: data.daysLeft,
    accountCanceled: data.accountCanceled,
    continueWatching: data.continueWatching,
    userLiked: data.userLiked,
    watchHistory: data.watchHistory,
    userStatus: data.userStatus,
    userPrefferedGenres: data.userPrefferedGenres
  }
}

async function getCloudUser(id: string) {
  console.log("Runing Getting Cloud User!.");

  try {
    const serverResponse = await fetch(`${mainUrl}/user/find-User${id}`, {
      method: "GET",
    });

    if (!serverResponse.ok) throw new Error("Cant connect to Server!");

    const data = await serverResponse.json();
    if (data.message !== "Successfully FOUND user!..")
      throw new Error("Cant Find user DATA!.");

    initializeCurrentUser(extractUserInfo(data.matchingUser));
    verifiedUserHasData(true);

    return "User Data FOUND!.";
  } catch (err: unknown) {
    const errMessage =
      err instanceof Error ? err.message : "unknown server error";
    console.error("AuthPage error\n", errMessage);
    return errMessage === "Cant connect to Server!"
      ? "Internet Error!."
      : "User Data NOT FOUND!.";
  }
} //end of get cloud use r function

export { getCloudUser, extractUserInfo}
