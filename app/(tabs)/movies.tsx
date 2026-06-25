import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { router } from 'expo-router';
import MovieContainer from "@/components/movieContainer"
import { useMainStore } from "@/stateManagement/store";
import { useEffect } from "react";

export default function Movies(){
  const movies = useMainStore((state: any)=> state.movies)

    return(
    <View>
        <Text className="pageHeaders">Movies Page</Text>

        <FlatList 
            key={3}
            contentContainerClassName="pb-20"
            numColumns={3}
            data={movies}
            renderItem={({item}) => (
              <View className="w-[30%] m-2">
           
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