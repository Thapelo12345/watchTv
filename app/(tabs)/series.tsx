import { View, Text, FlatList } from "react-native";
import SeriesContainer from "@/components/seriesContainer";
import { OnlineLoader } from "@/components/onlineLoader";
import { useMainStore } from "@/stateManagement/store";
import { usePathname } from 'expo-router';
import { useEffect } from "react";

export default function Series() {
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
        data={(pathname == "/series" && searchOn) ? searchedSeries : series}
        renderItem={({ item }) => (
          <View className="w-auto m-2">
            <SeriesContainer
              program={item}
              title={item.seriesHeader}
              seriesYear={Number(item.seriesYear)}
              rate={item.seriesRating}
              imageUrl={item.seriesImageUrl}
            />

          </View>
        )}
        keyExtractor={(item) => item._id}
      />)}
    </View>
  );
}
