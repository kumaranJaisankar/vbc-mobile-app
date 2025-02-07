import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Colors} from '../../../Common/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Zocial from 'react-native-vector-icons/Zocial';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles';
import DirectionSettings from '../../LocationNavigation/DirectionSettings';
import {Linking} from 'react-native';
import MapmyindiaDirectionWidget, {
  DirectionsCriteria,
  PlaceOptionsConstants,
} from 'mapmyindia-direction-widget-react-native';
import Toast from 'react-native-simple-toast';
import {
  getFormattedDistance,
  getFormattedDuration,
} from '../../LocationNavigation/Utils';

const NASList = props => {
  const [activeSections, setActiveSections] = useState([]);
  var nasListData = props.nasList;
  var navigation = props.navigate;
  const openDirection = async () => {
    let instance = DirectionSettings.getInstance();
    console.log(instance.destination);

    try {
      const data = await MapmyindiaDirectionWidget.openDirectionWidget({
        showStartNavigation: instance.showStartNavigation,
        steps: instance.steps,
        showAlternative: instance.showAlternative,
        profile: instance.profile,
        overview: instance.overview,
        attributions: instance.attributions,
        excludes: instance.excludes,
        destination: instance.destination,
        resource: instance.resource,
        searchPlaceOption: {
          location: instance.location,
          backgroundColor: instance.backgroundColor,
          toolbarColor: instance.toolbarColor,
          zoom: parseInt(instance.zoom),
          pod: instance.pod,
          tokenizeAddress: instance.tokenizeAddress,
          saveHistory: instance.saveHistory,
          historyCount: parseInt(instance.historyCount),
          attributionHorizontalAlignment:
            instance.attributionHorizontalAlignment,
          attributionVerticalAlignment: instance.attributionVerticalAlignment,
          logoSize: instance.logoSize,
          filter: instance.filter,
        },
      });
      instance.destination = {};
      console.log(JSON.stringify(data));
      let duration = data.directionsResponse.routes[0].duration;
      let distance = data.directionsResponse.routes[0].distance;
      Toast.show(
        `Duration: ${getFormattedDuration(
          duration,
        )}, Distance: ${getFormattedDistance(distance)}`,
        Toast.SHORT,
      );
    } catch (e) {
      console.log(e);
    }
  };
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
                  width: 220,
                }}>
                {section.name}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity style={{marginTop: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 3,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View>
                    {/* <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('NetworkPreviewDetails', {
                          section: section,
                          type: 'NAS',
                        });
                      }}>
                      <MaterialIcons
                        style={{marginRight: 30}}
                        name={'visibility'}
                        size={30}
                        color={'#666666'}
                      />
                    </TouchableOpacity> */}
                  </View>
                  {/* <TouchableOpacity
                    onPress={() => {
                      // openDirection();
                      const latitude = section.latitude; // Example latitude
                      console.log(latitude,"latitudelatitude")
                      const longitude = section.longitude; // Example longitude
                      const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
                      Linking.openURL(navigationUrl);
                    }}>
                    <MaterialIcons
                      name={'my-location'}
                      size={26}
                      color={'#666666'}
                    />
                  </TouchableOpacity> */}
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => {
                  navigation.navigate('NetworkPreviewDetails', {
                    section: section,
                    type: 'OLT',
                  });
                }}>
                <MaterialIcons
                  style={{marginRight: 10}}
                  name={'visibility'}
                  size={26}
                  color={'#666666'}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  props.onClickNasEdit(section);
                  // navigation.navigate('AddNetwork', {
                  //   section: section,
                  //   type: 'OLT',
                  // });
                }}
                >
                <MaterialIcons
                  style={{marginRight: 10}}
                  name={'edit'}
                  size={26}
                  color={'#666666'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.4, flexDirection: 'row'}}>
              <MaterialIcons
                name={'format-list-numbered'}
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
                Serial No.
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
                {section.serial_no}
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
                Branch
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
                {section.branch}
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
              IP Address
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
              {section.ip_address}
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
              Secret
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
              {section.secret}
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
              NAS Type
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
              {section.nas_type}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <MaterialIcons
              name={'format-list-numbered'}
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
              A-T- Interval:
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
              {section.accounting_interval_time}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: 10,
            marginLeft: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('NetworkPreviewDetails', {
                section: section,
                type: 'NAS',
              });
            }}
            style={styless.button}>
            <Text style={styless.textMap}>Information</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // openDirection();
              const latitude = section.latitude; // Example latitude
              console.log(latitude, 'latitudelatitude');
              const longitude = section.longitude; // Example longitude
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
        sections={nasListData}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
      />
    </View>
  );
};

export default NASList;
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
