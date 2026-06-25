import { Text, View, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import MarqeeComponent from "@/components/marqee";
import { useMainStore } from "@/stateManagement/store";

export default function Home() {
  const movies = useMainStore((state: any) => state.movies);
  const series = useMainStore((state: any)=> state.series)

  const [seriesImages, setSeriesImages] = useState<
    { id: string; imageUrl: string }[]
  >([]);

  const [moviesImages, setMoviesImages] = useState<
    { id: string; imageUrl: string }[]
  >([]);

  // page url notification
  
  // getting mongodb data
  useEffect(()=>{
    setSeriesImages(
      series.map((show: any)=> {return {id: show._id, imageUrl: show.seriesImageUrl}})
    )

    setMoviesImages(
      movies.map((movie: any)=>{return {id: movie._id, imageUrl: movie.movieImageUrl}})
    )
  }, [movies, series])


  return (
    <View className="flex flex-col items-center justify-evenly">
      <Text className="pageHeaders">Home Page</Text>

      {
      series.length === 0 ?
      <ActivityIndicator size="large" color="#00ff00" />
      : <MarqeeComponent
        linkText="Series"
        urlLink="/(tabs)/series"
        direction={0.5}
        imagesArray={seriesImages}
      /> 
      
    }
      {movies.length === 0 ?
      <ActivityIndicator size="large" color="#0000ff" />
       : <MarqeeComponent
        linkText="Movies"
        urlLink="/(tabs)/movies"
        direction={-0.5}
        imagesArray={moviesImages}
      />
       
    }
    </View>
  );
}
