import { useEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import { Colors } from "./Colors";

export const useTheme = () => {

    const systemScheme = useColorScheme();
    const [scheme, setScheme] = useState(systemScheme);

    useEffect(() => {
        // 2. Listen to active, manual runtime overrides
        const subscription = Appearance.addChangeListener((preferences) => {
            setScheme(preferences.colorScheme);
        });

        return () => subscription.remove();
    }, []);

    return scheme === "dark" ? Colors.dark : Colors.light
}