import { extractUserInfo, sortMoviesByReleaseDate } from "./auth-utils";

describe("extractUserInfo", () => {
  it("keeps the user fields used by the client", () => {
    const user = {
      userId: "user-1",
      profilePicture: {
        imageId: "image-1",
        imageUrl: "https://image.test/avatar",
      },
      email: "viewer@example.com",
      userName: "Viewer",
      joinedDate: "2026-01-01",
      paymentMethod: "card",
      daysLeft: 30,
      accountCanceled: "false",
      continueWatching: [{ programmeName: "A Show" }],
      userLiked: { userSeries: ["A Series"], userMovies: ["A Movie"] },
      watchHistory: ["A Show"],
      userStatus: "active",
      userPrefferedGenres: ["Drama"],
      ignoredServerField: "should not be returned",
    };

    expect(extractUserInfo(user)).toEqual({
      userId: "user-1",
      profilePicture: user.profilePicture,
      email: "viewer@example.com",
      userName: "Viewer",
      joinedDate: "2026-01-01",
      paymentMethod: "card",
      daysLeft: 30,
      accountCanceled: "false",
      continueWatching: user.continueWatching,
      userLiked: user.userLiked,
      watchHistory: ["A Show"],
      userStatus: "active",
      userPrefferedGenres: ["Drama"],
    });
  });

  it("preserves missing optional server values as undefined", () => {
    expect(extractUserInfo({ userId: "user-2" })).toMatchObject({
      userId: "user-2",
      email: undefined,
      userLiked: undefined,
    });
  });
});

describe("sortMoviesByReleaseDate", () => {
  it("sorts by year, month, and day from releaseDate", () => {
    const movies = [
      {
        movieHeader: "February",
        movieYear: "2020",
        releaseDate: "10 Feb 2020",
      },
      { movieHeader: "January", movieYear: "2020", releaseDate: "20 Jan 2020" },
      {
        movieHeader: "Later year",
        movieYear: "2021",
        releaseDate: "1 Mar 2021",
      },
    ];

    expect(
      sortMoviesByReleaseDate(movies).map((movie) => movie.movieHeader),
    ).toEqual(["Later year", "February", "January"]);
  });

  it("sorts DD-MM-YYYY release dates chronologically", () => {
    const movies = [
      { movieHeader: "January", movieYear: "2020", releaseDate: "20-01-2020" },
      { movieHeader: "February", movieYear: "2020", releaseDate: "05-02-2020" },
      { movieHeader: "Later year", movieYear: "2021", releaseDate: "01-03-2021" },
    ];

    expect(
      sortMoviesByReleaseDate(movies).map((movie) => movie.movieHeader),
    ).toEqual(["Later year", "February", "January"]);
  });

  it("uses movieYear when releaseDate is missing", () => {
    const movies = [
      { movieHeader: "Older", movieYear: "2019", releaseDate: null },
      { movieHeader: "Newer", movieYear: "2021", releaseDate: null },
      { movieHeader: "Released", movieYear: "2018", releaseDate: "5 May 2020" },
    ];

    expect(
      sortMoviesByReleaseDate(movies).map((movie) => movie.movieHeader),
    ).toEqual(["Newer", "Released", "Older"]);
  });
});
