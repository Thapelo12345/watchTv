import * as ImagePicker from "expo-image-picker";
import ImageKit from "imagekit-javascript";
import { useMainStore } from "@/stateManagement/store";

const mainUrl = (useMainStore.getState() as { baseUrl: string }).baseUrl;

type ImageKitUploadResponse = {
  url: string;
  fileId: string;
};

async function getFileImage() {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 1,
  });

  //  this if only runs when an image file is selected
  if (!result.canceled) {
    try {
      const imageUri = result.assets[0].uri;
      console.log("File URI:", imageUri);

      // getting imageKit auth token from server
      const response = await fetch(`${mainUrl}/user/imageKit-auth`, {
        method: "GET",
      });
      const authParams = await response.json();
      const { token, expire, signature, publicKey } = authParams;

      // 2. Initialize the core client instance
      const imagekit = new ImageKit({
        publicKey: publicKey,
        urlEndpoint: "https://ik.imagekit.io/tbqujnkny", // Your viewing endpoint path
      });

      // creating file information
      const fileName = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName || "");
      const fileType = match ? `image/${match[1]}` : `image/jpeg`;

      const rnFilePayload = {
        uri: imageUri,
        name: fileName || "upload.jpg",
        type: fileType || "image/jpeg",
      } as any;

      // 4. Fire the native upload script handler
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
              console.error("SDK Upload Error:", err);
              alert("Upload failed via SDK processing.");
              resolve({ url: "", fileId: "" });
            } else {
              console.log("Success! Image URL is:", result.url);
              resolve({ url: result.url, fileId: result.fileId }); // Returns your direct image view path
            }
          },
        );
      });
    } catch (err: unknown) {
      console.error(
        err instanceof Error ? err.message : "unknown server error!.",
      );
      return "";
    }
  } // end of if
  
  else return { url: "", fileId: "" };
} //end of get file image

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

export { getFileImage, extractUserInfo}
