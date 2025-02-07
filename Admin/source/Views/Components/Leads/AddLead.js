import React, {useEffect, useRef, useState} from 'react';
import {Colors} from '../../Common/Colors';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {Dialog, DialogContent} from 'react-native-popup-dialog';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {TextInput} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import {
  getAreaListData,
  getLeadOptions,
  addLead,
  branchList,
  getFranchiseByBranchId,
  getZoneByFranchiseId,
  getAreaByZoneId,
  getLeadAssignTo,
  getroleData
} from '../../services/MainService';
import DialogView from '../../Common/DialogView';
import locationServices from '../../services/api';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Spinner from 'react-native-loading-spinner-overlay';
import globalStyles from '../../Common/globalStyles';

const AddLead = props => {
  const windowHeight = Dimensions.get('window').height;
  // const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [isFocus, setIsFocus] = React.useState(false);

  const [leadSourceData, setLeadSourceData] = React.useState([]);
  const [leadTypeData, setLeadTypeData] = React.useState([]);
const[roleData,setRoleData]=React.useState([]);
  const [leadSource, setLeadSource] = React.useState({});
  const[assignToId,setAssignToId]= useState('');
  const[assignStatus,setAssignStatus]=useState('')
  const[role, setRole]=useState('');
  const [leadType, setLeadType] = React.useState({});
  const [leadStatus, setLeadStatus] = React.useState('');
  const [frequency, setFrequency] = React.useState('');
  const [pincode, setPinCode] = React.useState('');
  const [hNo, setHNo] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [landmark, setLandmark] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [note, setNote] = useState('');
  const [isAlertMessage, setAlertMessage] = React.useState('');
  const [showErrorAlertDialog, setShowErrorAlertDialog] = React.useState(false);
  const [showWarningAlertDialog, setShowWarningAlertDialog] =
    React.useState(false);
  const [showSuccessfulAlertDialog, setShowSuccessfulAlertDialog] =
    React.useState(false);
    const [isLoading, setLoading] = useState({
      spinner: false,
      spinnerText: '',
    });
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });
  //const [isLoading, setLoading] = React.useState(false);
  // const [isLoading, setLoading] = React.useState({text: '', visible: false});
  const [isLocationFetched, setLocationFetched] = React.useState(false);
  const leadStatusData = [
    {name: 'Open Lead', value: 'OPEN'},
    {name: 'Feasible Lead', value: 'QL'},
    {name: 'Non Feasible Lead', value: 'UQL'},
    {name: 'Closed But Not Converted', value: 'CBNC'},
    {name: 'Closed and Converted', value: 'CNC'},
    {name: 'Lead Conversion', value: 'LC'}
  ];
const frequencyData = [
    {
      id: "DAILY",
      name: "Daily",
    },
    {
      id: "WEEK",
      name: "Weekly",
    },
    {
      id: "MONTH",
      name: "Monthly",
    },
  ];
  const assignStatusData = [
    {
      id: "LAT",
      name: "Assign Later",
    },
    {
      id: "NOW",
      name: "Assign Now",
    },
  ];

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const [branchLists, setBranchList] = useState([]);
  const [franchiseList, setFranshiseList] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  const [areaData, setAreaData] = React.useState([]);
