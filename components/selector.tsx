import { Text, Pressable, View } from "react-native";
import DropDown from "./dropDown";
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


  const allSeasons: string[] = seasonsEpisode.map(
    (currentSeason) => currentSeason.season,
  );

  const [openSeasonDropDown, setSeasonDropDown] = useState(false)
  const [openEpisodeDropDown, setEpisodeDropDown] = useState(false)

  const [allEpisode, setAllEpisode] = useState<string[]>([]);

  useEffect(() => {
    const activeSeason = seasonsEpisode.find(
      (season) => season.season == selectedSeason,
    );
    const episodeArray = activeSeason.episodes.map(
      (episode: any) => episode.name,
    );
    setAllEpisode(episodeArray);
  }, []);

  return (
    <View className="flex flex-row items-center justify-evenly mt-2">
      <View>
        <Pressable className="series-btn" onPress={() => {
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
  );
}
