import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImageKit from "imagekit-javascript";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";

const mainUrl = (useMainStore.getState() as { baseUrl: string }).baseUrl;

// store state functions
const setName = (userStore.getState() as {setUserName: (value: string)=> void}).setUserName
const setImage = (userStore.getState() as {setUserNewImage: (value: {imageId: string, imageUrl: string })=> void}).setUserNewImage

type ImageKitUploadResponse = {
  url: string;
  fileId: string;
};

async function getImageLocation(){
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 1,
  });

  return !result.canceled ? result.assets[0].uri : ""
}

async function uploadToImageKit(imageLocation: string) {
const mainId = (userStore.getState() as {userId: string }).userId

console.log("Upload to image kit function Runing!.\nAnd this is the image location: ", imageLocation)

    if(imageLocation === "" || !imageLocation) return { fileId: "", url: "" }; 

    try {
      if(!mainId || mainId === "") throw new Error("No User Id FOUND!.")

      // getting imageKit auth token from server
      const response = await fetch(`${mainUrl}/user/imageKit-auth`, {
        method: "GET",
      });
      const authParams = await response.json();
      const { token, expire, signature, publicKey } = authParams;

      // 2. Initialize the core client instance
      const imagekit = new ImageKit({
        publicKey: publicKey,
        urlEndpoint: "https://ik.imagekit.io/tbqujnkny", // My viewing endpoint path
      });

      // creating file information
      const fileName = imageLocation.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName || "");
      const fileType = match ? `image/${match[1]}` : `image/jpeg`;

      const rnFilePayload = {
        uri: imageLocation,
        name: fileName || "upload.jpg",
        type: fileType || "image/jpeg",
      } as any;

      // 4. Firing the native upload script handler
      return new Promise<ImageKitUploadResponse>((resolve, reject) => {
        imagekit.upload(
          {
            file: rnFilePayload,
            fileName: fileName || "uploaded.jpg",
            signature: signature,
            token: token,
            expire: expire,
            folder: "/watchTv", // Targets your specific media directory
          },
          function (err: any, result: any) {
            if (err) {
              console.error("SDK Upload Error:\n", err);
              resolve({ fileId: "",  url: "" });
              throw new Error("Upload failed via SDK processing.");
            } else {
              console.log("Success! Image URL is:", result.url);
              resolve({fileId: result.fileId, url: result.url})
            }
          },
        );
      });

    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "unknown SDK Upload Error!.";
      Alert.alert("FILER PICKER ERROR!.", errMessage, [
        { text: "OK", onPress: () => console.error(errMessage) },
      ]);
      return { fileId: "", url: "" }; 
    }
  
} //end of get file image


async function updateCloud(
  newName: string,
  oldName: string,
  newProfile: { imageId: string; imageUrl: string },
  oldProfile:{ imageId: string; imageUrl: string },
) {

const mainId = (userStore.getState() as {userId: string }).userId

console.log(`This is the user's ID: ${mainId}`)

  try{

  if(newName !== oldName && (newName !== "" && newName !== undefined)){
    const sendToServer = await fetch(`${mainUrl}/user/update-user-name${mainId}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name: newName})
    })
  
    if(!sendToServer.ok) throw new Error("Failed To Connect to server!.")

      const data = await sendToServer.json()

      if(data.message !== "Update was Successful!.") throw new Error("Failed to the User name!.")
        setName(newName)
  }
  

  if(newProfile.imageId !== "" && newProfile.imageId !== oldProfile.imageId){

    const sendToServer = await fetch(`${mainUrl}/user/update-user-image${mainId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: newProfile.imageUrl,
        imageID: newProfile.imageId
      })
    })

    if(!sendToServer.ok) throw new Error("Failed To Connect to Server\nCheck your INTERNET connection!.")

      const data = await sendToServer.json()

      console.log("This is the message from the server!.\n", data.message)

      if(data.message !== "Image Updated Successfully!.") throw new Error("Failed to Upload Image!.")

        const cloudDelete = await fetch(`${mainUrl}/user/delete-image${oldProfile.imageId}`, {method: "DELETE"})
        if(!cloudDelete.ok) throw new Error("Failed to Connect with Server!.")

         const feedback = await cloudDelete.json()
         console.log(feedback.message)
        setImage(newProfile)
  }
  

}//end of try
catch(err: unknown){
  const errMessage = err instanceof Error ? err.message : "unknown server Error!."

  const cloudDelete = await fetch(`${mainUrl}/user/delete-image${newProfile.imageId}`, {method: "DELETE"})
  if(!cloudDelete.ok) console.error("Failed to Connect with Server!.")

  console.error(errMessage)
  Alert.alert("SERVER ERROR!.", errMessage, [{text: "OK", onPress: ()=> console.log("Done!.")}])
}
}

export { updateCloud, getImageLocation, uploadToImageKit };
