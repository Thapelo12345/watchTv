import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { search } from "@/utils/util";
import { useMainStore } from "@/stateManagement/store";

export default function SearchComponent() {
  const pathname = usePathname();

  const mainUrl = useMainStore((state: any)=> state.baseUrl)

  const movies = useMainStore((state: any)=> state.movies)
  const series = useMainStore((state: any)=> state.series)
  const CloudSearch = useMainStore((state: any)=> state.onlineSearch)
  const searchResult = useMainStore((state: any)=> state.searchResults)

  const addSeriesItem = useMainStore((state: any) => state.addSeries);
  const addMovieItem = useMainStore((state: any)=> state.addMovie)
  const addToSearchResults = useMainStore((state: any)=> state.addSearchResults)
  const emptySearchResults = useMainStore((state: any)=> state.clearSearchResults)

  const switchOnlineSearch = useMainStore((state: any) => state.setOnlineSearch,);

  const [hide, setHide] = useState(true);
  const [searchText, setSearhText] = useState("");

  function resetInput() {setSearhText("");}

  useEffect(() => {
    if (pathname == "/" && !hide) setHide(true);
    else if (hide && pathname !== "/") setHide(false);
    if (searchText !== "") resetInput();

    if(searchResult.length !== 0) emptySearchResults();
  }, [pathname]);

  return (
    <View
      className={`search-container ${hide ? "hidden" : "visible"} bg-white h-13 rounded-2xl flex flex-row items-center justify-evenly m-2 px-2 py-0`}
    >
      <MagnifyingGlassIcon color="black" size={20} />
      <TextInput
        className="search-input"
        value={searchText}
        onChangeText={(text) => {
          setSearhText(text);
          search(text, pathname === "/series" ? "series" : "movies");
        }}
        placeholder="Serach for a tv show"
      />

      <Pressable
        className="bg-[skyblue] p-2 rounded-md shadow-2xl"
        onPress={async () => {

          // if already seatching cancel function
          if(CloudSearch || searchText == "") return;

          const typeOfShow = pathname === "/series" ? "series" : "movies"

          const doIhaveTheShow = ()=>{
            let getShow: any = undefined;

            // searching both array's if the show exist locally
              if(typeOfShow === "series"){getShow = series.find((Series: any)=> Series.seriesHeader.trim().toLowerCase() === searchText.trim().toLowerCase())}
              else{getShow = movies.find((Movie: any)=> Movie.movieHeader.trim().toLowerCase() === searchText.trim().toLowerCase())}
              return getShow !== undefined
          }
          
          // test if the show exist locally
          if(doIhaveTheShow()) return
            
          // switching on the online search mode to show the loader
          switchOnlineSearch()

          const response = await fetch(`${mainUrl}/find-show`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Title: searchText, showType: typeOfShow }),
          });

          if (!response.ok) {
            Alert.alert("BROBLEM WITH THE SERVER", "failed to connect with server!...", [
              // clicking ok will turn off the online search mode and hide the loader
              { text: "OK", onPress: () => switchOnlineSearch()},
            ]);
            return
          }

          const data = await response.json();
          if (data.message == "Failed to find show!..") {
            Alert.alert("ONLINE RESPONSE", data.message.toUpperCase(), [{text: "OK", onPress: ()=> switchOnlineSearch()
            }])
            return
          }

          const newerShow = data.showData;

          // here i am just adding the new found series or movie to the main arrays
          typeOfShow === "series" ? addSeriesItem(newerShow) : addMovieItem(newerShow);

          console.log("Calling search after receiving the new show from the server !.")
           addToSearchResults(newerShow)
          //  switching off the online search mode to hide the loader
          switchOnlineSearch()
        }}
      >
        <Text className="text-white">Find online</Text>
      </Pressable>
    </View>
  );
}
