import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {Colors} from '../../../Common/Colors';
import {RadioButton} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  getDPParentSerialNo,
  getParentNASId,
  getOLTZone,
  getOLTarea,
  getDPChildSerialNo,
} from '../../../services/MainService';
import {Dropdown} from 'react-native-element-dropdown';
import styles from '../styles';
import {showMessage} from 'react-native-flash-message';
import NetworkFlowDiagram from '../NetworkFlowDiagram';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';

const DPHomeScreen = props => {
  const [checked, setChecked] = useState('parent');
  const [showDPImage, setshowDPImage] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [zone, setZone] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const refRBSheetdp = useRef();
  const refRBSheet = useRef();
  const [parentData, setParentData] = useState([]);
  const [parentSerialNo, setParentSerialNo] = useState('');
  const [lastParentObject, setLastParentObject] = useState({});
  const [zoneData, setZoneData] = useState([]);
  const [option, setOption] = useState('DP');
  const [areaData, setAreaData] = useState('');
  const [arealist, setAreaList] = useState([]);

  console.log('Ratio', checked);
  const getParentChild = async areaID => {
    if (checked == 'parent') {
      getParentSNo(areaID);
    } else {
      getChildSNo(areaID);
    }
  };
  const getChildSNo = async areaID => {
    try {
      const response = await getDPChildSerialNo(areaID);
      console.log(response);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setParentData(response.result);
        } else {
          const resposneMsg = response;
          console.log(
            '🚀 ~ file: DPHomeScreen.js ~ line 55 ~ getChildSNo ~ resposneMsg',
            resposneMsg,
          );
          setParentData([]);
          Toast.show({
            type: 'error',
            text1: 'No serial no. available for this zone!',
          });
        }
      } else {
        const resposneMsg = response;
        setParentData([]);
        Toast.show({
          type: 'error',
          text1: 'No serial no. available for this zone!',
        });
      }
    } catch (error) {
      const errorResponse = error.toString();
      setParentData([]);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong! Please try again later.',
      });
    }
  };
  const getParentSNo = async areaID => {
    try {
      const response = await getDPParentSerialNo(areaID);
      console.log(response);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setParentData(response.result);
        } else {
          const resposneMsg = response;
          setParentData([]);
          Toast.show({
            type: 'error',
            text1: 'No serial no. available for this zone!',
          });
        }
      } else {
        const resposneMsg = response;
        setParentData([]);
        Toast.show({
          type: 'error',
          text1: 'No serial no. available for this zone!',
        });
      }
    } catch (error) {
      const errorResponse = error.toString();
      console.log(
        '🚀 ~ file: DPHomeScreen.js ~ line 103 ~ getParentSNo ~ errorResponse',
        errorResponse,
      );
      setParentData([]);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong! Please try again later.',
      });
    }
  };

  const getLastParentObject = async zoneSNo => {
    console.log(zoneSNo, 'zoneSNo');
    try {
      const response = await getParentNASId(zoneSNo);
      if (response.isSuccess) {
        setLastParentObject(response.result[response.result.length - 1]);
      } else {
        const resposneMsg = response;
      }
    } catch (error) {
      const errorResponse = error.toString();
    }
  };

  const getZones = async () => {
    try {
      const response = await getOLTZone();
      if (response.isSuccess) {
        setZoneData(response.result);
      } else {
        const resposneMsg = response;
        Toast.show({
          type: 'error',
          text1: 'No zone available!',
        });
      }
    } catch (error) {
      const errorResponse = error.toString();
      Toast.show({
        type: 'error',
        text1: 'Something went wrong! Please try again later.',
      });
    }
  };

  const checkCategory = () => {
    if (Object.keys(lastParentObject).length > 0) {
      if (
        lastParentObject.category == 'ParentDp' ||
        lastParentObject.category == 'ChildDp' ||
        lastParentObject.category == 'Olt'
      ) {
        refRBSheetdp.current.open();
      }
    }
  };
  // get area list
  const getAreas = async zoneID => {
    try {
      const response = await getOLTarea(zoneID, props?.userInfo?.franchise?.id);
      console.log(
        '🚀 ~ file: DPHomeScreen.js ~ line 123 ~ getAreas ~ response',
        response,
      );
      if (response?.result?.length > 0) {
        setAreaList(response.result);
      } else {
        const resposneMsg = response;
        console.log(
          '🚀 ~ file: DPHomeScreen.js ~ line 131 ~ getAreas ~ resposneMsg',
          resposneMsg,
        );
        Toast.show({
          type: 'error',
          text1: 'No Area available!',
        });
      }
    } catch (error) {
      const errorResponse = error.toString();
      Toast.show({
        type: 'error',
        text1: 'Something went wrong! Please try again later.',
      });
    }
  };
  return (
    <View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <RadioButton
            value="parent"
            status={checked === 'parent' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('parent')}
          />
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: Colors.grey_888888,
              fontSize: 16,
              marginRight: 10,
            }}>
            Parent DP
          </Text>
          <RadioButton
            value="child"
            status={checked === 'child' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('child')}
          />
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: Colors.grey_888888,
              fontSize: 16,
            }}>
            Child DP
          </Text>
          <TouchableOpacity
            onPress={() => {
              Object.keys(lastParentObject).length > 0 && checkCategory();
            }}>
            <FontAwesome5
              name={'network-wired'}
              size={15}
              color={'#c0c0c0'}
              style={{
                alignSelf: 'center',
                backgroundColor: '#777777',
                padding: 5,
                borderRadius: 10,
                marginLeft: 90,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5}}>
          <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{marginTop: -22}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={zoneData}
              maxHeight={200}
              labelField="name"
              valueField="id"
              placeholder="Zone *"
              value={zone}
              onFocus={() => {
                setIsFocus(true);
                getZones();
              }}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setZone(item.id);
                setIsFocus(false);
                getAreas(item.id);
              }}
            />
          </View>
        </View>
        {/* area drop down */}
        <View style={{flexDirection: 'row', marginTop: 5}}>
          <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{marginTop: -22}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={arealist}
              maxHeight={200}
              labelField="name"
              valueField="id"
              placeholder="Area *"
              value={zone}
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setAreaData(item.id);
                setIsFocus(false);
                getParentChild(item.id);
              }}
            />
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5}}>
          <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{marginTop: -22}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={parentData}
              maxHeight={200}
              labelField="name"
              valueField="name"
              placeholder={
                checked == 'parent' ? 'Parent Serial No *' : 'Child Serial No *'
              }
              value={parentSerialNo}
              disable={parentData?.length === 0}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setParentSerialNo(item.name);
                setIsFocus(false);
                getLastParentObject(item.name);
              }}
            />
          </View>
        </View>

        <Text
          style={{
            fontFamily: 'Titillium-Semibold',
            color: Colors.black,
            fontSize: 16,
            textAlign: 'left',
            marginTop: 10,
            textAlign: 'center',
          }}>
          Select available ports for connecting Parent
        </Text>

        <View style={{flexDirection: 'row', marginTop: 5}}>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#DC1F1F',
                height: 15,
                width: 15,
                borderRadius: 50,
              }}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.black,
                fontSize: 14,
                textAlign: 'left',
                textAlign: 'center',
              }}>
              Unavailable
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#258925',
                height: 15,
                width: 15,
                borderRadius: 50,
              }}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.black,
                fontSize: 14,
                textAlign: 'left',
                textAlign: 'center',
              }}>
              Available
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#5180DA',
                height: 15,
                width: 15,
                borderRadius: 50,
              }}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.black,
                fontSize: 14,
                textAlign: 'left',
                textAlign: 'center',
              }}>
              Select
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => refRBSheet.current.open()}>
          <MaterialIcons
            name={'zoom-out-map'}
            size={15}
            color={'#c0c0c0'}
            style={{
              alignSelf: 'center',
              backgroundColor: '#777777',
              padding: 5,
              borderRadius: 10,
              marginLeft: 300,
              marginTop: 10,
            }}
          />
        </TouchableOpacity>

        {showDPImage && (
          <Image
            source={require('../../../../assets/images/pic1.png')}
            style={{
              alignSelf: 'center',
              width: 300,
              height: 300,
            }}></Image>
        )}
      </View>

      {/* Bottom sheet for NAS+OLT+ParentDP/ChildDp */}
      <RBSheet
        ref={refRBSheetdp}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={600}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            borderRadius: 20,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -20,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 20,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <ScrollView
          style={{padding: 10, flexDirection: 'column'}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Text
            style={{
              flex: 1,
              fontFamily: 'Titillium-Semibold',
              color: '#DC631F',
              fontSize: 16,
            }}>
            Network Hierarchy
          </Text>

          {/* NAS */}
          <View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View
                style={{
                  height: 25,
                  width: 25,
                  backgroundColor: '#DC631F',
                  borderRadius: 50,
                }}
              />
              <Text
                style={{
                  flex: 1,
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 16,
                  marginLeft: 10,
                }}>
                NAS
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                borderLeftColor: '#DC631F',
                borderLeftWidth: 2,
                marginLeft: 10,
              }}>
              <Text
                style={{
                  flex: 1,
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 14,
                  marginLeft: 10,
                }}>
                Hardware Device Name
              </Text>
              <Text
                style={{
                  flex: 0.5,
                  padding: 5,
                  borderRadius: 10,
                  textAlign: 'center',
                  fontFamily: 'Titillium-Semibold',
                  color: '#ffffff',
                  fontSize: 12,
                  marginLeft: 10,
                  backgroundColor: '#258925',
                }}>
                {Object.keys(lastParentObject).length == 0
                  ? ''
                  : lastParentObject?.available_hardware?.parentnas_info?.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderLeftColor: '#DC631F',
                borderLeftWidth: 2,
                marginLeft: 10,
              }}>
              <Text
                style={{
                  flex: 1,
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 14,
                  marginLeft: 10,
                }}>
                Current Device’s Branch
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  flex: 0.5,
                  padding: 5,
                  borderRadius: 10,
                  textAlign: 'center',
                  fontFamily: 'Titillium-Semibold',
                  color: '#ffffff',
                  fontSize: 12,
                  marginLeft: 10,
                  backgroundColor: '#258925',
                }}>
                {Object.keys(lastParentObject).length == 0
                  ? ''
                  : lastParentObject?.available_hardware?.parentnas_info
                      ?.branch}
              </Text>
            </View>
          </View>

          {/* OLT */}
          {Object.keys(lastParentObject).length > 0 &&
            lastParentObject?.available_hardware?.olt_info && (
              <View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      height: 25,
                      width: 25,
                      backgroundColor: '#DC631F',
                      borderRadius: 50,
                    }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      marginLeft: 10,
                    }}>
                    OLT
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Hardware Device Name
                  </Text>
                  <Text
                    style={{
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.olt_info?.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Total ports & Available ports
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.olt_info
                          ?.available_ports +
                        '/' +
                        lastParentObject?.available_hardware?.olt_info
                          ?.total_ports}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Current Device Zone
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware.olt_info?.zone}
                  </Text>
                </View>
              </View>
            )}

          {/* ParentOLT */}
          {Object.keys(lastParentObject).length > 0 &&
            lastParentObject?.available_hardware?.parentolt_info && (
              <View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      height: 25,
                      width: 25,
                      backgroundColor: '#DC631F',
                      borderRadius: 50,
                    }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      marginLeft: 10,
                    }}>
                    OLT
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Hardware Device Name
                  </Text>
                  <Text
                    style={{
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.parentolt_info
                          ?.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Total ports & Available ports
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.parentolt_info
                          ?.available_ports +
                        '/' +
                        lastParentObject?.available_hardware?.parentolt_info
                          ?.total_ports}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Current Device Zone
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.parentolt_info
                          ?.zone}
                  </Text>
                </View>
              </View>
            )}

          {/* ParentDP1 */}
          {Object.keys(lastParentObject).length > 0 &&
            lastParentObject?.available_hardware?.parentdp1_info && (
              <View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      height: 25,
                      width: 25,
                      backgroundColor: '#DC631F',
                      borderRadius: 50,
                    }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      marginLeft: 10,
                    }}>
                    ParentDP1
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Hardware Device Name
                  </Text>
                  <Text
                    style={{
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.parentdp1_info
                          ?.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Total ports & Available ports
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.parentdp1_info
                          ?.available_ports +
                        '/' +
                        lastParentObject?.available_hardware?.parentdp1_info
                          ?.total_ports}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Current Device Zone
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.parentdp1_info
                          ?.zone}
                  </Text>
                </View>
              </View>
            )}

          {/* ParentDP2 */}
          {Object.keys(lastParentObject).length > 0 &&
            lastParentObject?.available_hardware?.parentdp2_info && (
              <View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      height: 25,
                      width: 25,
                      backgroundColor: '#DC631F',
                      borderRadius: 50,
                    }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      marginLeft: 10,
                    }}>
                    ParentDP2
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Hardware Device Name
                  </Text>
                  <Text
                    style={{
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.parentdp2_info
                          ?.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Total ports & Available ports
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.parentdp2_info
                          ?.available_ports +
                        '/' +
                        lastParentObject?.available_hardware?.parentdp2_info
                          ?.total_ports}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderLeftColor: '#DC631F',
                    borderLeftWidth: 2,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 14,
                      marginLeft: 10,
                    }}>
                    Current Device Zone
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      flex: 0.5,
                      padding: 5,
                      borderRadius: 10,
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: '#258925',
                    }}>
                    {Object.keys(lastParentObject).length == 0
                      ? ''
                      : lastParentObject?.available_hardware?.parentdp2_info
                          ?.zone}
                  </Text>
                </View>
              </View>
            )}
        </ScrollView>
      </RBSheet>
      <NetworkFlowDiagram sheetRef={refRBSheet} />
    </View>
  );
};
function mapStateToProps(state, props) {
  return {
    userInfo: state.mainReducers.main.userInfo,
  };
}

export default connect(mapStateToProps)(DPHomeScreen);
