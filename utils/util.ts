import { useMainStore } from "../stateManagement/store";

export function showPosition(tvProgramme: any){
    const currentMovies = (useMainStore.getState() as { movies: any }).movies;
    const currentSeries = (useMainStore.getState() as { series: any }).series;
    return currentMovies.indexOf(tvProgramme) == -1 ? currentSeries.indexOf(tvProgramme) : currentMovies.indexOf(tvProgramme)
}