import { View, Text, FlatList } from "react-native"
import React from "react";
import MovieContainer from "@/components/movieContainer"
import { useMainStore } from "@/stateManagement/store";
import { OnlineLoader } from "@/components/onlineLoader";
import { usePathname } from 'expo-router';
import { useEffect } from "react";

// 1. Create a memoized item component outside the main function
const MovieItem = React.memo(({ item }: { item: any }) => {
  return (
   <View 
    key={item._id}
    className="w-auto m-2">
    <MovieContainer
    program={item}
    title={item.movieHeader}  
    movieYear={Number(item.movieYear)} 
    rate={item.movieRating} 
    imageUrl={item.movieImageUrl} />
    </View>
  );
});


export default function Movies(){

  const renderItem = React.useCallback(({ item }: any) => (
    <MovieItem item={item} />
  ), []);
  
  const movies = useMainStore((state: any)=> state.movies)

  const switchSearch = useMainStore((state: any)=> state.setSearching)
  const searchOn = useMainStore((state: any)=> state.searching)
  const searchedMovies = useMainStore((state: any)=> state.searchResults);

  const pathname = usePathname()

  useEffect(()=> {
    if(searchOn && pathname !== "/movies") switchSearch()
  }, [pathname])

    return(
    <View className="page-containers">
        <Text 
        className="pageHeaders"
        >Movies</Text>

        <FlatList 
            key={3}
            contentContainerClassName="pb-20"
            numColumns={3}
            initialNumToRender={9}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            data={(pathname == "/movies" && searchOn) ? searchedMovies : movies}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            />
    </View>
)
}