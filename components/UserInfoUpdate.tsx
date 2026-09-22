import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import ImageUpdate from "./imageUpdate";
import { getImageLocation, updateUserName, updateAvatar, uploadToImageKit } from "@/utils/update-utils";
import { userStore } from "@/stateManagement/userStore";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/constants/myTheme";

export default function UpdateUserInfor() {

  const theme = useTheme()
  // store states here
  const userProfile = userStore((state: any) => state.profilePicture);
  const currentUser = userStore((state: any) => state.userName);

  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [load, setLoad] = useState(false);
  const [inputName, setInputName] = useState(currentUser);

  useEffect(()=>{setCurrentImageUrl(userProfile.url)}, [userProfile])

  return (
    <View className="flex items-center justify-center m-2 p-2 mx-auto w-full h-fit rounded-lg">
      <Pressable
        onPress={async () => {
          setLoad(true);
          const imageUri = await getImageLocation();

          if(imageUri !== "") setCurrentImageUrl(imageUri)
          setLoad(false);
        }}
      >
        <ImageUpdate inputUrl={currentImageUrl} />
      </Pressable>

      <TextInput
        className="p-2 m-2 text-black rounded-lg border-4 border-white w-1/2 shadow-lg"
        value={inputName}
        onChangeText={(text) => setInputName(text)}
        style={{
          color: theme.text,
          boxShadow: theme.settingsShadow
        }}
      />

      {load ? (
        <ActivityIndicator className="p-2 m-4" color="blue" size={30} />
      ) : (
        <Pressable
          onPress={async () =>{
           setLoad(true)

            if(inputName !== currentUser) await updateUserName(inputName)
            if(currentImageUrl !== "") await  updateAvatar(currentImageUrl)
          
           setCurrentImageUrl("")
           setInputName(currentUser)
           setLoad(false)
          }}>
          <Text className="p-2 border-4 border-white m-4 rounded-lg"
          style={{
          color: theme.text,
          boxShadow: theme.settingsShadow
        }}
          >
            Update
          </Text>
        </Pressable>
      )}
    </View>
  );
}
