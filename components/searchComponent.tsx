import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { search, onlineSearch } from "@/utils/search-utils";
import { useMainStore } from "@/stateManagement/store";

export default function SearchComponent() {
  const pathname = usePathname();

  const searchResult = useMainStore((state: any) => state.searchResults);
  const emptySearchResults = useMainStore((state: any) => state.clearSearchResults);

  const [hide, setHide] = useState(true);
  const [searchText, setSearhText] = useState("");

  function resetInput() {setSearhText("");}

  useEffect(() => {
    if (pathname == "/" && !hide) setHide(true);
    else if (hide && pathname !== "/") setHide(false);
    if (searchText !== "") resetInput();

    if (searchResult.length !== 0) emptySearchResults();
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
          const typeOfShow = pathname === "/series" ? "series" : "movies";
          onlineSearch(typeOfShow, searchText)
        }}
      >
        <Text className="text-white">Find online</Text>
      </Pressable>
    </View>
  );
}
