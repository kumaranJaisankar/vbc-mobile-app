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

const BasicInfo = props => {
  const navigation = useNavigation();
  const [basicData, setBasicData] = useState({});
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [staticIpChk, setStaticIPChk] = useState(false);
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
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [smsService, setSmsService] = useState(true);
  const [mailService, setMailService] = useState(true);

  useEffect(() => {
    setFormValues({
      name: props?.basicData?.first_name + ' ' + props?.basicData?.last_name,
      mobile: props?.basicData?.register_mobile,
      email: props?.basicData?.registered_email,
      instCharges: props?.basicData?.user_advance_info?.installation_charges,
      securityDeposit: props?.basicData?.user_advance_info?.security_deposit,
      staticIPCost: props?.basicData?.radius_info?.static_ip_cost,
      staticIP: props?.basicData?.radius_info?.static_ip_bind,
      hNo: props?.basicData?.address?.house_no,
      district: props?.basicData?.address?.district,
      country: props?.basicData?.address?.country,
      street: props?.basicData?.address?.street,
      state: props?.basicData?.address?.state,
      city: props?.basicData?.address?.city,
      landmark: props?.basicData?.address?.landmark,
      pincode: props?.basicData?.address?.pincode,
      gstin: props?.basicData?.user_advance_info?.GSTIN,
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
      address: {
        id: props?.basicData?.address?.id,
        house_no: formValues.hNo,
        landmark: formValues.landmark,
        street: formValues.street,
        city: formValues.city,
        pincode: formValues.pincode,
        district: formValues.district,
        state: formValues.state,
        country: formValues.country,
      },
      first_name: formValues.name.split(' ')[0],
      last_name: formValues.name.split(' ')[1],
      register_mobile: formValues.mobile,
      registered_email: formValues.email,
      user_advance_info: {
        id: props?.basicData?.user_advance_info?.id,
        installation_charges: formValues.instCharges,
        security_deposit: formValues.securityDeposit,
        GSTIN: formValues.gstin,
      },
      radius_info: {
        id: props?.basicData?.radius_info?.id,
        static_ip_bind: props?.basicData?.radius_info?.static_ip_bind
          ? formValues.staticIP
          : ipData
          ? ipData
          : null,
        static_ip_cost: props?.basicData?.radius_info?.static_ip_bind
          ? formValues.staticIPCost
          : staticCost
          ? staticCost
          : null,
      },
      email_flag: mailService,
      sms_flag: smsService,
    };
    console.log('body', body);
    try {
      setLoading({spinner: true, spinnerText: 'Loading'});
      const response = await updateBasicInfo(props?.basicData?.id, body);
      console.log(
        '🚀 ~ file: BasicInfo.js:168 ~ updateInfo ~ response',
        response,
      );
      if (response.isSuccess) {
        const responseMsg = response;
        setLoading({spinner: false, spinnerText: ''});
        Toast.show({
          type: 'success',
          text1: 'Information updated successfully!',
        });
        // getBasicData();
        props.customerFun();
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
      console.log(
        '🚀 ~ file: BasicInfo.js:192 ~ updateInfo ~ errorresponse',
        errorresponse,
      );
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
          setRenewRecent({
            text: 'No IPpool found! Please try again later',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No IPpool found! Please try again later.',
          // });
        }
        console.log(
          '🚀 ~ file: PlanDetailsBottomSheet.js:618 ~ getIPPoolList ~ response',
          response,
        );
      } else {
        const responseMsg = response;
        setRenewRecent({
          text: 'No IPpool found! Please try again later',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No IPpool found! Please try again later.',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setRenewRecent({
        text: 'No IPpool found! Please try again later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No IPpool found! Please try again later.',
      // });
    }
  };

  // remaining ip's

  const getReaminingIP = async () => {
    if(poolData){

   
    try {
      const response = await getReaminingIPs(poolData);
      if (response.isSuccess) {
        if (response.result.available_ips.length > 0) {
          setIpList(response.result.available_ips);
          setValue(response?.result?.cost_per_ip);
        } else {
          const responseMsg = response;
          setRenewRecent({
            text: 'No IPpool found! Please try again later',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No IPpool found! Please try again later.',
          // });
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
        setRenewRecent({
          text: 'No IPpool found! Please try again later',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No IPpool found! Please try again later.',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setRenewRecent({
        text: 'No IPpool found! Please try again later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No IPpool found! Please try again later.',
      // });
    }
  }else{
    // setRenewRecent({
    //   text: 'Please Select Ip pool first',
    //   visible: true,
    // });
    Toast.show({
        type: 'error',
        text1: 'Please Select Ip pool first',
      });
  }
  };

  const enableEditPage = () => {
    setTimeout(() => {
      setIsEditLoading(false);
    }, 1000);
    setIsEditLoading(true);
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
                Basic Information
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setEnabled(true);
                  enableEditPage();
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
                  title={'User ID'}
                  formKey={'userID'}
                  isMandatory={true}
                  showInputField
                  // length={5}
                  isEnabled={false}
                  value={
                    props?.basicData?.user?.username
                      ? props?.basicData?.user?.username.toString()
                      : ''
                  }
                  // value={
                  //   isDataAvailable && basicData.username !== undefined
                  //     ? basicData.username.toString()
                  //     : ''
                  // }
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Name'}
                  formKey={'name'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.name
                      : props?.basicData !== undefined
                      ? props?.basicData?.first_name +
                        ' ' +
                        props?.basicData?.last_name
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.name
                  //     : isDataAvailable && basicData.first_name !== undefined
                  //     ? basicData.first_name + ' ' + basicData.last_name
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Mobile'}
                  formKey={'mobile'}
                  isMandatory={true}
                  length={12}
                  keyboardType={'numeric'}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.mobile
                      : props?.basicData !== undefined
                      ? props?.basicData?.register_mobile
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.mobile
                  //     : isDataAvailable &&
                  //       basicData.register_mobile !== undefined
                  //     ? basicData.register_mobile
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Email'}
                  formKey={'email'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.email
                      : props?.basicData !== undefined
                      ? props?.basicData?.registered_email
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.email
                  //     : isDataAvailable &&
                  //       basicData.registered_email !== undefined
                  //     ? basicData.registered_email
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'H.No'}
                  formKey={'hNo'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  keyboardType={'numeric'}
                  value={
                    enabled
                      ? formValues.hNo
                      : props?.basicData !== undefined
                      ? props?.basicData?.address?.house_no
                        ? props?.basicData?.address?.house_no
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.hNo
                  //     : isDataAvailable &&
                  //       basicData.address.house_no !== undefined
                  //     ? basicData.address.house_no
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
                      : props?.basicData !== undefined
                      ? props?.basicData?.address?.street
                        ? props?.basicData?.address?.street
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.street
                  //     : isDataAvailable &&
                  //       basicData.address.street !== undefined
                  //     ? basicData.address.street
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Landmark'}
                  formKey={'landmark'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.landmark
                      : props?.basicData !== undefined
                      ? props?.basicData?.address?.landmark
                        ? props?.basicData?.address?.landmark
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.landmark
                  //     : isDataAvailable &&
                  //       basicData.address.landmark !== undefined
                  //     ? basicData.address.landmark
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'City'}
                  formKey={'city'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  value={
                    enabled
                      ? formValues.city
                      : props?.basicData !== undefined
                      ? props?.basicData?.address?.city
                        ? props?.basicData?.address?.city
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.city
                  //     : isDataAvailable && basicData.address.city !== undefined
                  //     ? basicData.address.city
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
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
                      : props?.basicData !== undefined
                      ? props?.basicData?.address?.district
                        ? props?.basicData?.address?.district
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.district
                  //     : isDataAvailable &&
                  //       basicData.address.district !== undefined
                  //     ? basicData.address.district
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
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
                      : props?.basicData !== undefined
                      ? props?.basicData?.address?.state
                        ? props?.basicData?.address?.state
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.state
                  //     : isDataAvailable && basicData.address.state !== undefined
                  //     ? basicData.address.state
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
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
                      : props?.basicData !== undefined
                      ? props?.basicData?.address?.pincode
                        ? props?.basicData?.address?.pincode
                        : ''
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.pincode
                  //     : isDataAvailable &&
                  //       basicData.address.pincode !== undefined
                  //     ? basicData.address.pincode
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
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
                      : props?.basicData !== undefined
                      ? props?.basicData?.address?.country
                        ? props?.basicData?.address?.country
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
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Branch'}
                  formKey={'branch'}
                  isMandatory={true}
                  showInputField
                  isEnabled={false}
                  value={
                    props?.basicData?.area?.zone?.branch?.name !==
                    (undefined || null)
                      ? props?.basicData?.area?.zone?.branch?.name
                      : ''
                  }
                  // value={
                  //   isDataAvailable && basicData.branch !== undefined
                  //     ? basicData.branch
                  //     : ''
                  // }
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Zone'}
                  formKey={'zone'}
                  isMandatory={true}
                  showInputField
                  isEnabled={false}
                  // value={
                  //   isDataAvailable && basicData.zone !== (undefined || null)
                  //     ? basicData.zone
                  //     : ''
                  // }
                  value={props?.basicData?.area?.zone?.name}
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Installation Charges'}
                  formKey={'instCharges'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  keyboardType={'numeric'}
                  value={
                    enabled
                      ? formValues.instCharges
                      : props?.basicData?.user_advance_info !== undefined
                      ? props?.basicData?.user_advance_info
                          ?.installation_charges
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.instCharges
                  //     : isDataAvailable &&
                  //       basicData.user_advance_info.installation_charges !==
                  //         undefined
                  //     ? basicData.user_advance_info.installation_charges
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Security Deposit'}
                  formKey={'securityDeposit'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  keyboardType={'numeric'}
                  value={
                    enabled
                      ? formValues.securityDeposit
                      : props?.basicData?.user_advance_info !== undefined
                      ? props?.basicData?.user_advance_info?.security_deposit
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.securityDeposit
                  //     : isDataAvailable &&
                  //       basicData.user_advance_info.security_deposit !==
                  //         undefined
                  //     ? basicData.user_advance_info.security_deposit
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Area'}
                  formKey={'area'}
                  isMandatory={true}
                  showInputField
                  isEnabled={false}
                  value={props?.basicData?.area?.name}
                  // value={
                  //   isDataAvailable && basicData.area !== undefined
                  //     ? basicData.area
                  //     : ''
                  // }
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'GSTIN'}
                  formKey={'gstin'}
                  isMandatory={true}
                  showInputField
                  isEnabled={enabled}
                  keyboardType="default"
                  value={
                    enabled
                      ? formValues.gstin
                      : props?.basicData?.user_advance_info !== undefined
                      ? props?.basicData?.user_advance_info?.GSTIN
                      : ''
                  }
                  // value={
                  //   enabled
                  //     ? formValues.gstin
                  //     : isDataAvailable &&
                  //       basicData.user_advance_info.GSTIN !==
                  //         (undefined || null)
                  //     ? basicData.user_advance_info.GSTIN
                  //     : ''
                  // }
                  handleFormValueChange={handleFormValueChange}
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Franchise'}
                  formKey={'franchise'}
                  isMandatory={true}
                  showInputField
                  isEnabled={false}
                  value={
                    props?.basicData?.area?.franchise !== (undefined || null)
                      ? props?.basicData?.area?.franchise?.name
                      : ''
                  }
                  // value={
                  //   isDataAvailable &&
                  //   basicData.franchise !== (undefined || null)
                  //     ? basicData.franchise
                  //     : ''
                  // }
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Expiry Date'}
                  formKey={'expDate'}
                  isMandatory={true}
                  showInputField
                  isEnabled={false}
                  value={
                    props?.basicData?.expiry_date
                      ? formatDate(props?.basicData?.expiry_date)
                      : ''
                  }
                  // value={
                  //   isDataAvailable &&
                  //   basicData.expiry_date !== (undefined || null)
                  //     ? formatDate(basicData.expiry_date)
                  //     : ''
                  // }
                />
              </View>
            </View>
            {enabled && (
              <View>
                {!props?.basicData?.radius_info?.static_ip_bind && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      marginLeft: 10,
                    }}>
                    <Checkbox
                      color={Colors.black}
                      status={staticIpChk ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setStaticIPChk(!staticIpChk);
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 14,
                        fontFamily: 'Titillium-Semibold',
                        marginTop: 7,
                      }}>
                      {'Static IP'}
                    </Text>
                  </View>
                )}
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  {!props?.basicData?.radius_info?.static_ip_bind &&
                    staticIpChk && (
                      <View
                        style={{
                          flex: 0.97,
                          flexDirection: 'column',
                          marginLeft: 10,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: Colors.grey_888888,
                              fontSize: 14,
                            }}>
                            IP Pool
                          </Text>
                        </View>
                        <Dropdown
                          style={[styles.dropdown]}
                          containerStyle={{marginTop: -22}}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          data={ipPoolList}
                          maxHeight={200}
                          labelField="name"
                          valueField="id"
                          placeholder={''}
                          value={poolData}
                          onFocus={() => {
                            setIsFocus(true);
                            getIPPoolList();
                          }}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setPoolData(item.id);
                            setIsFocus(false);
                          }}
                        />
                      </View>
                    )}
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  {!props?.basicData?.radius_info?.static_ip_bind &&
                    staticIpChk && (
                      <View
                        style={{
                          flex: 0.97,
                          flexDirection: 'column',
                          marginLeft: 10,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: Colors.grey_888888,
                              fontSize: 14,
                            }}>
                            Static IP
                          </Text>
                        </View>
                        <Dropdown
                          style={[styles.dropdown]}
                          containerStyle={{marginTop: -22}}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          data={strAscending}
                          maxHeight={200}
                          labelField="ip"
                          valueField="ip"
                          placeholder={''}
                          value={ipData}
                          onFocus={() => {
                            setIsFocus(true);
                            getReaminingIP();
                          }}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setIPData(item.ip);
                            setIsFocus(false);
                            setStaticCost(value);
                          }}
                        />
                      </View>
                    )}
                </View>
                <View style={{flex: 1}}>
                  {!props?.basicData?.radius_info?.static_ip_bind &&
                    staticIpChk && (
                      <FormFieldInput
                        title={'Static IP Cost '}
                        // formKey={'expDate'}
                        isMandatory={false}
                        showInputField
                        isEnabled={false}
                        value={staticCost ? staticCost.toString() : '0'}
                      />
                    )}
                </View>
              </View>
            )}

            <View style={{flex: 2, flexDirection: 'row'}}>
              {props?.basicData?.radius_info?.static_ip_bind && (
                <View style={{flex: 1}}>
                  <FormFieldInput
                    title={'Static IP'}
                    formKey={'staticIP'}
                    isMandatory={true}
                    showInputField
                    isEnabled={enabled}
                    value={
                      enabled
                        ? formValues.staticIP
                        : props?.basicData?.radius_info?.static_ip_bind
                        ? props?.basicData?.radius_info?.static_ip_bind
                        : ''
                    }
                    handleFormValueChange={handleFormValueChange}
                  />
                </View>
              )}
              <View style={{flex: 1}}>
                {props?.basicData?.radius_info?.static_ip_bind && (
                  <FormFieldInput
                    title={'Static IP Cost'}
                    formKey={'staticIPCost'}
                    isMandatory={true}
                    showInputField
                    isEnabled={enabled}
                    value={
                      enabled
                        ? formValues.staticIPCost
                        : props?.basicData?.radius_info?.static_ip_cost
                        ? props?.basicData?.radius_info?.static_ip_cost
                        : ''
                    }
                    // value={
                    //   enabled
                    //     ? formValues.staticIPCost
                    //     : isDataAvailable &&
                    //       basicData.radius_info.static_ip_cost !==
                    //         (undefined || null)
                    //     ? basicData.radius_info.static_ip_cost
                    //     : ''
                    // }
                    handleFormValueChange={handleFormValueChange}
                  />
                )}
              </View>
            </View>
            {enabled && (
              <View style={{marginTop: 5}}>
                <Text style={{marginLeft: 15}}>SMS Services</Text>
                <View
                  style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={{marginTop: -22}}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={statusData}
                    maxHeight={100}
                    labelField="name"
                    valueField="code"
                    placeholder="SMS Services *"
                    value={smsService}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setSmsService(item.code);
                      setIsFocus(false);
                    }}
                  />
                </View>
              </View>
            )}
            {enabled && (
              <View style={{marginTop: 5, marginBottom: 15}}>
                <Text style={{marginLeft: 15}}>Email Services</Text>
                <View
                  style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={{marginTop: -22}}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={statusData}
                    maxHeight={100}
                    labelField="name"
                    valueField="code"
                    placeholder="Email Services "
                    value={mailService}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setMailService(item.code);
                      setIsFocus(false);
                    }}
                  />
                </View>
              </View>
            )}
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
          setRenewRecent({ visible: false,text: ''});
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

      <DialogView
        showLoadingDialog
        visible={isEditLoading}
        text={'Edit Enabling...'}></DialogView>
    </View>
  );
};

function mapStateToProps(state, props) {
  return {
    customer: state.mainReducers.main.customer,
    userInfo: state.mainReducers.main.userInfo,
  };
}

export default connect(mapStateToProps)(BasicInfo);
