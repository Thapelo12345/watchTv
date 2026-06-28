import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { search } from "@/utils/util";
import { useMainStore } from "@/stateManagement/store";

export default function SearchComponent() {
  const pathname = usePathname();

  const mainUrl = useMainStore((state: any)=> state.baseUrl)

  const addSeriesItem = useMainStore((state: any) => state.addSeries);
  const switchOnlineSearch = useMainStore(
    (state: any) => state.setOnlineSearch,
  );

  const [hide, setHide] = useState(true);
  const [searchText, setSearhText] = useState("");

  function resetInput() {
    setSearhText("");
  }

  useEffect(() => {
    if (pathname == "/" && !hide) setHide(true);
    else if (hide && pathname !== "/") setHide(false);
    if (searchText !== "") resetInput();
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
          switchOnlineSearch();
          //TODO: still gave to create movies online search
          const response = await fetch(`${mainUrl}/search-series`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Title: searchText }),
          });

          if (!response.ok) {
            Alert.alert("WEB RESPONSE", "FAILED TO GET DATA!...", [
              { text: "OK", onPress: () => switchOnlineSearch() },
            ]);
            return
          }

          const data = await response.json();
          if (data.message == "Falied to get SERIES!.") {
            Alert.alert("ONLINE RESPONSE", data.message.toUpperCase(), [{text: "OK", onPress: ()=> switchOnlineSearch()}])
            return
          }

          const newerShows = data.newShows;
          newerShows.forEach((show: any) => addSeriesItem(show));
          search(searchText, pathname === "/series" ? "series" : "movies");
          switchOnlineSearch()
        }}
      >
        <Text className="text-white">Find online</Text>
      </Pressable>
    </View>
  );
}
