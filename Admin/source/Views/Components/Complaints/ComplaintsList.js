import React, {useEffect, useRef, useState} from 'react';
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
import {Colors} from '../../Common/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Zocial from 'react-native-vector-icons/Zocial';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NoData from '../../Common/NoData';
import format from 'date-fns/format';
import {getFullAddress} from '../../Common/utility';
import {Linking} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import MapmyIndiaGL from 'mapmyindia-map-react-native-beta';
import DialogView from '../../Common/DialogView';
import {takeUp, takeUpUpdate} from '../../services/MainService';
import {connect} from 'react-redux';
import locationServices from '../../services/api';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const ComplaintsList = props => {
  const [activeSections, setActiveSections] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [comModalVisible, setComModalVisible] = React.useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [btn, setBtn] = useState(false);
  const [compId, setComId] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const navigation = useNavigation();

  console.log('isActive', isActive);
  useEffect(() => {
    let intervalId;

    if (isActive) {
      // call fetchData() initially
      getCurrentLocation();

      // schedule API calls every 10 seconds
      intervalId = setInterval(() => {
        updateLocationiInfo(compId);
      }, 10 * 1000); // 10 seconds in milliseconds

      setIntervalId(intervalId);
    }

    // clear interval on component unmount or when API calls are stopped
    return () => {
      clearInterval(intervalId);
      console.log('Interval cleared');
    };
  }, [isActive]);

  var complaintsListData = props?.complaintsList;
  console.log(
    '🚀 ~ file: ComplaintsList.js:30 ~ ComplaintsList ~ complaintsListData',
    complaintsListData,
  );
  console.log('modalVisible', props?.userInfo?.id);
  var isDataAvailable = props.isAvailable;
  const getFullStatus = status => {
    if (status == 'OPN') {
      return 'Open';
    } else if (status == 'ASN') {
      return 'Assigned';
    } else if (status == 'RSL') {
      return 'Resolved';
    } else if (status == 'INP') {
      return 'In-Progress';
    } else if (status == 'CLD') {
      return 'Closed';
    }
  };
  const getCurrentLocation = async () => {
    try {
      await locationServices.getGeoLocation(
        response => {
          if (response.responseCode) {
            let result = response.results[0];
            setLatitude(result.lat);
            setLongitude(result.lng);
          }
        },
        error => {
          Toast.show({
            type: 'error',
            text1: 'No Location Details Found!',
          });
        },
      );
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'This is problem in Location fetching!',
      });
    }
  };

  const initialApiCall = async (ticket_id, id) => {
    if (id === props?.userInfo?.id) {
      setComId(ticket_id);
      const payload = {
        user_id: props?.userInfo?.id,
        ticked_id: ticket_id,
        location_info: {Latitude: 17.385, Longitude: 78.4867},
        gis_status: 'STA',
      };
      console.log('pyaload ', payload);
      const res = await takeUp(payload);
      console.log(
        '🚀 ~ file: ComplaintsList.js:93 ~ initialApiCall ~ res:',
        res,
      );
      if (res.isSuccess) {
        setModalVisible(false);
        updateLocationiInfo(ticket_id);
        setBtn(true);
        setIsActive(prevIsActive => !prevIsActive);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something Went Wrong!',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'You are not assigned to this ticket!',
      });
    }
  };

  const updateLocationiInfo = async ticket_id => {
    const payload = {
      user_id: props?.userInfo?.id,
      ticked_id: ticket_id,
      location_info: {Latitude: 17.385, Longitude: 78.4867},
      gis_status: 'INP',
    };
    console.log('pyaload ', payload);
    const res = await takeUpUpdate(payload);
    console.log(
      '🚀 ~ file: ComplaintsList.js:146 ~ updateLocationiInfo ~ res:',
      res,
    );
    if (res.isSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Location Updated!',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Something Went Wrong!',
      });
    }
  };

  const reachedLocation = async ticket_id => {
    setComModalVisible(false);
    setIsActive(prevIsActive => !prevIsActive);
    const payload = {
      user_id: props?.userInfo?.id,
      ticked_id: ticket_id,
      location_info: {Latitude: 17.385, Longitude: 78.4867},
      gis_status: 'COMP',
    };
    console.log('pyaload ', payload);
    const res = await takeUpUpdate(payload);
    console.log(
      '🚀 ~ file: ComplaintsList.js:170 ~ reachedLocation ~ res:',
      res,
    );
    if (res.isSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Complete The task!',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Something Went Wrong!',
      });
    }
  };

  const _renderHeader = section => {
    return (
      <View style={styles.header}>
        {complaintsListData?.length > 0 ? (
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
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  flexDirection: 'column',
                  marginRight: 5,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    props.onEditClick(section);
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 3,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor: '#DADADA',
                    }}>
                    <Feather name={'edit'} size={16} color={'#666666'} />
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        padding: 1,
                      }}>
                      Edit
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Customer Name
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
                  {section?.name != undefined && section?.name
                    ? section?.name
                    : ''}
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
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Ticket Number
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
                  {section?.id}
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
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Customer ID
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
                  {section?.open_for != undefined && section?.open_for
                    ? section?.open_for
                    : ''}
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
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Open Date
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
                  {section?.open_date
                    ? format(
                        new Date(section?.open_date),
                        'dd MMM, yyyy, hh:mm a',
                      )
                    : ''}
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
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Franchise
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
                  {section?.franchise?.name != undefined &&
                  section?.franchise?.name
                    ? section?.franchise?.name
                    : ''}
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
                  {section?.status ? getFullStatus(section?.status) : ''}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Priority
                </Text>
              </View>
              <View
                style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
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
                  {section?.priority_sla?.name}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={{height: '70%', marginTop: 50}}>
            <NoData />
          </View>
        )}
      </View>
    );
  };
  const _renderContent = section => {
    const close_time = new Date();
    // section?.closed_date != undefined ? section?.closed_date * 1000 : 0,

    const resolu_time = new Date();
    // section?.resolved_time != undefined ? section?.resolved_time * 1000 : 0,

    return (
      <View style={styles.content}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Assigned To
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
              {section?.assigned_to?.name ? section?.assigned_to?.name : ''}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Mobile
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
            {section?.mobile_number != undefined && section?.mobile_number && (
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={() => {
                  Linking.openURL(`tel:${section?.mobile_number}`);
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: 'blue',
                    fontSize: 15,
                  }}>
                  {section?.mobile_number}
                </Text>
              </TouchableHighlight>
            )}
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Category
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
              {section?.ticket_category?.category}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Sub Category
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
              {section?.sub_category?.name ? section.sub_category.name : ''}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Assigned By
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
              {section?.created_by?.username != undefined
                ? section.created_by?.username
                  ? section.created_by?.username
                  : ''
                : ''}
            </Text>
          </View>
        </View>
        {/* from here */}
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Resolved By
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
              {section?.resolved_by != undefined
                ? section?.resolved_by?.username
                  ? section?.resolved_by?.username
                  : ''
                : ''}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Closed By
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
              {section?.closed_by?.username != undefined
                ? section?.closed_by?.username
                  ? section?.closed_by?.username
                  : ''
                : ''}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Resolution Time
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
              {/* {section?.resolved_time != undefined
                ? resolu_time
                  ? resolu_time
                  : ''
                : ''} */}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Closing Time
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
              {section?.closed_date
                ? format(
                    new Date(section?.closed_date),
                    'dd MMM, yyyy, hh:mm a',
                  )
                : ''}
            </Text>
          </View>
        </View>
        {/* to here */}
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flex: 0.4,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Address
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
              {section?.address != undefined
                ? getFullAddress(section?.address)
                : ''}
            </Text>
          </View>
        </View>
        {/* map button */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: 10,
            marginLeft: 10,
          }}>
          {!btn ? (
            <View>
              
            </View>
            // <TouchableOpacity
            //   onPress={() => setModalVisible(true)}
            //   style={styles.button}>
            //   <Feather
            //     name={'corner-up-right'}
            //     size={20}
            //     color={Colors.orange_295CBF}
            //     style={{marginRight: 5}}
            //   />

            //   <Text style={styles.textMap}>Take Up</Text>
            // </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => reachedLocation(section?.id)}
              style={styles.button}>
              <Feather
                name={'check-circle'}
                size={20}
                color={Colors.green_36BE39}
                style={{marginRight: 5}}
              />

              <Text style={styles.textMap}>Reached</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('MapDesignView');
              const latitude = 17.4435; // Example latitude
              const longitude = -122.4194; // Example longitude
              const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
              Linking.openURL(navigationUrl);
            }}
            style={styles.button}>
            <Image
              source={{
                uri: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
              style={styles.img}
            />
            <Text style={styles.textMap}>View on Map</Text>
          </TouchableOpacity>
        </View>
        <DialogView
          showConfirmDialog
          visible={modalVisible}
          text={`Are you sure to take up the complaint(${section?.id}) ?`}
          onConfirm={() => {
            initialApiCall(section?.id, section?.assigned_to?.id);
          }}
          onCancel={() => {
            setModalVisible(false);
          }}></DialogView>

        <DialogView
          showConfirmDialog
          visible={comModalVisible}
          text={`Are you sure that you reached?`}
          onConfirm={() => {
            // initialApiCall(section?.id, section?.assigned_to?.id);
          }}
          onCancel={() => {
            setComModalVisible(false);
          }}></DialogView>
      </View>
    );
  };

  const _updateSections = activeSections => {
    setActiveSections(activeSections);
  };
  return (
    <View>
      <Accordion
        sections={complaintsListData}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
      />
    </View>
  );
};
function mapStateToProps(state, props) {
  return {
    customer: state.mainReducers.main.customer,
    userInfo: state.mainReducers.main.userInfo,
  };
}

export default connect(mapStateToProps)(ComplaintsList);

const styles = StyleSheet.create({
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
