import { Text, Pressable, View, ActivityIndicator, Alert } from "react-native";
import DropDown from "./dropDown";
import { PlusIcon } from "react-native-heroicons/solid";
import { useMainStore } from "@/stateManagement/store";
import "../global.css";
import { useEffect, useState } from "react";

type PROPS = {
  showTitle: string;
  selectedSeason: string;
  selectedEpisode: string;
  seasonsEpisode: any[];
  pendingSeasons: boolean;
  addingSeaon: boolean;
  setaddingSeason: (value: boolean) => void;
  setSeason: (value: string) => void;
  setEpisode: (value: string) => void;
};

export default function SelectComponent({
  showTitle,
  selectedSeason,
  selectedEpisode,
  seasonsEpisode,
  pendingSeasons,
  addingSeaon,
  setaddingSeason,
  setSeason,
  setEpisode,
}: PROPS) {


  const baseUrl = useMainStore((state: any)=> state.baseUrl)
  const addToMainSeries = useMainStore((state: any)=> state.addSeasonToSeries)
  const addToSelected = useMainStore((state: any)=> state.addSeasonToSelected)

  const allSeasons = seasonsEpisode.map(
    (currentSeason) => currentSeason.season,
  );

  const [openSeasonDropDown, setSeasonDropDown] = useState(false)
  const [openEpisodeDropDown, setEpisodeDropDown] = useState(false)

  const [allEpisode, setAllEpisode] = useState<string[]>([]);

  useEffect(() => {
    const activeSeason = seasonsEpisode.find((season) => season.season == selectedSeason);
    const episodeArray = activeSeason.episodes.map((episode: any) => episode.name,);
    setAllEpisode(episodeArray);

  }, [selectedSeason]);

  return (
    <View className="flex flex-col items-center justify-center mt-2">
      <View className="flex flex-row items-center justify-evenly mt-2">
      <View>

        {/* This is the main season select button */}
        <Pressable className="series-btn" onPress={() => {
          if(addingSeaon) return
         setSeasonDropDown(!openSeasonDropDown)
         if(openEpisodeDropDown) setEpisodeDropDown(false)
          }}>
          <Text className="selected">{selectedSeason}</Text>
        </Pressable>

        <DropDown
          open={openSeasonDropDown}
          list={allSeasons}
          closeDropDown={setSeasonDropDown}
          setSelected={setSeason}
        />
      </View>

      <View>
        <Pressable className="series-btn" onPress={() => {
          if(addingSeaon) return
          setEpisodeDropDown(!openEpisodeDropDown)
          if(openSeasonDropDown) setSeasonDropDown(false)
          }}>
          <Text className="selected">{selectedEpisode}</Text>
        </Pressable>

        <DropDown
          open={openEpisodeDropDown}
          list={allEpisode}
          closeDropDown={setEpisodeDropDown}
          setSelected={setEpisode}
        />
      </View>
      </View>

      {
        pendingSeasons &&
      (
        addingSeaon ?
        (<ActivityIndicator size="large" color="white" /> ) :
        (
        <Pressable
        onPress={async ()=>{
        setaddingSeason(true)

        const response = await fetch(`${baseUrl}/add-season`, {
          method:"POST",
          headers: {"Content-Type": "application/json" },
          body: JSON.stringify({Title: showTitle })
        })

        if(!response.ok){
          Alert.alert("BROBLEM WITH THE SERVER", "failed to connect with server!...", [
              { text: "OK", onPress: () => setaddingSeason(false) },
            ]);
            return
        }

        const seasonData = await response.json()
        if(seasonData.message == "Failed to add season!.."){
           Alert.alert("SEARCH RESULTS", "could get the next season!...", [
              { text: "OK", onPress: () => setaddingSeason(false) },
            ]);
            return
        }

        // this adds the new season to the main series array
        addToMainSeries(showTitle, seasonData.Season)

        // this adds the season only to selected show that is on the show info page
        addToSelected(seasonData.Season)

        setSeason(seasonData.Season.season)
        setaddingSeason(false)

          }}
        >
        <View className="border-2 border-white px-4 p-1 rounded-lg m-2 my-4 flex flex-row gap-1.5">
          <PlusIcon color="white" size={20}/>
          <Text className="text-white text-lg"> Get Next Season</Text>
        </View>
      </Pressable>
    ))}
    </View>
  );
}
