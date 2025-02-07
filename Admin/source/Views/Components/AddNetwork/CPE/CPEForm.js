import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors } from '../../../Common/Colors';
import { TextInput } from 'react-native-paper';
import {
  getCPEParentSerialNo,
  getOLTZone,
  getCustomerCPEDetails,
  getParentNASId,
  addCPE,
  getOLTarea,
  parentDpsData,
  OLTPortsData,
  parentOLTData,
  childDpPortsData,
  childDpsData,
  updateCPE,
} from '../../../services/MainService';
import { Dropdown } from 'react-native-element-dropdown';
import styles from '../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import { showMessage } from 'react-native-flash-message';
import globalStyles from '../../../Common/globalStyles';
import locationServices from '../../../services/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import SearchableDropDown from 'react-native-searchable-dropdown';
import DialogView from '../../../Common/DialogView';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MacAddressInput from '../../../Common/MacAddressInput';

const CPEForm = props => {
  console.log("its the props from cpe parent", props);

  const isCPEEdit = props.isEditForm;
  const cpeFormData = props.formData;

  const [isLoading, setLoading] = useState({
    spinner: false,
    spinnerText: '',
  });
  
  const [customerID, setCustomerID] = useState(isCPEEdit ? cpeFormData.customer_id : '');
  const [serialNo, setSerialNo] = useState({ name: isCPEEdit ? cpeFormData.serial_no : '' });
  const [hName, setHName] = useState(isCPEEdit ? cpeFormData.hardware_name : '');
  const [make, setMake] = useState(isCPEEdit ? cpeFormData.make : '');
  const [model, setModel] = useState(isCPEEdit ? cpeFormData.model : '');
  const [notes, setNotes] = useState(isCPEEdit ? cpeFormData.notes : '');
  const [specification, setSpecification] = useState(isCPEEdit ? cpeFormData.specification : '');
  const [requiredMsg, setRequiredMsg] = useState({});
  const [zoneData, setZoneData] = useState([]);
  const [zone, setZone] = useState(isCPEEdit ? cpeFormData.zone : '' );
  const [parentData, setParentData] = useState([]);
  const [state, setState] = useState(isCPEEdit ? cpeFormData.state : '');
  const [district, setDistrict] = useState(isCPEEdit ? cpeFormData.district : '');
  const [hNo, setHNo] = useState(isCPEEdit ? cpeFormData.house_no : '');
  const [street, setStreet] = useState(isCPEEdit ? cpeFormData.street : '');
  const [landMark, setLandMark] = useState(isCPEEdit ? cpeFormData.landmark : '');
  const [city, setCity] = useState(isCPEEdit ? cpeFormData.city : '');
  const [pinCode, setPinCode] = useState(isCPEEdit ? cpeFormData?.pincode?.toString() : '');
  const [country, setCountry] = useState(isCPEEdit ? cpeFormData.country : '');
  const [latitude, setLatitude] = useState(isCPEEdit ? cpeFormData?.latitude?.toString() : '');
  const [longitude, setLongitude] = useState(isCPEEdit ? cpeFormData?.longitude?.toString() : '');
  const [customerData, setCustomerData] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [option, setOption] = useState('CPE');
  const [parentSerialNo, setParentSerialNo] = useState('');
  const [availableDevices, setAvailableDevices] = useState([]);
  const [devicePort, setDevicePort] = useState();
  const [isLocationFetched, setLocationFetched] = useState(false);
  const [areaData, setAreaData] = useState('');
  const [arealist, setAreaList] = useState([]);
  const [parentOLTList, setParentOLTList] = useState([]);
  const [selectParentOLT, setSelectParentOLT] = useState('');
  const [OLTPortsList, setOLTPortsList] = useState([]);
  const [selectOLTPort, setSelectOLTPort] = useState('');
  const [childDpsList, setChildDpsList] = useState([]);
  const [selectChildDp, setSelectChildDp] = useState('');
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });
  const [childDpsPortList, setChildDpsPortList] = useState([]);
  const [selectChildDpPort, setSelectChildDpPort] = useState('');
  const [macId, setMacId] = useState(isCPEEdit ? cpeFormData.mac_bind : '');

  console.log('pppppp', props?.userInfo?.id);
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

  const getParentSNo = async zoneID => {
    try {
      const response = await getCPEParentSerialNo(
        zoneID,
        props?.userInfo?.franchise?.id,
      );
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

  const getZones = async () => {
    try {
      const response = await getOLTZone();
      if (response.isSuccess) {
        setZoneData(response.result);
      } else {
        const resposneMsg = response;
        setRenewRecent({
          text: 'No Zone available!',
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

  const getCustomerData = async () => {
    try {
      const response = await getCustomerCPEDetails();
      console.log('this is', response);
      if (response?.isSuccess) {
        if (response?.result?.length > 0) {
          setCustomerData(response?.result);
        } else {
          const responseMsg = response;
          setRenewRecent({
            text: 'No Customer found!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No Customer found!',
          // });
        }
      } else {
        const responseMsg = response;
        setRenewRecent({
          text: 'No Customer found!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No Customer found!',
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

  const getAvailableDevices = async zoneSNo => {
    console.log(zoneSNo, 'zoneSNo');
    var tempArr = [];
    try {
      const response = await getParentNASId(zoneSNo);
      if (response.isSuccess) {
        var lastObj = response.result[response.result.length - 1];
        if (lastObj.usable == true) {
          var objects = response.result;
          for (let i = 0; i < objects.length - 1; i++) {
            if (objects[i].flag == false) {
              var tempObj = objects[i];
              tempArr.push(tempObj);
            }
          }
          setAvailableDevices(tempArr);
        } else {
          const responseMsg = response;
          setRenewRecent({
            text: 'No Device Available for this serial no.!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No Device Available for this serial no.!',
          // });
        }
      } else {
        const responseMsg = response;
        setRenewRecent({
          text: 'No Device Available for this serial no.!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No Device Available for this serial no.!',
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
  const onResetClick = () => {
    setZone('');
    setParentSerialNo('');
    setDevicePort('');
    setCustomerID('');
    setHName('');
    setSerialNo({ name: '' });
    setMake('');
    setModel('');
    setNotes('');
    setSpecification('');
    setHNo('');
    setStreet('');
    setLandMark('');
    setCity('');
    setDistrict('');
    setPinCode('');
    setState('');
    setCountry('');
    setLatitude('');
    setLongitude('');
    setLocationFetched(false);
    setAreaData('');
    setSelectChildDp('');
    setSelectChildDpPort('');
    setSelectParentOLT('');
    setSelectOLTPort('');
  };
  const onAddClick = async () => {
    if (
      // zone &&
      customerID &&
      (isCPEEdit || selectChildDpPort) &&
      // serialNo.name &&
      // hName &&
      street &&
      landMark &&
      city &&
      district &&
      pinCode &&
      state &&
      country &&
      macId
    ) {
      var body = {
        parent_child_dpport: selectChildDpPort,
        customer_id: customerID,
        hardware_name: hName,
        serial_no: serialNo,
        make: make,
        model: model,
        notes: notes,
        specification: specification,
        house_no: hNo,
        street: street,
        landmark: landMark,
        city: city,
        district: district,
        pincode: parseInt(pinCode),
        state: state,
        country: country,
        latitude: Number(latitude),
        longitude: Number(longitude),
        mac_bind: macId
      };
      if(!(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(macId))) {
        setRenewRecent({
          text: 'Please Enter valid mac id',
          visible: true,
        });
        return;
      }
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

        // zone
        if (!zone || zone === '' || zone === null) {
          setRenewRecent({
            text: 'Please fillup the zone field!',
            visible: true,
          });
          return;
        }
        // areaData
        if (!isCPEEdit && (!areaData || areaData === '' || areaData === null) ) {
          setRenewRecent({
            text: 'Please fillup the area field!',
            visible: true,
          });
          return;
        }

        // serialNo.name

        if (!serialNo?.name || serialNo?.name === '' || serialNo?.name === null) {
          setRenewRecent({
            text: 'Please fillup the serial no field!',
            visible: true,
          });
          return;
        }

        // hName
        if (!hName || hName === '' || hName === null) {
          setRenewRecent({
            text: 'Please fillup the hardware name field!',
            visible: true,
          });
          return;
        }
        // make
        if (!make || make === '' || make === null) {
          setRenewRecent({
            text: 'Please fillup the make field!',
            visible: true,
          });
          return;
        }
        // notes
        if (!notes || notes === '' || notes === null) {
          setRenewRecent({
            text: 'Please fillup the notes field!',
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
        // model
        if (!model || model === '' || model === null) {
          setRenewRecent({
            text: 'Please fillup the model field!',
            visible: true,
          });
          return;
        }
      if (/^[a-zA-Z0-9,_-]+$/.test(serialNo?.name) === false) {
        setRenewRecent({
          text: 'Serial No. Only Allow Alphanumeric and special char(_ -), No White Spaces Allow',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Serial No. Allows ',
        //   text2: 'Alphanumeric and special char(_ -)',
        // });
        return;
      }
      else if (/^[a-zA-Z0-9,_-]+$/.test(hName) === false) {
        setRenewRecent({
          text: 'Hardware Name Allows Alphanumeric and special char(_ -), No White Spaces',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Hardware Name Allows',
        //   text2: 'Alphanumeric and special char(_ -)',
        // });
        return;
      } 
      else if (/^[a-zA-Z0-9,_@-]+$/.test(model) === false) {
        setRenewRecent({
          text: 'Model Allows Alphanumeric and special char(@, _ -)',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Model Allows',
        //   text2: 'Alphanumeric and special char(@, _ -)',
        // });
        return;
      } else if (/^[a-zA-Z0-9,_@-]+$/.test(specification) === false) {
        setRenewRecent({
          text: 'Specifications Allows Alphanumeric and special char(@, _ -)',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Specifications Allows',
        //   text2: 'Alphanumeric and special char(@, _ -)',
        // });
        return;
      } else if (/^[a-zA-Z0-9,_-]+$/.test(notes) === false) {
        setRenewRecent({
          text: 'Notes Should contain Alphanumeric and special char( _ -) ',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Notes Should contain',
        //   text2: 'Alphanumeric and special char( _ -)',
        // });
        return;
      }
      setLoading({ spinner: true, spinnerText: isCPEEdit ? 'Editing CPE...' :  'Creating CPE...' });
      try {

        if(isCPEEdit) {
          body.serial_no = body.serial_no.name;
          delete body.customer_id;
          body.mobile_no = cpeFormData.mobile_no;
          delete body.parent_child_dpport
          body.id = cpeFormData.id;
        }

        const response = isCPEEdit ? await updateCPE(body) : await addCPE(body);
        if (response.isSuccess) {
          const responseMsg = response;1
          // onResetClick();
          setLoading({ spinner: false, spinnerText: '' });
          Toast.show({
            type: 'success',
            text1: isCPEEdit ? 'CPE Edited Successfully!' :  'CPE Created Successfully!',
          });
          props.cpeListView();
        } else {
          const errorresponse = response?.message?.response?.data;
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
          // Toast.show({
          //   type: 'error',
          //   text1: 'CPE with this customer id or serial no. already exists.',
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
  const getParentOLT = async areaID => {
    const response = await parentOLTData(areaID);
    if (response?.result?.length > 0) {
      setParentOLTList(response?.result);
    } else {
      setRenewRecent({
        text: 'No Parent OLT available!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No Parent OLT available!',
      // });
    }
  };
  const getOLTPorts = async ID => {
    const response = await OLTPortsData(ID);
    if (response?.result?.length > 0) {
      setOLTPortsList(response?.result);
    } else {
      setRenewRecent({
        text: 'No OLT ports available!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No  OLT ports available!',
      // });
    }
  };
  const getChildDps = async ID => {
    console.log('ID', ID);
    const response = await childDpsData(ID);
    console.log('🚀 ~ file: CPEForm.js:379 ~ getChildDps ~ response', response);
    if (response?.result?.length > 0) {
      setChildDpsList(response?.result);
    } else {
      setRenewRecent({
        text: 'No Child DP available!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No  Child DP  available!',
      // });
    }
  };

  const getChildDpPorts = async ID => {
    const response = await childDpPortsData(ID);
    if (response?.result?.length > 0) {
      setChildDpsPortList(response?.result);
    } else {
      setRenewRecent({
        text: 'No Child DP ports available!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No Child DP ports available!',
      // });
    }
  };
  console.log('customer id', customerID);
  useEffect(() => {
    getZones();
    getCustomerData();
  }, []);

  const validateChildDp = async ID => {
    const res = childDpsPortList.find(item => item.id === ID);
    console.log('🚀 ~ file: CPEForm.js:415 ~ validateChildDp ~ res', res);
    if (res?.flag) {
      setRenewRecent({
        text: 'Child DP ports not available!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Child DP ports not available!',
      // });
    } else {
      setSelectChildDpPort(ID);
    }
  };

  return (
    <View>
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
      {!isCPEEdit && <View style={{ flexDirection: 'row', marginTop: 5 }}>
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
      </View>}
      {!isCPEEdit && <View style={{ flexDirection: 'row', marginTop: 5 }}>
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
      </View>}
      {!isCPEEdit && <View style={{ flexDirection: 'row', marginTop: 5 }}>
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
      </View>}
      {!isCPEEdit && <View style={{ flexDirection: 'row', marginTop: 5 }}>
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
              setSelectOLTPort(item.id);
              getChildDps(item.id);
            }}
          />
        </View>
      </View>}
      {!isCPEEdit && <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={childDpsList}
            maxHeight={200}
            labelField="serial_no"
            valueField="id"
            placeholder="Child DP *"
            value={selectChildDp}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setSelectChildDp(item?.id);
              getChildDpPorts(item?.id);
              setIsFocus(false);
            }}
          />
        </View>
      </View>}
      {!isCPEEdit && <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={{ marginTop: -22 }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={childDpsPortList}
            maxHeight={200}
            labelField="name"
            valueField="id"
            placeholder="Child DP Port *"
            value={selectChildDpPort}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              // setSelectChildDpPort(item.id);
              setIsFocus(false);
              validateChildDp(item?.id);
            }}
          />
        </View>
      </View>}

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
            valueField="name"
            placeholder="Parent Serial No *"
            value={parentSerialNo}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setParentSerialNo(item.name);
              setIsFocus(false);
              getAvailableDevices(item.name);
            }}
          />
        </View>
      </View> */}

      {!isCPEEdit && <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.grey_888888,
                fontSize: 14,
              }}>
              Customer ID
            </Text>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.grey_888888,
                fontSize: 14,
              }}>
              *
            </Text>
          </View>
          <SafeAreaView>
            <SearchableDropDown
              onItemSelect={item => {
                setCustomerID(item?.id);
              }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
              }}
              itemTextStyle={{ color: '#222' }}
              itemsContainerStyle={{
                maxHeight: 140,
                backgroundColor: '#fff',
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
              }}
              items={customerData?.map(item => {
                {
                  return {
                    id: item?.username,
                    name: item?.username,
                  };
                }
              })}
              resetValue={false}
              textInputProps={{
                // onTextChange: text => setCustomerBoxText(text),
                // value: customerBoxText,
                placeholder: customerID ? customerID : 'Search Customer',
                underlineColorAndroid: 'transparent',
                style: styles.dropdown,
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </SafeAreaView>
          {/* <Dropdown
            style={[styles.dropdown]}
            containerStyle={{marginTop: -22}}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={customerData}
            maxHeight={200}
            labelField="username"
            valueField="username"
            placeholder="Customer ID *"
            value={customerID}
            onFocus={() => {
              setIsFocus(true);
              getCustomerData();
            }}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setCustomerID(item.username);
              setIsFocus(false);
            }}
          /> */}
        </View>
      </View>}
      
      {isCPEEdit && <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Customer Id *'}
            disabled
            value={customerID}
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
      </View>}
      
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
            label={'Make *'}
            value={make}
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
            onChangeText={text => setMake(text)}
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

      {isCPEEdit && <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Branch *'}
            disabled
            value={cpeFormData.branch}
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
      </View>}

      {isCPEEdit && <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Franchise *'}
            disabled
            value={cpeFormData.franchise}
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
      </View>}

      {isCPEEdit && <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Zone *'}
            disabled
            value={cpeFormData.zone}
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
      </View>}

      {isCPEEdit && <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Area *'}
            disabled
            value={cpeFormData.area}
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
      </View>}

      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flex: 0.97, flexDirection: 'column', marginLeft: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.grey_888888,
                fontSize: 14,
              }}>
              Mac ID
            </Text>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.grey_888888,
                fontSize: 14,
              }}>
              *
            </Text>
          </View>
          <SafeAreaView>
          <MacAddressInput value={macId} onChangeMacIDInput={(e) => setMacId(e)} />
          </SafeAreaView>
        </View>
      </View>

      

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            mode="outlined"
            label={'Hardware Name *'}
            value={hName}
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
            onChangeText={text => setHName(text)}
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
            label={'Model *'}
            value={model}
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
            onChangeText={text => setModel(text)}
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
              {isCPEEdit ? 'Save' : 'Add'}
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
export default connect(mapStateToProps)(CPEForm);
