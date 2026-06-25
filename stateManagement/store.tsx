import { create } from "zustand";

type STORETYPES ={
  movies: any[],
  series: any[];
  selectedShow: any;
  selectedPosition: number;
  showType: string;
  playUrl: string;
  openSeason: boolean;
  openEpisode: boolean;
  playing: string;
  getMovies: (value: any)=> void;
  editMovies:(pos: number, newObj: any)=> void;//replacing one value from the array tv programme
  getSeries: (value: any)=> void;
  editSeries: (pos: number, newObj: any) => void;//replacing one value from the array tv programme
  set_selected_show: (value: any)=> void;
  setUrl: (value: string)=> void;
  openCloseSeason: (value: boolean)=> void;
  openCloseEpisode: (value: boolean)=> void;
  setPlaying: (value: boolean)=> void;
  getSelectedPosition: (value: number)=> void;
}

export const useMainStore = create((set)=>({
    movies: [],
    series: [],
    selectedShow: null,
    selectedPosition: -1,
    showType: "series",
    playUrl: null,
    openSeason: false,
    openEpisode: false,
    playing: false,
  getMovies: (newMovie: any)=> set({movies: newMovie}),

  editMovies: (position: number, newTvProgramme: any)=> set((state: any) => {
      const updatedMovies = [...state.movies]; // 1. Copy array
      updatedMovies[position] = newTvProgramme; // 2. Modify index
      return { movies: updatedMovies };       // 3. Return update
    }),

  getSeries: (newSeires: any)=> set({ series: newSeires}),

  editSeries: (position: number, newTvProgramme: any)=>set((state: any) => {
      const updateSeries = [...state.series]; // 1. Copy array
      updateSeries[position] = newTvProgramme; // 2. Modify index
      return { series: updateSeries };       // 3. Return update
    }),
  set_selected_show: (newShow: any, type_of_show: string)=> set({selectedShow: newShow, showType: type_of_show}),
  getSelectedPosition: (newPosistion: number)=> set({selectedPosition: newPosistion}),
  setUrl: (newUrl: string)=> set({playUrl: newUrl}),
  openCloseSeason: (open: boolean)=> set({openSeason: open}),
  openCloseEpisode: (open: boolean)=> set({openEpisode: open}),
  setPlaying: (position: boolean)=> set({playing: position}),

}))
