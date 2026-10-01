import React from "react";
import { Alert, BackHandler, Pressable, TextInput } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

const mockMainState = {
  baseUrl: "http://localhost:5000",
  movies: [],
  series: [],
  latestMovies: [],
  latestSeries: [],
  playing: false,
  imagesDownloaded: true,
  appUpdating: false,
  appUpdateMessage: "",
  showInfoLocked: false,
  setImageDownloaded: jest.fn(),
  setAppUpdate: jest.fn(),
  setAppUpdateMessage: jest.fn(),
  setShowInfoLocked: jest.fn(),
  addSeasonToSeries: jest.fn(),
  set_selected_show: jest.fn(),
  getSelectedPosition: jest.fn(),
};

const mockUserState = {
  userId: "user-1",
  userName: "Alex",
  profilePicture: {
    imageId: "old-id",
    imageUrl: "https://example.com/avatar.jpg",
  },
  userInitialized: true,
  userTheme: "light",
  userActive: true,
  userLiked: { userSeries: [], userMovies: [] },
  setUserTheme: jest.fn(),
  setUserActive: jest.fn(),
  setUserName: jest.fn(),
  setUserNewImage: jest.fn(),
  initializeUser: jest.fn(),
};

function mockCreateStoreHook(state: Record<string, unknown>) {
  const hook = ((selector?: (value: typeof state) => unknown) =>
    selector ? selector(state) : state) as jest.Mock;
  hook.getState = () => state;
  return hook;
}

jest.mock("@/stateManagement/store", () => ({
  useMainStore: mockCreateStoreHook(mockMainState),
}));
jest.mock("@/stateManagement/userStore", () => ({
  userStore: mockCreateStoreHook(mockUserState),
}));
jest.mock("@/constants/myTheme", () => ({
  useTheme: () => ({
    text: "#111111",
    cardBackground: "#ffffff",
    cardShadow: "none",
    settingsShadow: "none",
  }),
}));
jest.mock("expo-image", () => ({
  Image: (props: Record<string, unknown>) =>
    require("react").createElement("Image", props),
}));
jest.mock("expo-blur", () => ({
  BlurView: (props: Record<string, unknown>) =>
    require("react").createElement("View", props),
}));
jest.mock(
  "react-native-linear-gradient",
  () => (props: Record<string, unknown>) =>
    require("react").createElement("View", props),
);
jest.mock("@animatereactnative/marquee", () => ({
  Marquee: (props: Record<string, unknown>) =>
    require("react").createElement("View", props),
}));
jest.mock("react-native-heroicons/solid", () => ({
  UserCircleIcon: () =>
    require("react").createElement("Text", null, "user icon"),
  StarIcon: () => require("react").createElement("Text", null, "star icon"),
  XCircleIcon: () => require("react").createElement("Text", null, "close icon"),
  ClockIcon: () => require("react").createElement("Text", null, "clock icon"),
  HeartIcon: () => require("react").createElement("Text", null, "heart icon"),
  ForwardIcon: () =>
    require("react").createElement("Text", null, "forward icon"),
  PlusIcon: () => require("react").createElement("Text", null, "plus icon"),
  TrashIcon: () => require("react").createElement("Text", null, "trash icon"),
  PlayIcon: () => require("react").createElement("Text", null, "play icon"),
  MagnifyingGlassIcon: () =>
    require("react").createElement("Text", null, "search icon"),
}));
jest.mock("react-native-heroicons/outline", () => ({
  SunIcon: () => require("react").createElement("Text", null, "sun icon"),
  MoonIcon: () => require("react").createElement("Text", null, "moon icon"),
}));
jest.mock("expo-router", () => ({
  router: { navigate: jest.fn() },
  usePathname: () => "/",
  Link: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid"),
}));
jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  default: "Animated",
  Easing: { linear: jest.fn() },
  useSharedValue: (value: unknown) => ({ value }),
  useAnimatedStyle: () => ({}),
  withTiming: (value: unknown) => value,
  withDelay: (_delay: number, value: unknown) => value,
  withRepeat: (value: unknown) => value,
  withSequence: (...values: unknown[]) => values[0],
}));
jest.mock("@/utils/auth-utils", () => ({
  getCloudUser: jest.fn(),
  getAllProgrammes: jest.fn().mockResolvedValue(undefined),
  getLatestProgrames: jest.fn(),
  getNewShows: jest.fn(),
  seriesLatestUpdates: jest.fn(),
}));
jest.mock("@/utils/search-utils", () => ({
  search: jest.fn().mockReturnValue([]),
  onlineSearch: jest.fn().mockResolvedValue(undefined),
  showPosition: jest.fn().mockReturnValue(0),
}));
jest.mock("@/utils/media-utils", () => ({
  addRemoveLikedProgramme: jest.fn().mockResolvedValue("update done"),
}));
jest.mock("@/utils/list-items-utils", () => ({
  deleteItem: jest.fn().mockResolvedValue("deleted"),
  openShow: jest.fn(),
}));
jest.mock("@/utils/update-utils", () => ({
  getImageLocation: jest.fn().mockResolvedValue(""),
  updateUserName: jest.fn().mockResolvedValue(undefined),
  updateAvatar: jest.fn().mockResolvedValue(null),
}));
jest.mock("@/utils/superbase-utils", () => ({ facebookLogin: jest.fn() }));
jest.mock("@/lib/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    },
  },
}));
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock("react-native-exit-app", () => ({ exitApp: jest.fn() }));
jest.mock("expo-auth-session", () => ({
  makeRedirectUri: jest.fn(() => "watchtv://redirect"),
}));
jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
  },
}));

