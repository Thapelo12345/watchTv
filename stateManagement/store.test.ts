import { useMainStore } from "./store";

describe("useMainStore", () => {
  beforeEach(() => {
    useMainStore.setState({
      movies: [],
      latestMovies: [],
      series: [],
      latestSeries: [],
      searchResults: [],
      searching: false,
      onlineSearch: false,
      playUrl: null,
      playing: false,
    });
  });

  it("adds and edits movies without changing the original list", () => {
    const movie = { movieHeader: "Arrival", movieYear: "2016" };

    useMainStore.getState().addMovie(movie);
    expect(useMainStore.getState().movies).toEqual([movie]);

    const updatedMovie = { ...movie, movieYear: "2017" };
    useMainStore.getState().editMovies(0, updatedMovie);

    expect(useMainStore.getState().movies).toEqual([updatedMovie]);
  });

  it("adds a show to search results and removes it by id", () => {
    const show = { _id: "show-1", movieHeader: "Arrival" };

    useMainStore.getState().addSearchResults(show);
    expect(useMainStore.getState().searchResults).toEqual([show]);

    useMainStore.getState().removeSearchResults({ _id: "show-1" });
    expect(useMainStore.getState().searchResults).toEqual([]);
  });

  it("toggles search state and stores playback state", () => {
    useMainStore.getState().setSearching();
    useMainStore.getState().setOnlineSearch();
    useMainStore.getState().setUrl("https://video.test/play.m3u8");
    useMainStore.getState().setPlaying(true);

    expect(useMainStore.getState()).toMatchObject({
      searching: true,
      onlineSearch: true,
      playUrl: "https://video.test/play.m3u8",
      playing: true,
    });
  });
});
