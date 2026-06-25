import { Text, View, TextInput, TouchableOpacity} from "react-native"
import { MagnifyingGlassIcon } from "react-native-heroicons/solid"

export default function SearchComponent(){

    return(
        <View className="search-container">

        <MagnifyingGlassIcon color="black" size={20} />
        <TextInput
          className="search-input"
          onChangeText={()=>{}}
          value="Serach for a tv show"
        />

        <TouchableOpacity
        className="search-btn"
        onPress={()=>{}}>
          <Text>Search</Text>
        </TouchableOpacity>

        </View>
    )
}