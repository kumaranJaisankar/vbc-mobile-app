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
  changePassword,
  getCustomerDocs,
  deactivateUser,
  buffer,
  hold,
  getTemprorayRenewal,
  getSessionInfo,
  customerInfoData,
  Unhold,
} from '../../../../services/MainService';
import RBSheet from 'react-native-raw-bottom-sheet';
import {formData} from '../../../../Common/formData';
import styles from '../styles';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNavigation, useRoute} from '@react-navigation/native';
import {showAppInstruction} from '../../../../Common/Common';
//redux
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import {formatDate} from '../../../../Common/utility';
import {id} from 'date-fns/locale';

const UserInfo = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const valueFromrenew = route?.params?.paramValue;
  const [basicData, setBasicData] = useState({});
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [customerPic, setCustomerPic] = useState('');
  const refRBSheet = useRef();
  const [sessionData, setSessionData] = useState({});
  const [customerData, setCustomerData] = useState({});
  var data = {
    newPass: '',
    confirmNewPass: '',
  };
  console.log(customerData, 'basicData');
  console.log('props monir', props);
  const [formValues, handleFormValueChange, setFormValues] = formData(data);
  const [isLoading, setLoading] = useState({
    spinner: false,
    spinnerText: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalFlag, setModalFlag] = useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [unhold, setUnHold] = React.useState();
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });
  const permission = props.userInfo.permissions;
  console.log('account status', props?.customer?.account_status);

  console.log('abclogs', props.customer.account_status);
  useEffect(() => {
    setIsDataLoading(true);
    if (Object.keys(props?.userInfoData).length) {
      console.log(
        '🚀 ~ file: UserInfo.js:64 ~ UserInfo ~ props',
        props.userInfoData,
      );
      setIsDataLoading(false);
      setCustomerData(props?.userInfoData);
    } else {
      setIsDataLoading(true);
    }
  }, [props?.userInfoData, unhold,navigation]);

  const getCustomerInfo = async () => {
    setIsDataLoading(true);
    const response = await customerInfoData(
      props?.customer?.user?.id,
      props?.customer?.user?.username,
    );
    console.log(
      '🚀 ~ file: UserInfo.js:74 ~ getCustomerInfo ~ response',
      response,
    );
    if (response?.isSuccess) {
      setIsDataLoading(false);
      setCustomerData(response?.result);
    } else {
      setIsDataLoading(false);
    }
  };

  console.log('aaaa', props?.customer?.username);

  console.log('cccc', props?.customer?.user);
  const getsessionData = async () => {
    const response = await getSessionInfo(
      props?.customer?.username,
      props?.customer?.user,
    );
    if (response?.isSuccess === 200) {
      setSessionData(response?.result);
    } else {
      const responseMsg = response;
      setIsDataAvailable(false);
      setIsDataLoading(false);
    }
  };

  console.log('props', props);

  const getBasicData = async () => {
    setIsDataLoading(true);
    try {
      const response = await getCustomerBasicInfo(props.customer.user);
      console.log('on load pasas', response);
      if (response.isSuccess) {
        setBasicData(response.result);
      } else {
        const responseMsg = response;
        setIsDataAvailable(false);
        setIsDataLoading(false);
      }
    } catch (err) {
      const errorresponse = err.toString();
      setIsDataAvailable(false);
      setIsDataLoading(false);
    }
  };

  const getCustomerPic = async () => {
    try {
      const response = await getCustomerDocs(props.customer.user);
      console.log(
        '🚀 ~ file: UserInfo.js:88 ~ getCustomerPic ~ response',
        response,
      );
      if (response.isSuccess) {
        setCustomerPic(response.result.customer_pic_preview);
        setIsDataAvailable(true);
        setIsDataLoading(false);
      } else {
        const responseMsg = response;
        setIsDataAvailable(false);
        setIsDataLoading(false);
      }
    } catch (err) {
      const errorresponse = err.toString();
      setIsDataAvailable(false);
      setIsDataLoading(false);
    }
  };

  const upDatePassword = async () => {
    console.log('User Information', props?.customer?.user?.username);
    console.log('User Information', formValues.newPass);
    console.log('User Information', formValues.confirmNewPass);

    try {
      if (
        props?.customer?.user?.username &&
        formValues.newPass &&
        formValues.confirmNewPass
      ) {
        if (
          formValues.newPass.includes(' ') ||
          formValues.confirmNewPass.includes(' ')
        ) {
          setRenewRecent({
            text: 'Please remove spaces from passwords',
            visible: true,
          });
          // Toast.show({
          //   type: 'warning',
          //   text1: 'Please remove spaces from passwords',
          // });
        } else {
          if (formValues.newPass === formValues.confirmNewPass) {
            var body = {
              username: props?.customer?.user?.username,
              password: formValues.newPass,
              password2: formValues.confirmNewPass,
            };
            setLoading({spinner: true, spinnerText: 'Updating Password...'});
            const response = await changePassword(body);
            if (response.isSuccess) {
              const responseMsg = response;
              setFormValues({
                newPass: '',
                confirmNewPass: '',
              });
              setLoading({spinner: false, spinnerText: ''});
              Toast.show({
                type: 'success',
                text1: 'Password updated successfully!',
              });
              getCustomerInfo();
              refRBSheet.current.close();
              setIsDataLoading(false);
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
          } else {
            setRenewRecent({
              text: 'Passwords is not match!',
              visible: true,
            });
            // Toast.show({
            //   type: 'warning',
            //   text1: `Passwords don't match!`,
            // });
            // showMessage({
            //   message: `Passwords don't match!`,
            //   type: 'warning',
            // });
          }
        }
      } else {
        setRenewRecent({
          text: 'Please fill up all the necessary fields!',
          visible: true,
        });
        // Toast.show({
        //   type: 'warning',
        //   text1: 'Please fill up all the necessary fields!',
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

  console.log('erroraaa', props?.userInfoData?.user?.username);
  const disconnectUser = async () => {
    try {
      setLoading({spinner: true, spinnerText: 'Disconnecting'});
      const response = await deactivateUser(
        props?.userInfoData?.user?.username,
      );
      if (response.isSuccess) {
        const responseMsg = response;
        setLoading({spinner: false, spinnerText: ''});
        Toast.show({
          type: 'success',
          text1: 'User deactivated successfully!',
        });
        getCustomerInfo();
        navigation.navigate('KYC_List');
      } else {
        const errorresponse = response;
        console.log('errorresponse', errorresponse);
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
  };

  const enableBuffer = async () => {
    try {
      var body = {
        time_period: 48,
      };
      setLoading({spinner: true, spinnerText: 'Enabling'});
      const response = await getTemprorayRenewal(props?.id, body);
      if (response.isSuccess) {
        // getBasicData();
        getCustomerInfo();
        setIsDataLoading(false);
        setLoading({spinner: false, spinnerText: ''});
        Toast.show({
          type: 'success',
          text1: 'Buffer enabled successfully!',
        });
      } else {
        const errorresponse = response;
        setLoading({spinner: false, spinnerText: ''});
        setRenewRecent({
          text: 'Cannot put in buffer period while customer is active',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Cannot put in buffer period while customer is active.',
        // });
      }
    } catch (err) {
      const errorresponse = err.toString();
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
  };

  // const makeUnhold = async () => {
  //   try {
  //     setLoading({spinner: true, spinnerText: 'Unholding'});
  //     const res = await Unhold(props?.customer?.user?.id);
  //     console.log('🚀 ~ file: UserInfo.js:302 ~ makeUnhold ~ res', res);
  //     if (res?.isSuccess) {
  //       setLoading({spinner: false, spinnerText: ''});
  //       setUnHold(false);
  //       Toast.show({
  //         type: 'success',
  //         text1: 'UnHold successful!',
  //       });
  //       props.customerFun();
  //     } else {
  //       const errorresponse = response;
  //       console.log(
  //         '🚀 ~ file: UserInfo.js:316 ~ makeUnhold ~ errorresponse',
  //         errorresponse,
  //       );
  //       setLoading({spinner: false, spinnerText: ''});
  //       Toast.show({
  //         type: 'error',
  //         text1: errorresponse?.message?.response?.data?.detail,
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err, 'errrrrrrrrrrrrr');
  //     setLoading({spinner: false, spinnerText: ''});
  //   }
  // };

  const makeUnhold = async () => {
    try {
      var body = {
        account_status: 'HLD',
      };
      setLoading({spinner: true, spinnerText: 'Unholding'});
      const res = await Unhold(props?.customer?.user?.id);
      console.log('res', res);
      if (response.isSuccess) {
        const responseMsg = response;
        setLoading({spinner: false, spinnerText: ''});
        setUnHold(false);
        Toast.show({
          type: 'success',
          text1: 'UnHold successful!',
        });
        props.customerFun();
      } else {
        const errorresponse = response;
        setLoading({spinner: false, spinnerText: ''});
        setRenewRecent({
          text: errorresponse?.message?.response?.data?.detail,
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: errorresponse?.message?.response?.data?.detail,
        // });
      }
    } catch (err) {
      const errorresponse = err.toString();
      console.log(
        '🚀 ~ file: UserInfo.js:358 ~ makeUnhold ~ errorresponse',
        err,
      );
      setLoading({spinner: false, spinnerText: ''});
      setRenewRecent({
        text: 'Customer should wait for 30 days before he can be released from HOLD',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1:
      //     'Customer should wait for 30 days before he can be released from HOLD',
      // });
    }
  };

  const makeHold = async () => {
    try {
      var body = {
        account_status: 'HLD',
      };
      setLoading({spinner: true, spinnerText: 'Holding'});
      const response = await hold(props?.customer?.user?.id, body);
      if (response.isSuccess) {
        const responseMsg = response;
        setLoading({spinner: false, spinnerText: ''});
        setUnHold(true);
        Toast.show({
          type: 'success',
          text1: 'Hold successful!',
        });
        props.customerFun();
      } else {
        const errorresponse = response;
        setLoading({spinner: false, spinnerText: ''});
        setRenewRecent({
          text: errorresponse?.message?.response?.data?.detail,
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: errorresponse?.message?.response?.data?.detail,
        // });
      }
    } catch (err) {
      const errorresponse = err.toString();
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
  };
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
                User Information
              </Text>
            </View>
            {permission.find(code => code === 13) && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    getCustomerInfo();
                    refRBSheet.current.open();
                  }}>
                  <Feather
                    name={'edit'}
                    size={25}
                    color={Colors.orange_295CBF}
                    style={{padding: 10}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View
            style={{
              height: 250,
              margin: 10,
              borderRadius: 2,
              borderWidth: 3,
              borderColor: Colors.grey_D0D0D0,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            {customerData && (
              <Image
                source={{
                  uri: customerData?.customer_documents?.customer_pic_preview,
                }}
                style={{width: '100%', height: 250, borderRadius: 5}}
              />
            )}
          </View>
          <View style={{backgroundColor: Colors.white}}>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'User ID'}
                  formKey={'userID'}
                  isMandatory={true}
                  showInputField
                  isEnabled={false}
                  value={
                    customerData?.user?.username
                      ? customerData?.user?.username.toString()
                      : ''
                  }
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Name'}
                  formKey={'name'}
                  isMandatory={true}
                  showInputField
                  isEnabled={false}
                  value={
                    customerData !== undefined
                      ? customerData?.first_name + ' ' + customerData?.last_name
                      : ''
                  }
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Mobile'}
                  formKey={'mobile'}
                  isMandatory={true}
                  showInputField
                  isEnabled={false}
                  value={
                    customerData?.register_mobile
                      ? customerData?.register_mobile
                      : ''
                  }
                  // value={
                  //   isDataAvailable && basicData.register_mobile !== undefined
                  //     ? basicData.register_mobile
                  //     : ''
                  // }
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'A/C Status'}
                  formKey={'acStatus'}
                  isMandatory={true}
                  showInputField
                  isEnabled={false}
                  // value={
                  //   isDataAvailable && basicData.account_status !== undefined
                  //     ? basicData.account_status
                  //     : ''
                  // }
                  value={
                    customerData?.account_status
                      ? customerData?.account_status === 'KYC'
                        ? 'KYC Confirmed'
                        : customerData?.account_status === 'EXP'
                        ? 'Expired'
                        : customerData?.account_status === 'ACT'
                        ? 'Active'
                        : customerData?.account_status === 'DCT'
                        ? 'Deactive'
                        : customerData?.account_status === 'SPD'
                        ? 'Suspended'
                        : customerData?.account_status === 'HLD'
                        ? 'Hold'
                        : customerData?.account_status === 'INS'
                        ? 'Installation'
                        : customerData?.account_status === 'PROV'
                        ? 'Provisioning'
                        : ''
                      : ''
                  }
                />
              </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Last Renew Date'}
                  // formKey={'mobile'}
                  // isMandatory={true}
                  showInputField
                  isEnabled={false}
                  // value={
                  //   isDataAvailable && sessionData?.monthly_date
                  //     ? formatDate(sessionData?.monthly_date)
                  //     : 'Not found'
                  // }
                  value={
                    customerData?.monthly_date
                      ? formatDate(customerData?.monthly_date)
                      : 'Not Found'
                  }
                />
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Expiry Date '}
                  // formKey={'acStatus'}
                  // isMandatory={true}
                  showInputField
                  isEnabled={false}
                  value={
                    customerData?.expiry_date
                      ? formatDate(customerData?.expiry_date)
                      : 'Not Found'
                  }
                  // value={
                  //   isDataAvailable && basicData?.expiry_date
                  //     ? formatDate(basicData?.expiry_date)
                  //     : ''
                  // }
                />
              </View>
            </View>

            <View style={{flex: 2, flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  margin: 8,
                  marginHorizontal: 15,
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: Colors.grey_888888,
                      fontSize: 14,
                      alignSelf: 'flex-start',
                    }}>
                    Connection Status
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor:
                      basicData.acctstoptime !== undefined
                        ? Colors.green_36BE39
                        : Colors.red_FF0000,
                    borderRadius: 15,
                    height: 35,
                    marginTop: 7,
                    padding: 5,
                    width: 85,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 14,
                      alignSelf: 'center',
                    }}>
                    {basicData.acctstoptime !== undefined
                      ? 'Online'
                      : 'Offline'}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <FormFieldInput
                  title={'Password'}
                  formKey={'password'}
                  isMandatory={true}
                  showInputField
                  isEnabled={false}
                  isPasswordField={
                    permission.find(code => code === 448) ? false : true
                  }
                  // value={
                  //   isDataAvailable &&
                  //   basicData.cleartext_password !== undefined
                  //     ? basicData.cleartext_password
                  //     : ''
                  // }
                  value={
                    customerData?.user?.cleartext_password
                      ? customerData?.user?.cleartext_password
                      : ''
                  }
                />
              </View>
            </View>

            <View>
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  marginTop: 25,
                  margin: 8,
                  marginHorizontal: 15,
                }}>
                {permission.find(code => code === 310) && (
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      style={{height: 40}}
                      onPress={() => {
                        setModalFlag(1);
                        setModalText('Are you sure you want to disconnect?');
                        setModalVisible(true);
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#FF0000',
                          fontSize: 16,
                          textAlign: 'center',
                          backgroundColor: '#ffffff',
                          borderRadius: 10,
                          // padding: 10,
                          paddingBottom: 15,
                          paddingTop: 5,
                          borderColor: '#FF0000',
                          borderWidth: 1,
                        }}>
                        Disconnect
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {permission.find(code => code === 445) &&
                  <View style={{flex: 1}}>
                    <View>
                      <TouchableOpacity
                        style={{height: 40}}
                        onPress={() => {
                          navigation.navigate('PlanRenewal');
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
                            // padding: 10,
                            paddingBottom: 15,
                            paddingTop: 5,
                            borderColor: '#DC631F',
                            borderWidth: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          Renew Plan
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
               }
              </View>
            </View>
            <View>
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  marginTop: 25,
                  margin: 8,
                  marginHorizontal: 15,
                }}>
                {permission.find(code => code === 456||457) && (
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      style={{height: 40}}
                      onPress={() => {
                        navigation.navigate('Shifting',{
                          data:customerData,
                          userInfo:props?.customer
                        });
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#FF0000',
                          fontSize: 16,
                          textAlign: 'center',
                          backgroundColor: '#ffffff',
                          borderRadius: 10,
                          // padding: 10,
                          paddingBottom: 15,
                          paddingTop: 5,
                          borderColor: '#FF0000',
                          borderWidth: 1,
                        }}>
                        Shifting
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {permission.find(code => code === 458) &&
                  <View style={{flex: 1}}>
                    <View>
                      <TouchableOpacity
                        style={{height: 40}}
                        onPress={() => {
                          navigation.navigate('Extend',{
                            data:customerData,
                            userInfo:props?.customer
                          });
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
                            // padding: 10,
                            paddingBottom: 15,
                            paddingTop: 5,
                            borderColor: '#DC631F',
                            borderWidth: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          Extend
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
               }
              </View>
            </View>
            <View>
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  marginTop: 25,
                  margin: 8,
                  marginHorizontal: 15,
                }}>
                <View style={{flex: 1}}>
                  {customerData?.account_status === 'HLD' || unhold ? (
                    <View>
                      {permission.find(code => code === 447) && (
                        <View>
                          <TouchableOpacity
                            style={{height: 40}}
                            onPress={() => makeUnhold()}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#008000',
                                fontSize: 16,
                                textAlign: 'center',
                                backgroundColor: '#ffffff',
                                borderRadius: 10,
                                // padding: 10,
                                paddingBottom: 15,
                                paddingTop: 5,
                                borderColor: '#008000',
                                borderWidth: 1,
                              }}>
                              Unhold
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={{flex: 1}}>
                      {permission.find(code => code === 447) && (
                        <View>
                          <TouchableOpacity
                            style={{height: 40}}
                            onPress={() => {
                              setModalFlag(3);
                              setModalText('Are you sure you want to Hold?');
                              setModalVisible(true);
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#808080',
                                fontSize: 16,
                                textAlign: 'center',
                                backgroundColor: '#ffffff',
                                borderRadius: 10,
                                // padding: 10,
                                paddingBottom: 15,
                                paddingTop: 5,
                                borderColor: '#808080',
                                borderWidth: 1,
                              }}>
                              Hold
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{height: 40}}
                    onPress={() => {
                      navigation.navigate('TrafReports');
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
                        // padding: 10,
                        paddingBottom: 15,
                        paddingTop: 5,
                        borderColor: '#DC631F',
                        borderWidth: 1,
                      }}>
                      Traffic/Session Report
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {permission.find(code => code === 446) && (
              <View style={{flex: 1}}>
                {basicData.account_status === 'Expired' && (
                  <TouchableOpacity
                    style={{height: 40}}
                    onPress={() => {
                      setModalFlag(2);
                      setModalText(
                        'Are you sure you want to Activate Temporary Renewal ?',
                      );
                      setModalVisible(true);
                    }}>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 16,
                        textAlign: 'center',
                        backgroundColor: '#DC631F',
                        borderRadius: 10,
                        // padding: 10,
                        paddingBottom: 15,
                        paddingTop: 5,
                        borderColor: '#DC631F',
                        borderWidth: 1,
                      }}>
                      Temporary Renewal
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={400}
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
        <View style={{padding: 20}}>
          <ScrollView>
            <View>
              <View style={{flex: 2, flexDirection: 'row'}}>
                <View style={{flex: 1.2}}>
                  <FormFieldInput
                    title={'Password'}
                    formKey={'password'}
                    isMandatory={true}
                    showInputField
                    isEnabled={false}
                    isPasswordField={false}
                    // value={
                    //   isDataAvailable &&
                    //   basicData.cleartext_password !== undefined
                    //     ? basicData.cleartext_password
                    //     : ''
                    // }
                    value={
                      customerData?.user?.cleartext_password
                        ? customerData?.user?.cleartext_password
                        : ''
                    }
                  />
                </View>
                <View style={{flex: 0.8, marginTop: 25}}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsVisible(true);
                    }}
                    style={{
                      backgroundColor: Colors.orange_295CBF,
                      borderRadius: 15,
                    }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#ffffff',
                          fontSize: 16,
                          alignSelf: 'center',
                        }}>
                        Change Password
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {isVisible ? (
                <View>
                  <View style={{flex: 2, flexDirection: 'column'}}>
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={'New Password'}
                        formKey={'newPass'}
                        isMandatory={true}
                        showInputField
                        isEnabled={true}
                        length={20}
                        value={formValues.newPass}
                        handleFormValueChange={handleFormValueChange}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={'Confirm Password'}
                        formKey={'confirmNewPass'}
                        isMandatory={true}
                        showInputField
                        isEnabled={true}
                        length={20}
                        value={formValues.confirmNewPass}
                        handleFormValueChange={handleFormValueChange}
                      />
                    </View>
                  </View>
                  <View style={{flex: 2, flexDirection: 'row', marginTop: 25}}>
                    <View style={{flex: 1}}>
                      <TouchableOpacity
                        style={{height: 40}}
                        onPress={() => {
                          setIsVisible(false);
                          setFormValues({
                            newPass: '',
                            confirmNewPass: '',
                          });
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
                        onPress={upDatePassword}>
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
                          Update
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </RBSheet>
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
        text={'Loading User Info...'}></DialogView>
      <DialogView
        showConfirmDialog
        visible={modalVisible}
        text={modalText}
        onConfirm={() => {
          setModalVisible(false);
          {
            modalFlag == 1 && disconnectUser();
          }
          {
            modalFlag == 2 && enableBuffer();
          }
          {
            modalFlag == 3 && makeHold();
          }
          setModalFlag(0);
        }}
        onCancel={() => {
          setModalFlag(0);
          setModalVisible(false);
        }}></DialogView>
    </View>
  );
};

function mapStateToProps(state, props) {
  return {
    customer: state.mainReducers.main.customer,
    userInfo: state.mainReducers.main.userInfo,
  };
}

export default connect(mapStateToProps)(UserInfo);
