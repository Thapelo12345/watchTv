import { View, Text, Image} from "react-native"

type PROPS ={
    title: string;
    seriesYear: number;
    rate:number;
    imageUrl: string;
}
export default function SeriesContainer({title, seriesYear, rate, imageUrl }: PROPS){
    return(
        <View className="border boder-blue-500 rounded-lg m-2 w-fit">
            <Image
            className="w-full h-40"
             source={{uri: imageUrl}} />

            <View className="mx-2">
                <Text 
                numberOfLines={1} 
                className="truncate">{title}</Text>
                <Text>{rate}</Text>
                <Text>{seriesYear}</Text>
            </View>
        </View>
    )
}