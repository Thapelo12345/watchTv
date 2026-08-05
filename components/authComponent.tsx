import { View, Text, Pressable } from "react-native";
import { Alert } from "react-native";
import { usePathname } from "expo-router";
import { Image } from "expo-image";
import { useAuth, useUser } from "@clerk/expo";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { getCloudUser, extractUserInfo, getAllPrommes, getLatestProgrames } from "@/utils/auth-utils";
import { useEffect, useRef } from "react";

type PROP = {
  openCloseClerk: (value: boolean) => void;
};
export default function Auth({ openCloseClerk }: PROP) {
  const { isLoaded, isSignedIn, userId, signOut } = useAuth();
  const { user } = useUser();

  // store states
  const mainUserName = userStore((state: any) => state.userName);
  const initializeCurrentUser = userStore((state: any) => state.initializeUser);
  const profileImage = userStore((state: any) => state.profilePicture);
  const userHasData = userStore((state: any) => state.userInitialized);

  const allMovies = useMainStore((state: any) => state.movies);
  const allSeries = useMainStore((state: any) => state.series);

  const latestMovies = useMainStore((state: any) => state.latestMovies);
  const latestSeries = useMainStore((state: any) => state.latestSeries);
 
  const mainUrl = useMainStore((state: any) => state.baseUrl);
  const mediaFilePlaying = useMainStore((state: any) => state.playing);
  const imagesDownloaded = useMainStore((state: any)=> state.imagesDownloaded)

  // store action states
  const verifiedUserHasData = userStore((state: any) => state.setUserInitialized,);
  const setImageDownloaded = useMainStore((state: any)=> state.setImageDownloaded)

  const startedGettingUrls = useRef(false);

    async function downloadingImages(urls: string[]) {
      await Image.clearDiskCache();
      Image.prefetch(urls)
      .then(()=> console.log("Images downloaded successfully!"))
      .catch ((err: unknown)=> {
        const errMessage = err instanceof Error ? err.message : "Unkown image url's error!."
        Alert.alert("IMAGE DOWNLOAD ERROR!.", "Failed to save Images to the solid disk\n Images may Load slower!.", [{text: "OK", onPress: ()=> console.error(errMessage)}])  
      })

      setImageDownloaded(true)
    } //end of downloading images function

  // use auth useEffect to check if the user is signed in and has data, if not get the data from the server and initialize the user store
  useEffect(() => {
    if (!isLoaded || userHasData) return;

    if (isSignedIn && user && !userHasData) {

      getCloudUser(user.id).then(async (cloudData) => {
        if (cloudData == "User Data NOT FOUND!.") {
          try {
            const sendToServer = await fetch(`${mainUrl}/user/new-user`, {
              method: "PUT",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({
                name: user.username ?? user.firstName ?? "User",
                id: user.id,
                email: user.primaryEmailAddress?.emailAddress ?? "",
                image: user.imageUrl,
                imageId: "",
              }),
            });

            if (!sendToServer.ok)
              throw new Error(
                "Failed to Connect to Server!.\nCheck YOUR INTERNET connection and try again.",
              );

            const data = await sendToServer.json();
            if (data.message !== "User created successfully!..")
              throw new Error(data.message);

            initializeCurrentUser(extractUserInfo(data.newUser));
            verifiedUserHasData(true);
          } catch (err: unknown) {
            const errMessage =
              err instanceof Error ? err.message : "unknown Server Error!.";
            Alert.alert("SERVER ERROR!.", errMessage, [
              { text: "OK", onPress: () => signOut() },
            ]);
          } //end of catch
        } else if (cloudData === "Internet Error!.") {
          Alert.alert(
            "SERVER ERROR!.",
            "The seem to be a problem with Your Internet Connection!.\n YOU'LL BE SIGNED OUT! TRY AGAIN.",
            [{ text: "OK", onPress: () => signOut() }],
          );
        } else return;
      });
    }
  }, [isSignedIn, user]);

  // programe useEffect to get the latest programes from the server and update the store
  useEffect(() => {

    if(allMovies.length === 0 && allSeries.length === 0) getAllPrommes();
    if(allMovies.length !== 0 && allSeries.length !== 0) getLatestProgrames();
 
  }, [allMovies, allSeries]);

  useEffect(()=>{
    if((!imagesDownloaded &&  !startedGettingUrls.current) && (latestMovies.length !== 0 && latestSeries.length !== 0)) {
      startedGettingUrls.current = true;
      downloadingImages(latestMovies.map((movie: any)=> movie.movieImageUrl).concat(latestSeries.map((serie: any)=> serie.seriesImageUrl)));
    } 
  }, [latestMovies, latestSeries])


  return (
    <View
      className={`${mediaFilePlaying ? "hidden" : "visible"} flex flex-row items-center justify-end w-[99%] mx-0.5 rounded-lg gap-x-4 bg-blue-400 h-14 p-2`}
    >
      {isSignedIn && (
        <Text className="text-white mr-11 text-[17px] font-extrabold">
          {mainUserName}
        </Text>
      )}

      <View className="border border-white overflow-hidden flex items-center justify-center rounded-full w-10 h-full">
        {!isSignedIn || !profileImage?.imageUrl ? (
          <UserCircleIcon color="white" size={30} />
        ) : (
          <Image
            style={{ width: 30, aspectRatio: 1 }}
            source={{ uri: profileImage.imageUrl }}
            placeholder={require("../assets/images/cast-default.png")}
            accessibilityLabel="User image"
            transition={20}
            contentFit="cover"
          />
        )}
      </View>

      <Pressable
        onPress={() => {
          if (!isSignedIn) openCloseClerk(true);
          else signOut();
        }}
      >
        <Text className="auth-btn">Sign {isSignedIn ? "Out" : "In"}</Text>
      </Pressable>
    </View>
  );
}
