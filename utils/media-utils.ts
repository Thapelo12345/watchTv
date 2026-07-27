import { Alert } from "react-native";
import { userStore } from "@/stateManagement/userStore";
import { useMainStore } from "@/stateManagement/store";

// store state
const mainUrl = (useMainStore.getState() as {baseUrl: string}).baseUrl

// store actions
const saveSeries = (userStore.getState() as {addLikedSeries: (value: string)=> void}).addLikedSeries
const saveMovie = (userStore.getState() as {addLikedMovies: (value: string)=> void}).addLikedMovies

const removeSeries = (userStore.getState() as {removeLikedSeries: (value: string)=> void }).removeLikedSeries
const removeMovie = (userStore.getState() as {removeLikedMovies: (value: string)=> void}).removeLikedMovies

export async function addRemoveLikedProgramme(programmeName: string, destination: string, action: string){

const currentId = (userStore.getState() as {userId: string}).userId

if(!currentId) {
  Alert.alert('NO USER DATA', 'Still getting user data!.\nPlease wait', [
    {text: 'OK',onPress: () => console.log('Cant get data!.'),}])
    return "update done"
}

if(action === "add") destination === "series" ? saveSeries(programmeName) : saveMovie(programmeName)
else destination === "series" ? removeSeries(programmeName) : removeMovie(programmeName)

const usersShows = (userStore.getState() as {userLiked: any}).userLiked

const serverResponse = await fetch(`${mainUrl}/user/update-userLikes`, 
    {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        id: currentId,
        userLikes: usersShows
    })
})

if(!serverResponse.ok) {
    alert("Failed to connect to server.\nCheck Network connection!.")
    return
}

const data = await serverResponse.json()

console.log("Below is a message from the cloud!..")
console.log(data.message)

console.table(usersShows.userSeries)
console.table(usersShows.userMovies)
if(data.message) return "update done"

}//end liked programme function