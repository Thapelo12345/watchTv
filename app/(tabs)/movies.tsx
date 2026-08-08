import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import MovieContainer from "@/components/movieContainer";
import { useMainStore } from "@/stateManagement/store";
import { OnlineLoader } from "@/components/onlineLoader";
import { usePathname } from "expo-router";
import { useEffect, useState, useRef } from "react";
import ViewShows from "@/components/ui/userView";
import { userStore } from "@/stateManagement/userStore";
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from "@/constants/myTheme";

// 1. Create a memoized item component outside the main function
const MovieItem = React.memo(({ item }: { item: any }) => {
  return (
    <View key={item._id} className="w-auto m-2">
      <MovieContainer
        program={item}
        title={item.movieHeader}
        movieYear={Number(item.movieYear)}
        rate={item.movieRating}
        imageUrl={item.movieImageUrl}
      />
    </View>
  );
});

export default function Movies() {

  const theme = useTheme()

  const extractedlikedShows = useRef([])
  const [displayShows, setDisplayShows] = useState([])

  const renderItem = React.useCallback(
    ({ item }: any) => <MovieItem item={item} />,
    [],
  );

  const movies = useMainStore((state: any) => state.movies);
  const likedMoviesNames = userStore(useShallow((state: any) => state.userLiked.userMovies));
  const onView = userStore((state: any)=> state.userPrefferendView)

  const onlineSearchOn = useMainStore((state: any) => state.onlineSearch);

  const switchSearch = useMainStore((state: any) => state.setSearching);
  const searchOn = useMainStore((state: any) => state.searching);
  const searchedMovies = useMainStore((state: any) => state.searchResults);

  const pathname = usePathname();

  useEffect(() => {
    if (searchOn && pathname !== "/movies") switchSearch();
  }, [pathname]);

  useEffect(()=>{extractedlikedShows.current = movies.filter((movie: any)=> likedMoviesNames.includes(movie.movieHeader))}, [likedMoviesNames])
  
  useEffect(()=>{
    onView === "all" ?
    setDisplayShows(movies) :
    setDisplayShows(extractedlikedShows.current)
  }, [onView])

  return (
    <View className="page-containers">
      <Text className="pageHeaders">Movies</Text>
      <ViewShows />

      {onlineSearchOn ? (
        <OnlineLoader />
      ) : 
      
      displayShows.length !== 0 ?
      (
        <FlatList
          key={3}
          contentContainerClassName="pb-20"
          numColumns={3}
          initialNumToRender={9}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          data={pathname == "/movies" && searchOn ? searchedMovies : displayShows}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      ) :
      (<Text
      className="mt-50"
      style={{color: theme.text}}
      >
        No user Data
      </Text>)
    
    }
    </View>
  );
}
