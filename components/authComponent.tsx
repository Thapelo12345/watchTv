import { View, Text, Pressable, Modal } from "react-native";
import { Alert } from "react-native";
import { Image } from "expo-image";
import { useAuth, useUser } from "@clerk/expo";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import {
  getCloudUser,
  extractUserInfo,
  getAllProgrammes,
  getLatestProgrames,
  getNewShows,
  seriesLatestUpdates,
} from "@/utils/auth-utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef } from "react";

type PROP = {
  openCloseClerk: (value: boolean) => void;
};
export default function Auth({ openCloseClerk }: PROP) {
  const { isLoaded, isSignedIn, userId, signOut } = useAuth();
  const { user } = useUser();

  // store static states
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
  const imagesDownloaded = useMainStore((state: any) => state.imagesDownloaded);

  // store action states
  const verifiedUserHasData = userStore(
    (state: any) => state.setUserInitialized,
  );
  const setImageDownloaded = useMainStore(
    (state: any) => state.setImageDownloaded,
  );

  // this is the store functions runing the app updates
  const setAppUpdate = useMainStore((state: any) => state.setAppUpdate);
  const setAppUpdateMessage = useMainStore(
    (state: any) => state.setAppUpdateMessage,
  );

  const startedGettingUrls = useRef(false);
  const updateDate = useRef<string | null>(null);

  const appUpdatesRuning = useRef(false);

  // system date update
  const getUpdateDate = async () => {
    try {
      const savedUpdatedate = await AsyncStorage.getItem("DATE_UPDATE");
      if (!savedUpdatedate) throw new Error("No save date!.");
      updateDate.current = savedUpdatedate;
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "unknown System Error!..";
      console.log(errMessage);
    }
  };
  const setUpdateDate = async (newDate: string) => {
    try {
      const newerDate = await AsyncStorage.setItem("DATE_UPDATE", newDate);
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "unknown System Error!..";
      console.log(errMessage);
    }
  };

  function generateNewUpdateDate() {
    const today = new Date("2026-08-17");
    const day = today.getDay();
    //if day is zero then its sunday
    const daysLeftBeforeSunday = 7 - day;

    today.setDate(today.getDate() + daysLeftBeforeSunday);
    setUpdateDate(today.toISOString().split("T")[0]);
    return today.toISOString().split("T")[0];
  }

  async function downloadingImages(urls: string[]) {
    await Image.clearDiskCache();
    Image.prefetch(urls)
      .then(() => console.log("Images downloaded successfully!"))
      .catch((err: unknown) => {
        const errMessage =
          err instanceof Error ? err.message : "Unkown image url's error!.";
        Alert.alert(
          "IMAGE DOWNLOAD ERROR!.",
          "Failed to save Images to the solid disk\n Images may Load slower!.",
          [{ text: "OK", onPress: () => console.error(errMessage) }],
        );
      });

    setImageDownloaded(true);
  } //end of downloading images function

  // this use effect checks for date updates
  useEffect(() => {getUpdateDate();}, []);

  // use auth useEffect to check if the user is signed in and has data, if not get the data from the server and initialize the user store
  useEffect(() => {
    if (!isLoaded || userHasData) return;

    if (isSignedIn && user && !userHasData) {
      getCloudUser(user.id).then(async (cloudData) => {
        if (cloudData == "User Data NOT FOUND!.") {
          try {
            const sendToServer = await fetch(`${mainUrl}/user/new-user`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
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
    if (allMovies.length === 0 && allSeries.length === 0) getAllProgrammes();
    if (allMovies.length !== 0 && allSeries.length !== 0) getLatestProgrames();
  }, [allMovies, allSeries]);

  useEffect(() => {
    if (
      !imagesDownloaded &&
      !startedGettingUrls.current &&
      latestMovies.length !== 0 &&
      latestSeries.length !== 0
    ) {
      startedGettingUrls.current = true;
      downloadingImages(
        latestMovies
          .map((movie: any) => movie.movieImageUrl)
          .concat(latestSeries.map((serie: any) => serie.seriesImageUrl)),
      );
    }
  }, [latestMovies, latestSeries]);

  // setting up dates updates
  useEffect(() => {
    if (!updateDate.current) updateDate.current = generateNewUpdateDate();
    else {
      // if today's date is greater than the update date so i should run an update
      if (
        new Date() >= new Date(updateDate.current) &&
        !appUpdatesRuning.current
      ) {
        setAppUpdate(true);
        appUpdatesRuning.current = true;
        setAppUpdateMessage("Getting new Shows!.");

        getNewShows()
          .then(async () => {
            setAppUpdateMessage("Finding latest Series Update!..");
            await seriesLatestUpdates();
          })
          .catch((err: unknown) => {
            const errMessage =
              err instanceof Error
                ? err.message
                : "Failed to update DataBase!.";
            console.error(errMessage);
          })
          .finally(() => {
            setAppUpdate(false);
            appUpdatesRuning.current = false;
          });

        updateDate.current = generateNewUpdateDate();
        setUpdateDate(updateDate.current);
      } //end of inner statement
    }
  }, [updateDate]);

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
