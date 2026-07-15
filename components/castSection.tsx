import { View, Text } from "react-native";
import CastCard from "./castCard";
import { v4 as uuidv4 } from "uuid";

type PROPS = {castArray: any[]}

export default function CastSection({ castArray }: PROPS){
 return(
    <View>
        <Text className="text-center font-lobster text-green-500 text-4xl m-2">
          Cast
        </Text>
        <View className="w-full mb-15 flex flex-row flex-wrap items-start justify-evenly">
          {castArray.map((actor: any) => (
            <CastCard
              key={uuidv4()}
              actorName={actor.actorRealName}
              imageUrl={actor.actorImage}
              character={actor.actorCharacter}
            />
          ))}
        </View>
    </View>
 )
}