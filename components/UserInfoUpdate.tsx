import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import ImageUpdate from "./imageUpdate";
import { getImageLocation, updateCloud, uploadToImageKit } from "@/utils/update-utils";
import { userStore } from "@/stateManagement/userStore";
import { useState, useRef, useEffect } from "react";

export default function UpdateUserInfor() {
  // store states here
  const userProfile = userStore((state: any) => state.profilePicture);
  const currentUser = userStore((state: any) => state.userName);

  const [currentImageUrl, setCurrentImageUrl] = useState(userProfile.imageUrl);
  const imageId = useRef(userProfile.imageId);
  const [load, setLoad] = useState(false);
  const [inputName, setInputName] = useState(currentUser);

  useEffect(()=>{setCurrentImageUrl(userProfile.url)}, [userProfile])

  return (
    <View className="flex items-center  justify-center  m-2 p-2 mx-auto w-[70%] h-fit  rounded-lg">
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

      {/* <ImageUpdate /> */}
      <TextInput
        className="p-2 m-2 text-black rounded-lg border-4 border-white w-full shadow-lg"
        value={inputName}
        onChangeText={(text) => setInputName(text)}
      />

      {load ? (
        <ActivityIndicator className="p-2 m-4" color="blue" size={30} />
      ) : (
        <Pressable
          onPress={async () =>{

            setLoad(true)
            const profile = currentImageUrl === "" ? {fileId: "", url: ""} : await uploadToImageKit(currentImageUrl)

            updateCloud(
              inputName,
              currentUser,
              { imageId: profile.fileId, imageUrl: profile.url },
              userProfile,
            )

            setLoad(false)
        }
          }
        >
          <Text className="p-2 border-4 border-white m-4 rounded-lg shadow-lg">
            Update
          </Text>
        </Pressable>
      )}
    </View>
  );
}
