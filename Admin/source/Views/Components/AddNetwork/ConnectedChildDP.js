import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import HeaderView1 from '../../Common/HeaderView1';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {he, it} from 'date-fns/locale';
import {getCDPInfo, getOLTInfo, getPDPInfo} from '../../services/MainService';
import DialogView from '../../Common/DialogView';
const {width, height} = Dimensions.get('window');

const ConnectedChildDP = props => {
  const [activeSections, setActiveSections] = useState([]);
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [detailsInfo, setDetailsInfo] = useState([]);
  const route = useRoute();
  const {deviceId} = route.params;
  const [isLoading, setLoading] = React.useState(false);

  console.log('type', deviceId);

  useEffect(() => {
    if (deviceId) {
      cdpDetails(deviceId);
    }
  }, [deviceId]);

  const cdpDetails = async deviceId => {
    const res = await getCDPInfo(deviceId);
    setLoading(true);
    console.log('🚀 ~ file: ConnectedChildDP.js:37 ~ cdpDetails ~ res:', res);
    if (res?.isSuccess) {
      setLoading(false);
      setDetailsInfo(res?.result);
    }
    setLoading(false);
  };

  console.log('detailsInfo', detailsInfo);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleNotesExpanded = () => {
    setIsNotesExpanded(!isNotesExpanded);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderView1
        username={`Details Of Child DP - ${detailsInfo?.name}`}
        showHeaderBack
        onBackClick={() => {
          navigation.goBack();
        }}
      />

      <ScrollView>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'grey',
            padding: 20,
            width: width * 0.95,
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: 'lightgrey',
              width: width * 0.9,
              padding: 5,
              borderRadius: 5,
            }}>
            <View
              style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Name
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
                {detailsInfo?.name}
              </Text>
            </View>

            {/* 2nd */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: 'lightgrey',
              width: width * 0.9,
              padding: 5,
              marginTop: 10,
              borderRadius: 5,
            }}>
            <View
              style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
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
                {detailsInfo?.serial_no}
              </Text>
            </View>

            {/* 2nd */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: 'lightgrey',
              width: width * 0.9,
              padding: 5,
              marginTop: 10,
              borderRadius: 5,
            }}>
            <View
              style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
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
                {detailsInfo?.zone}
              </Text>
            </View>

            {/* 2nd */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: 'lightgrey',
              width: width * 0.9,
              padding: 5,
              marginTop: 10,
              borderRadius: 5,
            }}>
            <View
              style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Area
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
                {detailsInfo?.area}
              </Text>
            </View>

            {/* 2nd */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: 'lightgrey',
              width: width * 0.9,
              padding: 5,
              marginTop: 10,
              borderRadius: 5,
            }}>
            <View
              style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Model
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
                {detailsInfo?.device_model}
              </Text>
            </View>

            {/* 2nd */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: 'lightgrey',
              width: width * 0.9,
              padding: 5,
              marginTop: 10,
              borderRadius: 5,
            }}>
            <View
              style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Status
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
                {detailsInfo?.status == 'ACT' ? 'Active' : detailsInfo?.status}
              </Text>
            </View>

            {/* 2nd */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: 'lightgrey',
              width: width * 0.9,
              padding: 5,
              marginTop: 10,
              borderRadius: 5,
            }}>
            <View
              style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Make
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
                {detailsInfo?.make}
              </Text>
            </View>

            {/* 2nd */}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: 'lightgrey',
              width: width * 0.9,
              padding: 5,
              marginTop: 10,
              borderRadius: 5,
            }}>
            <View
              style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#808080',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Specification
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
                {detailsInfo?.specification}
              </Text>
            </View>

            {/* 2nd */}
          </View>
        </View>

        {/* start */}

        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'grey',
            padding: 20,
            width: width * 0.95,
            alignSelf: 'center',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>
            {detailsInfo?.name} Is Connected To:
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'grey',
              padding: 20,
              width: width * 0.9,
              alignSelf: 'center',
              marginTop: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: height * 0.015,
                color: 'black',
                fontWeight: 'bold',
              }}>
              Optical Line Terminal: {detailsInfo?.name}
            </Text>

            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: width * 0.8,
                height: height * 0.1,
                marginTop: 10,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: width * 0.25,
                  height: height * 0.1,
                }}>
                <Image
                  style={{
                    resizeMode: 'contain',
                    width: width * 0.25,
                    height: height * 0.1,
                  }}
                  source={require('../../../assets/images/deviceInfo.png')}
                />
              </View>

              <View style={{width: width * 0.25, height: height * 0.1}}>
                <View style={{width: width * 0.25, height: height * 0.1}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      width: width * 0.25,
                      height: height * 0.1,
                    }}>
                    <Text style={{fontSize: height * 0.015, color: 'black'}}>
                      Serial No
                    </Text>
                    <Text style={{fontSize: height * 0.015, color: 'black'}}>
                      Available Slots
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{width: width * 0.25, height: height * 0.1}}>
                <View
                  style={{
                    justifyContent: 'center',
                    width: width * 0.25,
                    height: height * 0.1,
                  }}>
                  <Text style={{fontSize: height * 0.015, color: 'black'}}>
                    {detailsInfo?.parent_olt?.serial_no}
                  </Text>
                  <Text style={{fontSize: height * 0.015, color: 'black'}}>
                    {detailsInfo?.parent_olt?.avaialable_slots}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: width * 0.8,
                height: height * 0.1,
                marginTop: 10,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: width * 0.1,
                  height: height * 0.1,
                  borderWidth: 1,
                  borderColor: 'lightgrey',
                }}>
                <MaterialIcons
                  name={'location-on'}
                  size={20}
                  color={'#777777'}
                  style={{}}
                />
              </View>

              <View style={{width: width * 0.7, height: height * 0.1}}>
                <View
                  style={{
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: width * 0.7,
                    height: height * 0.1,
                    borderWidth: 1,
                    borderColor: 'lightgrey',
                  }}>
                  <Text style={{color: 'black'}}>
                    {detailsInfo?.parent_olt?.house_no},
                    {detailsInfo?.parent_olt?.street},
                    {detailsInfo?.parent_olt?.landmark},
                    {detailsInfo?.parent_olt?.city},
                    {detailsInfo?.parent_olt?.district},{' '}
                    {detailsInfo?.parent_olt?.country},
                    {detailsInfo?.parent_olt?.pincode}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* end */}

        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'grey',
            padding: 20,
            width: width * 0.95,
            alignSelf: 'center',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>
            Capacity Info ({detailsInfo?.name})
          </Text>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: width * 0.8,
              height: height * 0.1,
              marginTop: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: width * 0.35,
                height: height * 0.1,
                borderColor: 'blue',
                borderWidth: 1,
              }}>
              <Text style={{fontSize: height * 0.05}}>
                {detailsInfo?.no_of_ports}
              </Text>
              <Text style={{fontSize: height * 0.015, color: 'black'}}>
                Capacity
              </Text>
            </View>

            <View style={{width: width * 0.35, height: height * 0.1}}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: width * 0.35,
                  height: height * 0.1,
                  borderColor: 'red',
                  borderWidth: 1,
                }}>
                <Text style={{fontSize: height * 0.05}}>
                  {detailsInfo?.available_ports}
                </Text>
                <Text style={{fontSize: height * 0.015, color: 'black'}}>
                  Available Slots
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: width * 0.8,
              height: height * 0.1,
              marginTop: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: width * 0.35,
                height: height * 0.1,
                borderColor: 'orange',
                borderWidth: 1,
              }}>
              <Text style={{fontSize: height * 0.05}}>
                {detailsInfo?.occupied_ports}
              </Text>
              <Text style={{fontSize: height * 0.015, color: 'black'}}>
                Occupied Slots
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'grey',
            width: width * 0.95,
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <TouchableOpacity onPress={toggleExpanded}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons
                name={isExpanded ? 'arrow-drop-down' : 'arrow-right'}
                size={30}
                color={'#777777'}
                style={{}}
              />
              <Text
                style={{
                  marginLeft: 20,
                  marginBottom: 20,
                  marginTop: 20,
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: 'black',
                }}>
                {isExpanded ? 'Connected Devices' : 'Connected Devices'}
              </Text>
            </View>
          </TouchableOpacity>
          {isExpanded && (
            <View
              style={{
                borderRadius: 10,
                borderTopColor: 'grey',
                width: width * 0.95,
                alignSelf: 'center',
              }}>
              <FlatList
                data={detailsInfo?.connected_cpes}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ConnectedDevicesDetailsCPE', {
                        deviceId: item?.id,
                      });
                    }}>
                    <View
                      style={{
                        borderBottomColor: 'grey',
                        borderBottomWidth: 1,
                        padding: 10,
                        marginTop: 5,
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderRadius: 5,
                        marginLeft: 5,
                        marginRight: 5,
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          marginLeft: 20,
                          color: 'grey',
                          fontWeight: 'bold',
                        }}>
                        {`CPE - ${item.serial_no}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item?.id?.toString()}
              />
            </View>
          )}
        </View>

        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'grey',
            width: width * 0.95,
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <TouchableOpacity onPress={toggleNotesExpanded}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons
                name={isNotesExpanded ? 'arrow-drop-down' : 'arrow-right'}
                size={30}
                color={'#777777'}
                style={{}}
              />
              <Text
                style={{
                  marginLeft: 20,
                  marginBottom: 20,
                  marginTop: 20,
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: 'black',
                }}>
                Notes
              </Text>
            </View>
          </TouchableOpacity>
          {isNotesExpanded && (
            <View
              style={{
                borderRadius: 10,
                borderTopColor: 'grey',
                width: width * 0.95,
                alignSelf: 'center',
              }}>
              <FlatList
                data={detailsInfo ? detailsInfo : []}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      borderBottomColor: 'grey',
                      borderBottomWidth: 1,
                      padding: 10,
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        marginLeft: 20,
                        color: 'grey',
                        fontWeight: 'bold',
                      }}>
                      {item.name}
                    </Text>
                  </View>
                )}
                keyExtractor={item => item?.id?.toString()}
              />
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'grey',
            padding: 20,
            width: width * 0.95,
            alignSelf: 'center',
            marginTop: 20,
            marginBottom: 30,
          }}>
          <View
            style={{
              width: width * 0.3,
              height: height * 0.1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialIcons
              name={'location-on'}
              size={50}
              color={'#777777'}
              style={{}}
            />
          </View>
          <View
            style={{
              marginLeft: 10,
              width: width * 0.5,
              height: height * 0.1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'black'}}>
              {detailsInfo?.house_no},{detailsInfo?.street},
              {detailsInfo?.landmark},{detailsInfo?.city},
              {detailsInfo?.district}, {detailsInfo?.country},
              {detailsInfo?.pincode}
            </Text>
          </View>
        </View>
      </ScrollView>
      <DialogView
        showLoadingDialog
        visible={isLoading}
        text="Loading..."></DialogView>
    </View>
  );
};

export default ConnectedChildDP;
