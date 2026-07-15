import { View, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useMainStore } from "@/stateManagement/store";
import { useEffect, useState, useRef } from "react";
import MediaInfo from "./ui/mediaInf";

export default function MediaScreen() {
  const movies = useMainStore((state: any) => state.movies);
  const series = useMainStore((state: any) => state.series);

  const allProgramms: any = useRef([]);
  const [newShow, setNewShow] = useState(null);

  const gettingImage = (programme: any) =>
    programme.movieImageUrl
      ? programme.movieImageUrl
      : programme.seriesImageUrl;
  const gettingHeader = (programme: any) =>
    programme.seriesHeader ? programme.seriesHeader : programme.movieHeader;
  const gettingGenres = (programme: any) =>
    programme.seriesGenres ? programme.seriesGenres : programme.movieGenres;

  async function downloadingImages(programmes: any) {
    const allImageUrls = programmes.map((programme: any) =>
      !programme.seriesImageUrl
        ? programme.movieImageUrl
        : programme.seriesImageUrl,
    );
    try {
      await Image.prefetch(allImageUrls);
    } catch (err: unknown) {
      console.log(
        err instanceof Error ? err.message : "Unkown image url's error!.",
      );
    }
  } //end of downloading images function

  useEffect(() => {
    if (movies.length !== 0 && series.length !== 0) {
      // reserting the array so i dont have duplicates
      allProgramms.current = [...movies, ...series];
      downloadingImages(allProgramms.current);

      const slideCounter = setInterval(() => {
        const randomNumber =
          Math.floor(Math.random() * allProgramms.current.length) + 1;
        setNewShow(allProgramms.current[randomNumber]);
      }, 7500);

      return () => clearInterval(slideCounter);
    }
  }, [movies, series]);

  return (
    <View className="flex-1 items-center justify-center relative w-full h-115 -z-20 overflow-hidden">
      {!newShow ? (
        <ActivityIndicator size="large" color="royalblue" />
      ) : (
        <Image
          className="absolute inset-0 bg-red-400"
          style={{ width: 425, height: 400 }}
          source={{ uri: gettingImage(newShow) }}
          accessibilityLabel="Current Show  image"
          transition={550}
          contentFit="fill"
          cachePolicy="disk"
        />
      )}

      {!newShow ? (
        <ActivityIndicator size="large" color="royalblue" />
      ) : (
        <MediaInfo
          showHeader={gettingHeader(newShow)}
          genres={gettingGenres(newShow)}
          show={newShow}
        />
      )}
    </View>
  );
}
