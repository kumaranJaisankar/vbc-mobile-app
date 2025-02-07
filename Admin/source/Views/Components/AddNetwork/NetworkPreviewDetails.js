import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import HeaderView1 from '../../Common/HeaderView1';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {el, he, it} from 'date-fns/locale';
import {
  getNasById,
  getOltById,
  getParentDPbyId,
  getChildDPbyId,
  getCPEById,
} from '../../services/MainService';
const {width, height} = Dimensions.get('window');

const NetworkPreviewDetails = props => {
  const [nasDataById, setNasDataByIdData] = useState([]);
  const [oltDataById, setOltDataByIdData] = useState([]);
  const [cpeDataById, setCpeDataByIdData] = useState([]);

  const [parentDpDataByID, setParentDpData] = useState([]);
  const [childDpDataByID, setChildDpData] = useState([]);
  const [globalData, setGlobalData] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const section = route?.params?.section;
  console.log(
    '🚀 ~ file: NetworkPreviewDetails.js:38 ~ NetworkPreviewDetails ~ section:',
    section,
  );
  const type = route?.params?.type;
  const dpListType = route?.params?.dpListType;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleNotesExpanded = () => {
    setIsNotesExpanded(!isNotesExpanded);
  };

  const addressDummy = () => {
    var data = [];
    if (type == 'NAS') {
      // getNasParentDataById(section.id);
      data = nasDataById;
    } else if (type == 'OLT') {
      data = oltDataById;
    } else if (type == 'DP') {
      data = parentDpDataByID;
    } else {
      data = cpeDataById;
    }

    setGlobalData(data);
  };

  const address =
    globalData?.house_no +
    ',' +
    globalData?.street +
    ',' +
    '\n' +
    globalData?.landmark +
    ',' +
    globalData?.city +
    ',' +
    '\n' +
    globalData?.district +
    ',' +
    '\n' +
    globalData?.state +
    ',' +
    '\n' +
    globalData?.country +
    ',' +
    '\n' +
    globalData?.pincode +
    '.';

  const connectedDevices = [
    {id: 1, name: 'Distribution Point - DW01-1A (7/1)'},
    {id: 2, name: 'Distribution Point - DW01-2A (5/2)'},
    {id: 3, name: 'Distribution Point - DW01-2A (2/3)'},
    {id: 4, name: 'Distribution Point - DW01-2A (5/4)'},
    {id: 5, name: 'Distribution Point - DW01-2A (7/5)'},
  ];

  const dummyNotesData = [
    // {id: 1, name: 'Updated by koteswari on Oct 31, 2020 4:35 PM'},
    // {id: 2, name: 'Updated by koteswari on Oct 31, 2020 12:02 PM'},
    // {id: 3, name: 'Created by VENKY VENKATESH on Oct 30, 2020 12:18 PM'},
  ];

  //  Api call
  const getNasDataById = async id => {
    try {
      const response = await getNasById(id);
      if (response.isSuccess) {
        console.log('nas data by id====>', response);
        setNasDataByIdData(response.result);
        addressDummy();

        // setParentNASID(response.result[response.result.length - 1].id);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorResponse = error.toString();
    }
  };

  const getOltDataById = async id => {
    try {
      const response = await getOltById(id);
      console.log(
        '🚀 ~ file: NetworkPreviewDetails.js:123 ~ getOltDataById ~ response:',
        response,
      );
      if (response.isSuccess) {
        console.log('olt data by id====>', response);
        setOltDataByIdData(response.result);
        addressDummy();
        // setParentNASID(response.result[response.result.length - 1].id);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorResponse = error.toString();
    }
  };

  const getParentDpDataById = async id => {
    try {
      const response = await getParentDPbyId(id);
      if (response.isSuccess) {
        console.log(' parent dp by id====>', response);
        setParentDpData(response.result);
        addressDummy();
        // setParentNASID(response.result[response.result.length - 1].id);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorResponse = error.toString();
    }
  };

  const getChildDpDataById = async id => {
    try {
      const response = await getChildDPbyId(id);
      if (response.isSuccess) {
        console.log(' child dp by id====>', response);
        setParentDpData(response.result);
        addressDummy();
        // setParentNASID(response.result[response.result.length - 1].id);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorResponse = error.toString();
    }
  };

  const getCpeDataById = async id => {
    try {
      const response = await getCPEById(id);
      if (response.isSuccess) {
        console.log('cpe data by id====>', response);
        setCpeDataByIdData(response.result);
        addressDummy();
        // setParentNASID(response.result[response.result.length - 1].id);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorResponse = error.toString();
    }
  };

  useEffect(() => {
    if (type == 'NAS') {
      getNasDataById(section.id);
      // getNasParentDataById(section.id);
    } else if (type == 'OLT') {
      getOltDataById(section.id);
    } else if (type == 'DP') {
      if (dpListType == 'parent') {
        getParentDpDataById(section.id);
      } else {
        getChildDpDataById(section.id);
      }
    } else {
      getCpeDataById(section.id);
    }
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderView1
        username={'Network Preview Details'}
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
              marginTop: 10,
              borderRadius: 5,
            }}>
            <View
              style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
              {/* <MaterialIcons
                                name={'format-list-numbered'}
                                size={16}
                                color={'#777777'}
                                style={{}}
                            /> */}
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
                {section?.name}
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
                {section.serial_no}
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
                Branch
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
                {section?.branch}
              </Text>
            </View>

            {/* 2nd */}
          </View>
          {type == 'NAS' && (
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
                  NAS Type
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
                  {section?.nas_type}
                </Text>
              </View>

              {/* 2nd */}
            </View>
          )}

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
                --
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
                {section?.status == 'ACT' ? 'Active' : section?.status}
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
                IP Address
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
                {section.ip_address}
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
                {section?.specification || '---'}
              </Text>
            </View>

            {/* 2nd */}
          </View>
        </View>

        {/* <View
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
            Device Info {section?.cstmr_name}
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
                {type == 'NAS'
                  ? 'NA'
                  : type == 'OLT'
                  ? oltDataById.capacity
                  : type == 'CPE'
                  ? 'NA'
                  : dpListType == 'parent'
                  ? 'NA'
                  : 'NA'}
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
                  {type == 'NAS'
                    ? 'NA'
                    : type == 'OLT'
                    ? oltDataById.avaialable_slots
                    : type == 'CPE'
                    ? 'NA'
                    : dpListType == 'parent'
                    ? parentDpDataByID.available_ports
                    : parentDpDataByID.available_ports}
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
                {type == 'NAS'
                  ? 'NA'
                  : type == 'OLT'
                  ? oltDataById.occupied_slots
                  : type == 'CPE'
                  ? 'NA'
                  : dpListType == 'parent'
                  ? 'NA'
                  : 'NA'}
              </Text>
              <Text style={{fontSize: height * 0.015, color: 'black'}}>
                Occupied Slots
              </Text>
            </View>

            <View style={{width: width * 0.35, height: height * 0.1}}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: width * 0.35,
                  height: height * 0.1,
                  borderColor: 'grey',
                  borderWidth: 1,
                }}>
                <Text style={{fontSize: height * 0.05}}>0</Text>
                <Text style={{fontSize: height * 0.015, color: 'black'}}>
                  Images
                </Text>
              </View>
            </View>
          </View>
        </View> */}

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
              {type === 'NAS' && (
                <FlatList
                  data={nasDataById.connected_oltes}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ConnectedDevicesDetails', {
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
                          {`OLT - ${item.serial_no}`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.id.toString()}
                />
              )}

              {type === 'OLT' && (
                <View>
                  <View
                    style={{
                      borderRadius: 10,
                      borderTopColor: 'grey',
                      width: width * 0.95,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        marginLeft: 20,
                        marginBottom: 20,
                        marginTop: 20,
                        fontWeight: 'bold',
                        fontSize: 15,
                        color: 'black',
                      }}>
                      Parent DPs
                    </Text>
                    <FlatList
                      data={oltDataById?.connected_parentdpes}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('ConnectedDevicesDetailsPDP', {
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
                              {`Parent DP - ${item.serial_no}`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.id.toString()}
                    />
                  </View>
                  <Text
                    style={{
                      marginLeft: 20,
                      marginBottom: 20,
                      marginTop: 20,
                      fontWeight: 'bold',
                      fontSize: 15,
                      color: 'black',
                    }}>
                    Child DPs
                  </Text>
                  <View
                    style={{
                      borderRadius: 10,
                      borderTopColor: 'grey',
                      width: width * 0.95,
                      alignSelf: 'center',
                    }}>
                    <FlatList
                      data={oltDataById?.connected_childdpes}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('ConnectedDevicesDetailsCDP', {
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
                              {`Child DP - ${item.serial_no}`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.id.toString()}
                    />
                  </View>
                </View>
                // <FlatList
                //   data={oltDataById.connected_parentdpes}
                //   renderItem={({item, index}) => (
                //     <TouchableOpacity
                //       onPress={() => {
                //         navigation.navigate('ConnectedDevicesDetails', {
                //           deviceId: item?.id,
                //         });
                //       }}>
                //       <View
                //         style={{
                //           borderBottomColor: 'grey',
                //           borderBottomWidth: 1,
                //           padding: 10,
                //           marginTop: 5,
                //           borderWidth: 1,
                //           borderColor: 'grey',
                //           borderRadius: 5,
                //           marginLeft: 5,
                //           marginRight: 5,
                //           marginBottom: 5,
                //         }}>
                //         <Text
                //           style={{
                //             marginLeft: 20,
                //             color: 'grey',
                //             fontWeight: 'bold',
                //           }}>
                //           {`DP - ${item.serial_no}`}
                //         </Text>
                //       </View>
                //     </TouchableOpacity>
                //   )}
                //   keyExtractor={item => item.id.toString()}
                // />
              )}
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
                data={dummyNotesData}
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
                keyExtractor={item => item.id.toString()}
              />
            </View>
          )}
        </View>

        {/* <View
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
              {oltDataById?.house_no +
                ',' +
                oltDataById?.street +
                ',' +
                '\n' +
                oltDataById?.landmark +
                ',' +
                oltDataById?.city +
                ',' +
                '\n' +
                oltDataById?.district +
                ',' +
                '\n' +
                oltDataById?.state +
                ',' +
                '\n' +
                oltDataById?.country +
                ',' +
                '\n' +
                oltDataById?.pincode +
                '.'}
            </Text>
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
};

export default NetworkPreviewDetails;
