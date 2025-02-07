import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Colors} from '../../../Common/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Zocial from 'react-native-vector-icons/Zocial';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Linking} from 'react-native';
const DPList = props => {
  const [activeSections, setActiveSections] = useState([]);
  var dpListData = props.dpList;
  var dpListType = props.type;
  console.log('Dp list', dpListData);
  var navigation = props.navigate;
  const _renderHeader = section => {
    return (
      <View style={styles.header}>
        <View>
          <View
            style={{
              height: 2,
              backgroundColor: Colors.grey_C0C0C0,
              marginBottom: 5,
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 18,
                }}>
                {section?.name}
              </Text>
            </View>

            {/* <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('NetworkPreviewDetails', {
                    section: section,
                    type: 'DP',
                    dpListType: dpListType,
                  });
                }}>
                <MaterialIcons
                  style={{marginRight: 10}}
                  name={'visibility'}
                  size={26}
                  color={'#666666'}
                />
              </TouchableOpacity>
            </View> */}

            <View>
              <TouchableOpacity
                onPress={() => {
                  props.onClickDpEdit(section)
                }}>
                <MaterialIcons
                  style={{marginRight: 10}}
                  name={'edit'}
                  size={26}
                  color={'#666666'}
                />
              </TouchableOpacity>
            </View>

            {/* <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-end',
                flexDirection: 'column',
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('LocationNavigation')}
                style={{marginTop: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 3,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#DADADA',
                  }}>
                  <Ionicons
                    name={'navigate-outline'}
                    size={16}
                    color={'#666666'}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      padding: 1,
                    }}>
                    Navigate
                  </Text>
                </View>
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.4, flexDirection: 'row'}}>
              <Zocial
                name={'googleplus'}
                size={16}
                color={'#777777'}
                style={{}}
              />
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Serial No
              </Text>
            </View>
            <View style={{flex: 0.1, flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                }}>
                :
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                }}>
                {section?.serial_no}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flex: 0.4,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Ionicons
                name={'location-sharp'}
                size={16}
                color={'#666666'}
                style={{}}
              />
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Zone
              </Text>
            </View>
            <View
              style={{
                flex: 0.1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                }}>
                :
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                }}>
                {section?.zone?.name}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flex: 0.4,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name={'source-branch'}
                size={18}
                color={'#777777'}
                style={{}}
              />
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Parent OLT
              </Text>
            </View>
            <View
              style={{
                flex: 0.1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                }}>
                :
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                }}>
                {section?.parent_olt}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const _renderContent = section => {
    return (
      <View style={styles.content}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name={'ip'}
              size={18}
              color={'#777777'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Latitude
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {section?.latitude}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
            <Feather
              name={'user-plus'}
              size={18}
              color={'#777777'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Longitude
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {section?.longitude}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Zocial
              name={'googleplus'}
              size={18}
              color={'#777777'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Total Ports
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {section?.no_of_ports}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Zocial
              name={'googleplus'}
              size={18}
              color={'#777777'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Available Ports
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {section?.available_ports}
            </Text>
          </View>
        </View>
        {/* map and view */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: 10,
            marginLeft: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              // openDirection();
              const latitude = section?.latitude; // Example latitude
              console.log(latitude, 'latitudelatitude');
              const longitude = section?.longitude; // Example longitude
              const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
              Linking.openURL(navigationUrl);
            }}
            style={styless.button}>
            <Image
              source={{
                uri: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
              style={styless.img}
            />
            <Text style={styless.textMap}>View on Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const _updateSections = activeSections => {
    setActiveSections(activeSections);
  };
  return (
    <View>
      <Accordion
        sections={dpListData}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={props.handleloadmore}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {/* {isLoading ? (
            <ActivityIndicator color="white" style={{marginLeft: 8}} />
          ) : null} */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DPList;

const styless = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    width: '48%',
    alignSelf: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  img: {width: 18, height: 18, marginRight: 10},
  txt_clicked1: {
    color: Colors.white,
  },
  textMap: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  txt_clicked: {
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: Colors.white,
    fontSize: 14,
  },
  txt_normal: {
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#777777',
    fontSize: 14,
  },
  nas_clicked: {
    width: 150,
    height: 36,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nas_normal: {
    width: 145,
    height: 36,
    backgroundColor: Colors.grey_F8F7FD,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNormal: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#000000',
    fontSize: 14,
    width: 78,
    height: 38,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
  btnPress: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#ffffff',
    fontSize: 14,
    width: 78,
    height: 38,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
});
