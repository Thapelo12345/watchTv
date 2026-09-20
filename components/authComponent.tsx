import { View, Text, Pressable, Platform, Modal } from "react-native";
import { Alert } from "react-native";
import { Image } from "expo-image";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import {
  getCloudUser,
  getAllProgrammes,
  getLatestProgrames,
  getNewShows,
  seriesLatestUpdates,
} from "@/utils/auth-utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackHandler } from "react-native";
import RNExitApp from "react-native-exit-app";
import { makeRedirectUri } from "expo-auth-session";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/lib/supabase";

export default function Auth() {
  const redirectTo = makeRedirectUri();

  // store static states
  const mainUserName = userStore((state: any) => state.userName);
  const profileImage = userStore((state: any) => state.profilePicture);

  const userHasData = userStore((state: any) => state.userInitialized);
  const currentTheme = userStore((state: any) => state.userTheme);

  const allMovies = useMainStore((state: any) => state.movies);
  const allSeries = useMainStore((state: any) => state.series);

  const latestMovies = useMainStore((state: any) => state.latestMovies);
  const latestSeries = useMainStore((state: any) => state.latestSeries);

  const mediaFilePlaying = useMainStore((state: any) => state.playing);
  const imagesDownloaded = useMainStore((state: any) => state.imagesDownloaded);

  const activeUser = userStore((state: any)=> state.userActive)

  // store action states
  const setImageDownloaded = useMainStore((state: any) => state.setImageDownloaded);
  const setTheme = userStore((state: any) => state.setUserTheme);

  const setOpenAuthModal = useMainStore((state: any)=> state.setOpenAuthModal)
  const setActiveUser = userStore((state: any) => state.setUserActive)

  // this is the store functions runing the app updates
  const setAppUpdate = useMainStore((state: any) => state.setAppUpdate);
  const setAppUpdateMessage = useMainStore((state: any) => state.setAppUpdateMessage);

  const startedGettingUrls = useRef(false);
  const updateDate = useRef<string | null>(null);

  const appUpdatesRuning = useRef(false);
  const loadingProgrammes = useRef(false);

  const [refresh, setRefresh] = useState(false);

  // system date update
  const getUpdateDate = async () => {
    try {
      const savedUpdatedate = await AsyncStorage.getItem("DATE_UPDATE");
      if (!savedUpdatedate) throw new Error("No System save Date!.");
      updateDate.current = savedUpdatedate;
    } catch (err: unknown) {
      return generateNewUpdateDate();
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

  const getSystemTheme = async () => {
    try {
      const systemTheme = await AsyncStorage.getItem("THEME");
      if (!systemTheme) throw new Error("No save Theme data!.");
      setTheme(systemTheme);
    } catch (err: unknown) {
      await AsyncStorage.setItem("THEME", currentTheme);
    }
  };

  function generateNewUpdateDate() {
    const today = new Date("2026-08-17");
    const day = today.getDay();
    const daysLeftBeforeSunday = 7 - day;

    today.setDate(today.getDate() + daysLeftBeforeSunday);
    setUpdateDate(today.toISOString().split("T")[0]);
    return today.toISOString().split("T")[0];
  } // end of generate new update date function

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
  useEffect(() => {
    getSystemTheme();
    getUpdateDate();
  }, [activeUser]);

  // This is an auth useEffect
  /*
  useEffect(()=>{
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
      const loggedInUser = session.user
      await getCloudUser(loggedInUser.id)
      setActiveUser(true)

    }//end of if
    }

    checkInitialSession()
  }, [])
*/
  // programe useEffect to get the latest programes from the server and update the store
  useEffect(() => {
    if (
      allMovies.length === 0 &&
      allSeries.length === 0 &&
      !loadingProgrammes.current
    ) {
      loadingProgrammes.current = true;

      console.log("Starting to get All Shows!.");
      getAllProgrammes()
        .then(() => console.log("Shows Recieved!,"))
        .catch((err: unknown) => {
          const errMessage =
            err instanceof Error ? err.message : "unknown server Error!...";

          console.error(errMessage);
          Alert.alert(
            "SERVER ERROR!.",
            "Failed To Get Data From the Server\nApp Is Being Closed!..",
            [
              {
                text: "Close App",
                onPress: () => {
                  Platform.OS === "android"
                    ? BackHandler.exitApp()
                    : RNExitApp.exitApp();
                  console.log("App is Being Closed!..");
                },
              },
              { text: "Retry", onPress: () => setRefresh((prev) => !prev) },
            ],
          );
        });
    }
    if (allMovies.length !== 0 && allSeries.length !== 0) getLatestProgrames();
  }, [allMovies, allSeries, refresh]); // this use effect downloads images to my device

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
      {userHasData && (
        <Text className="text-white mr-11 text-[17px] font-extrabold">
          {mainUserName}
        </Text>
      )}

      <View className="border border-white overflow-hidden flex items-center justify-center rounded-full w-10 h-full">
        {!userHasData || !profileImage?.imageUrl ? (
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
        onPress={async () => {
        if(!activeUser) setOpenAuthModal(true)
        else{
           const { error } = await supabase.auth.signOut()
          if (error) {
            Alert.alert("LOGOUT ERROR!.", error.message)
            return
          }

          setActiveUser(false)
        }
        }}
      >
        <Text className="auth-btn">Sign {activeUser ? "Out" : "In"}</Text>
      </Pressable>
    </View>
  );
}