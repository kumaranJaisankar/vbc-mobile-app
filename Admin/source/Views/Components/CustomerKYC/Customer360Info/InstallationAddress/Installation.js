import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import {Colors} from '../../../../Common/Colors';
import DialogView from '../../../../Common/DialogView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import NoData from '../../../../Common/NoData';
import FormFieldInput from '../../FormFields/KYC_FormField1';
import {
  getCustomerBasicInfo,
  getIpPoolData,
  getReaminingIPs,
  updateBasicInfo,
} from '../../../../services/MainService';
import RBSheet from 'react-native-raw-bottom-sheet';
import {formData} from '../../../../Common/formData';
import styles from '../styles';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {formatDate} from '../../../../Common/utility';
//redux
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import {Checkbox} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';

const Installation = props => {
  const navigation = useNavigation();
  const [basicData, setBasicData] = useState({});
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [staticIpChk, setStaticIPChk] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [poolData, setPoolData] = useState('');
  const [ipPoolList, setIpPoolList] = useState([]);
  const [ipList, setIpList] = useState([]);
  const [value, setValue] = React.useState(0);
  const [ipData, setIPData] = useState('');
  const [staticCost, setStaticCost] = useState('');
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });

  console.log('props =>', props);
  var data = {
    name: '',
    mobile: '',
    email: '',
    instCharges: '',
    staticIPCost: null,
    staticIP: null,
    hNo: '',
    district: '',
    country: '',
    street: '',
    state: '',
    city: '',
    landmark: '',
    pincode: '',
    securityDeposit: '',
    gstin: null,
  };
  const [formValues, handleFormValueChange, setFormValues] = formData(data);
  const [isLoading, setLoading] = useState({
    spinner: false,
    spinnerText: '',
  });
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [smsService, setSmsService] = useState(true);
  const [mailService, setMailService] = useState(true);

  console.log('iop', props);

  useEffect(() => {
    setFormValues({
      hNo: props?.address?.house_no,
      district: props?.address?.district,
      country: props?.address?.country,
      street: props?.address?.street,
      state: props?.address?.state,
      city: props?.address?.city,
      landmark: props?.address?.landmark,
      pincode: props?.address?.pincode,
    });
  }, []);

  const statusData = [
    {name: 'Enabled', code: true},
    {name: 'Disabled', code: false},
  ];
  // const getBasicData = async () => {
  //   setIsDataLoading(true);
  //   try {
  //     const response = await getCustomerBasicInfo(props.customer.user);
  //     console.log(
  //       '🚀 ~ file: BasicInfo.js:101 ~ getBasicData ~ response',
  //       response,
  //     );
  //     if (response.isSuccess) {
  //       setBasicData(response.result);

  //       setIsDataAvailable(true);
  //       setIsDataLoading(false);
  //     } else {
  //       const responseMsg = response;
  //       setIsDataAvailable(false);
  //       setIsDataLoading(false);
  //     }
  //   } catch (err) {
  //     const errorresponse = err.toString();
  //     setIsDataAvailable(false);
  //     setIsDataLoading(false);
  //   }
  // };

  const updateInfo = async () => {
    var body = {
      permanent_address: {
        id: props?.address?.id,
        house_no: formValues.hNo,
        landmark: formValues.landmark,
        street: formValues.street,
        city: formValues.city,
        pincode: formValues.pincode,
        district: formValues.district,
        state: formValues.state,
        country: formValues.country,
      },
    };

    try {
      setLoading({spinner: true, spinnerText: 'Loading'});
      const response = await updateBasicInfo(props?.basicData?.id, body);
      console.log(
        '🚀 ~ file: Installation.js:170 ~ updateInfo ~ response',
        response,
      );
      if (response.isSuccess) {
        console.log('hi');
        const responseMsg = response;
        setLoading({spinner: false, spinnerText: ''});
        Toast.show({
          type: 'success',
          text1: 'Information updated successfully!',
        });
        props.customerFun();
        // getBasicData();
        setEnabled(false);
      } else {
        const errorresponse = response;
        setLoading({spinner: false, spinnerText: ''});
        setRenewRecent({
          text: 'Something went wrong! Please try again later',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Something went wrong! Please try again later.',
        // });
      }
    } catch (err) {
      const errorresponse = err.toString();
      setRenewRecent({
        text: 'Something went wrong! Please try again later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something went wrong! Please try again later.',
      // });
    }
  };

  // ippool list
  const getIPPoolList = async () => {
    try {
      const response = await getIpPoolData(props?.basicData?.area?.id);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setIpPoolList(response.result);
        } else {
          const responseMsg = response;
          Toast.show({
            type: 'error',
            text1: 'No IPpool found! Please try again later.',
          });
        }
        console.log(
          '🚀 ~ file: PlanDetailsBottomSheet.js:618 ~ getIPPoolList ~ response',
          response,
        );
      } else {
        const responseMsg = response;
        Toast.show({
          type: 'error',
          text1: 'No IPpool found! Please try again later.',
        });
      }
    } catch (error) {
      const errorresponse = error.toString();
      Toast.show({
        type: 'error',
        text1: 'No IPpool found! Please try again later.',
      });
    }
  };

  // remaining ip's

  const getReaminingIP = async () => {
    try {
      const response = await getReaminingIPs(poolData);
      if (response.isSuccess) {
        if (response.result.available_ips.length > 0) {
          setIpList(response.result.available_ips);
          setValue(response?.result?.cost_per_ip);
        } else {
          const responseMsg = response;
          Toast.show({
            type: 'error',
            text1: 'No IPpool found! Please try again later.',
          });
        }
        console.log(
          '🚀 ~ file: PlanDetailsBottomSheet.js:654 ~ getReaminingIP ~ cost_per_ip',
          response?.result?.cost_per_ip,
        );
        console.log(
          '🚀 ~ file: PlanDetailsBottomSheet.js:650 ~ getReaminingIP ~ response',
          response,
        );
      } else {
        const responseMsg = response;
        Toast.show({
          type: 'error',
          text1: 'No IPpool found! Please try again later.',
        });
      }
    } catch (error) {
      const errorresponse = error.toString();
      Toast.show({
        type: 'error',
        text1: 'No IPpool found! Please try again later.',
      });
    }
  };

  // sorting Ip's

  const strAscending = [...ipList]?.sort((a, b) => (a.ip > b.ip ? 1 : -1));
  return (
    <View>
      <ScrollView>
        <View>
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
                Installation Information
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setEnabled(true);
                }}>
                <Feather
                  name={'edit'}
                  size={25}
                  color={Colors.orange_295CBF}
                  style={{padding: 10}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{backgroundColor: Colors.white}}>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'House No'}
                  formKey={'hNo'}
                  isMandatory={true}
                  showInputField
                  // length={5}
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.hNo
                      : props?.address !== undefined
                      ? props?.address?.house_no
                        ? props?.address?.house_no
                        : ''
                      : ''
                  }
                  // value={
                  //   isDataAvailable && address.username !== undefined
                  //     ? address.username.toString()
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Street'}
                  formKey={'street'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.street
                      : props?.address !== undefined
                      ? props?.address?.street
                        ? props?.address?.street
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.street
                  //     : isDataAvailable &&
                  //       address.address.street !== undefined
                  //     ? address.address.street
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'City'}
                  formKey={'city'}
                  isMandatory={true}
                  length={12}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.city
                      : props?.address !== undefined
                      ? props?.address?.city
                        ? props?.address?.city
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.mobile
                  //     : isDataAvailable &&
                  //       address.register_mobile !== undefined
                  //     ? address.register_mobile
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'District'}
                  formKey={'district'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.district
                      : props?.address !== undefined
                      ? props?.address?.district
                        ? props?.address?.district
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.district
                  //     : isDataAvailable &&
                  //       address.address.district !== undefined
                  //     ? address.address.district
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'State'}
                  formKey={'state'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.state
                      : props?.address !== undefined
                      ? props?.address?.state
                        ? props?.address?.state
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.state
                  //     : isDataAvailable && address.address.state !== undefined
                  //     ? address.address.state
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Pincode'}
                  formKey={'pincode'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  keyboardType={'numeric'}
                  value={
                    enabled
                      ? formValues.pincode
                      : props?.address !== undefined
                      ? props?.address?.pincode
                        ? props?.address?.pincode
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.pincode
                  //     : isDataAvailable &&
                  //       address.address.pincode !== undefined
                  //     ? address.address.pincode
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
              {/* <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Street'}
                  formKey={'street'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.street
                      : props?.address !== undefined
                      ? props?.address?.street
                        ? props?.address?.street
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.street
                  //     : isDataAvailable &&
                  //       address.address.street !== undefined
                  //     ? address.address.street
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View> */}
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Country'}
                  formKey={'country'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.country
                      : props?.address !== undefined
                      ? props?.address?.country
                        ? props?.address?.country
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.country
                  //     : isDataAvailable &&
                  //       basicData.address.country !== undefined
                  //     ? basicData.address.country
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
              <View style={{flex: 1}}></View>
            </View>

            {/* <View style={{flex: 2, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
                <FormFieldInput
                  title={'GSTIN'}
                  formKey={'gstin'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.gstin
                      : isDataAvailable &&
                        basicData.user_advance_info.GSTIN !== (undefined || null)
                      ? basicData.user_advance_info.GSTIN
                      : ''
                  }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
            </View> */}
            {enabled && (
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  marginTop: 10,
                  margin: 8,
                  marginHorizontal: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{height: 40}}
                    onPress={() => {
                      setEnabled(false);
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 16,
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
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{height: 40}}
                    onPress={() => {
                      updateInfo();
                    }}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 16,
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
            )}
          </View>
        </View>
      </ScrollView>
      <DialogView
        showAlertDialog
        visible={isRenewRecent.visible}
        text={isRenewRecent.text}
        onConfirm={() => {
          setRenewRecent({text: '', visible: false});
        }}
        textConfirm={'Okay'}></DialogView>
      <Spinner
        animation={'fade'}
        overlayColor={Colors.orange_295CBF}
        indicatorStyle={styles.loader}
        visible={isLoading.spinner}
        textContent={isLoading.spinnerText}
        textStyle={styles.spinnerTextStyle}
      />
      <DialogView
        showLoadingDialog
        visible={isDataLoading}
        text={'Loading Basic Info...'}></DialogView>
    </View>
  );
};

function mapStateToProps(state, props) {
  return {
    customer: state.mainReducers.main.customer,
  };
}

export default connect(mapStateToProps)(Installation);
