import { Text, Pressable, View } from "react-native";
import DropDown from "./dropDown";
import { useMainStore } from "@/stateManagement/store";
import "../global.css";
import { useEffect, useState } from "react";

type PROPS = {
  selectedSeason: string;
  selectedEpisode: string;
  seasonsEpisode: any[];
  setSeason: (value: string) => void;
  setEpisode: (value: string) => void;
};

export default function SelectComponent({
  selectedSeason,
  selectedEpisode,
  seasonsEpisode,
  setSeason,
  setEpisode,
}: PROPS) {

const dropSeason = useMainStore((state:any)=> state.openSeason),
       dropEpisode = useMainStore((state: any)=> state.openEpisode)

  const openSeason = useMainStore((state: any) => state.openCloseSeason),
   openEpisode = useMainStore((state: any) => state.openCloseEpisode);

  const allSeasons: string[] = seasonsEpisode.map((currentSeason) => currentSeason.season);
  const [allEpisode, setAllEpisode] = useState<string[]>([])

  useEffect(()=>{
    const activeSeason = seasonsEpisode.find((season)=> season.season == selectedSeason)
    const episodeArray = activeSeason.episodes.map((episode: any)=> episode.name)
    setAllEpisode(episodeArray)
  }, [])

  return (
    <View className="flex flex-row items-center justify-evenly mt-10">
      <View>
        <Pressable
          className="series-btn"
          onPress={() => openSeason(true)}
        >
          <Text>{selectedSeason}</Text>
        </Pressable>

        <DropDown showType="season" open={dropSeason} list={allSeasons} setSelected={setSeason} />
      </View>

      <View>
        <Pressable 
        className="series-btn"
        onPress={() => openEpisode(true)}
        >
          <Text>{selectedEpisode}</Text>
        </Pressable> 

        <DropDown showType="episode" open={dropEpisode} list={allEpisode} setSelected={setEpisode} />

      </View>
    </View>
  );
}
