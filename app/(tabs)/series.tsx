import { View, Text, FlatList } from "react-native"
import SeriesContainer from "@/components/seriesContainer";

const series = [
  {
    id: "1",
    header: "Breaking Bad",
    year: 2008,
    rating: 9.5,
    image: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg"
  },
  {
    id: "2",
    header: "Game of Thrones",
    year: 2011,
    rating: 9.2,
    image: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg"
  },
  {
    id: "3",
    header: "Stranger Things",
    year: 2016,
    rating: 8.7,
    image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg"
  },
  {
    id: "4",
    header: "The Walking Dead",
    year: 2010,
    rating: 8.1,
    image: "https://image.tmdb.org/t/p/w500/reKs8y4mPwPkZG99ZpbKRhBPKsX.jpg"
  },
  {
    id: "5",
    header: "The Last of Us",
    year: 2023,
    rating: 8.8,
    image: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg"
  },
  {
    id: "6",
    header: "The Boys",
    year: 2019,
    rating: 8.7,
    image: "https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg"
  },
  {
    id: "7",
    header: "Wednesday",
    year: 2022,
    rating: 8.1,
    image: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg"
  },
  {
    id: "8",
    header: "Dark",
    year: 2017,
    rating: 8.7,
    image: "https://image.tmdb.org/t/p/w500/5LoHuHWA4H8jElFlZDvsmU2n63b.jpg"
  },
  {
    id: "9",
    header: "Peaky Blinders",
    year: 2013,
    rating: 8.8,
    image: "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg"
  },
  {
    id: "10",
    header: "The Witcher",
    year: 2019,
    rating: 8.0,
    image: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg"
  },
  {
    id: "11",
    header: "Narcos",
    year: 2015,
    rating: 8.8,
    image: "https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg"
  },
  {
    id: "12",
    header: "House of the Dragon",
    year: 2022,
    rating: 8.4,
    image: "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg"
  },
  {
    id: "13",
    header: "Money Heist",
    year: 2017,
    rating: 8.2,
    image: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg"
  },
  {
    id: "14",
    header: "Loki",
    year: 2021,
    rating: 8.2,
    image: "https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg"
  },
  {
    id: "15",
    header: "Sherlock",
    year: 2010,
    rating: 9.1,
    image: "https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg"
  }
];

export default function Series(){
    return(
        <View>
            <Text className="pageHeaders">Series Page</Text>
            <FlatList 
            key={3}
            contentContainerClassName="pb-10"
            numColumns={3}
            data={series}
            renderItem={({item}) => (
              <View className="flex-1 p-1">
            <SeriesContainer 
            title={item.header}  
            seriesYear={item.year} 
            rate={item.rating} 
            imageUrl={item.image} />
            </View>
          )}
            keyExtractor={item => item.id}
            />
        </View>
    )
}