import { Text, View } from "react-native";
import { useTheme } from "@/constants/myTheme";
import { useEffect } from "react";
import Animated, { useSharedValue, withTiming, Easing, withDelay, withRepeat, useAnimatedStyle, withSequence } from 'react-native-reanimated';

export default function TextAnimation(){
    const theme = useTheme()
    const animatedWidth= useSharedValue(275);

   useEffect(() => {
    animatedWidth.value = withRepeat(
      withSequence(
        // 1. Shrink down to 10 smoothly (No delay before this)
        withTiming(10, {
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
        }),
        // 2. Expand back to 290 immediately without pausing at 10
        withTiming(290, {
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
        }),
        // 3. Pause for 1 second ONLY after reaching 290 before restarting
        withDelay(1000, withTiming(290, { duration: 0 }))
      ),
      -1,   // Repeat indefinitely
      false // Do not auto-reverse, since our sequence handles the directions
    );
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    width: animatedWidth.value,
  }));

    return(

        <View className="pl-2 pb-2 pt-2 mt-10 w-90">
        <Animated.View 
        className={`border-r-4 -pr-2 overflow-hidden`}
        style={[
    animatedStyles, 
    { borderRightColor: theme.slidBorderColor }
  ]}
        >
            <Text
            className="font-lobster text-[35px] -z-10 shrink-0"
            numberOfLines={1}
            style={{
                color: "white",
                textShadowColor: "black",
                textShadowOffset: { width: 2, height: 2},
                textShadowRadius: 1,
                width: 290,
                minWidth: 290,
                }}
               
            >Searching the WEB!...</Text>
</Animated.View>
 </View>
    )
}