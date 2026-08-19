import { create } from "zustand";

type SEASON = { season: string; episode: string; };

type STORETYPES = {
  baseUrl: string;
  movies: any[];
  latestMovies: any[];
  series: any[];
  latestSeries: any[];
  selectedShow: { programme: any; programmeType: string | null };
  selectedPosition: number;
  showType: string;
  playUrl: string | null;
  playing: boolean;
  searchResults: any[];
  searching: boolean;
  onlineSearch: boolean;
  appLoading: boolean;
  imagesDownloaded: boolean;
  playingProgramme: {
    programmeName: string | null;
    programmeSeason?: SEASON | null;
  };
  appUpdating: boolean;
  appUpdateMessage: string | null;
  setAppUpdate: (value: boolean) => void;
  setAppUpdateMessage: (value: string) => void;
  setPlayingProgramme: (value: { programmeName: string; programmeSeason?: SEASON }) => void;
  setImageDownloaded: (value: boolean) => void;
  getMovies: (value: any) => void;
  addMovie: (value: any) => void;
  addLatestMovie: (value: any) => void;
  editMovies: (pos: number, newObj: any) => void;
  getSeries: (value: any) => void;
  addSeries: (value: any) => void;
  addLatestSeries: (value: any) => void;
  addSeasonToSeries: (title: string, newSeason: any) => void;
  editSeries: (pos: number, newObj: any) => void;
  set_selected_show: (value1: any, value2: string) => void;
  setUrl: (value: string) => void;
  setPlaying: (value: boolean) => void; // Fixed parameter definition
  getSelectedPosition: (value: number) => void;
  addSearchResults: (value: any) => void;
  removeSearchResults: (value: any) => void;
  clearSearchResults: () => void;
  setSearching: () => void;
  setOnlineSearch: () => void;
  switchAppLoding: () => void;
  setUserStatus: (newStatus: string) => void; 
};

// Applied STORETYPES to enforce strict compile-time checks
export const useMainStore = create<STORETYPES>((set) => ({
  // baseUrl: "http://192.168.18.7:5000",
  baseUrl: "https://neststream-server.onrender.com",
  movies: [],
  latestMovies: [],
  series: [],
  latestSeries: [],
  selectedShow: { programme: null, programmeType: null },
  selectedPosition: -1,
  showType: "series",
  playUrl: null,
  playing: false,
  searchResults: [],
  searching: false,
  onlineSearch: false,
  appLoading: false,
  imagesDownloaded: false,
  playingProgramme: { programmeName: null, programmeSeason: null },
  appUpdating: false,
  appUpdateMessage: null,
  
  setAppUpdate: (validate) => set({ appUpdating: validate }),
  setAppUpdateMessage: (message) => set({ appUpdateMessage: message }),
  setPlayingProgramme: (validValue) => set({ playingProgramme: validValue }),
  setImageDownloaded: (validValue) => set({ imagesDownloaded: validValue }),
  getMovies: (newMovie) => set({ movies: newMovie }),
  addMovie: (newMovie) =>
    set((state) => ({ movies: [...state.movies, newMovie] })),
  addLatestMovie: (newMovie) =>
    set({ latestMovies: newMovie }),
  editMovies: (position, newTvProgramme) =>
    set((state) => {
      const updatedMovies = [...state.movies];
      updatedMovies[position] = newTvProgramme;
      return { movies: updatedMovies };
    }),

  getSeries: (newSeries) => set({ series: newSeries }),
  addSeries: (newSeries) =>
    set((state) => ({ series: [...state.series, newSeries] })),
  addLatestSeries: (newSeries) => set({ latestSeries: newSeries }),
  editSeries: (position, newTvProgramme) =>
    set((state) => {
      const updateSeries = [...state.series];
      updateSeries[position] = newTvProgramme;
      return { series: updateSeries };
    }),
    
  // FIXED: Removed direct object mutations and missing return bugs
  addSeasonToSeries: (title, newSeason) =>
    set((state) => ({
      series: state.series.map((show) => {
        if (show.seriesHeader === title) {
          return {
            ...show,
            seriesSeasons: [...(show.seriesSeasons || []), newSeason],
            pendingSeasons: (show.pendingSeasons || []).slice(1),
          };
        }
        return show;
      }),
    })),
    
  set_selected_show: (newShow, type_of_show) =>
    set(() => ({
      selectedShow: {
        programme: newShow,
        programmeType: type_of_show,
      },
    })),
  
  getSelectedPosition: (newPosition) =>
    set({ selectedPosition: newPosition }),
  setUrl: (newUrl) => set({ playUrl: newUrl }),
  
  // FIXED: Correctly tracking the parameter mapping payload to state values
  setPlaying: (isPlaying) => set({ playing: isPlaying }),
  
  setSearching: () => set((state) => ({ searching: !state.searching })),
  setOnlineSearch: () => set((state) => ({ onlineSearch: !state.onlineSearch })),
  addSearchResults: (newResults) =>
    set((state) => ({
      searchResults: [...state.searchResults, newResults],
    })),
  removeSearchResults: (oldResults) =>
    set((state) => ({
      searchResults: state.searchResults.filter(
        (item) => item._id !== oldResults._id,
      ),
    })),
  clearSearchResults: () => set({ searchResults: [] }),
  setUserStatus: (newStatus) => set({ userStatus: newStatus } as any),
  switchAppLoding: () => set((state) => ({ appLoading: !state.appLoading })),
}));