import Auth from "./authComponent";
import CastCard from "./castCard";
import CastSection from "./castSection";
import DropDown from "./dropDown";
import ImageUpdate from "./imageUpdate";
import ListContainer from "./list-container";
import MarqeeComponent from "./marqee";
import MediaScreen from "./mediaPlayer";
import MovieContainer from "./movieContainer";
import { OnlineLoader } from "./onlineLoader";
import SearchComponent from "./searchComponent";
import SelectComponent from "./selector";
import SeriesContainer from "./seriesContainer";
import ShowList from "./show-list";
import SuperBaseAuth from "./superBaseAuth";
import UpdateUserInfor from "./UserInfoUpdate";
import UpdateComponent from "./updateComponent";
import FormInput from "./ui/formInput";
import ListItem from "./ui/list-item";
import MediaInfo from "./ui/mediaInf";
import TextAnimation from "./ui/textAnimation";
import ThemeToggle from "./ui/themeToogle";
import ViewShows from "./ui/userView";

const program = { title: "Sample Show", seriesHeader: "Sample Show" };
const selectProps = {
  showTitle: "Sample Show",
  selectedSeason: "1",
  selectedEpisode: "Episode 1",
  seasonsEpisode: [{ season: "1", episodes: [{ name: "Episode 1" }] }],
  pendingSeasons: false,
  addingSeaon: false,
  setaddingSeason: jest.fn(),
  setSeason: jest.fn(),
  setEpisode: jest.fn(),
};

afterEach(() => {
  jest.clearAllMocks();
  mockMainState.appUpdating = false;
  mockUserState.userActive = true;
});

