import { View, ImageBackground, ActivityIndicator } from "react-native";
import { useMainStore } from "@/stateManagement/store";
import { useEffect, useState, useRef } from "react";
import MediaInfo from "./ui/mediaInf";

type DISPLAY = {
  header: string;
  year: string;
  genres: string[];
  imageUrl: string;
}

export default function MediaScreen() {
  const movies = useMainStore((state: any) => state.movies);
  const series = useMainStore((state: any) => state.series);

  const [oldShow, setOldShow] = useState<DISPLAY | null>(null);
  const [newShow, setNewShow] = useState<DISPLAY | null>(null);
  const [submitShow , setSubmitShow] = useState({})

  const [showsRecieved, setShowRecieved] = useState(false);
  // false = showing old show on screen, true = currently preloading next show
  const [isPreloading, setIsPreloading] = useState(false);

  // Keep a mutable tracking ref to avoid React stale closure bugs inside the interval
  const isReadyToChange = useRef(true);

  function settingDisplay(allShow: any) {
    const showToDisplay = allShow[Math.floor(Math.random() * allShow.length)];
    setSubmitShow(showToDisplay)
    return {
      header: showToDisplay.movieHeader || showToDisplay.seriesHeader,
      year: showToDisplay.movieYear || showToDisplay.seriesYear,
      genres: showToDisplay.movieGenres || showToDisplay.seriesGenres,
      imageUrl: showToDisplay.movieImageUrl || showToDisplay.seriesImageUrl,
    };
  }

  useEffect(() => {
    if (movies.length !== 0 && series.length !== 0) {
      const combineShows = [...movies, ...series];
      
      // Set initial show right away
      const initial = settingDisplay(combineShows);
      setOldShow(initial);
      setSubmitShow(initial)
      setShowRecieved(true);

      const delay = setInterval(() => {
        // Use the mutable ref to check if the last background image finished downloading
        if (isReadyToChange.current) {
          const nextSelected = settingDisplay(combineShows);
          
          setNewShow(nextSelected);
          setIsPreloading(true);
          isReadyToChange.current = false; // Block next updates until this image loads
        }
      }, 7000);

      return () => clearInterval(delay);
    }
  }, [movies, series]);

  return (
    <View className="relative w-full h-95">
      {!showsRecieved || !oldShow ? (
        <ActivityIndicator className="m-auto" color="blue" size="large" />
      ) : (
        <View style={{ width: "100%", height: "100%" }}>
          
          {/* THE MAIN VISIBLE SCREEN (Always shows the last fully downloaded show) */}
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={{ uri: oldShow.imageUrl }}
            defaultSource={require("../assets/images/icon.png")}
            accessibilityLabel="Official poster for the show"
            resizeMode="cover"
          >
            <MediaInfo showHeader={oldShow.header ?? ""} genres={oldShow.genres} show={submitShow}/>
          </ImageBackground>

          {/* THE HIDDEN PRELOADER (Downloads the incoming new image silently behind the scenes) */}
          {isPreloading && newShow && (
            <ImageBackground
              source={{ uri: newShow.imageUrl }}
              style={{ width: 0, height: 0, position: "absolute" }}
              onLoadEnd={() => {
                setOldShow(newShow);            // Pull downloaded image to main display
                setIsPreloading(false);         // Stop preloading
                isReadyToChange.current = true; // Unlock the interval for the next cycle
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}
