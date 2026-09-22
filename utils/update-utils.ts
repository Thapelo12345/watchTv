import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImageKit from "imagekit-javascript";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";

const mainUrl = (useMainStore.getState() as { baseUrl: string }).baseUrl;

// store state functions
const setName = (
  userStore.getState() as { setUserName: (value: string) => void }
).setUserName;
const setImage = (
  userStore.getState() as {
    setUserNewImage: (value: { imageId: string; imageUrl: string }) => void;
  }
).setUserNewImage;

type ImageKitUploadResponse = {
  url: string;
  fileId: string;
};

async function getImageLocation() {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 1,
  });

  return !result.canceled ? result.assets[0].uri : "";
}

async function uploadToImageKit(imageLocation: string) {
  const mainId = (userStore.getState() as { userId: string }).userId;
  const mainUrl = useMainStore.getState().baseUrl.replace(/\/$/, "");

  if (imageLocation === "" || !imageLocation) return { fileId: "", url: "" };

  try {
    if (!mainId || mainId === "") throw new Error("No User Id FOUND!.");

    // getting imageKit auth token from server
    const response = await fetch(`${mainUrl}/user/imageKit-auth`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`ImageKit auth request failed (${response.status}).`);
    }

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
    const newerImage = new Promise<ImageKitUploadResponse>(
      (resolve, reject) => {
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
            err
              ? reject({ fileId: "", url: "" })
              : resolve({ fileId: result.fileId, url: result.url });
          },
        );
      },
    );

    return newerImage;
  } catch (err: unknown) {
    const errMessage =
      err instanceof Error ? err.message : "Failed to Upload to imageKit!.";
    console.log(errMessage);
    return { fileId: "", url: "" };
  }
} //end of get file image

async function updateAvatar(imageUrl: string) {
  const mainId = (userStore.getState() as { userId: string }).userId;
  const profile = (
    userStore.getState() as {
      profilePicture: { imageId: string; imageUrl: string };
    }
  ).profilePicture;

  if (!imageUrl) return null;

  try {
    const newImage = await uploadToImageKit(imageUrl);
    if (!newImage.fileId || !newImage.url) throw new Error("Failed to upload to ImageKit!.");

    // here i am updating the current image
    const sendToServer = await fetch(`${mainUrl}/user/update-user-image${mainId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: newImage.url,
          imageID: newImage.fileId,
        }),
      },
    );

    if (!sendToServer.ok) throw new Error("Failed To Connect to Server\nCheck your INTERNET connection!.");
    const data = await sendToServer.json();

    if (data.message !== "Image Updated Successfully!.") throw new Error("Failed to Upload Image!.");
    const cloudDelete = await fetch(`${mainUrl}/user/delete-image${profile.imageId}`, { method: "DELETE" });

    if (!cloudDelete.ok) throw new Error("Failed to Connect with Server!.");

    const feedback = await cloudDelete.json();

    if (feedback.message !== "File deleted successfully")
      throw new Error("Failed to delete Old Image File!.");

    setImage({ imageId: newImage.fileId, imageUrl: newImage.url });
  } catch (err: unknown) {
    const errMessage =
      err instanceof Error ? err.message : "unknown server Error!.";

    Alert.alert("SERVER ERROR!.", errMessage, [
      { text: "OK", onPress: () => console.log("Done!.") },
    ]);
  }
} //end of update avatar function

async function updateUserName(newName: string) {
  const userName = (userStore.getState() as { userName: string }).userName;
  const mainId = (userStore.getState() as { userId: string }).userId;

  if (newName === userName || newName === "") return;

  try {
    const sendToServer = await fetch(`${mainUrl}/user/update-user-name${mainId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      },
    );

    if (!sendToServer.ok) throw new Error("Failed To Connect to server!.");

    const data = await sendToServer.json();
    if (data.message !== "Update was Successful!.") throw new Error("Failed to the User name!.");

    setName(newName);
  } catch (err: unknown) {
    const errMessage =
      err instanceof Error ? err.message : "Failed to Update User name!.";
    Alert.alert("USER NAME ERROR!.", errMessage);
  }
} //end of updateUserName

export { updateUserName, updateAvatar, getImageLocation, uploadToImageKit };
