import { Text, View, ActivityIndicator, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import MarqeeComponent from "@/components/marqee";
import { useMainStore } from "@/stateManagement/store";
import MediaScreen from "@/components/mediaPlayer";

export default function Home() {
  
  // store solid states here
  const movies = useMainStore((state: any) => state.latestMovies);
  const series = useMainStore((state: any) => state.latestSeries);
  const imagesDownloaded = useMainStore((state: any)=> state.imagesDownloaded)

  const [seriesImages, setSeriesImages] = useState<{ id: string; imageUrl: string }[]>([]);
  const [moviesImages, setMoviesImages] = useState< { id: string; imageUrl: string }[]>([]);

  // getting mongodb data
  useEffect(() => {
    if(movies.length !== 0) {
      setSeriesImages(
        series.map((show: any) => {
          return { id: show._id, imageUrl: show.seriesImageUrl };
        }),
      );
    }

    if(series.length !== 0) {
      setMoviesImages(
        movies.map((movie: any) => {
          return { id: movie._id, imageUrl: movie.movieImageUrl };
        }),
      );
    }
    
  }, [movies, series]);

  return (
    <View className="page-containers">
      <Text className="pageHeaders">Home</Text>
      <ScrollView nestedScrollEnabled={false}>
        <MediaScreen />
        {series.length === 0 ? (
          <View className="image-loader">
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          imagesDownloaded &&
          <MarqeeComponent
            linkText="Series"
            urlLink="/(tabs)/series"
            direction={0.5}
            imagesArray={seriesImages}
          />
        )}
        {movies.length === 0 ? (
          <View className="image-loader">
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (imagesDownloaded &&
          <MarqeeComponent
            linkText="Movies"
            urlLink="/(tabs)/movies"
            direction={-0.5}
            imagesArray={moviesImages}
          />
        )}
      </ScrollView>
    </View>
  );
}
