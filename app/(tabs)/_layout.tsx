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
import { useAuth } from "@clerk/expo";

export default function TabLayout() {
  const { isSignedIn } = useAuth();
  const imagesDownloaded = useMainStore((state: any)=> state.imagesDownloaded)

  return (
    <>
      <SearchComponent />

      <Tabs
        screenOptions={{
          headerShown: false,
          // main bar
          tabBarStyle: {
            position: "absolute",
            bottom: 10,
            left: "5%",
            right: "5%",
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            borderRadius: 10,
            width: 400,
            height: 60,
            margin: 10,
          },

          tabBarActiveTintColor: "cyan",
          tabBarAllowFontScaling: true,
          // tabBarActiveBackgroundColor: "94BAF4",
          tabBarInactiveTintColor: "white",

          tabBarItemStyle: {
            backgroundColor: "rgba(0, 60, 80, 0.8)",
            height: 57,
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
                  },
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
                disabled={!imagesDownloaded}
                style={[
                  props.style,
                  {
                    borderRadius: 50,
                    width: 60,
                  },
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
                disabled={!imagesDownloaded}
                style={[
                  props.style,
                  {
                    borderRadius: 50,
                    width: 60,
                  },
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
                disabled={!isSignedIn || !imagesDownloaded}
                style={[
                  props.style,
                  {
                    borderRadius: 50,
                    width: 50,
                  },
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
