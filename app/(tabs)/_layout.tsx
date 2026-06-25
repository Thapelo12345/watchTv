import { Tabs } from "expo-router";
import {
  HomeIcon,
  TvIcon,
  FilmIcon,
  Cog6ToothIcon,
} from "react-native-heroicons/solid";
import SearchComponent from "@/components/searchComponent";
import { useMainStore } from "@/stateManagement/store";
import { useEffect } from "react";

const iconSize = 20
export default function TabLayout() {
  const getMovies = useMainStore((state: any) => state.getMovies);
  const getSeries = useMainStore((state: any) => state.getSeries);

  const moviesUrl = "http://192.168.18.7:5000/movies",
    seriesUrl = "http://192.168.18.7:5000/series";

  const getShows = async (showUrl: string) => {
    try {
      const response = await fetch(showUrl, { method: "GET" });

      if (response.status !== 200) {
        alert("Failed to get data from server!.");
        return [];
      }

      // 2. FIXED: Added 'await' before response.json()
      const showData: any = await response.json();
      return showData.data;
    } catch (error) {
      console.error("Network Fetch Error: ", error);
      return [];
    }
  }; //end of fetching show

  useEffect(() => {
    const loadData = async () => {
      const moviesData = await getShows(moviesUrl);
      const seriesData = await getShows(seriesUrl);

      getMovies(moviesData);
      getSeries(seriesData);
    };

    loadData();
  }, []);

  return (
    <>
      <SearchComponent />

      <Tabs
        screenOptions={{
          headerShown: false,

          // main bar
          tabBarStyle: {
            backgroundColor: "white",
            boxShadow: "1px 7px 8px white, 1px 2px 5.5px black, -1px -7px 8px white",
            // margin: 20,
            borderRadius: 10,
            width: 400,
            height: 60,
            marginBottom: 10,
            marginHorizontal: 10,
            // padding: 50,
          },

          tabBarItemStyle: {
            paddingTop: -5,
            // borderWidth: 1,
            // borderColor: "whitesmoke",
            // borderRadius: 20,
            width: 10,
            height: 50,
            // overflow: "hidden"
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <HomeIcon color={color} size={18} />
            ),
          }}
        />

        <Tabs.Screen
          name="series"
          options={{
            title: "Series",
            tabBarIcon: ({ color, size }) => (
              <TvIcon color={color} size={18} />
            ),
          }}
        />

        <Tabs.Screen
          name="movies"
          options={{
            title: "Movies",
            tabBarIcon: ({ color, size }) => (
              <FilmIcon color={color} size={18} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Cog6ToothIcon color={color} size={18} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
