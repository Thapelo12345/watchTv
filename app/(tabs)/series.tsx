import { View, Text, FlatList } from "react-native";
import React from "react";
import SeriesContainer from "@/components/seriesContainer";
import { OnlineLoader } from "@/components/onlineLoader";
import { useMainStore } from "@/stateManagement/store";
import { usePathname } from 'expo-router';
import { useEffect, useState, useRef } from "react";
import ViewShows from "@/components/ui/userView";
import { userStore } from "@/stateManagement/userStore";
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from "@/constants/myTheme";

// 1. Create a memoized item component outside the main function
const SeriesItem = React.memo(({ item }: { item: any }) => {
  return (
    <View 
      key={item._id}
      className="w-auto m-2">
      <SeriesContainer
      program={item}
      title={item.seriesHeader}
      seriesYear={Number(item.seriesYear)}
      rate={item.seriesRating}
      imageUrl={item.seriesImageUrl}
  />

</View>
  );
});

export default function Series() {

  const theme = useTheme()
  
  const extractLikedShows = useRef([])
  const [displayShows, setDisplayShow] = useState([])

  const renderItem = React.useCallback(({ item }: any) => (
      <SeriesItem item={item} />
    ), []);
    
  const series = useMainStore((state: any) => state.series);
  const likedSeriesNames = userStore(useShallow((state: any) => state.userLiked.userSeries));
  const onView = userStore((state: any)=> state.userPrefferendView)
  
  const switchSearch = useMainStore((state: any)=> state.setSearching)

  const searchOn = useMainStore((state: any)=> state.searching)
  const onlineSearchOn = useMainStore((state: any)=> state.onlineSearch)

  const searchedSeries = useMainStore((state: any)=> state.searchResults);
  const pathname = usePathname()

  useEffect(()=> {
    if(searchOn && pathname !== "/series") switchSearch()
  }, [pathname])

  useEffect(()=>{extractLikedShows.current = series.filter((series: any)=> likedSeriesNames.includes(series.seriesHeader))
  },[likedSeriesNames])

  useEffect(()=>{
    onView === "all" ? 
    setDisplayShow(series) :
    setDisplayShow(extractLikedShows.current)
  }, [onView])

  return (
    <View className="page-containers">
      <Text className="pageHeaders font-lobster">Series</Text>
      <ViewShows />

      {
       onlineSearchOn ?
       (<OnlineLoader />) :

       displayShows.length !== 0 ?
      (<FlatList
        key={3}
        contentContainerClassName="pb-20"
        numColumns={3}
        initialNumToRender={9}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        data={(pathname == "/series" && searchOn) ? searchedSeries : displayShows}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />) :
      (

      <Text
      className="mt-50"
      style={{color: theme.text}}
      >No user Data</Text>)
    
    }
    </View>
  );
}