describe("components", () => {
  it("renders the authentication component", () => {
    expect(render(<Auth />).toJSON()).toBeTruthy();
  });

  it("renders cast components", () => {
    const card = render(
      <CastCard actorName="Actor" imageUrl="actor.jpg" character="Hero" />,
    );
    expect(card.getByText("Actor")).toBeTruthy();
    expect(
      render(
        <CastSection
          castArray={[
            { actorName: "Actor", imageUrl: "actor.jpg", character: "Hero" },
          ]}
        />,
      ).getByText("Actor"),
    ).toBeTruthy();
  });

  it("selects a dropdown item", () => {
    const close = jest.fn();
    const select = jest.fn();
    const view = render(
      <DropDown
        open
        list={["One"]}
        closeDropDown={close}
        setSelected={select}
      />,
    );
    fireEvent.press(view.getByText("One"));
    expect(select).toHaveBeenCalledWith("One");
    expect(close).toHaveBeenCalledWith(false);
  });

  it("renders image and update components", () => {
    expect(
      render(<ImageUpdate inputUrl="https://example.com/image.jpg" />).toJSON(),
    ).toBeTruthy();
    expect(render(<UpdateUserInfor />).getByText("Update")).toBeTruthy();
  });

  it("renders list containers and opens a show list", () => {
    expect(render(<ListContainer />).toJSON()).toBeTruthy();
    const view = render(
      <ShowList
        ActionIcon={() => <Text>action</Text>}
        listName="Favorites"
        listArray={["Sample Show"]}
      />,
    );
    fireEvent.press(view.getByText("Favorites"));
    expect(view.getByText("Sample Show")).toBeTruthy();
  });

  it("renders marquee and media player", () => {
    expect(
      render(
        <MarqeeComponent
          linkText="Movies"
          urlLink="/movies"
          direction={1}
          imagesArray={[{ id: "1", imageUrl: "movie.jpg" }]}
        />,
      ).getByText("Movies"),
    ).toBeTruthy();
    expect(render(<MediaScreen />).toJSON()).toBeTruthy();
  });

  it("selects a movie and series", () => {
    const movie = render(
      <MovieContainer
        program={program}
        title="Movie"
        movieYear={2026}
        rate={8}
        imageUrl="movie.jpg"
      />,
    );
    fireEvent.press(movie.getByText("Movie"));
    const series = render(
      <SeriesContainer
        program={program}
        title="Series"
        seriesYear={2026}
        rate={8}
        imageUrl="series.jpg"
      />,
    );
    fireEvent.press(series.getByText("Series"));
    expect(mockMainState.set_selected_show).toHaveBeenCalled();
  });

  it("renders the online loader and search component", () => {
    expect(render(<OnlineLoader />).toJSON()).toBeTruthy();
    expect(render(<SearchComponent />).toJSON()).toBeTruthy();
  });

  it("renders the selector and supports season controls", () => {
    const view = render(<SelectComponent {...selectProps} />);
    fireEvent.press(view.getByText("1"));
    expect(view.getByText("Episode 1")).toBeTruthy();
  });

  it("renders the authentication, update, and form controls", () => {
    expect(render(<SuperBaseAuth />).toJSON()).toBeTruthy();
    mockMainState.appUpdating = true;
    expect(render(<UpdateComponent />).getByText("Update")).toBeTruthy();
    const sendUserName = jest.fn();
    const input = render(
      <FormInput
        label="Name"
        defaultValue="Alex"
        sendUserName={sendUserName}
      />,
    ).UNSAFE_getByType(TextInput);
    fireEvent.changeText(input, "Taylor");
    expect(sendUserName).toHaveBeenCalledWith("Taylor");
  });

  it("renders list item and opens media info", async () => {
    const setLoading = jest.fn();
    const item = render(
      <ListItem
        itemName="Sample Show"
        mainList="Favorites"
        setmodal1={jest.fn()}
        setModal2={jest.fn()}
        setLoading={setLoading}
      />,
    );
    fireEvent.press(item.getByText("Sample Show"));
    expect(setLoading).toHaveBeenCalledWith(true);

    const info = render(
      <MediaInfo
        folder="movies"
        showHeader="Sample Show"
        genres={["Drama"]}
        show={program}
      />,
    );
    fireEvent.press(info.getByText("Play"));
    await waitFor(() => expect(info.getByText("My List")).toBeTruthy());
  });

  it("renders animation, theme, and view controls", () => {
    expect(render(<TextAnimation />).getByText("Searching...")).toBeTruthy();
    expect(render(<ThemeToggle />).toJSON()).toBeTruthy();
    expect(render(<ViewShows />).toJSON()).toBeTruthy();
  });
});