const[leadAssignData,setLeadAssignToData]=useState([]);
  const [area, setArea] = useState([]);
  const [branchID, setBranchID] = useState('');
  const [franchiseID, setFranchiseID] = useState('');
  const [zoneID, setZoneID] = useState('');
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = React.useState('date');
  const [start_date, setStart_date] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
  let timeInterval='';
  React.useEffect(() => {
    getBranchList();
    getRoles();
  }, []);
  // const onLocationEnablePressed = () => {
  //   if (Platform.OS === 'android') {
  //     RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
  //       interval: 10000,
  //       fastInterval: 5000,
  //     })
  //       .then(data => {
  //         console.log('location data', data);
  //         if (data == 'already-enabled') {
  //           getCurrentLocation();
  //         }
  //         if (data == 'enabled') {
  //           getCurrentLocation();
  //         }
  //       })
  //       .catch(err => {
  //         // The user has not accepted to enable the location services or something went wrong during the process
  //         // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
  //         // codes :
  //         //  - ERR00 : The user has clicked on Cancel button in the popup
  //         //  - ERR01 : If the Settings change are unavailable
  //         //  - ERR02 : If the popup has failed to open
  //         alert('Error ' + err.message + ', Code : ' + err.code);
  //       });
  //   }
  // };

  // const getAreaList = async () => {
  //   try {
  //     const response = await getAreaListData();
  //     if (response.isSuccess) {
  //       if (response.result.areas.length > 0) {
  //         setAreaData(response.result.areas);
  //       } else {
  //         const responseMsg = response;
  //       }
  //     } else {
  //       const responseMsg = response;
  //     }
  //   } catch (error) {
  //     const errorresponse = error.toString();
  //   }
  // };
  var dateTime = '';
  const formatDate = date => {
    console.log('date', date);
    dateTime = format(new Date(date), 'dd/MM/yyyy');
    // dateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return dateTime;
  };
  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === 'ios');
    const selectedTime = selectedValue || new Date();
    setTime(selectedTime);
    setShow(Platform.OS === 'ios');
  };
  
  const showTimepicker = () => {
    showMode();
  };
  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode('date');
  };
  const onChangeformDate = (event, selectedValue) => {
    setShow(Platform.OS === 'ios');
    if (mode == 'date') {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
      setStart_date(format(new Date(currentDate), 'yyyy-MM-dd'));
      // setShow(Platform.OS !== 'ios');
      setShow(false);
      setMode('date');
    } else {
      const selectedTime = selectedValue || new Date();
      setTime(selectedTime);
      // setShow(Platform.OS === 'ios');
      setShow(false);
      setMode('date');
    }
  };
  const getBranchList = async () => {
    const res = await branchList();
    console.log('🚀 ~ file: BillingHistory.js:97 ~ getBranchList ~ res:', res);
    if (res.isSuccess) {
      // res.result.push({
      //   id: 0,
      //   name: 'All',
      // });
      setBranchList(res?.result);
    } else {
      setBranchList([]);
    }
  };
  const getFranchise = async value => {
    const res = await getFranchiseByBranchId(value);
    console.log('🚀 ~ file: BillingHistory.js:83 ~ getFranchise ~ res:', res);
    if (res.isSuccess) {
      // res.result.push({
      //   id: 0,
      //   name: 'All',
      // });
      setFranshiseList(res?.result);
    } else {
      setFranshiseList([]);
    }
  };
  const getZones = async value => {
    const res = await getZoneByFranchiseId(value);
    if (res.isSuccess) {
      // res.result.push({
      //   id: 0,
      //   name: 'All',
      // });
      setZonesList(res?.result);
    } else {
      setZonesList([]);
    }
  };

  const getAreas = async value => {
    const res = await getAreaByZoneId(value);
    if (res.isSuccess) {
      // res.result.push({
      //   id: 0,
      //   name: 'All',
      // });
      setAreaData(res?.result);
    } else {
      setAreaData([]);
    }
  };
  
  const getLeadsAssignedToData = async value => {
    const res = await getLeadAssignTo(value);
    console.log(res)
    if (res.isSuccess) {
      setLeadAssignToData(res?.result);
    } else {
      setLeadAssignToData([]);
    }
  };
  const getLeadFilterOptions = async () => {
    try {
      const response = await getLeadOptions();
      console.log("response lead",response)
      if (response.isSuccess) {
        if (response.result.lead_source.length > 0) {
          setLeadSourceData(response.result.lead_source);
        }
        if (response.result.type.length > 0) {
          setLeadTypeData(response.result.type);
        }
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorresponse = error.toString();
    }
  };
  const getRoles = async () => {
    try {
      const response = await getroleData();
      console.log("response role data",response)
      if (response.isSuccess) {
       
          setRoleData(response?.result?.roles);
      }
    } catch (error) {
      const errorresponse = error.toString();
    }
  };
  React.useEffect(() => {
   console.log(assignToId,"assignToId")
  }, [assignToId]);

  const onAddClick = async () => {
    if (
      // username &&
      firstName &&
      lastName &&
      mobile &&
      email &&
      area &&
      pincode &&
      street &&
      district &&
      landmark &&
      city &&
      state &&
      country &&
      leadSource &&
      leadType &&
      leadStatus &&
      note
    ) {
      if(leadStatus === 'QL' ) {
        if(!assignStatus) {
          setAlertMessage('Please fill up all the required fields!');
          setShowWarningAlertDialog(true);
          return;
        }
        if(assignStatus === "NOW") {
          if(!assignToId || !role) {
            setAlertMessage('Please fill up all the required fields!');
            setShowWarningAlertDialog(true);
            return;
          }
        }
      }

      if(leadStatus === "OPEN" && !frequency) {
        setAlertMessage('Please fill up all the required fields!');
        setShowWarningAlertDialog(true);
        return;
      }

      if(!validateEmail(email)) {
          setAlertMessage('Please enter valid email address!');
          setShowWarningAlertDialog(true);
          return
      }

      if(pincode.length < 6) {
        setAlertMessage('Please enter valid pincode!');
        setShowWarningAlertDialog(true);
        return
    }

      let body = {
        first_name: firstName,
        last_name: lastName,
        mobile_no: mobile,
        email: email,
        house_no: hNo?hNo:'N/A',
        street: street,
        city: city,
        pincode: parseInt(pincode),
        state: state,
        country: country,
        landmark: landmark,
        district: district,
        area: area,
        lead_source: leadSource,
        type: leadType,
        status: leadStatus,
        ...(leadStatus ==='QL'||leadStatus ==='OPEN'?{follow_up: date,
        frequency:frequency}:{}),
        notes: note,
        ...(leadStatus ==='QL' || leadStatus  === 'UQL'?{
          assign: assignStatus,
          department: null,
        }:'')
        ,
        ...(((leadStatus ==='QL' || leadStatus  === 'UQL') &&  assignStatus === "NOW") ? {
          assigned_to: assignToId,
        } : '')
      };
      
      console.log(body,"leadBody")
     setLoading({text: 'Creating Lead...', visible: true});
      try {
        const response = await addLead(body);
        if (response.isSuccess) {
          const responseMsg = response;
          setLoading({text: '', visible: false});
          showErrorPopUp('addLeadSuccess');
          resetFields();
        } else if(response?.message?.response?.data?.department) {
          setLoading({text: '', visible: false});
          setAlertMessage(flag.department[0]);
          setShowWarningAlertDialog(true);
        } 
        else {
          const errorresponse = response;
          setLoading({text: '', visible: false});
          setAlertMessage(response?.message?.response.data);
          setShowWarningAlertDialog(true);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setLoading({text: '', visible: false});
        showErrorPopUp('addLeadError');
      }
    } else {
      setAlertMessage('Please fill up all the required fields!');
      setShowWarningAlertDialog(true);
    }
  };

  const showErrorPopUp = flag => {
    switch (flag) {
      case 'addLeadSuccess':
        setAlertMessage('Lead Created Successfully!');
        setShowSuccessfulAlertDialog(true);
        break;
      case 'addLeadError':
        setAlertMessage('Lead Creation Failed!');
        setShowErrorAlertDialog(true);
        break;
      case 'LocationError':
        setAlertMessage('No Location Details Found!');
        setShowErrorAlertDialog(true);
        break;
      case 'location_alreay_fetched':
        setAlertMessage('Location details already fetched!');
        setShowWarningAlertDialog(true);
        break;
      default:
        setAlertMessage('Something went wrong please try again');
        setShowWarningAlertDialog(true);
        break;
    }
  };

  const resetFields = () => {
    // setUsername('');
    setFirstName('');
    setLastName('');
    setMobile('');
    setEmail('');
    setArea('');
    setHNo('');
    setStreet('');
    setPinCode('');
    setState('');
    setDistrict('');
    setCountry('');
    setLandmark('');
    setCity('');
    setLeadSource('');
    setLeadType('');
    setLeadStatus('');
    setNote('');
    setLocationFetched(false);
  };
  // const getCurrentLocation = async () => {
  //   if (isLocationFetched) {
  //     showErrorPopUp('location_alreay_fetched');

  //   } else {
  //     setLoading({text: 'Fetching location...', visible: true});
  //     await locationServices.getGeoLocation(
  //       response => {
  //         if (response.responseCode) {
  //           let result = response.results[0];
  //           setHNo(result.houseNumber);
  //           setStreet(result.street);
  //           setDistrict(result.district);
  //           setState(result.state);
  //           setCity(result.city);
  //           setPinCode(result.pincode);
  //           setCountry(result.area);
  //           setLandmark(result.locality);
  //           setLocationFetched(true);
  //           setLoading({text: '', visible: false});
  //         }
  //       },
  //       error => {
  //         setLocationFetched(false);
  //         setLoading({text: '', visible: false});
  //         showErrorPopUp('LocationError');
  //       },
  //     );
  //   }
  // };
  // const getCurrentLocation = async () => {
  //   if (isLocationFetched) {
  //     setRenewRecent({
  //       text: 'Location details already fetched!',
  //       visible: true,
  //     });
  //   } else {
  //     setLoading({spinner: true, spinnerText: 'Fetching location...'});
  //     await locationServices.getGeoLocation(
  //       response => {
  //         console.log(response, 'map response');
  //         if (response.responseCode) {
  //           let result = response.results[0];
  //           setHNo(result.houseNumber);
  //           setStreet(result.street);
  //           setDistrict(result.district);
  //           setState(result.state);
  //           setCity(result.city);
  //           setPincode(result.pincode);
  //           setCountry(result.area);
  //           // setLatitude(result.lat);
  //           // setLongitude(result.lng);
  //           setLandmark(result.locality);
  //           setLocationFetched(true);
  //           setLoading({spinner: false, spinnerText: ''});
  //         }
  //       },
  //       error => {
  //         console.log(error, 'error location');
  //         setLocationFetched(false);
  //         setLoading({spinner: false, spinnerText: ''});
  //         setRenewRecent({
  //           text: 'No Location Details Found!',
  //           visible: true,
  //         });
  //       },
  //     );
  //   }
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
  console.log("inside getlocation");
    if (isLocationFetched) {
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
            setHNo(result.houseNumber);
            setStreet(result.street);
            setDistrict(result.district);
            setState(result.state);
            setCity(result.city);
            setPinCode(result.pincode);
            setCountry(result.area);
            // setLatitude(result.lat);
            // setLongitude(result.lng);
            setLandmark(result.locality);
            setLocationFetched(true);
            setLoading({ spinner: false, spinnerText: '' });
          }
        },
        error => {
          console.log(error)
          setLocationFetched(false);
          setLoading({ spinner: false, spinnerText: '' });
          if(error === "LocationError: Authorization denied") {
            setRenewRecent({
              text: 'Please turn on location access from application settings',
              visible: true,
            });
          } else if(error === "LocationError: Location not available") {
            setRenewRecent({
              text: 'Please turn on your location',
              visible: true,
            });
          } else {
            setRenewRecent({
              text: 'No Location Details Found!',
              visible: true,
            });
          }
        
        },
      );
    }
  };

  const navigation = useNavigation();
  
  const onAddLeadConfirmation = () => {
    setShowSuccessfulAlertDialog(false);
    sheetRef.current.close();
    navigation.navigate('Dashboard');
    navigation.navigate('Leads');
  }

  console.log(assignToId,"assignToId")
  var sheetRef = props.Ref;
  return (
    <RBSheet
      ref={sheetRef}
      closeOnDragDown={false}
      closeOnPressMask={false}
      height={windowHeight}
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
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 20,
        },
        draggableIcon: {
          backgroundColor: '#000',
        },
      }}>
      <View style={{padding: 15, flexDirection: 'column'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              flex: 0.9,
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 20,
            }}>
            Add New Leads
          </Text>
          <TouchableOpacity
            style={{flex: 0.1, alignItems: 'center'}}
            onPress={() => sheetRef.current.close()}>
            <Ionicons
              name={'ios-close'}
              size={33}
              color={'#DC631F'}
              style={{padding: 5, alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 16,
              marginTop: 10,
            }}>
            Personal Info
          </Text>

          <TextInput
            mode="outlined"
            label={'First Name *'}
            value={firstName}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{fontSize: 20}}
            underlineColorAndroid="transparent"
            style={{
              marginTop: 15,
              fontSize: 15,
              width: '100%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => { if(/^[a-zA-Z ]*$/.test(text)) return setFirstName(text) }}
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
          <TextInput
            mode="outlined"
            label={'Last Name *'}
            value={lastName}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{fontSize: 20}}
            underlineColorAndroid="transparent"
            style={{
              marginTop: 15,
              fontSize: 15,
              width: '100%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => { if(/^[a-zA-Z ]*$/.test(text)) return setLastName(text) }}
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
          <TextInput
            mode="outlined"
            label={'Mobile Number *'}
            value={mobile}
            maxLength={10}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="numeric"
            placeholderStyle={{fontSize: 20}}
            underlineColorAndroid="transparent"
            style={{
              marginTop: 15,
              fontSize: 15,
              width: '100%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => {if(/^[0-9]+$|^$/.test(text)) return setMobile(text)}}
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
          <TextInput
            mode="outlined"
            label={'Email *'}
            value={email}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{fontSize: 20}}
            underlineColorAndroid="transparent"
            style={{
              marginTop: 15,
              fontSize: 15,
              width: '100%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setEmail(text)}
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
          {/* <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={areaData}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Area *"
                value={area}
                onFocus={() => {
                  setIsFocus(true);
                  getAreaList();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setArea(item.id);
                  setIsFocus(false);
                }}
              />
            </View>
          </View> */}
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 16,
              marginTop: 20,
            }}>
            Address
          </Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <TextInput
              mode="outlined"
              label={'Pincode *'}
              value={pincode}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="numeric"
              maxLength={6}
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              style={{
                flex: 0.5,
                fontSize: 15,
                width: '100%',
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
                paddingBottom: 0,
                backgroundColor: '#FAFAFA',
              }}
              onChangeText={text => {if(/^[0-9]+$|^$/.test(text)) return setPinCode(text)}}
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
            <TextInput
              mode="outlined"
              label={'H.No. *'}
              value={hNo}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="numeric"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              style={{
                flex: 0.5,
                marginLeft: 10,
                fontSize: 15,
                width: '100%',
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
                paddingBottom: 0,
                backgroundColor: '#FAFAFA',
              }}
              onChangeText={text => setHNo(text)}
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

          <View style={{flexDirection: 'row', marginTop: 15}}>
            <TextInput
              mode="outlined"
              label={'Street *'}
              value={street}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="default"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              style={{
                flex: 0.5,
                fontSize: 15,
                width: '100%',
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
            <TextInput
              mode="outlined"
              label={'District *'}
              value={district}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="default"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              style={{
                flex: 0.5,
                marginLeft: 10,
                fontSize: 15,
                width: '100%',
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
                paddingBottom: 0,
                backgroundColor: '#FAFAFA',
              }}
              onChangeText={text => { if(/^[a-zA-Z ]*$/.test(text)) return setDistrict(text) }}
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

          <View style={{flexDirection: 'row', marginTop: 15}}>
            <TextInput
              mode="outlined"
              label={'Landmark *'}
              value={landmark}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="default"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              style={{
                flex: 0.5,
                fontSize: 15,
                width: '100%',
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
            <TextInput
              mode="outlined"
              label={'City *'}
              value={city}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="default"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              style={{
                flex: 0.5,
                marginLeft: 10,
                fontSize: 15,
                width: '100%',
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
                paddingBottom: 0,
                backgroundColor: '#FAFAFA',
              }}
              onChangeText={text => {if(/^[a-zA-Z ]*$/.test(text)) return setCity(text)}}
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

          <View style={{flexDirection: 'row', marginTop: 15}}>
            <TextInput
              mode="outlined"
              label={'State *'}
              value={state}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="default"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              style={{
                flex: 0.5,
                fontSize: 15,
                width: '100%',
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
                paddingBottom: 0,
                backgroundColor: '#FAFAFA',
              }}
              onChangeText={text => {if(/^[a-zA-Z ]*$/.test(text)) return setState(text)}}
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
            <TextInput
              mode="outlined"
              label={'Country *'}
              value={country}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="default"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              style={{
                flex: 0.5,
                marginLeft: 10,
                fontSize: 15,
                width: '100%',
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
                paddingBottom: 0,
                backgroundColor: '#FAFAFA',
              }}
              onChangeText={text => {if(/^[a-zA-Z ]*$/.test(text)) return setCountry(text)}}
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

          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 16,
              marginTop: 20,
            }}>
            Assign
          </Text>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={branchLists?.sort((a, b) => a.id - b.id)}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Branch"
                value={branchID}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setBranchID(item?.id);
                  setIsFocus(false);
                  getFranchise(item?.id);
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={franchiseList?.sort((a, b) => a.id - b.id)}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Franchise"
                value={franchiseID}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setFranchiseID(item?.id);
                  setIsFocus(false);
                  getZones(item?.id);
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={zonesList?.sort((a, b) => a.id - b.id)}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Zone"
                value={zoneID}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setZoneID(item?.id);
                  setIsFocus(false);
                  getAreas(item?.id);
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={areaData}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Area"
                value={area.id}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setArea(item.id);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={leadSourceData}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Lead Source *"
                value={leadSource.id}
                onFocus={() => {
                  setIsFocus(true);
                  getLeadFilterOptions();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setLeadSource({id: item.id, name: item.name});
                  setIsFocus(false);
                }}
              />
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={leadTypeData}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Lead Type *"
                value={leadType.id}
                onFocus={() => {
                  setIsFocus(true);
                  getLeadFilterOptions();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setLeadType({id: item.id, name: item.name});
                  setIsFocus(false);
                }}
              />
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={leadStatusData}
                maxHeight={200}
                labelField="name"
                valueField="value"
                placeholder="Lead Status *"
                value={leadStatus}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setLeadStatus(item.value);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
         
        {leadStatus==='QL' &&  <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={assignStatusData}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Assign Status *"
                value={assignStatus}
                onFocus={() => {
                  setIsFocus(true);
                  getLeadFilterOptions();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setAssignStatus(item.id);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
          }
          
          {(leadStatus==='QL' && assignStatus==='NOW') &&
          <>
            <View style={{flexDirection: 'row', marginTop: 5}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{marginTop: -22}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={roleData}
              maxHeight={200}
              labelField="name"
              valueField="id"
              placeholder="Role *"
              value={role}
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setRole(item.id);
                getLeadsAssignedToData(item.id);
                setIsFocus(false);
              }}
            />
          </View>
        </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={leadAssignData}
                maxHeight={200}
                labelField="username"
                valueField="id"
                placeholder="Assign To *"
                value={assignToId}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  console.log(item.id,"item.id");
                  setAssignToId(item.id);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
          </>
}
          {(leadStatus==='OPEN'||leadStatus==='QL') &&
          <>
          <View>
          <View style={{marginTop: 5}}>
                    <Text style={{marginLeft: 10, fontFamily: 'Titillium-Semibold', color: '#000000',fontSize: 15}}>Follow Up</Text>
                    <View
                      style={{
                        marginHorizontal: 5,
                        height: 48,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                        backgroundColor: '#FAFAFA',
                        borderColor: Colors.grey_C0C0C0,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.grey_888888,
                          fontSize: 15,
                        }}>
                        {date ? formatDate(date) : ''}
                      </Text>
                      <TouchableOpacity
                        style={{flex: 0.1, alignItems: 'center'}}
                        onPress={showDatePicker}>
                        <Ionicons
                          name={'calendar'}
                          size={20}
                          color={Colors.grey_888888}
                          style={{alignSelf: 'center'}}
                        />
                      </TouchableOpacity>
                    </View>
                    {show && (
                      <DateTimePicker
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeformDate}
                      />
                    )}
                  </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={frequencyData}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Frequency *"
                value={frequency}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setFrequency(item.id);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
          </>
}
         
          {/* <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={leadSourceData}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Frequency "
                value={leadSource.id}
                onFocus={() => {
                  setIsFocus(true);
                  getLeadFilterOptions();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setLeadSource({id: item.id, name: item.name});
                  setIsFocus(false);
                }}
              />
            </View>
          </View> */}
          <TextInput
            mode="outlined"
            label={'Notes *'}
            value={note}
            multiline={true}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{fontSize: 20}}
            underlineColorAndroid="transparent"
            style={{
              marginTop: 15,
              fontSize: 15,
              width: '100%',
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              paddingBottom: 0,
              backgroundColor: '#FAFAFA',
            }}
            onChangeText={text => setNote(text)}
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
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
            <TouchableOpacity
              style={{flex: 1, height: 40}}
              onPress={onLocationEnablePressed}>
              <View style={{flexDirection: 'row'}}>
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
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 30,
              marginBottom: 80,
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                borderRadius: 10,
                padding: 10,
                borderColor: '#DC631F',
                borderWidth: 1,
              }}
              onPress={resetFields}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Reset
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                marginLeft: 10,
                backgroundColor: '#DC631F',
                borderRadius: 10,
                padding: 10,
                borderColor: '#DC631F',
                borderWidth: 1,
              }}
              onPress={onAddClick}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#ffffff',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <DialogView
          showAlertDialog
          visible={isRenewRecent.visible}
          text={isRenewRecent.text}
          // onCancel={() => {
          //   setRenewRecent({text: '', visible: false});
          // }}
          // textCancel={'No'}
          onConfirm={() => {
            setRenewRecent({text: '', visible: false});
          }}
          textConfirm={'Okay'}></DialogView>
        <DialogView
          showUnSuccessfulAlert
          confirmText={'Ok'}
          visible={showErrorAlertDialog}
          text={isAlertMessage}
          onConfirm={() => {
            setShowErrorAlertDialog(false);
          }}></DialogView>
        <DialogView
          showSuccessfulAlert
          confirmText={'Ok'}
          visible={showSuccessfulAlertDialog}
          text={isAlertMessage}
          onConfirm={() => onAddLeadConfirmation()}></DialogView>
        <DialogView
          showWarningAlert
          confirmText={'Ok'}
          visible={showWarningAlertDialog}
          text={isAlertMessage}
          onConfirm={() => {
            setShowWarningAlertDialog(false);
          }}></DialogView>
        <DialogView
          showLoadingDialog
          visible={isLoading.visible}
          text={isLoading.text}></DialogView>
            <Spinner
        animation={'fade'}
        overlayColor={Colors.orange_295CBF}
        indicatorStyle={globalStyles.loader}
        visible={isLoading.spinner}
        textContent={isLoading.spinnerText}
        textStyle={globalStyles.spinnerTextStyle}
      />
      </View>
    </RBSheet>
  );
};

export default AddLead;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 25,
    color: 'white',
    flex: 1,
  },
  dropdown: {
    marginTop: 5,
    borderColor: Colors.grey_C0C0C0,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FAFAFA',
    padding: 5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.grey_888888,
    fontSize: 15,
  },
  selectedTextStyle: {
    fontFamily: 'Titillium-Semibold',
    color: '#000000',
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
