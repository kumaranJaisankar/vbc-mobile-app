import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../../Common/Colors';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getOLTZone,
  getParentNASId,
  getParentNASSerialNo,
  getOLTarea,
  addOLT,
  updateOLT,
} from '../../../services/MainService';
import { Dropdown } from 'react-native-element-dropdown';
import styles from '../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import { showMessage } from 'react-native-flash-message';
import globalStyles from '../../../Common/globalStyles';
import locationServices from '../../../services/api';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import DialogView from '../../../Common/DialogView';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';

const OLTForm = props => {

  console.log("its the props data", props);
  const editFormData = props.isEditForm ? props.formData : {};

  const [isLoading, setLoading] = useState({
    spinner: false,
    spinnerText: '',
  });

  const [isFocus, setIsFocus] = useState(false);
  const [show, setShow] = useState(false);
  const [hCategory, setHCategory] = useState(props.isEditForm ? editFormData?.hardware_category : '');
  const [branch, setBranch] = useState(props.isEditForm ? editFormData?.branch : '');
  const [franchise, setFranchise] = useState(null);
  const [zone, setZone] = useState(props.isEditForm ? editFormData?.zone.id : '');
  const [zoneSNo, setZoneSNo] = useState(props.isEditForm ? editFormData?.serial_no : '');
  const [state, setState] = useState(props.isEditForm ? editFormData?.state : '');
  const [deviceModel, setDeviceModel] = useState(props.isEditForm ? editFormData?.device_model : '');
  const [oltCriteria, setOLTCriteria] = useState(props.isEditForm ? editFormData?.olt_use_criteria?.toString() : '');
  const [hardwareName, setHardwareName] = useState(props.isEditForm ? editFormData?.name : '');
  const [district, setDistrict] = useState(props.isEditForm ? editFormData?.district : '');
  const [hNo, setHNo] = useState(props.isEditForm ? editFormData?.house_no : '');
  const [availablePorts, setAvailablePorts] = useState(props.isEditForm ? editFormData?.available_ports : 0);
  const [street, setStreet] = useState(props.isEditForm ? editFormData?.street : '');
  const [landMark, setLandMark] = useState(props.isEditForm ? editFormData?.landmark : '');
  const [city, setCity] = useState(props.isEditForm ? editFormData?.city : '');
  const [pinCode, setPinCode] = useState(props.isEditForm ? editFormData?.pincode?.toString() : '');
  const [modal, setModal] = useState('');
  const [capacity, setCapacity] = useState(props.isEditForm ? editFormData?.no_of_ports?.toString() : '');
  const [country, setCountry] = useState(props.isEditForm ? editFormData?.country : '');
  const [latitude, setLatitude] = useState(props.isEditForm ? editFormData?.latitude?.toString() : '');
  const [notes, setNotes] = useState(props.isEditForm ? editFormData?.notes : '');
  const [longitude, setLongitude] = useState(props.isEditForm ? editFormData?.longitude?.toString() : '');
  const [noOfPorts, setNoOfPorts] = useState(props.isEditForm ? editFormData?.no_of_ports?.toString() : '');
  const [parentNasSNo, setParentNasSNo] = useState();
  const [specification, setSpecification] = useState(props.isEditForm ? editFormData?.specification : '');
  const [make, setMake] = useState(props.isEditForm ? editFormData?.make : '');
  const [isData, setData] = useState([]);
  const [parentNASID, setParentNASID] = useState();
  const [zoneData, setZoneData] = useState([]);
  const [locatioData, setLocationData] = useState({});
  const [isLocationFetched, setLocationFetched] = useState(false);
  const [arealist, setAreaList] = useState([]);
  const [areaData, setAreaData] = useState('');
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });

  console.log(arealist, 'arealist');
  const hardwareCategory = [
    { name: 'Internet', code: 'INT' },
    { name: 'Cable TV', code: 'CT' },
  ];
  const makeData = [
    // {name: 'Mikrotik', code: 'MTK'},
    // {name: 'Cisco', code: 'CIS'},
    // {name: 'Juniper', code: 'JUN'},
    // {name: 'Huawei', code: 'HUW'},
    // {name: 'Alcatel', code: 'ATL'},
    // {name: 'HB', code: 'HB'},
    { name: 'Optilink', code: 'OTLK' },
    { name: 'Syrotech', code: 'SRT' },
    { name: 'Timescope', code: 'TS' },
    { name: 'Tejas', code: 'TJS' },
    { name: 'KWAHISH', code: 'KWSH' },
    { name: 'DBC', code: 'DBC' },
  ];
  const [location, setLocation] = useState(false);
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
            setHNo(result.houseNumber);
            setStreet(result.street);
            setDistrict(result.district);
            setState(result.state);
            setCity(result.city);
            setPinCode(result.pincode);
            setCountry(result.area);
            setLatitude(result.lat);
            setLongitude(result.lng);
            setLandMark(result.locality);
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

  const onResetClick = () => {
    setHCategory('');
    setZone('');
    setAreaData('');
    setZoneData([]);
    setData([]);
    setParentNasSNo('');
    setMake('');
    setZoneSNo('');
    setHardwareName('');
    setNoOfPorts('');
    setSpecification('');
    setCapacity('');
    setDeviceModel('');
    setAvailablePorts('');
    setOLTCriteria('');
    setHNo('');
    setStreet('');
    setLandMark('');
    setCity('');
    setPinCode('');
    setDistrict('');
    setState('');
    setNotes('');
    setCountry('');
    setLatitude('');
    setLongitude('');
    setLocationFetched(false);
  };
  const onAddClick = async () => {
    console.log("it is validation data", parentNASID,
      oltCriteria,
      street,
      city,
      district,
      pinCode,
      state,
      country,
      availablePorts,
      landMark);
    if (
      // hCategory &&
      // hardwareName &&
      (props.isEditForm || parentNASID) &&
      oltCriteria &&
      // zoneSNo &&
      // deviceModel &&
      // noOfPorts &&
      // specification &&
      street &&
      city &&
      district &&
      pinCode &&
      state &&
      country &&
      // capacity &&
      // notes &&
      availablePorts &&
      // zone &&
      // areaData &&
      // make &&
      landMark
    ) {
      var body = {
        hardware_category: hCategory,
        name: hardwareName,
        parent_nas: parentNASID,
        olt_use_criteria: oltCriteria,
        serial_no: { name: zoneSNo },
        device_model: deviceModel,
        no_of_ports: Number(noOfPorts),
        specification: specification,
        house_no: hNo,
        street: street,
        city: city,
        latitude: Number(latitude),
        longitude: Number(longitude),
        district: district,
        pincode: parseInt(pinCode),
        state: state,
        country: country,
        capacity: Number(capacity),
        notes: notes,
        available_ports: availablePorts,
        zone: zone,
        area: areaData,
        make: make,
        landmark: landMark,
        franchise:
          props.userInfo.franchise != undefined
            ? props.userInfo.franchise.id
            : null,
      };
      console.log(body, 'bidyolt');
      if (pinCode?.length < 6) {
        setRenewRecent({
          text: 'Pincode Can Not Less Than 6 Digit!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Pincode Can Not',
        //   text2: 'Less Than 6 Digit!',
        // });
        return;
      }
      if (!longitude || longitude === '' || longitude === null) {
        setRenewRecent({
          text: 'Please fillup the longitude field!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Please fillup the longitude field!',
        // });
        return;
      }
      
// serial no
 if (!zoneSNo || zoneSNo === '' || zoneSNo === null) {
        setRenewRecent({
          text: 'Please fillup the Serial No field!',
          visible: true,
        });
        return;
      }
      // hCategory
      if (!hCategory || hCategory === '' || hCategory === null) {
        setRenewRecent({
          text: 'Please fillup the hardware category field!',
          visible: true,
        });
        return;
      }

      // zone
      if (!zone || zone === '' || zone === null) {
        setRenewRecent({
          text: 'Please fillup the zone field!',
          visible: true,
        });
        return;
      }

      // areaData
      if (!areaData || areaData === '' || areaData === null) {
        setRenewRecent({
          text: 'Please fillup the area field!',
          visible: true,
        });
        return;
      }
      // parentNasSNo
      // if (!parentNasSNo || parentNasSNo === '' || parentNasSNo === null) {
      //   setRenewRecent({
      //     text: 'Please fillup the parent serial no field!',
      //     visible: true,
      //   });
      //   return;
      // }
      // make
      if (!make || make === '' || make === null) {
        setRenewRecent({
          text: 'Please fillup the make field!',
          visible: true,
        });
        return;
      }
      // hardware Name
      if (!hardwareName || hardwareName === '' || hardwareName === null) {
        setRenewRecent({
          text: 'Please fillup the hardware name field!',
          visible: true,
        });
        return;
      }
      // no Of Ports
      if (!noOfPorts || noOfPorts === '' || noOfPorts === null) {
        setRenewRecent({
          text: 'Please fillup the no of ports field!',
          visible: true,
        });
        return;
      }
      // specification
      if (!specification || specification === '' || specification === null) {
        setRenewRecent({
          text: 'Please fillup the specification field!',
          visible: true,
        });
        return;
      }
      // capacity
      if (!capacity || capacity === '' || capacity === null) {
        setRenewRecent({
          text: 'Please fillup the capacity per port field!',
          visible: true,
        });
        return;
      }
      // deviceModel

      if (!deviceModel || deviceModel === '' || deviceModel === null) {
        setRenewRecent({
          text: 'Please fillup the device model field!',
          visible: true,
        });
        return;
      }
      // notes
      if (!notes || notes === '' || notes === null) {
        setRenewRecent({
          text: 'Please fillup the device model field!',
          visible: true,
        });
        return;
      }
      if (!latitude || latitude === '' || latitude === null) {
        setRenewRecent({
          text: 'Please fillup the latitude field!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Please fillup the latitude field!',
        // });
        return;
      }
     
     
      if (/^[a-zA-Z0-9,_@-]+$/.test(specification) === false) {
        setRenewRecent({
          text: 'Specification Allows Alphanumeric and special char(@ _ -)',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Specification Allows',
        //   text2: 'Alphanumeric and special char(@ _ -)',
        // });
        return;
      } else if (/^[a-zA-Z0-9,_@-]+$/.test(deviceModel) === false) {
        setRenewRecent({
          text: 'Model Allows Alphanumeric and special char(@ _ -)',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Model Allows',
        //   text2: 'Alphanumeric and special char(@ _ -)',
        // });
        return;
      } 
      
  

      else if (/^[a-zA-Z0-9,_-]+$/.test(zoneSNo) === false) {
        setRenewRecent({
          text: 'Serial No. Only Allow Alphanumeric and special char(_ -), No White Spaces Allow',
          visible: true,
        });
        // zoneSNo
        // Toast.show({
        //   type: 'error',
        //   text1: 'Serial No. Allows',
        //   text2: 'Alphanumeric and special char(@ _ -)',
        // });
        return;
      }
      else if (/^[a-zA-Z0-9,_-]+$/.test(hardwareName) === false) {
        setRenewRecent({
          text: 'Hardware Name Allows Alphanumeric and special char( _ -)',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Hardware Name Allows',
        //   text2: 'Alphanumeric and special char(@ _ -)',
        // });
        return;
      } 

      else if (/^[a-zA-Z0-9,_-]+$/.test(notes) === false) {
        setRenewRecent({
          text: 'Notes Allows Alphanumeric and special char( _ -)',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Notes Allows',
        //   text2: 'Alphanumeric and special char( _ -)',
        // });
        return;
      }
      setLoading({ spinner: true, spinnerText: props.isEditForm ? 'Editing OLT...' : 'Creating OLT...' });
      try {
        if(props.isEditForm) {
          const areaObj = arealist.find((item) => item.id == areaData);
          body.area = areaObj;
          body.id = editFormData?.id;
          body.status = editFormData?.status;
          body.branch = editFormData?.branch;
          delete body.available_ports;
          delete body.olt_use_criteria;
          body.created_by = editFormData?.created_by;
          body.created_at = editFormData?.created_at;
          body.franchise = editFormData?.franchise;
        }

        const response = props.isEditForm ? await updateOLT(body) : await addOLT(body);
        console.log('body', body);
        console.log('response', response);
        if (response.isSuccess) {
          const responseMsg = response;
          // await onResetClick();
          await setLoading({ spinner: false, spinnerText: '' });
          await Toast.show({
            type: 'success',
            text1: props.isEditForm ? 'OLT Edited Successfully!' : 'OLT Created Successfully!',
          });
          props.oltListView();
        } else {
          const errorresponse = response?.message?.response?.data;
          console.log(
            '🚀 ~ file: OLTForm.js:188 ~ onAddClick ~ errorresponse:',
            errorresponse,
          );
          setLoading({ spinner: false, spinnerText: '' });
          // Toast.show({
          //   type: 'error',
          //   text1: 'OLT with this name already exists.',
          // });
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
            }  else{
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
        }
      } catch (error) {
        const errorresponse = error.toString();
        console.log("its the error response", errorresponse);
        setLoading({ spinner: false, spinnerText: '' });
        setRenewRecent({
          text: 'Something went wrong! Please try again later!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Something went wrong! Please try again later.',
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
  const getParentNASSNo = async areaID => {
    try {
      const response = await getParentNASSerialNo(areaID);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setData(response.result);
        } else {
          const responseMsg = response;
          setData([]);
          setRenewRecent({
            text: 'No serial no. available for this zone!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No serial no. available for this zone!',
          // });
        }
      } else {
        const responseMsg = response;
        setData([]);
        setRenewRecent({
          text: 'No serial no. available for this zone!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No serial no. available for this zone!',
        // });
      }
    } catch (error) {
      const errorResponse = error.toString();
      setData([]);
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
  const getParentNAS = async zoneSNo => {
    try {
      const response = await getParentNASId(zoneSNo);
      if (response.isSuccess) {
        setParentNASID(response.result[response.result.length - 1].id);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorResponse = error.toString();
    }
  };

  const getZones = async () => {
    try {
      const response = await getOLTZone();
      console.log(response);
      if (response.isSuccess) {
        setZoneData(response.result);
        props.isEditForm && setZone(editFormData?.zone.id);
      } else {
        const resposneMsg = response;
        setRenewRecent({
          text: 'No zone available!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No zone available!',
        // });
      }
    } catch (error) {
      const errorResponse = error.toString();
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

  // get area list
  const getAreas = async zoneID => {
    try {
      const response = await getOLTarea(zoneID, props?.userInfo?.franchise?.id || props?.formData?.franchise?.id);
      console.log(response);
      if (response.isSuccess) {
        setAreaList(response.result);
      } else {
        const resposneMsg = response;
        setRenewRecent({
          text: 'No Area available!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No Area available!',
        // });
      }
    } catch (error) {
      const errorResponse = error.toString();
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

  // const getCurrentLocation = async () => {
  //   // setRenewRecent({
  //   //   text: 'Sorry! Location is not working now.',
  //   //   visible: true,
  //   // });
  //   // return;
  //   if (isLocationFetched) {
  //     setRenewRecent({
  //       text: 'Location details already fetched!',
  //       visible: true,
  //     });
  //     // Toast.show({
  //     //   type: 'warning',
  //     //   text1: 'Location details already fetched!',
  //     // });
  //   } else {
  //     try {
  //       setLoading({spinner: true, spinnerText: 'Fetching location...'});

  //       await locationServices.getGeoLocation(
  //         response => {
  //           if (response.responseCode) {
  //             let result = response.results[0];
  //             // setHNo(result.houseNumber);
  //             // setStreet(result.street);
  //             // setDistrict(result.district);
  //             // setState(result.state);
  //             // setCity(result.city);
  //             // setPinCode(result.pincode);
  //             // setCountry(result.area);
  //             setLatitude(result.lat);
  //             setLongitude(result.lng);
  //             // setLandMark(result.locality);
  //             setLocationFetched(true);
  //             setLoading({spinner: false, spinnerText: ''});
  //           }
  //         },
  //         error => {
  //           setLocationFetched(false);
  //           setLoading({spinner: false, spinnerText: ''});
  //           setRenewRecent({
  //             text: 'No Location Details Found!',
  //             visible: true,
  //           });
  //           // Toast.show({
  //           //   type: 'error',
  //           //   text1: 'No Location Details Found!',
  //           // });
  //         },
  //       );
  //     } catch (err) {
  //       setRenewRecent({
  //         text: 'Problem in Location fetching!',
  //         visible: true,
  //       });
  //       // Toast.show({
  //       //   type: 'error',
  //       //   text1: 'This is problem in Location fetching!',
  //       // });
  //     }
  //   }
  // };

  const mapDropdownFields = async () => {
    await getZones();
    await getAreas(zone);
    setAreaData(editFormData?.area.id);
  }

  useEffect(() => {
    if(props.isEditForm) {
      mapDropdownFields();
    } else {
      getZones();
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={hardwareCategory}
            maxHeight={100}
            labelField="name"
            valueField="code"
            placeholder="Hardware Category *"
            value={hCategory}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setHCategory(item.code);
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
            data={zoneData}
            maxHeight={200}
            labelField="name"
            valueField="id"
            placeholder="Zone *"
            value={zone}
            onFocus={() => {
              setIsFocus(true);
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
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={arealist}
            maxHeight={200}
            labelField="name"
            valueField="id"
            placeholder="Area *"
            // value={zone}
            value={areaData}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setAreaData(item.id);
              setIsFocus(false);
              getParentNASSNo(item.id);
            }}
          />
        </View>
      </View>

      {!props.isEditForm && <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={isData}
            maxHeight={200}
            labelField="name"
            valueField="name"
            placeholder="Parent Serial No *"
            value={parentNasSNo}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setParentNasSNo(item.name);
              setIsFocus(false);
              getParentNAS(item.name);
            }}
          />
        </View>
      </View>}

      {!props.isEditForm && <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={makeData}
            maxHeight={200}
            labelField="name"
            valueField="code"
            placeholder="Make *"
            value={make}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setMake(item.code);
              setIsFocus(false);
            }}
          />
        </View>
      </View>}

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Serial No *'}
            value={zoneSNo}
            maxLength={20}
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
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]*$/.test(text)) return setZoneSNo(text)}}
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

      {props?.userInfo?.franchise && (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <TextInput
              mode="outlined"
              label={'Franchise'}
              value={props?.userInfo?.franchise?.name}
              maxLength={20}
              returnKeyType="next"
              keyboardType="default"
              placeholderStyle={{ fontSize: 20 }}
              underlineColorAndroid="transparent"
              disabled={true}
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
      )}
      {props?.userInfo?.branch && (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <TextInput
              mode="outlined"
              label={'Branch'}
              value={props?.userInfo?.branch?.name}
              maxLength={20}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="default"
              placeholderStyle={{ fontSize: 20 }}
              underlineColorAndroid="transparent"
              disabled={true}
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
      )}

      {props?.userInfo?.department && (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <TextInput
              mode="outlined"
              label={'Department'}
              value={props?.userInfo?.department?.name}
              maxLength={20}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="default"
              placeholderStyle={{ fontSize: 20 }}
              underlineColorAndroid="transparent"
              disabled={true}
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
      )}

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Hardware Name *'}
            value={hardwareName}
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
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]*$/.test(text)) return setHardwareName(text)}}
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
            label={'No Of Ports *'}
            value={noOfPorts}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="numeric"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            maxLength={3}
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
            onChangeText={text => {
              setNoOfPorts(parseInt(text));
              setAvailablePorts(parseInt(text));
              setOLTCriteria(parseInt(text) * parseInt(capacity));
            }}
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
            label={'Specification *'}
            value={specification}
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
            onChangeText={text => setSpecification(text)}
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
            label={'Capacity per port *'}
            value={capacity}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="numeric"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            maxLength={3}
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
            onChangeText={text => {
              setCapacity(parseInt(text));
              setOLTCriteria(parseInt(text) * noOfPorts);
            }}
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
            label={'Device Model *'}
            value={deviceModel}
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
            onChangeText={text => setDeviceModel(text)}
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
            label={'Notes *'}
            value={notes}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="default"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            maxLength={500}
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
            onChangeText={text => setNotes(text)}
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
            label={'OLT Use Criteria *'}
            value={oltCriteria.toString()}
            editable={false}
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
            label={'House No *'}
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
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Street *'}
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
            label={'Landmark *'}
            value={landMark}
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
            onChangeText={text => setLandMark(text)}
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
            value={pinCode}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="numeric"
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
            onChangeText={text => setPinCode(text)}
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
            label={'Latitude'}
            value={latitude}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="numeric"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            maxLength={15}
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
            label={'Longitude'}
            value={longitude}
            returnKeyType="next"
            autoCapitalize="none"
            keyboardType="numeric"
            placeholderStyle={{ fontSize: 20 }}
            underlineColorAndroid="transparent"
            maxLength={15}
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
          //shadowRadius: 2,
          margin: 1,
          // shadowOffset: {
          //   width: 0,
          //   height: -1,
          // },
          // shadowColor: '#000000',
          //elevation: 4,
          marginTop: 15,
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
              {props.isEditForm ? 'Save' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Spinner
        animation={'fade'}
        overlayColor={Colors.orange_295CBF}
        indicatorStyle={globalStyles.loader}
        visible={isLoading.spinner}
        textContent={isLoading.spinnerText}
        textStyle={globalStyles.spinnerTextStyle}
      />
      <DialogView
        showAlertDialog
        visible={isRenewRecent.visible}
        text={isRenewRecent.text}
        // onCancel={() => {
        //   setRenewRecent({text: '', visible: false});
        // }}
        // textCancel={'No'}
        onConfirm={() => {
          setRenewRecent({ text: '', visible: false });
        }}
        textConfirm={'Okay'}></DialogView>
    </View>
  );
};

function mapStateToProps(state, props) {
  return {
    userInfo: state.mainReducers.main.userInfo,
  };
}
export default connect(mapStateToProps)(OLTForm);
