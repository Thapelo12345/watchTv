import { create } from "zustand";
type IMAGE = {imageId: string, imageUrl: string }

 type USERTYPES = {
    userId: string,
    profilePicture: {imageId: string, imageUrl: string },
    email: string,
    userName: string,
    joinedDate: string,
    paymentMethod: string,
    daysLeft: number,
    accountCanceled: string,
    continueWatching: string[],
    userLiked: {
      userSeries: string[],
      userMovies: string[]
    },
    watchHistory: string[],
    userStatus: string,
    userPrefferedGenres: string[],
    initializeUser: (value: Partial<USERTYPES>)=> void,
    setUserNewImage: (value: IMAGE)=> void
    addUnfinishedShow: (value: string)=> void,
    addWatchedShow: (value: string)=> void
    addPreferedGenre: (value: string)=> void,
    addLikedSeries: (value: string)=> void,
    addLikedMovies: (value: string)=> void,
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

    setUserNewImage:(newImage: IMAGE)=> set({profilePicture: newImage}),
    addUnfinishedShow: (showName: string)=> set((state: any)=> ({continueWatching: [...state.continueWatching, showName]})),
    addWatchedShow: (showName: string)=> set((state: any)=> ({watchHistory: [...state.watchHistory, showName]})),
    addPreferedGenre: (genre: string)=> set((state: any)=> ({userPrefferedGenres: [...state.userPrefferedGenres, genre]})),
    addLikedSeries: (likedSeries: string)=> set((state: any)=> ({userLiked: {...state.userLiked, userSeries: [...state.userLiked.userSeries, likedSeries]}})),
    addLikedMovies: (likedMovie: string)=> set((state: any)=> ({userLiked: {...state.userLiked, userSeries: [...state.userLiked.userSeries, likedMovie]}})),

 }))//end of user store