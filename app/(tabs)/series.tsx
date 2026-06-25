import { View, Text, FlatList } from "react-native"
import SeriesContainer from "@/components/seriesContainer";
import { useMainStore } from "@/stateManagement/store";
import { useEffect } from "react";

export default function Series(){
  const series = useMainStore((state: any)=> state.series)

    return(
        <View>
            <Text className="pageHeaders">Series Page</Text>
            <FlatList 
            key={3}
            contentContainerClassName="pb-20"
            numColumns={3}
            data={series}
            renderItem={({item}) => (
              <View className="w-[33%]">
            <SeriesContainer 
            program={item}
            title={item.seriesHeader}  
            seriesYear={Number(item.seriesYear)} 
            rate={item.seriesRating} 
            imageUrl={item.seriesImageUrl} />
            </View>
          )}
            keyExtractor={item => item._id}
            />
        </View>
    )
}