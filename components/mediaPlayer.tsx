import { View, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useMainStore } from "@/stateManagement/store";
import { userStore } from "@/stateManagement/userStore";
import { useEffect, useState, useRef } from "react";
import MediaInfo from "./ui/mediaInf";

export default function MediaScreen() {
  // store state
  const movies = useMainStore((state: any) => state.latestMovies);
  const series = useMainStore((state: any) => state.latestSeries);
  const imagesDownloaded = useMainStore((state: any) => state.imagesDownloaded);

  const allProgramms: any = useRef([]);
  const saveTo = useRef("");

  const [oldShow, setOldShow] = useState(null);

  const gettingImage = (programme: any) =>
    programme.movieImageUrl
      ? programme.movieImageUrl
      : programme.seriesImageUrl;
  const gettingHeader = (programme: any) =>
    programme.seriesHeader ? programme.seriesHeader : programme.movieHeader;
  const gettingGenres = (programme: any) =>
    programme.seriesGenres ? programme.seriesGenres : programme.movieGenres;

  useEffect(() => {
    if (movies.length !== 0 || series.length !== 0) {
      allProgramms.current = [...movies, ...series].filter(Boolean);
      if (allProgramms.current.length === 0) return;

      const firstShow = allProgramms.current[0];
      saveTo.current =
        firstShow.seriesSeasons === undefined ? "movies" : "series";
      setOldShow(firstShow);

      const slideCounter = setInterval(async () => {
        const randomNumber = Math.floor(
          Math.random() * allProgramms.current.length,
        );

        const tempHolder = allProgramms.current[randomNumber];
        tempHolder.seriesSeasons === undefined
          ? (saveTo.current = "movies")
          : (saveTo.current = "series");

        setOldShow(tempHolder);
      }, 8500);

      return () => clearInterval(slideCounter);
    }
    allProgramms.current = [];
    setOldShow(null);
  }, [movies, series]);

  return (
    <View className="flex-1 items-center justify-center relative w-full h-115 -z-20 overflow-hidden">
      {!oldShow || !imagesDownloaded ? (
        <ActivityIndicator size="large" color="royalblue" />
      ) : (
        <Image
          className="absolute inset-0 bg-red-400"
          style={{ width: 425, height: 400 }}
          source={{ uri: gettingImage(oldShow) || undefined }}
          accessibilityLabel="Current Show image"
          transition={550}
          contentFit="fill"
        />
      )}

      {oldShow && (
        <MediaInfo
          folder={saveTo.current}
          showHeader={gettingHeader(oldShow)}
          genres={gettingGenres(oldShow)}
          show={oldShow}
        />
      )}
    </View>
  );
}
