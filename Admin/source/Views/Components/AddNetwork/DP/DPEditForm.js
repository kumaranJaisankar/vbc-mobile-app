import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../../Common/Colors';
import { TextInput } from 'react-native-paper';
import {
  getOLTZone,
  getDPParentSerialNo,
  getParentNASId,
  addPDP,
  addCDP,
  getOLTarea,
  getDPChildSerialNo,
  parentOLTData,
  OLTPortsData,
  parentDpsData,
  parentDpPortsData,
	updatePDP,
	updateCDP,
} from '../../../services/MainService';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton } from 'react-native-paper';
import styles from '../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import { showMessage } from 'react-native-flash-message';
import globalStyles from '../../../Common/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import locationServices from '../../../services/api';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import DialogView from '../../../Common/DialogView';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const DPEditForm = props => {

	const isDPEdit = props.isEditForm;
	const dpFormData = props.formData;

  const [isLoading, setLoading] = useState({
    spinner: false,
    spinnerText: '',
  });
  const [username, setUsername] = useState('');
  const [dpName, setDPName] = useState(dpFormData.name || '');
  const [checked, setChecked] = useState('parent');
  const [zoneData, setZoneData] = useState([]);
  const [zone, setZone] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [parentData, setParentData] = useState([]);
  const [noOfPorts, setNoOfPorts] = useState(dpFormData?.no_of_ports?.toString());
  const [availablePorts, setAvailablePorts] = useState(0);
  const [state, setState] = useState(dpFormData.state || '');
  const [district, setDistrict] = useState(dpFormData.district || '');
  const [hNo, setHNo] = useState(dpFormData.house_no || '');
  const [street, setStreet] = useState(dpFormData.street || '');
  const [landMark, setLandMark] = useState(dpFormData.landmark || '');
  const [city, setCity] = useState(dpFormData.city || '');
  const [pinCode, setPinCode] = useState(dpFormData?.pincode?.toString() || '');
  const [country, setCountry] = useState(dpFormData.country || '');
  const [latitude, setLatitude] = useState(dpFormData?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(dpFormData?.longitude?.toString() || '');
  const [isParentOLTPort, setIsParentOLTPort] = useState(true);
  const [parentOLTPort, setParentOLTPort] = useState(null);
  const [parentDPPort, setParentDPPort] = useState(null);
  const [option, setOption] = useState('DP');
  const [availableDevices, setAvailableDevices] = useState([]);
  const [serialNo, setSerialNo] = useState({ name: dpFormData.serial_no || '' });
  const [parentSerialNo, setParentSerialNo] = useState('');
  const [isLocationFetched, setLocationFetched] = useState(false);
  const [areaData, setAreaData] = useState('');
  const [arealist, setAreaList] = useState([]);
  const [selectDevice, setSelectDevice] = useState(props.selectedDPType);
  const [selectConncectType, setSelectConnectType] = useState();
  const [parentOLTList, setParentOLTList] = useState([]);
  const [selectParentOLT, setSelectParentOLT] = useState('');
  const [OLTPortsList, setOLTPortsList] = useState([]);
  const [selectOLTPort, setSelectOLTPort] = useState('');
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });

  const [parentDpsList, setParentDpsList] = useState([]);
  const [selectParentDp, setSelectParentDp] = useState('');

  const [parentDpPortsList, setParentDpPortsList] = useState([]);
  const [selectParentDpPort, setSelectParentDpPort] = useState('');

  console.log('props', props);

	const mapDropdown = async () => {
		await getZones();
		await setZone(dpFormData.zone.id);
		await getAreas(dpFormData.zone.id);
		await setAreaData(dpFormData.area.id);
	}

  const onLocationEnablePressed = () => {
    if (Platform.OS === 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => {
          console.log('location data', data);
          if (data == 'already-enabled') {
            getCurrentLocation();
          }
          if (data == 'enabled') {
            getCurrentLocation();
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

  // get area list
  const getAreas = async zoneID => {
    try {
      const response = await getOLTarea(zoneID, props?.userInfo?.franchise?.id || dpFormData.franchise.id);
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

  const getZones = async () => {
    try {
      const response = await getOLTZone();
      console.log(response);
      if (response.isSuccess) {
        setZoneData(response.result);
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

  const getParentSNo = async areaID => {
    console.log(areaID);
    try {
      const response = await getDPParentSerialNo(areaID);
      console.log(response);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setParentData(response.result);
        } else {
          const resposneMsg = response;
          setParentData([]);
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
        const resposneMsg = response;
        setParentData([]);
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
      setParentData([]);
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

  const getLastParentObject = async zoneSNo => {
    var tempArr = [];
    try {
      const response = await getParentNASId(zoneSNo);
      if (response.isSuccess) {
        var lastObj = response.result[response.result.length - 1];
        if (lastObj.usable == true) {
          if (lastObj.category == 'ParentDp') {
            setIsParentOLTPort(false);
          } else {
            setIsParentOLTPort(true);
          }
          var objects = response.result;
          for (let i = 0; i < objects.length - 1; i++) {
            if (objects[i].flag == false) {
              var tempObj = objects[i];
              tempArr.push(tempObj);
            }
          }
          setAvailableDevices(tempArr);
        } else {
          Toast.show({
            type: 'error',
            text1: 'No Device Available for this serial no.!',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'No Device Available for this serial no.!',
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

  const getParentOLT = async areaID => {
    const response = await parentOLTData(areaID);
    console.log('🚀 ~ file: DPForm.js:206 ~ getParentOLT ~ response', response);
    if (response?.result?.length > 0) {
      setParentOLTList(response?.result);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Port is Not available!',
      });
    }
  };

  const getOLTPorts = async ID => {
    const response = await OLTPortsData(ID);
    console.log('🚀 ~ file: DPForm.js:219 ~ getOLTPorts ~ response', response);
    if (response?.result?.length > 0) {
      setOLTPortsList(response?.result);
    } else {
      setRenewRecent({
        text: 'Port is Not available!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Port is Not available!',
      // });
    }
  };
  const getParentDps = async ID => {
    setSelectOLTPort(null);
    if (selectConncectType === 1) {
      const res = OLTPortsList.find(item => item.id === ID);
      if (res?.flag) {
        setSelectOLTPort(null);
        setRenewRecent({
          text: 'Parent DP Port is Not available!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Port is Not available!',
        // });
      } else {
        setSelectOLTPort(ID);
      }
    }
    if (selectConncectType === 2) {
      const response = await parentDpsData(ID);
      if (response?.result?.length > 0) {
        setParentDpsList(response?.result);
      } else {
        setRenewRecent({
          text: 'Parent DP Port is Not available!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Port is Not available!',
        // });
      }
    }
  };
  const parentDPValidate = async ID => {
    setSelectParentDpPort('');
    const res = parentDpPortsList.find(item => item.id === ID);
    if (res?.flag) {
      setSelectParentDpPort('');
      setRenewRecent({
        text: 'Port is Not available!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Port is Not available!',
      // });
    } else {
      setSelectParentDpPort(ID);
    }
  };
  const getParentDpPorts = async ID => {
    const response = await parentDpPortsData(ID);
    if (response?.result?.length > 0) {
      setParentDpPortsList(response?.result);
    } else {
      setRenewRecent({
        text: 'Port is Not available!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Port is Not available!',
      // });
    }
  };

  const setDevicePort = port => {
    if (isParentOLTPort) {
      setParentOLTPort(port);
    } else {
      setParentDPPort(port);
    }
  };
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
        const resposneMsg = response;
        setParentData([]);
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
      setParentData([]);
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
  const onResetClick = () => {
    setDPName('');
    setZone('');
    setZoneData([]);
    setParentSerialNo('');
    setParentData([]);
    setSerialNo({ name: '' });
    setParentDPPort(null);
    setParentOLTPort(null);
    setNoOfPorts('');
    setAvailablePorts('');
    setHNo('');
    setStreet('');
    setLandMark('');
    setCity('');
    setPinCode('');
    setDistrict('');
    setState('');
    setCountry('');
    setLatitude(null);
    setLongitude(null);
    setLocationFetched(false);
    setSelectDevice('');
    setSelectConnectType('');
    setAreaData('');
    setSelectParentOLT('');
    setSelectOLTPort('');
    setSelectParentDp('');
    setSelectParentDpPort('');
  };
  const onAddClick = async () => {
    if (
      // dpName &&
      // zone &&
      street &&
      landMark &&
      city &&
      district &&
      pinCode &&
      state &&
      country
    ) {
      var body =
        selectConncectType === 1
          ? {
            is_parent_oltport: true,
            parent_oltport: selectOLTPort,
            name: dpName,
            no_of_ports: noOfPorts,
            available_ports: noOfPorts,
            serial_no: serialNo,
            area: areaData,
            zone: zone,
            house_no: hNo,
            street: street,
            landmark: landMark,
            city: city,
            district: district,
            pincode: parseInt(pinCode),
            state: state,
            country: country,
            latitude: latitude,
            longitude: longitude,
            franchise:
              props.userInfo.franchise != undefined
                ? props.userInfo.franchise.id
                : null,
          }
          : {
            is_parent_oltport: false,
            parent_dpport: selectParentDpPort,
            name: dpName,
            no_of_ports: noOfPorts,
            available_ports: noOfPorts,
            serial_no: serialNo,
            area: areaData,
            zone: zone,
            house_no: hNo,
            street: street,
            landmark: landMark,
            city: city,
            district: district,
            pincode: parseInt(pinCode),
            state: state,
            country: country,
            latitude: latitude,
            longitude: longitude,
            franchise:
              props.userInfo.franchise != undefined
                ? props.userInfo.franchise.id
                : null,
          };

      if (pinCode?.length < 6) {
        setRenewRecent({
          text: 'Pincode Can Not Less Than 6 Digit!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Pincode Can Not Less Than 6 Digit!',
        // });
        return;
      }
      console.log('body dp creating', body);
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


      // dpName
      if (!dpName || dpName === '' || dpName === null) {
        setRenewRecent({
          text: 'Please fillup the DP name field!',
          visible: true,
        });
        return;
      }
      // connectTypes
      // if (!selectConncectType || selectConncectType === '' || selectConncectType === null) {
      //   setRenewRecent({
      //     text: 'Please fillup the connect field!',
      //     visible: true,
      //   });
      //   return;
      // }
      // zone
      if (!zone || zone === '' || zone === null) {
        setRenewRecent({
          text: 'Please fillup the zone field!',
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

      // selectParentOLT

      // if (!selectParentOLT || selectParentOLT === '' || selectParentOLT === null) {
      //   setRenewRecent({
      //     text: 'Please fillup the Parent OLT field!',
      //     visible: true,
      //   });
      //   return;
      // }
      // noOfPorts
      if (!noOfPorts || noOfPorts === '' || noOfPorts === null) {
        setRenewRecent({
          text: 'Please fillup the no of ports field!',
          visible: true,
        });
        return;
      }
      // parentDpPortsList

   
      if (/^[a-zA-Z0-9,_-]+$/.test(dpName) === false) {
        setRenewRecent({
          text: 'DP Name Allows Alphanumeric and special char(_ -), No White Spaces Allow',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'DP Name Allows',
        //   text2: 'Alphanumeric and special char(_ -)',
        // });
        return;
        } else if (/^[a-zA-Z0-9,_-]+$/.test(serialNo?.name) === false) {
          setRenewRecent({
            text: 'Serial No. Allows Alphanumeric and special char(_ -)',
            visible: true,
          });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Serial No. Allows',
        //   text2: 'Alphanumeric and special char(_ -)',
        // });
        return;
      }
      // serialNo
      // if (/^[a-zA-Z0-9,_]+$/.test(serialNo) === false) {
      //   setRenewRecent({
      //     text: 'Serial No. Only Allow Alphanumeric, No White Spaces Allow',
      //     visible: true,
      //   });
      // }

			body.id = dpFormData.id;
			body.area = arealist.find((item) => item.id == areaData);
			body.status = dpFormData.status;
			body.latitude = Number(body.latitude);
			body.longitude = Number(body.longitude);
			body.franchise = dpFormData.franchise;
			body.no_of_ports = Number(body.no_of_ports);
			body.branch = dpFormData.branch;
			delete body.available_ports;
			if(selectDevice == 1) {
				delete body.branch;
			}
			delete body.parent_dpport;
			delete body.is_parent_oltport;

      setLoading({ spinner: true, spinnerText: 'Editing DP...' });

      try {
        if (selectDevice === 1) {
          var response = await updatePDP(body);
        } else {
          var response = await updateCDP(body);
        }
        console.log(
          '🚀 ~ file: DPForm.js:364 ~ onAddClick ~ response',
          response,
        );
        if (response.isSuccess) {
          const responseMsg = response;
          console.log(
            '🚀 ~ file: DPForm.js:353 ~ onAddClick ~ responseMsg',
            responseMsg,
          );
          setLoading({ spinner: false, spinnerText: '' });
          Toast.show({
            type: 'success',
            text1: ' DP Edited Successfully!',
            visibilityTime: 5000,
          });
					// onResetClick();
					props.dpListView();
        } else {
          const errorresponse = response?.message?.response?.data;
          setLoading({ spinner: false, spinnerText: '' });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Parent DP with this name already exists.',
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
        }
      } catch (error) {
				console.log("in the error block dp");
        const errorresponse = error.toString();
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
  const getCurrentLocation = async () => {
    // setRenewRecent({
    //   text: 'Sorry! Location is not working now.',
    //   visible: true,
    // });
    // return;
    if (isLocationFetched) {
      setRenewRecent({
        text: 'Location details already fetched!',
        visible: true,
      });
      // Toast.show({
      //   type: 'warning',
      //   text1: 'Location details already fetched!',
      // });
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
            setLocationFetched(true);
            setLoading({ spinner: false, spinnerText: '' });
          }
        },
        error => {
          console.log(error,"error location")
          setLocationFetched(false);
          setLoading({ spinner: false, spinnerText: '' });
          setRenewRecent({
            text: 'No Location Details Found!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No Location Details Found!',
          // });
        },
      );
    }
  };

  const deviceTypes = [
    {
      id: 1,
      name: 'Parent DP',
    },
    {
      id: 2,
      name: 'Child DP',
    },
  ];
  const connectTypes = [
    {
      id: 1,
      name: 'OLT',
    },
    {
      id: 2,
      name: 'Parent DP',
    },
  ];
  useEffect(() => {
		mapDropdown();
    // getZones();
  }, []);

  return (
    <View>
      {/* <View
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
      </View> */}

      {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={deviceTypes}
            maxHeight={200}
            labelField="name"
            valueField="id"
            placeholder="Device Type *"
            value={selectDevice}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setIsFocus(false);
              setSelectDevice(item?.id);
            }}
          />
        </View>
      </View> */}
      {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={connectTypes}
            maxHeight={200}
            labelField="name"
            valueField="id"
            placeholder="Connect *"
            value={selectConncectType}
            onFocus={item => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setSelectConnectType(item?.id);
              // setZone(item.id);
              setIsFocus(false);
              // getAreas(item.id);
              // getParentSNo(item.id);
            }}
          />
        </View>
      </View> */}

    	<View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Name *'}
            value={dpName}
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
            onChangeText={text => setDPName(text)}
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
            label={'Serial No *'}
            value={serialNo.name}
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
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]*$/.test(text)) return setSerialNo({ name: text })}}
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
            label={'Branch *'}
            disabled
            value={dpFormData.branch}
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
              backgroundColor: '#e5e5e5',
            }}
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]+$/.test(text)) return setSerialNo({ name: text })}}
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
            label={'Franchise *'}
            disabled
            value={dpFormData.franchise.name}
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
              backgroundColor: '#e5e5e5',
            }}
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]+$/.test(text)) return setSerialNo({ name: text })}}
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

      {/* {props?.userInfo?.user_type === 'Branch Owner' && (
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

      {props?.userInfo?.user_type === 'Franchise Owner' && (
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
      )} */}

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
              // getParentSNo(item.id);
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
            value={areaData}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setAreaData(item.id);
              setIsFocus(false);
              getParentOLT(item.id);
            }}
          />
        </View>
      </View>

      {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={parentOLTList}
            maxHeight={200}
            labelField="serial_no"
            valueField="id"
            placeholder="Parent OLT *"
            value={selectParentOLT}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setSelectParentOLT(item.id);
              setIsFocus(false);
              getOLTPorts(item.id);
            }}
          />
        </View>
      </View> */}

      {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={OLTPortsList}
            maxHeight={200}
            labelField="name"
            valueField="id"
            placeholder="OLT Ports *"
            value={selectOLTPort}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setIsFocus(false);
              getParentDps(item.id);
            }}
          />
        </View>
      </View> */}

			<View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Availaible Ports *'}
            disabled
            value={dpFormData.available_ports.toString()}
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
              backgroundColor: '#e5e5e5',
            }}
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]+$/.test(text)) return setSerialNo({ name: text })}}
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
              // setNoOfPorts(parseInt(text));
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
            label={'Parent OLT Port *'}
            disabled
            value={dpFormData.parent_oltport}
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
              backgroundColor: '#e5e5e5',
            }}
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]+$/.test(text)) return setSerialNo({ name: text })}}
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
            label={'Parent OLT Name *'}
            disabled
            value={dpFormData.parent_olt}
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
              backgroundColor: '#e5e5e5',
            }}
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]+$/.test(text)) return setSerialNo({ name: text })}}
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
            label={'Created At *'}
            disabled
            value={dpFormData.created_at}
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
              backgroundColor: '#e5e5e5',
            }}
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]+$/.test(text)) return setSerialNo({ name: text })}}
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
            label={'Created By *'}
            disabled
            value={dpFormData.created_by || ''}
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
              backgroundColor: '#e5e5e5',
            }}
            onChangeText={text => {if(/^[a-zA-Z0-9,_-]+$/.test(text)) return setSerialNo({ name: text })}}
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
			

      {/* {selectConncectType === 2 && (
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{ marginTop: -22 }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={parentDpsList}
              maxHeight={200}
              labelField="serial_no"
              valueField="id"
              placeholder="Parent DP *"
              value={selectParentDp}
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                // setZone(item.id);
                setIsFocus(false);
                setSelectParentDp(item?.id);
                getParentDpPorts(item?.id);
                // getAreas(item.id);
                // getParentSNo(item.id);
              }}
            />
          </View>
        </View>
      )}

      {selectConncectType === 2 && (
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{ marginTop: -22 }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={parentDpPortsList}
              maxHeight={200}
              labelField="name"
              valueField="id"
              placeholder="Parent DP Ports *"
              value={selectParentDpPort}
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setIsFocus(false);
                // setSelectParentDpPort(item?.id);
                parentDPValidate(item?.id);
              }}
            />
          </View>
        </View>
      )} */}

      {/* <View style={{flexDirection: 'row', marginTop: 5}}>
        <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{marginTop: -22}}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={parentData}
            maxHeight={200}
            labelField="name"
            disable={parentData?.length === 0}
            valueField="name"
            placeholder={
              checked == 'parent' ? 'Parent Serial No *' : 'Child Serial No *'
            }
            value={parentSerialNo}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setParentSerialNo(item.name);
              setIsFocus(false);
              getLastParentObject(item.name);
            }}
          />
        </View>
      </View> */}

      {/* <View style={{flexDirection: 'row', marginTop: 5}}>
        <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{marginTop: -22}}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={availableDevices}
            maxHeight={200}
            labelField="name"
            valueField="id"
            placeholder="Parent OLT/DP Port *"
            value={isParentOLTPort ? parentOLTPort : parentDPPort}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setDevicePort(item.id);
              setIsFocus(false);
            }}
          />
        </View>
      </View> */}

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
        <TouchableOpacity
          style={{ flex: 1, height: 40 }}
          onPress={onLocationEnablePressed}>
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
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
export default connect(mapStateToProps)(DPEditForm);
