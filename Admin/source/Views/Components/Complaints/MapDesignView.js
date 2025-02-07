import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';

import { Colors } from '../../Common/Colors';
const MapDesignView = props => {
  const [activeSections, setActiveSections] = React.useState([]);
 
  

 
  

  
  return (
    <View style={{flex:1}}>
 <View style={styles.parent}>
          <View style={styles.child1}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Ionicons
                name={'md-arrow-back-sharp'}
                size={33}
                color={Colors.orange_295CBF}
                style={{padding: 10}}
              />
            </TouchableOpacity>
          </View>
        </View>
<MapView style={{width:"100%",height:"100%"}}
    initialRegion={{
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  />
    </View>
  );
};

export default MapDesignView;

const styles = StyleSheet.create({
 
  mapView: {
  width:200,
  height:400
  },
  parent: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
  },
  title1_child1: {
    flex: 2,
    alignItems: 'flex-start',
  },
  child: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  child1: {
    flex: 1,
    justifyContent: 'center',
  },
});
