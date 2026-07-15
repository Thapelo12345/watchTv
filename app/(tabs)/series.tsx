import { View, Text, FlatList } from "react-native";
import React from "react";
import SeriesContainer from "@/components/seriesContainer";
import { OnlineLoader } from "@/components/onlineLoader";
import { useMainStore } from "@/stateManagement/store";
import { usePathname } from 'expo-router';
import { useEffect } from "react";

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

  const renderItem = React.useCallback(({ item }: any) => (
      <SeriesItem item={item} />
    ), []);
    
  const series = useMainStore((state: any) => state.series);
  
  const switchSearch = useMainStore((state: any)=> state.setSearching)

  const searchOn = useMainStore((state: any)=> state.searching)
  const onlineSearchOn = useMainStore((state: any)=> state.onlineSearch)

  const searchedSeries = useMainStore((state: any)=> state.searchResults);
  const pathname = usePathname()

  useEffect(()=> {
    if(searchOn && pathname !== "/series") switchSearch()
  }, [pathname])

  return (
    <View className="page-containers">
      <Text
        className="pageHeaders font-lobster"
      >
        Series
      </Text>

      {
       onlineSearchOn ?
       (<OnlineLoader />) :

      (<FlatList
        key={3}
        contentContainerClassName="pb-20"
        numColumns={3}
        initialNumToRender={9}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        data={(pathname == "/series" && searchOn) ? searchedSeries : series}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />)}
    </View>
  );
}
