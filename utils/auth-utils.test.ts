import { extractUserInfo } from "./auth-utils";

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
