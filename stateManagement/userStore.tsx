import { create } from "zustand";
type IMAGE = { imageId: string, imageUrl: string }
type SEASON = {season: string;  episode: string;}

 type USERTYPES = {
    userId: string,
    profilePicture: {imageId: string, imageUrl: string },
    email: string,
    userName: string,
    joinedDate: string,
    paymentMethod: string,
    daysLeft: number,
    accountCanceled: string,
    continueWatching:{
      programmeName: string;
      programmeSeason?: SEASON;
    }[],
    userLiked: {
      userSeries: string[],
      userMovies: string[]
    },
    watchHistory: string[],
    userStatus: string,
    userPrefferedGenres: string[],
    userInitialized: boolean;
    initializeUser: (value: Partial<USERTYPES>)=> void,
    setUserName: (value: string)=> void,
    setUserNewImage: (value: IMAGE)=> void,
    addUnfinishedShow: (value: {programmeName: string, programmeSeason?: SEASON})=> void,
    addWatchedShow: (value: string)=> void,
    removeWatchShow: (value: string)=> void,
    addPreferedGenre: (value: string)=> void,
    addLikedSeries: (value: string)=> void,
    addLikedMovies: (value: string)=> void,
    removeLikedSeries: (value: string)=> void,
    removeLikedMovies: (value: string)=> void,
    removeUnfinishedShow: (value: string)=> void,
    setUserInitialized: (value: boolean)=> void,
 }

 export const userStore = create((set)=>({
    userId: null,
    profilePicture: {imageId: null, imageUrl: null },
    email: null,
    userName: null,
    joinedDate: null,
    paymentMethod: null,
    daysLeft: 0,
    accountCanceled: null,
    continueWatching: [],
    userLiked: {
      userSeries: [],
      userMovies: []
    },
    watchHistory: [],
    userStatus: null,
    userPrefferedGenres: [],
    userInitialized: false,
    // store functions
   // 3. Fixed syntax: Added parentheses around the returned object code context
    initializeUser: (userData: any) => set((state: any) => ({
      ...state,
      ...userData,
      profilePicture: { 
        ...state.profilePicture, 
        ...userData?.profilePicture,
      },
      userLiked: { 
        ...state.userLiked, 
        ...userData?.userLiked, 
      },
    })),//end of iniliazer  function
    setUserName: (newName: string)=> set({userName: newName}),
    setUserNewImage:(newImage: IMAGE)=> set({profilePicture: newImage}),
    addUnfinishedShow: (show: {programmeName: string, programmeSeason?: SEASON})=> set((state: any)=> ({continueWatching: [...state.continueWatching, show]})),
    addWatchedShow: (showName: string)=> set((state: any)=> ({watchHistory: [...state.watchHistory, showName]})),
    removeWatchShow: (showName: string)=> set((state: any)=> ({watchHistory: state.watchHistory.filter((show: string)=> show !== showName)})),
    addPreferedGenre: (genre: string)=> set((state: any)=> ({userPrefferedGenres: [...state.userPrefferedGenres, genre]})),
    removeUnfinishedShow: (showName: string)=> set((state: any)=> ({continueWatching: state.continueWatching.filter((show: {programmeName: string})=> show.programmeName !== showName)})),
    addLikedSeries: (likedSeries: string) => set((state: any) => ({
    userLiked: {
      ...state.userLiked, // Keeps userMovies intact
      userSeries: [...state.userLiked.userSeries, likedSeries]
    }
  })),  
    addLikedMovies: (likedMovie: string) => set((state: any) => ({
    userLiked: {
      ...state.userLiked, // Keeps userSeries intact
      userMovies: [...state.userLiked.userMovies, likedMovie]
    }
  })),
    removeLikedSeries: (removeShow: string) => set((state: any) => ({
    userLiked: {
      ...state.userLiked,
      userSeries: state.userLiked.userSeries.filter((showName: string) => showName !== removeShow)
    }
  })),
  removeLikedMovies: (removeShow: string) => set((state: any) => ({
    userLiked: {
      ...state.userLiked,
      userMovies: state.userLiked.userMovies.filter((showName: string) => showName !== removeShow)
    }
  })),
  setUserInitialized: (valid: boolean)=> set({ userInitialized: valid }),
 }))//end of user store