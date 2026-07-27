import { View, Text } from "react-native";
import ShowList from "./show-list";
import { useEffect, useState } from "react";
import { userStore } from "@/stateManagement/userStore";
import { lickedModal } from "@/Content/listContent";
import { ClockIcon, HeartIcon, ForwardIcon } from "react-native-heroicons/solid";

export default function ListContainer() {
  // store states here
  const likedShows = userStore((state: any) => state.userLiked);
  const ContinueList = userStore((state: any) => state.continueWatching);
  const History = userStore((state: any) => state.watchHistory);

  const [modalOpen, setModal] = useState(false);
  const [moviesList, setMovieList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [history, setHistory] = useState([]);
  const [continueList, setContinueList] = useState([]);

  useEffect(() => {
    setMovieList(likedShows.userMovies);
    setSeriesList(likedShows.userSeries);

    setHistory(History);
    setContinueList(ContinueList);
  }, [likedShows, ContinueList, History]);

  return (
    <View className="relative w-full p-2">
      <lickedModal.Provider value={{ modalOpen, setModal }}>
        <ShowList ActionIcon={HeartIcon} listName="Movies" listArray={moviesList} />
        <ShowList ActionIcon={HeartIcon} listName="Series" listArray={seriesList} />

        <ShowList ActionIcon={ClockIcon} listName="Watch History" listArray={history} />
        <ShowList ActionIcon={ForwardIcon} listName="Continue to Watch" listArray={continueList} />
      </lickedModal.Provider>
    </View>
  );
}
