import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { router } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "@clerk/expo";

// store sates here
const mainUrl = (useMainStore.getState() as { baseUrl: string }).baseUrl;

// store function states here
const initializeCurrentUser = (userStore.getState() as { initializeUser: (value: any) => void }).initializeUser;
const verifiedUserHasData = (userStore.getState() as { setUserInitialized: (value: boolean) => void }).setUserInitialized;

const getMovies = (useMainStore.getState() as { getMovies: (value: any) => void }).getMovies;
const getSeries = (useMainStore.getState() as { getSeries: (value: any) => void }).getSeries;

const addNewMovie = (useMainStore.getState() as {addMovie: (value: any)=> void}).addMovie
const addNewSeries = (useMainStore.getState() as {addSeries: (value: any)=> void}).addSeries

const getLatestMovies = (useMainStore.getState() as { addLatestMovie: (value: any) => void }).addLatestMovie;
const getLatestSeries = (useMainStore.getState() as { addLatestSeries: (value: any) => void }).addLatestSeries;

const setAppUpdateMessage = (useMainStore.getState() as {setAppUpdateMessage: (value: string)=> void}).setAppUpdateMessage

 const getShows = async (showUrl: string) => {
    try {
      const response = await fetch(showUrl, { method: "GET" });

      if (!response.ok) throw new Error("Failed to retch server!..");

      if (response.status !== 200) {
        alert("Failed to get data from server!.");
        return [];
      }

      // 2. FIXED: Added 'await' before response.json()
      const showData: any = await response.json();
      return showData.data;
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "unknown server error!..";
      console.error("Network Fetch Error: ", errMessage);
      return [];
    }
}; //end of fetching show

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

async function getCloudUser(id: string) {
  console.log("Runing Getting Cloud User!.");

  try {
    const serverResponse = await fetch(`${mainUrl}/user/find-User${id}`, {
      method: "GET",
    });

    if (!serverResponse.ok) throw new Error("Cant connect to Server!");

    const data = await serverResponse.json();
    if (data.message !== "Successfully FOUND user!..")
      throw new Error("Cant Find user DATA!.");

    initializeCurrentUser(extractUserInfo(data.matchingUser));
    verifiedUserHasData(true);

    return "User Data FOUND!.";
  } catch (err: unknown) {
    const errMessage =
      err instanceof Error ? err.message : "unknown server error";
    console.error("AuthPage error\n", errMessage);
    return errMessage === "Cant connect to Server!"
      ? "Internet Error!."
      : "User Data NOT FOUND!.";
  }
} //end of get cloud use r function

async function getAllProgrammes() {
  // get all movies ,series and latest movies and series
  const allMovies = await getShows(`${mainUrl}/movies/programs`);
  const allSeries = await getShows(`${mainUrl}/series/programs`);


  getMovies([...allMovies].sort((a, b) => Number(b.movieYear) - Number(a.movieYear)));
  getSeries([...allSeries].sort((a, b) => b.lastUpdate.localeCompare(a.lastUpdate)));
}//end get all programmes function

async function getLatestProgrames(){
  // first update series data base
  const movies = (useMainStore.getState() as {movies: any[]}).movies;
  const series = (useMainStore.getState() as {series: any[]}).series;

  // try{

  //   const serieUpdateResponse = await fetch(`${mainUrl}/series/lastDate`, { method: "GET" });

  //   if(!serieUpdateResponse.ok) throw new Error("Failed to update series data!.")

  //     const data = await serieUpdateResponse.json();

  //     if(data.message !== "All Data Updated Successfully!.") throw new Error("Failed to update series data!.")
  // }
  // catch(err: unknown){
  //   const errMessage = err instanceof Error ? err.message : "unknown error";
  //   console.error("Error in getting latest programes\n", errMessage);
  // }

  let tempMovie: any[] = [];
  let tempSeries: any[] = [];

      for (let i = 0; i < 10; i++) {
        tempMovie.push(movies[i]);
        tempSeries.push(series[i]);
      } //end of 4 loop

  getLatestMovies(tempMovie);
  getLatestSeries(tempSeries);
}

async function getNewShows(){

// get movies show first
try{
setAppUpdateMessage("Searching and Adding new movies!..")
const moviesResponse = await fetch(`${mainUrl}/movies/new-movies`, {method: "GET"})

if(!moviesResponse.ok) throw new Error("Failed to get new Movies!.")
const movieData = await moviesResponse.json()

if(movieData.message !== "Added new shows successfully!..") {
  setAppUpdateMessage(movieData.message)
  throw new Error(movieData.message)
}

const newMovies = movieData.results

setAppUpdateMessage("Adding new Movies to Your Data Base!.")
for(const movie of newMovies){addNewMovie(movie)}//end of 4 loop

}
catch(err: unknown){
  const errMessage = err instanceof Error ? err.message : "Failed to Get New Shows!."
  console.error(errMessage)
  setAppUpdateMessage(errMessage)
}

// get new Series
try{
  setAppUpdateMessage("Getting New Series Shows!.")
  const seriesResponse = await fetch(`${mainUrl}/series/new-series`, {method: "GET"})

  if(!seriesResponse.ok) throw new Error("Failed to connect to server!.")

    const seriesData = await seriesResponse.json()

    if(seriesData.message !== "Added new shows successfully!..") throw new Error(seriesData.message)

    setAppUpdateMessage("Adding new shows to Your data Base!.")

    for(const show of seriesData){addNewSeries(show)}//end of 4 loop
}
catch(err: unknown){
  const errMessage = err instanceof Error ? err.message : "Failed get New Series Shows!."
  console.error(errMessage)
}

}//end of getting new shows functions

async function seriesLatestUpdates(){
  try{
    setAppUpdateMessage("Getting latest series updates!.")
    const seriesResponse = await fetch(`${mainUrl}/series/latestDate`, {method:"GET"})

    if(!seriesResponse.ok) throw new Error("Failed to connect to server!..")
    const seriesData = await seriesResponse.json()

    if(seriesData.message !== "All Data Updated Successfully!.") throw new Error(seriesData.message)

    const pause = setTimeout(()=>{
    setAppUpdateMessage("App has Been Updated Successfully!.")
    clearTimeout(pause)
    }, 1200)
  } 
  catch(err: unknown){
    const errMessage = err instanceof Error ? err.message : "Failed to get Series Latest Updates!."
    setAppUpdateMessage(errMessage)
    console.error(errMessage)
  }
}//end of latest series date

export { getCloudUser, extractUserInfo, getAllProgrammes, getLatestProgrames, getNewShows, seriesLatestUpdates };