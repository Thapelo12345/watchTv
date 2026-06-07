import { Tabs } from "expo-router";
import { HomeIcon, TvIcon, FilmIcon, Cog6ToothIcon } from "react-native-heroicons/solid"

export default function TabLayout() {

  return (
  <Tabs screenOptions={{ 
    headerShown: false,
  
    // main bar 
    tabBarStyle:{
      backgroundColor: "whitesmoke",
      margin: 20,
      borderRadius: 10,
      padding: 50,
      height: 70
    },

    tabBarItemStyle:{},
    }}>

    <Tabs.Screen name="index" options={{
      title: "Home",
      tabBarIcon: ({color, size})=> <HomeIcon color={color} size={size} />
      }} />
    
    <Tabs.Screen name="series" options={{
      title: "Series",
      tabBarIcon: ({ color, size})=> <TvIcon color={color} size={size} />
      }} />

    <Tabs.Screen name="movies" options={{
      title: "Movies",
      tabBarIcon: ({color, size})=> <FilmIcon color={color} size={size} />
      }} />

    <Tabs.Screen name="settings" options={{
      title: "Settings",
      tabBarIcon: ({ color, size})=> <Cog6ToothIcon color={color} size={size} />
      }} />

  </Tabs>
  );
}
