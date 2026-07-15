import { View, Pressable, Text, Image } from "react-native";
import FormInput from "./ui/formInput";
import { useAuth } from "@clerk/expo";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { useState, useEffect } from "react";
import { getFileImage, extractUserInfo } from "@/utils/form-utils";
import { router } from "expo-router";

type PROPS = {
  userName: string;
  userId: string;
  userImage: string;
  userEmail: string;
};

export default function AuthForm({
  userName,
  userId,
  userEmail,
  userImage,
}: PROPS) {
  
  // store states
  const mainUrl = useMainStore((state: any) => state.baseUrl);

  // store functions
  const toggleAppLoading = useMainStore((state: any) => state.switchAppLoding);
  const getUserData = userStore((state: any) => state.initializeUser);

  const [preferedUserName, setPreferedName] = useState<string | undefined>(
    undefined,
  );

  const [imageUrl, setImageUrl] = useState(userImage);
  const [imageId, setImageId] = useState("");

  useEffect(() => {
    if (!preferedUserName) setPreferedName(userName);
  }, []);

  return (
    <View className="border-2 border-white bg-blue-300 flex-col items-center shadow-lg w-[90%] p-2 m-auto rounded-2xl">
      <View className="flex flex-row w-fit gap-2 p-2 items-center">
        {/* Base container matches width to h-30 and removes flex-1 */}
        <View className="image-shadow border-2 border-white rounded-full p-4 w-30 h-30 overflow-hidden items-center justify-center">
          {imageUrl == "" ? (
            <UserCircleIcon size={110} color="white" />
          ) : (
            <Image
              className="rounded-full mt-1"
              source={
                imageUrl === ""
                  ? require("../assets/images/cast-default.png")
                  : { uri: imageUrl }
              } // Placeholder image URL
              style={{ width: 95, height: 95 }}
            />
          )}
        </View>

        {/* upload a new image only */}
        <Pressable
          onPress={async () => {
            const profileInfo: any = await getFileImage();

            if (profileInfo.url !== "") {
              if (imageId !== "" && imageUrl !== "") {
                const response = await fetch(
                  `${mainUrl}/user/delete-image/${imageId}`,
                  {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                  },
                );

                if (!response.ok) {
                  alert("Failed to get response from server!..");
                  return;
                } //end of inner if
                console.log(await response.json());
              }

              setImageUrl(profileInfo.url);
              setImageId(profileInfo.fileId);
            }
          }}
        >
          <Text className="form-btn">Upload image</Text>
        </Pressable>
      </View>

      <View className=" flex flex-col items-center my-1/2 gap-2 rounded-lg">
        <FormInput
          label="username"
          defaultValue={preferedUserName}
          sendUserName={setPreferedName}
        />

        <View className="flex flex-row items-center justify-evenly m-2 gap-2">
          <Pressable
            onPress={async () => {
              if (!userName || !userId) return;

              toggleAppLoading();

              const firstResponse = await fetch(
                `${mainUrl}/user/find-User${userId}`,
                { method: "GET" },
              );

              if (!firstResponse.ok) {
                alert(
                  "Enable to contact to server!.\ncheck Network connectoin and try again!..",
                );
                toggleAppLoading();
                useAuth().signOut()
                router.navigate("/(tabs)");
                return;
              }

              const verdict = await firstResponse.json();

              // if use is found the do not create a new user
              if (verdict.message === "Successfully FOUND user!..") {

                getUserData(extractUserInfo(verdict.matchingUser));
                console.log("User has been initialized!..");
                router.navigate("/(tabs)");
                toggleAppLoading();
                return;
              }

              // creating a new user here!
              const response = await fetch(`${mainUrl}/user/new-user`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: preferedUserName,
                  id: userId,
                  email: userEmail,
                  imageId: imageId,
                  image: imageUrl,
                }),
              });

              if (!response.ok) {
                alert(
                  "Failed to add account to database!.\nCheck internet connection and try again!..",
                );
                toggleAppLoading();
                return;
              }

              const res = await response.json();

              if (res.message === "User created successfully!..") {
               
                getUserData(extractUserInfo(res.newUser));
                console.log("User has been initialized!..");

                router.navigate("/(tabs)");
                toggleAppLoading();
              }

              else{
                alert("Couldnt get User data re-try!..")
                router.navigate("/(tabs)");
                toggleAppLoading();
                useAuth().signOut()
              }
            }} //end of press function
          >
            <Text className="form-btn">Continue</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
