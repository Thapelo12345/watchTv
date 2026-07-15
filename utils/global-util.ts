import { Alert } from "react-native";

export function Notify(typeOfMessage: string, message: string, variableTochange?:(value?: any)=> void ){
     Alert.alert(typeOfMessage, message,
    [{ text: "OK", onPress: () => variableTochange }],
        );
}//end of notify