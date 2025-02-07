import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import {Colors} from '../../../../../Common/Colors';
import {RadioButton, TextInput} from 'react-native-paper';
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
  getFranchiseAreas,
  getPaymentMethodListData,
  getPaymentOptions,
  areaToAreaShifting,
} from '../../../../../services/MainService';
import {Dropdown} from 'react-native-element-dropdown';
import styles from '../../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import {showMessage} from 'react-native-flash-message';
import globalStyles from '../../../../../Common/globalStyles';
import locationServices from '../../../../../services/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import SearchableDropDown from 'react-native-searchable-dropdown';
import DialogView from '../../../../../Common/DialogView';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MacAddressInput from '../../../../../Common/MacAddressInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';

const Shifting = props => {
  console.log('its the props from Shifting', props);
  const route = useRoute();
  const navigation = useNavigation();
  const customerData = route?.params?.userInfo;
  const isCPEEdit = props.isEditForm;
  const cpeFormData = props.formData;

  const [isLoading, setLoading] = useState({
    spinner: false,
    spinnerText: '',
  });

  const [customerID, setCustomerID] = useState(
    isCPEEdit ? cpeFormData.customer_id : '',
  );

  const [zoneData, setZoneData] = useState([]);
  const [zone, setZone] = useState(isCPEEdit ? cpeFormData.zone : '');
  const [parentData, setParentData] = useState([]);

  const [isFocus, setIsFocus] = useState(false);
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
  const [shiftingType, setShiftingType] = React.useState('AreaToArea');
  const [paymentMethodListData, setPaymentMethodListData] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [upiReferenceNo,setUpiReferenceNo]=useState('')

  console.log('pppppp', props?.userInfo?.id);

  //   const getZones = async () => {
  //     try {
  //       const response = await getOLTZone();
  //       if (response.isSuccess) {
  //         setZoneData(response.result);
  //       } else {
  //         const resposneMsg = response;
  //         setRenewRecent({
  //           text: 'No Zone available!',
  //           visible: true,
  //         });
  //         // Toast.show({
  //         //   type: 'error',
  //         //   text1: 'No zone available!',
  //         // });
  //       }
  //     } catch (error) {
  //       const errorResponse = error.toString();
  //       setRenewRecent({
  //         text: 'Something went wrong! Please try again later!',
  //         visible: true,
  //       });
  //       // Toast.show({
  //       //   type: 'error',
  //       //   text1: 'Something went wrong! Please try again later.',
  //       // });
  //     }
  //   };

  const onResetClick = () => {
 navigation.navigate('Customer360Info');
  };
  const onAddClick = async () => {
    if (areaData && selectChildDpPort && selectedPaymentMethod) {
     
      setLoading({
        spinner: true,
        spinnerText:'Area  Shifting...',
      });
      try {
        let body={
            new_area: areaData,
            parent_child_dpport: selectChildDpPort,
            payment_method: selectedPaymentMethod,
            upi_reference_no: upiReferenceNo,
            amount: customerData?.area?.franchise?.shifting_charges
        }
        console.log(body,"shifting body")
        const response = await areaToAreaShifting(route?.params?.userInfo?.id,body);
        console.log(response,"response")
        if (response.isSuccess) {
          const responseMsg = response;
          // onResetClick();
          setLoading({spinner: false, spinnerText: ''});
          Toast.show({
            type: 'success',
            text1: 'Shifting Done Successfully!',
          });
          navigation.navigate('Customer360Info', {
            param1: 'update',
          });
        } else {
            setLoading({spinner: false, spinnerText: ''});
            setRenewRecent({
                text: 'Something went wrong! Please try again later!',
                visible: true,
              });
        }
      } catch (error) {
        const errorresponse = error.toString();
        setLoading({spinner: false, spinnerText: ''});
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
        setLoading({spinner: false, spinnerText: ''});
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

  // get area list
  const getAreas = async () => {
    try {
      const response = await getFranchiseAreas(
        customerData?.area?.franchise?.id,
        customerData?.area?.id,
      );
      console.log(
        '🚀 ~ file: DPHomeScreen.js ~ line 123 ~ getAreas ~ response',
        response,
      );
      if (response?.result?.length > 0) {
        const formattedAreas = response.result.map(areaObj => areaObj.area);
        setAreaList(formattedAreas);
        // setAreaList(response.result);
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
  const getPaymentMethodList = async () => {
    try {
      const response = await getPaymentOptions();
      console.log('re', response);
      if (response.isSuccess === 200) {
        if (response.result.offline_payment_modes.length > 0) {
          const value = response.result.offline_payment_modes?.map(item =>
            item.name === 'Google pay' ? {...item, name: 'Google Pay'} : item,
          );
          setPaymentMethodListData(value);
        }
        // if (response.result.length > 0) {
        //   setPaymentMethodListData(response?.result);
        // }
        else {
          const responseMsg = response;
          console.log(response);
          //   setError({
          //     text: 'Something went wrong! Please try again later.',
          //     visible: true,
          //   });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Something went wrong! Please try again later.',
          // });
        }
      } else {
        const responseMsg = response;
        setError({
          text: 'Something went wrong! Please try again later.',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Something went wrong! Please try again later.',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setError({
        text: 'Something went wrong! Please try again later.',
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
    getAreas();
    getPaymentMethodList();
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
        <ScrollView>
      <View style={styles.title1}>
        <View>
          <Ionicons
            name={'person'}
            size={25}
            color={Colors.orange_295CBF}
            style={{padding: 10}}
          />
        </View>
        <View style={styles.title1_child1}>
          <Text
            style={{
              color: Colors.orange_295CBF,
              fontSize: 16,
              fontFamily: 'Titillium-Semibold',
              marginTop: 12,
            }}>
           Area To Area Shifting
          </Text>
        </View>
      </View>
      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <RadioButton
          value="AreaToArea"
          status={shiftingType === 'AreaToArea' ? 'checked' : 'unchecked'}
          onPress={() => {
            setShiftingType('AreaToArea');
          }}
        />
        <Text
          style={{
            fontFamily: 'Titillium-Semibold',
            color: Colors.grey_888888,
            fontSize: 16,
            marginRight: 8,
          }}>
          Area To Area
        </Text>
        <RadioButton
          value="FranchiseToFranchise"
          status={
            shiftingType === 'FranchiseToFranchise' ? 'checked' : 'unchecked'
          }
          onPress={() => {
            setShiftingType('FranchiseToFranchise');
          }}
        />
        <Text
          style={{
            fontFamily: 'Titillium-Semibold',
            color: Colors.grey_888888,
            fontSize: 16,
            flexWrap: 'wrap',
          }}>
          Franchise to Franchise
        </Text>
      </View> */}
      
        <View style={{marginTop:10}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <TextInput
                mode="outlined"
                label={'Franchise'}
                value={customerData?.area?.franchise?.name}
                maxLength={20}
                returnKeyType="next"
                keyboardType="default"
                placeholderStyle={{fontSize: 20}}
                underlineColorAndroid="transparent"
                disabled={true}
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 20,
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
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <TextInput
                mode="outlined"
                label={'Area'}
                value={customerData?.area?.name}
                maxLength={20}
                returnKeyType="next"
                keyboardType="default"
                placeholderStyle={{fontSize: 20}}
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
          {/* <View style={{flexDirection: 'row', marginTop: 5}}>
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
      </View> */}
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
                placeholder="Area To *"
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

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
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
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
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
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
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
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
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
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <TextInput
                mode="outlined"
                label={'Shifting Charges'}
                value={String(customerData?.area?.franchise?.shifting_charges)}
                maxLength={20}
                returnKeyType="next"
                keyboardType="default"
                placeholderStyle={{fontSize: 20}}
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
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={paymentMethodListData}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder="Payment Method *"
                value={selectedPaymentMethod}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setSelectedPaymentMethod(item.id);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
          {selectedPaymentMethod === 'Bank_transfer' && (
            <View style={{flex: 1}}>
              <TextInput
                mode="outlined"
                label={'Bank Reference No.'}
                value={upiReferenceNo}
                maxLength={20}
                returnKeyType="next"
                keyboardType="default"
                placeholderStyle={{fontSize: 20}}
                underlineColorAndroid="transparent"
                onChangeText={(text) => setUpiReferenceNo(text)}
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
          )}
          {selectedPaymentMethod === 'CHEK' && (
            <View style={{flex: 1}}>
              <TextInput
                mode="outlined"
                label={'Cheque No.'}
                value={upiReferenceNo}
                maxLength={20}
                returnKeyType="next"
                keyboardType="default"
                placeholderStyle={{fontSize: 20}}
                underlineColorAndroid="transparent"
                onChangeText={(text) => setUpiReferenceNo(text)}
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
          )}
          {selectedPaymentMethod === 'GPAY' && (
            <View style={{flex: 1}}>
              <TextInput
                mode="outlined"
                label={'UTR No.'}
                value={upiReferenceNo}
                maxLength={20}
                returnKeyType="next"
                keyboardType="default"
                placeholderStyle={{fontSize: 20}}
                underlineColorAndroid="transparent"
                onChangeText={(text) => setUpiReferenceNo(text)}
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
          )}
          {selectedPaymentMethod === 'PHNPE' && (
            <View style={{flex: 1}}>
              <TextInput
                mode="outlined"
                label={'UTR No.'}
                value={upiReferenceNo}
                maxLength={20}
                returnKeyType="next"
                keyboardType="default"
                placeholderStyle={{fontSize: 20}}
                underlineColorAndroid="transparent"
                onChangeText={(text) => setUpiReferenceNo(text)}
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
          )}
          {/* {paymentMethod === 'NEFT' && checked == 'offline' && (
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={'Transaction No.'}
                        formKey={'transaction_no'}
                        isMandatory={false}
                        showInputField
                        isEnabled={true}
                        value={formValues.transaction_no}
                        handleFormValueChange={handleFormValueChange}
                      />
                    </View>
                  )} */}
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
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
          <TouchableOpacity
            style={{flex: 0.5, height: 40}}
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
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 0.5, height: 40}}
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
              {'Save'}
            </Text>
          </TouchableOpacity>
        </View>
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

export default Shifting;
