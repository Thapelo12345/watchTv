import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import {
  HomeIcon,
  TvIcon,
  FilmIcon,
  Cog6ToothIcon,
} from "react-native-heroicons/solid";
import SearchComponent from "@/components/searchComponent";
import { useMainStore } from "@/stateManagement/store";
import { useEffect } from "react";

export default function TabLayout() {
  const getMovies = useMainStore((state: any) => state.getMovies);
  const getSeries = useMainStore((state: any) => state.getSeries);
  const mainUrl = useMainStore((state: any)=> state.baseUrl)
  
  const moviesUrl = `${mainUrl}/movies`,
    seriesUrl = `${mainUrl}/series`;

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
            boxShadow: "inset 2px 2px 8px whitesmoke, inset -2px -2px 8px whitesmoke, 1px 7px 8px white, 1px 2px 5.5px black, -1px -7px 8px white,",
            borderRadius: 10,
            width: 400,
            height: 60,
            margin: 10,
            overflow: "hidden"
          },

          tabBarActiveTintColor:"white",
          tabBarAllowFontScaling: true,
          
          tabBarActiveBackgroundColor: "skyblue",

          tabBarItemStyle: {
            backgroundColor: "white",
            height: 60,

          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <HomeIcon color={color} size={focused ? 17 : 15} />
            ),

            tabBarButton: (props: any) => (
      <TouchableOpacity
        {...props}
        style={[
          props.style, 
          {
            borderRadius: 50,
            width: 60,
            overflow: 'hidden',
          }
        ]}
        activeOpacity={0.7}
      />
    ),
          }}
        />

        <Tabs.Screen
          name="series"
          options={{
            title: "Series",
            tabBarIcon: ({ color, size, focused }) => (
              <TvIcon color={color} size={focused ? 17 : 15} />
            ),
            tabBarButton: (props: any) => (
      <TouchableOpacity
        {...props}
        style={[
          props.style, 
          {
            borderRadius: 50,
            width: 60,
            overflow: 'hidden',
          }
        ]}
        activeOpacity={0.7}
      />
    ),
          }}
        />

        <Tabs.Screen
          name="movies"
          options={{
            title: "Movies",
            tabBarIcon: ({ color, size, focused }) => (
              <FilmIcon color={color} size={focused ? 17 : 15} />
            ),
            tabBarButton: (props: any) => (
      <TouchableOpacity
        {...props}
        style={[
          props.style, 
          {
            borderRadius: 50,
            width: 60,
            overflow: 'hidden',
          }
        ]}
        activeOpacity={0.7}
      />
    ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size, focused }) => (
              <Cog6ToothIcon color={color} size={focused ? 17 : 15} />
            ),
            tabBarButton: (props: any) => (
      <TouchableOpacity
        {...props}
        style={[
          props.style, 
          {
            borderRadius: 50,
            width: 60,
            overflow: 'hidden',
          }
        ]}
        activeOpacity={0.7}
      />
    ),
          }}
        />
      </Tabs>
    </>
  );
}
