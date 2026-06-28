import { create } from "zustand";

type STORETYPES ={
  baseUrl: string;
  movies: any[],
  series: any[];
  selectedShow: any;
  selectedPosition: number;
  showType: string;
  playUrl: string;
  playing: string;
  searchResults: any[],
  searching: boolean;
  onlineSearch: boolean;
  getMovies: (value: any)=> void;
  addMovie: (value: any)=> void;
  editMovies:(pos: number, newObj: any)=> void;//replacing one value from the array tv programme
  getSeries: (value: any)=> void;
  addSeries: (value: any)=> void;
  editSeries: (pos: number, newObj: any) => void;//replacing one value from the array tv programme
  set_selected_show: (value: any)=> void;
  setUrl: (value: string)=> void;
  setPlaying: (value: boolean)=> void;
  getSelectedPosition: (value: number)=> void;
  addSearchResults: (value: any)=> void;
  removeSearchResults: (value: any)=> void;
  clearSearchResults: ()=> void;
  setSearching: ()=> void,
  setOnlineSearch: ()=> void,
}

export const useMainStore = create((set)=>({
  baseUrl: "http://192.168.18.7:5000",
    movies: [],
    series: [],
    selectedShow: null,
    selectedPosition: -1,
    showType: "series",
    playUrl: null,
    playing: false,
    searchResults: [],
    searching: false,
    onlineSearch: false,
  getMovies: (newMovie: any)=> set({movies: newMovie}),
  addMovie: (newMovie: any)=> set((state: any)=> ({movies: [...state.movies, newMovie]})),
  editMovies: (position: number, newTvProgramme: any)=> set((state: any) => {
      const updatedMovies = [...state.movies]; // 1. Copy array
      updatedMovies[position] = newTvProgramme; // 2. Modify index
      return { movies: updatedMovies };       // 3. Return update
    }),

  getSeries: (newSeires: any)=> set({ series: newSeires}),
  addSeries: (newSeries: any)=> set((state: any)=>({series: [...state.series, newSeries]})),
  editSeries: (position: number, newTvProgramme: any)=>set((state: any) => {
      const updateSeries = [...state.series]; // 1. Copy array
      updateSeries[position] = newTvProgramme; // 2. Modify index
      return { series: updateSeries };       // 3. Return update
    }),
  set_selected_show: (newShow: any, type_of_show: string)=> set({selectedShow: newShow, showType: type_of_show}),
  getSelectedPosition: (newPosistion: number)=> set({selectedPosition: newPosistion}),
  setUrl: (newUrl: string)=> set({playUrl: newUrl}),
  setPlaying: (position: boolean)=> set({playing: position}),
  setSearching: ()=> set((state: any)=> ({searching: !state.searching})),
  setOnlineSearch: ()=> set((state: any)=> ({onlineSearch: !state.onlineSearch})),
  addSearchResults: (newResults: any)=> set((state:any)=> ({searchResults: [...state.searchResults, newResults]})),
  removeSearchResults: (oldResults: any)=> set((state: any)=>({searchResults: state.searchResults.filter((item: any)=> item._id !== oldResults._id)})),
  clearSearchResults: ()=> set({searchResults: []})

}))
