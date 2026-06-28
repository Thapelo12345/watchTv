import { View, Text, FlatList } from "react-native"
import MovieContainer from "@/components/movieContainer"
import { useMainStore } from "@/stateManagement/store";
import { OnlineLoader } from "@/components/onlineLoader";
import { usePathname } from 'expo-router';
import { useEffect } from "react";

export default function Movies(){
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
            data={(pathname == "/movies" && searchOn) ? searchedMovies : movies}
            renderItem={({item}) => (
              <View className="w-auto m-2">
           
            <MovieContainer
            program={item}
            title={item.movieHeader}  
            movieYear={Number(item.movieYear)} 
            rate={item.movieRating} 
            imageUrl={item.movieImageUrl} />
            </View>
          )}
            keyExtractor={item => item._id}
            />
    </View>
)
}