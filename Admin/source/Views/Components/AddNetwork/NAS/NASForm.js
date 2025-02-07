import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { Colors } from '../../../Common/Colors';
import { TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getNASBranchList, addNAS, updateNas } from '../../../services/MainService';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { isIPv4 } from 'is-ip';
import { showMessage } from 'react-native-flash-message';
import globalStyles from '../../../Common/globalStyles';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../styles';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import DialogView from '../../../Common/DialogView';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import locationServices from '../../../services/api';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const NASForm = props => {

  const nasTypeData = [
    { name: 'Mikrotik', code: 'MTK' },
    { name: 'Cisco', code: 'CIS' },
    { name: 'Juniper', code: 'JUN' },
    { name: 'Huawei', code: 'HUW' },
    { name: 'Alcatel', code: 'ATL' },
    { name: 'HB', code: 'HB' },
  ];

  const statusData = [
    { name: 'Active', code: 'ACT' },
    { name: 'Inactive', code: 'IN' },
  ];

  var navigation = props.navigate;

  const [isLoading, setLoading] = useState({
    spinner: false,
    spinnerText: '',
  });
  console.log("its the child component of nas form",props.formData, props.isEditForm, props);
  console.log(props.userInfo);
  const editFormData = props.isEditForm ? props.formData : {};

  const [username, setUsername] = useState(props.isEditForm ? editFormData?.name : '');
  const [ip, setIP] = useState(props.isEditForm ? editFormData?.ip_address : '');
  const [secret, setSecret] = useState(props.isEditForm ? editFormData?.secret : '');
  const [serialNo, setSerialNo] = useState(props.isEditForm ? editFormData?.serial_no : '');
  const [hNo, sethNo] = useState(props.isEditForm ? editFormData?.house_no : '');
  const [street, setStreet] = useState(props.isEditForm ? editFormData?.street : '');
  const [landmark, setLandmark] = useState(props.isEditForm ? editFormData?.landmark : '');
  const [city, setCity] = useState(props.isEditForm ? editFormData?.city : '');
  const [pincode, setPincode] = useState(props.isEditForm ? editFormData?.pincode?.toString() : '');
  const [district, setDistrict] = useState(props.isEditForm ? editFormData?.district : '');
  const [state, setState] = useState(props.isEditForm ? editFormData?.state : '');
  const [country, setCountry] = useState(props.isEditForm ? editFormData?.country : '');
  const [latitude, setLatitude] = useState(props.isEditForm ? editFormData?.latitude?.toString() : '');
  const [longitude, setLongitude] = useState(props.isEditForm ? editFormData?.longitude?.toString() : '');
  const [nasType, setNASType] = useState(props.isEditForm ? editFormData?.nas_type : '');
  const [status, setStatus] = useState(props.isEditForm ? editFormData?.status : '');
  
  const [branch, setBranch] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [interval, setInterval] = useState('');
  const [isBranchData, setBranchData] = useState([]);
  const [time, setTime] = useState(new Date());
  const [isRenewRecent, setRenewRecent] = useState({
    text: '',
    visible: false,
  });
  const [location, setLocation] = useState(false);
  
  // const [username, setUsername] = useState('');
  // const [ip, setIP] = useState('');
  // const [secret, setSecret] = useState('');
  // const [branch, setBranch] = useState();
  // const [nasType, setNASType] = useState('');
  // const [status, setStatus] = useState('');
  // const [serialNo, setSerialNo] = useState('');
  // const [isFocus, setIsFocus] = useState(false);
  // const [show, setShow] = useState(false);
  // const [date, setDate] = useState(new Date());
  // const [interval, setInterval] = useState('');
  // const [isBranchData, setBranchData] = useState([]);
  // const [time, setTime] = useState(new Date());
  // const [hNo, sethNo] = useState('');
  // const [street, setStreet] = useState('');
  // const [landmark, setLandmark] = useState('');
  // const [city, setCity] = useState('');
  // const [pincode, setPincode] = useState('');
  // const [district, setDistrict] = useState('');
  // const [state, setState] = useState('');
  // const [country, setCountry] = useState('');
  // const [latitude, setLatitude] = useState('');
  // const [longitude, setLongitude] = useState('');
  // const [isRenewRecent, setRenewRecent] = React.useState({
  //   text: '',
  //   visible: false,
  // });
  // const [location, setLocation] = useState(false);
  // function to check permissions and get Location
  // const getLocation = () => {
  //   setLoading({ spinner: true, spinnerText: 'Fetching Location' });
  //   const result = requestLocationPermission();
  //   result.then(res => {
  //     console.log('res is:', res);
  //     if (res) {
  //       Geolocation.getCurrentPosition(
  //         position => {
  //           console.log(position);
  //           setLoading({ spinner: false, spinnerText: 'Fetching Location' });
  //           setLocation(position);
  //           setLongitude(position?.coords?.longitude?.toString());
  //           setLatitude(position?.coords?.latitude?.toString());
  //         },
  //         error => {
  //           // See error code charts below.
  //           console.log(error.code, error.message);
  //           setLocation(false);
  //           setRenewRecent({
  //             text: error.message,
  //             visible: true,
  //           });
  //           setLoading({ spinner: false, spinnerText: 'Fetching Location' });
  //         },
  //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
  //       );
  //     }
  //   });
  //   console.log(location);
  //   setLoading({ spinner: false, spinnerText: 'Fetching Location' });
  // };
  const onLocationEnablePressed = () => {
    if (Platform.OS === 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => {
          console.log('location data', data);
          if (data == 'already-enabled') {
            getLocation();
          }
          if (data == 'enabled') {
            getLocation();
          }
        })
        .catch(err => {
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          // alert('Error ' + err.message + ', Code : ' + err.code);
        });
    }
  };
  const getLocation = async () => {

  
    if (location) {
      setRenewRecent({
        text: 'Location details already fetched!',
        visible: true,
      });

    } else {
      setLoading({ spinner: true, spinnerText: 'Fetching location...' });
      await locationServices.getGeoLocation(
        response => {
          console.log(response,"map response")
          if (response.responseCode) {
            let result = response.results[0];
            sethNo(result.houseNumber);
            setStreet(result.street);
            setDistrict(result.district);
            setState(result.state);
            setCity(result.city);
            setPincode(result.pincode);
            setCountry(result.area);
            setLatitude(result.lat);
            setLongitude(result.lng);
            setLandmark(result.locality);
            setLocation(true);
            setLoading({ spinner: false, spinnerText: '' });
          }
        },
        error => {
          console.log(error,"error location")
          setLocation(false);
          setLoading({ spinner: false, spinnerText: '' });
          setRenewRecent({
            text: 'No Location Details Found!',
            visible: true,
          });
        
        },
      );
    }
  };
  console?.log('latitute', latitude);
  console?.log('longitude', longitude);
  var timeInterval = '';
  
  // Function to get permission for location
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };
  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === 'ios');
    const selectedTime = selectedValue || new Date();
    setTime(selectedTime);
    setShow(Platform.OS === 'ios');
  };
  const showMode = () => {
    setShow(true);
  };
  const showTimepicker = () => {
    showMode();
  };
  const onResetClick = () => {
    setBranch('');
    setNASType('');
    setUsername('');
    setIP('');
    setSecret('');
    setSerialNo('');
    setInterval('');
    setStatus('');
    sethNo('');
    setStreet('');
    setLandmark('');
    setCity('');
    setPincode('');
    setDistrict('');
    setState('');
    setCountry('');
    setLatitude('');
    setLongitude('');
    setLocation(false);
    setTime(new Date());
  };
  const onAddClick = async () => {
    if (
      // branch &&
      // nasType &&
      // username &&
      // ip &&
      // secret &&
      timeInterval 
      // status &&
      // serialNo
    ) {
      if (isIPv4(ip)) {
        var body = {
          branch: branch,
          nas_type: nasType,
          name: username,
          ip_address: ip,
          secret: secret,
          serial_no: { name: serialNo },
          accounting_interval_time: timeInterval,
          status: status,
          city: city,
          country: country,
          district: district,
          house_no: hNo,
          landmark: landmark,
          latitude: latitude,
          longitude: longitude,
          street: street,
          state: state,
          pincode: pincode,
        };
        if (pincode?.length < 6) {
          setRenewRecent({
            text: 'Pincode Can Not Less Than 6 Digit!',
            visible: true,
          });
          return;
        }
        // name
        if (!username || username === '' || username === null) {
          setRenewRecent({
            text: 'Please fillup the name field!',
            visible: true,
          });
          return;
        }

      // ip
      if (!ip || ip === '' || ip === null) {
        setRenewRecent({
          text: 'Please fillup the ip field!',
          visible: true,
        });
        return;
      }

      // secret

      if (!secret || secret === '' || secret === null) {
        setRenewRecent({
          text: 'Please fillup the secret field!',
          visible: true,
        });
        return;
      }

      // serialNo
      if (!serialNo || serialNo === '' || serialNo === null) {
        setRenewRecent({
          text: 'Please fillup the serial no field!',
          visible: true,
        });
        return;
      }
        // branch
        if (!branch || branch === '' || branch === null) {
          setRenewRecent({
            text: 'Please fillup the branch field!',
            visible: true,
          });
          return;
        }

        // nasType
        if (!nasType || nasType === '' || nasType === null) {
          setRenewRecent({
            text: 'Please fillup the nas type field!',
            visible: true,
          });
          return;
        }

        if (!longitude || longitude === '' || longitude === null) {
          setRenewRecent({
            text: 'Please fillup the longitude field!',
            visible: true,
          });
          return;
        }
        if (!latitude || latitude === '' || latitude === null) {
          setRenewRecent({
            text: 'Please fillup the latitude field!',
            visible: true,
          });
          return;
        }
        if (/^[a-zA-Z0-9,_-]+$/.test(username) === false) {
          setRenewRecent({
            text: 'Name Should Contain Alpha Numerics and special char(_ -)',
            visible: true,
          });
          return;
        } else if (/^[a-zA-Z0-9,@_-]+$/.test(secret) === false) {
          setRenewRecent({
            text: 'Secret Allows Alphanumeric and special char(_ - @)',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Secret Allows',
          //   text2: 'Alphanumeric and special char(_ -)',
          // });
          return;
        } else if (/^[a-zA-Z0-9,_-]+$/.test(serialNo) === false) {
          setRenewRecent({
            text: 'Serial No. Only Allow Alphanumeric and special char(_ -), No White Spaces Allow',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Serial No. Should',
          //   text2: 'Contain Alphabets, No White Spaces',
          // });
          return;
        }

        setLoading({ spinner: true, spinnerText: props.isEditForm ? 'Editing NAS...' : 'Creating NAS...' });
        try {
          if(props.isEditForm) {
            body.id =  props.formData.id;
            body.created_by = props.userInfo.username;
          }
          const response = props.isEditForm ? await updateNas(body) : await addNAS(body);

          if (response.isSuccess) {
            const responseMsg = response;
            // onResetClick();
            setLoading({ spinner: false, spinnerText: '' });
            Toast.show({
              type: 'success',
              text1: props.isEditForm ? 'NAS Edit Successfully!' : 'NAS Created Successfully!',
            });
            props.nasListView();
          } else {
            const errorresponse = response?.message?.response?.data;
            console.log('errorresponse[0].name', errorresponse);
            setLoading({ spinner: false, spinnerText: '' });

            Object.entries(errorresponse).forEach(([field, errors]) => {
              if (Array.isArray(errors)) {
                errors.forEach(error => {
                  setRenewRecent({
                    text: `${field === 'name' || field === 'serial_no' ? '' : field
                      } ${error}`,
                    visible: true,
                  });
                  return;
                  // Toast.show({
                  //   type: 'error',
                  //   text1: `${
                  //     field === 'name' || field === 'serial_no' ? '' : field
                  //   } ${error}`,
                  // });
                });
              }
              else{
                setRenewRecent({
                  text: errors,
                  visible: true,
                });
                return;
              }
            });
            // setRenewRecent({
            //   text: response?.message?.response?.data?.detail,
            //   visible: true,
            // });
            // return;
            // errorresponse?.forEach(errorresponse => {
            //   Toast.show({
            //     type: 'error',
            //     text1: errorresponse || 'NAS Not Created!',
            //   });
            // });
          }
        } catch (error) {
          const errorresponse = error.toString();
          console.log(
            '🚀 ~ file: NASForm.js:132 ~ onAddClick ~ errorresponse:',
            errorresponse,
          );
          setLoading({ spinner: false, spinnerText: '' });
          setRenewRecent({
            text: `Something went wrong! Please try again later!`,
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Something went wrong! Please try again later.',
          // });
        }
      } else {
        setRenewRecent({
          text: 'Inavlid IP address! Please enter a valid one!',
          visible: true,
        });
        // Toast.show({
        //   type: 'warning',
        //   text1: 'Inavlid IP address! Please enter a valid one',
        // });
      }
    } else {
      setRenewRecent({
        text: 'Please fill up all the required fields!',
        visible: true,
      });
      // Toast.show({
      //   type: 'warning',
      //   text1: 'Please fill up all the required fields!',
      // });
    }
  };

  const getBranchList = async () => {
    try {
      const response = await getNASBranchList();
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setBranchData(response.result);

          if(props.isEditForm) {
            const nameToIdMap = {};
            response.result.forEach(item => {
              nameToIdMap[item.name] = item.id;
            });
            setBranch(nameToIdMap[props.formData.branch]);
          }

        } else {
          const responseMsg = response;
          setRenewRecent({
            text: 'No Branch found!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No Branch found!',
          // });
        }
      } else {
        const responseMsg = response;
        setRenewRecent({
          text: 'No Branch found!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No Branch found!',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setRenewRecent({
        text: 'Something went wrong! Please try again later!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something went wrong! Please try again later.',
      // });
    }
  };

  useEffect(() => {
    getBranchList();
    if (props?.userInfo?.branch) {
      setBranch(props?.userInfo?.branch?.id);
    }
  }, [props?.userInfo]);

  const formatDate = time => {
    timeInterval = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    return timeInterval;
  };
  return (
    <View>
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={isBranchData}
            maxHeight={200}
            labelField="name"
            valueField="id"
            placeholder="Select Branch *"
            value={branch}
            onFocus={() => {
              setIsFocus(true);
              // getBranchList();
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setBranch(item.id);
              setIsFocus(false);
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={nasTypeData}
            maxHeight={200}
            labelField="name"
            valueField="code"
            placeholder="NAS Type *"
            value={nasType}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setNASType(item.code);
              setIsFocus(false);
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Name *'}
            value={username}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            maxLength={50}
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setUsername(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'NAS IP *'}
            value={ip}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={15}
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setIP(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Secret *'}
            value={secret}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            maxLength={20}
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setSecret(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={statusData}
            maxHeight={100}
            labelField="name"
            valueField="code"
            placeholder="Status *"
            value={status}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setStatus(item.code);
              setIsFocus(false);
            }}
          />
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={showTimepicker}>
          <View
            style={{
              marginHorizontal: 10,
              height: 48,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12,
              backgroundColor: '#FAFAFA',
              borderColor: Colors.grey_C0C0C0,
              borderWidth: 1,
              borderRadius: 5,
              padding: 5,
            }}>
            <Text>
              <Ionicons
                name={'time-outline'}
                size={26}
                color={Colors.grey_888888}
              />{' '}
            </Text>
            <Text
              style={{
                flex: 0.9,
                fontFamily: 'Titillium-Semibold',
                color: Colors.grey_888888,
                fontSize: 15,
              }}>
              {time ? formatDate(time) : 'Accounting Interval Time *'}
            </Text>
          </View>
          {show && (
            <DateTimePicker
              value={date}
              mode={'time'}
              is24Hour={true}
              display="default"
              onChange={onChange}
              placeholderText="tests"
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Serial No *'}
            value={serialNo}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            maxLength={20}
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]*$/.test(text)) return setSerialNo(text)}}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'H.No'}
            value={hNo}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => sethNo(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Street /Building *'}
            value={street}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setStreet(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Landmark'}
            value={landmark}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setLandmark(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'City *'}
            value={city}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setCity(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Pincode *'}
            value={pincode}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            maxLength={6}
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setPincode(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'District *'}
            value={district}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setDistrict(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'State *'}
            value={state}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setState(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Country *'}
            value={country}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setCountry(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Latitude *'}
            value={latitude}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setLatitude(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Longitude *'}
            value={longitude}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
              fontSize: 15,
              width: '95%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setLongitude(text)}
            theme={{
              colors: {
                placeholder: Colors.grey_888888,
                text: Colors.black,
                primary: Colors.grey_C0C0C0,
                underlineColor: 'transparent',
                backgroundColor: Colors.white,
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
        <TouchableOpacity style={{ flex: 1, height: 40 }} onPress={onLocationEnablePressed}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                flex: 1,
                fontFamily: 'Titillium-Semibold',
                color: '#ffffff',
                fontSize: 14,
                textAlign: 'center',
                backgroundColor: '#DC631F',
                borderRadius: 10,
                padding: 10,
                borderColor: '#DC631F',
                borderWidth: 1,
              }}>
              <MaterialCommunityIcons
                name="crosshairs-gps"
                color="#ffffff"
                size={14}
              />
              Location
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 60,
          backgroundColor: '#ffffff',
          margin: 1,
          marginTop: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <TouchableOpacity
            style={{ flex: 0.5, height: 40 }}
            onPress={onResetClick}>
            <Text
              style={{
                flex: 1,
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 14,
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderRadius: 10,
                padding: 10,
                borderColor: '#DC631F',
                borderWidth: 1,
              }}>
              Reset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 0.5, height: 40 }}
            onPress={onAddClick}>
            <Text
              style={{
                flex: 1,
                marginLeft: 10,
                fontFamily: 'Titillium-Semibold',
                color: '#ffffff',
                fontSize: 14,
                textAlign: 'center',
                backgroundColor: '#DC631F',
                borderRadius: 10,
                padding: 10,
                borderColor: '#DC631F',
                borderWidth: 1,
              }}>
              {props.isEditForm ? 'Save' :  'Add' }
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <DialogView
        showAlertDialog
        visible={isRenewRecent.visible}
        text={isRenewRecent.text}
        onConfirm={() => {
          setRenewRecent({ text: '', visible: false });
        }}
        textConfirm={'Okay'}></DialogView>

      <Spinner
        animation={'fade'}
        overlayColor={Colors.orange_295CBF}
        indicatorStyle={globalStyles.loader}
        visible={isLoading.spinner}
        textContent={isLoading.spinnerText}
        textStyle={globalStyles.spinnerTextStyle}
      />
    </View>
  );
};

function mapStateToProps(state, props) {
  return {
    userInfo: state.mainReducers.main.userInfo,
  };
}
export default connect(mapStateToProps)(NASForm);
