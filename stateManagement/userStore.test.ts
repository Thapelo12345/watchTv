import { userStore } from "./userStore";

type TestUserState = {
  userId: string | null;
  userName: string | null;
  userLiked: { userSeries: string[]; userMovies: string[] };
  continueWatching: { programmeName: string }[];
  watchHistory: string[];
  userPrefferedGenres: string[];
  userInitialized: boolean;
  initializeUser: (value: any) => void;
  addLikedMovies: (value: string) => void;
  addLikedSeries: (value: string) => void;
  removeLikedMovies: (value: string) => void;
  removeLikedSeries: (value: string) => void;
  addWatchedShow: (value: string) => void;
  addUnfinishedShow: (value: { programmeName: string }) => void;
  removeWatchShow: (value: string) => void;
  removeUnfinishedShow: (value: string) => void;
};

const getUserState = () => userStore.getState() as TestUserState;

describe("userStore", () => {
  beforeEach(() => {
    userStore.setState({
      userId: null,
      userName: null,
      userLiked: { userSeries: [], userMovies: [] },
      continueWatching: [],
      watchHistory: [],
      userPrefferedGenres: [],
      userInitialized: false,
    });
  });

  it("initializes profile data while preserving nested defaults", () => {
    getUserState().initializeUser({
      userId: "user-1",
      userName: "Viewer",
      userLiked: { userMovies: ["Arrival"] },
    });

    expect(getUserState()).toMatchObject({
      userId: "user-1",
      userName: "Viewer",
      userLiked: { userMovies: ["Arrival"], userSeries: [] },
    });
  });

  it("adds and removes liked shows by type", () => {
    getUserState().addLikedMovies("Arrival");
    getUserState().addLikedSeries("Severance");
    getUserState().removeLikedMovies("Arrival");
    getUserState().removeLikedSeries(" Severance ");

    expect(getUserState().userLiked).toEqual({
      userMovies: [],
      userSeries: [],
    });
  });

  it("tracks and removes watched and unfinished shows", () => {
    getUserState().addWatchedShow("Arrival");
    getUserState().addUnfinishedShow({ programmeName: "Severance" });

    getUserState().removeWatchShow("Arrival");
    getUserState().removeUnfinishedShow("Severance");

    expect(getUserState().watchHistory).toEqual([]);
    expect(getUserState().continueWatching).toEqual([]);
  });
});
