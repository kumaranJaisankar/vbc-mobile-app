import React, {useRef, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {Colors} from '../../../Common/Colors';
import {strings} from '../../../../strings/i18n';
import {formData} from '../../../Common/formData';
import FormFieldInput from '../FormFields/KYC_FormField1';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import DialogView from '../../../Common/DialogView';
import {TextInput, Checkbox, RadioButton} from 'react-native-paper';
import {
  getAreaListData,
  getPlanListData,
  getPaymentMethodListData,
  getNASBranchList,
  makePayment,
  createCustomer,
  getAssignUsers,
  getPaymentOptions,
  checkWalletInfo,
  makeOfflinePayment,
  getIpPoolData,
  getReaminingIPs,
  getBranchZone,
  KycCheckAmount,
} from '../../../services/MainService';
import RBSheet from 'react-native-raw-bottom-sheet';
import Camera from '../../../Common/Camera';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import format from 'date-fns/format';
import styles from './styles';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import apiConfig from '../../../services/api/config';
import locationServices from '../../../services/api';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {macAddressMask} from '../../../../utils/macAddressMask';
import {inputAlphaNumeric} from '../../../../utils/inputAlpaNumaric';
const KYC_Add_Update = props => {
  const navigation = useNavigation();
  const [text, setText] = React.useState('');
  const [pageNo, setPageNo] = React.useState(1);
  const [nextText, setNextText] = React.useState('Next');
  const [isLoading, setLoading] = React.useState({text: '', visible: false});
  const [isTitle, setTitle] = React.useState(strings('KYC_Form.Add_KYC_Form'));
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [showSuccessfulAlertDialog, setShowSuccessfulAlertDialog] =
    React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [upSpeed, setUpSpeed] = React.useState(0);
  const [downSpeed, setDownSpeed] = React.useState(0);
  const [planSgst, setPlanSgst] = React.useState(0);
  const [planCgst, setPlanCgst] = React.useState(0);
  const [totalPlanCost, setTotalPlanCost] = React.useState(0.0);
  const [discountamount, setDiscountAmount] = React.useState(0.0);
  const [timeUnit, setTimeUnit] = React.useState();
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });
  const [isError, setError] = React.useState({
    text: '',
    visible: false,
  });
  const [card, setCard] = React.useState('adharCard');
  var data = {
    first_name: '',
    last_name: '',
    mobile_no: '',
    email: '',
    pincode: '',
    hNo: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    district: '',
    country: '',
    permanentPincode: '',
    permanentHNo: '',
    permanentStreet: '',
    permanentLandmark: '',
    permanentCity: '',
    permanentState: '',
    permanentDistrict: '',
    permanentCountry: '',
    installationCharge: '',
    static_ip_bind: '',
    static_ip_cost: '',
    ippool: '',
    securityDeposit: '',
    aadhar_no: '',
    pan_no: '',
    GSTIN: '',
    mac_bind: '',
    discount_amount: '',
    bank_reference_no: '',
  };
  const [formValues, handleFormValueChange, setFormValues] = formData(data);
  const [isBranchData, setBranchData] = React.useState([]);
  const [isFocus, setIsFocus] = React.useState(false);
  const [branch, setBranch] = React.useState('');
  const [zone, setZone] = React.useState('');

  const [requiredMsg, setRequiredMsg] = React.useState({});
  const [permanentAddreessChecked, setpermanentAddreessChecked] =
    React.useState(false);
  const [isProfilePicUri, setProfilePicUri] = React.useState('');
  const profilePicRBSheet = useRef();
  const signTermsRBSheet = useRef();
  const paymentMethodRBSheet = useRef();
  const [isCameraClick, setCamerClick] = React.useState('');
  const [areaData, setAreaData] = React.useState([]);
  const [planData, setPlanData] = React.useState([]);
  const [area, setArea] = React.useState('');
  const [areas, setAreas] = React.useState('');
  const [plan, setPlan] = React.useState({id: 0, name: ''});
  const [planCost, setPlanCost] = React.useState(0.0);
  const [isAddressProofUri, setAddressProofUri] = React.useState('');
  const [isIDProofUri, setIDProofUri] = React.useState('');
  const [isSignatureProofUri, setSignatureProofUri] = React.useState('');
  const [isSignatureDisplay, setSignatureDisplay] = React.useState(false);
  const [checked, setChecked] = React.useState('phone');
  const [paymentMethodListData, setPaymentMethodListData] = React.useState([]);
  const [isChecked, setIsChecked] = React.useState(false);
  const [paymentMethodChecked, setPaymentMethodChecked] = React.useState({});
  const [makePaymentResponse, setMakePaymentResponse] = React.useState({});
  const [billDate, setBillDate] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [assignedToData, setAssignedToData] = React.useState([]);
  const [assignedTo, setAssignedTo] = React.useState('');
  const [offlinePaymentOptions, setOfflinePaymentOptions] = React.useState([]);
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [receipt, setReceipt] = React.useState('');
  const [dataLimit, setDataLimit] = React.useState(0);
  const [isLocationFetched, setLocationFetched] = React.useState(false);
  const [isDecisionVisible, setDecisionVisible] = React.useState({
    text: '',
    visible: false,
  });

  console.log('branch', branch);
  console.log('SGST', planSgst);
  const [ipPoolList, setIpPoolList] = React.useState([]);
  const [poolData, setPoolData] = React.useState('');
  const [ipList, setIpList] = React.useState([]);
  const [ipData, setIPData] = React.useState('');
  const [costIP, setCostIP] = React.useState();
  const [serviceId, setServiceId] = React.useState();
  const [calculateValue, setCalculateValue] = React.useState([]);
  const profilePicclicked = () => {
    setCamerClick('profilePic');
    profilePicRBSheet.current.open();
  };

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

  const receiptUpClicked = () => {
    setCamerClick('receipt');
    profilePicRBSheet.current.open();
  };
  const getAreaList = async () => {
    try {
      const response = await getAreaListData();
      console.log(response, 'area response');
      if (response.isSuccess) {
        if (response.result.areas.length > 0) {
          setAreaData(response.result.areas);
        } else {
          const responseMsg = response;
          setError({
            text: 'No Area found! Please try again later.',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No Area found! Please try again later.',
          // });
        }
      } else {
        const responseMsg = response;
        setError({
          text: 'No Area found! Please try again later.',
          visible: true,
        });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setError({
        text: 'No Area found! Please try again later.',
        visible: true,
      });
    }
  };

  const getZoneBranch = async areaID => {
    setLoading({text: 'Fetching Zone & Branch ...', visible: true});
    try {
      const response = await getBranchZone(areaID);
      console.log(
        '🚀 ~ file: KYC_Add_Update.js:190 ~ getZoneBranch ~ response',
        response,
      );
      if (response?.isSuccess === 200) {
        setBranch(response?.result?.branch?.name);
        setZone(response?.result?.zone?.name);
        setLoading({text: 'Fetching Zone & Branch ...', visible: false});
      } else {
        setLoading({text: 'Fetching Zone & Branch ...', visible: false});
        setError({
          text: 'No Zone or Branch found.',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No Zone or Branch found.',
        // });
      }
    } catch (error) {
      setLoading({text: 'Fetching Zone & Branch ...', visible: false});
      const errorresponse = error.toString();
      console.log(
        '🚀 ~ file: KYC_Add_Update.js:190 ~ getZoneBranch ~ errorresponse',
        errorresponse,
      );
      setError({
        text: 'No Zone or Branch found.',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No Zone or Branch found.',
      // });
    }
    console.log(
      '🚀 ~ file: KYC_Add_Update.js:205 ~ getZoneBranch ~ name',
      name,
    );
    console.log(
      '🚀 ~ file: KYC_Add_Update.js:205 ~ getZoneBranch ~ name',
      name,
    );
  };

  const getPlanList = async areaID => {
    try {
      const response = await getPlanListData(areaID);
      console.log(
        '🚀 ~ file: KYC_Add_Update.js:221 ~ getPlanList ~ response',
        response,
      );
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setPlanData(response.result);
        } else {
          const responseMsg = response;
          setError({
            text: 'No Plan found for this area! Please try again later.',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No Plan found for this area! Please try again later.',
          // });
        }
      } else {
        const responseMsg = response;
        setError({
          text: 'No Plan found for this area! Please try again later.',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No Plan found for this area! Please try again later.',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setError({
        text: 'No Plan found for this area! Please try again later.',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No Plan found for this area! Please try again later.',
      // });
    }
  };

  const getPaymentMethodList = async () => {
    console.log('area', area ? area : '');
    try {
      const response = await getPaymentMethodListData(area ? area : '');
      console.log('re', response);
      if (response.isSuccess === 200) {
        if (response.result.length > 0) {
          setPaymentMethodListData(response?.result);
          paymentMethodRBSheet.current.open();
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

  const getBranchList = async () => {
    try {
      const response = await getNASBranchList();
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setBranchData(response.result);
        } else {
          const responseMsg = response;
          setError({
            text: 'No Branch found! Please try again later.',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No Branch found! Please try again later.',
          // });
        }
      } else {
        const responseMsg = response;
        setError({
          text: 'No Branch found! Please try again later.',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No Branch found! Please try again later.',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setError({
        text: 'No Branch found! Please try again later.',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No Branch found! Please try again later.',
      // });
    }
  };
  const getAssignToUsers = async () => {
    try {
      const response = await getAssignUsers();
      if (response.isSuccess) {
        if (response.result.assigned_to.length > 0) {
          setAssignedToData(response.result.assigned_to);
        } else {
          Toast.show({
            type: 'error',
            text1: 'No data found! Please try later.',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong! Please try again later.',
        });
      }
    } catch (error) {
      const errorresponse = error.toString();
      Toast.show({
        type: 'error',
        text1: 'Something went wrong! Please try again later.',
      });
    }
  };
  const getOfflinePaymentOptions = async () => {
    try {
      const response = await getPaymentOptions();
      if (response.isSuccess) {
        if (response.result.offline_payment_modes.length > 0) {
          const value = response.result.offline_payment_modes?.map(item =>
            item.id === 'Bank_transfer' ? {...item, id: 'BNKTF'} : item,
          );
          console.log('Payment Method', value);
          setOfflinePaymentOptions(value);
        } else {
          setError({
            text: 'No data found! Please try later.',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No data found! Please try later.',
          // });
        }
      } else {
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

  // getting pool branch list
  const getingIPPoolList = async areaID => {
    console.log(areaID, 'areaID');
    try {
      const response = await getIpPoolData(areaID);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setIpPoolList(response.result);
        } else {
          const responseMsg = response;
          setError({
            text: 'No IPpool found! Please try again later.',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No IPpool found! Please try again later.',
          // });
        }
      } else {
        const responseMsg = response;
        setError({
          text: 'No IPpool found! Please try again later.',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No IPpool found! Please try again later.',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setError({
        text: 'No IPpool found! Please try again later.',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No IPpool found! Please try again later.',
      // });
    }
  };
  // remaining ip's

  const getReaminingIPslist = async () => {
    try {
      const response = await getReaminingIPs(poolData);
      console.log(
        '🚀 ~ file: KYC_Add_Update.js:399 ~ getReaminingIPslist ~ response',
        response,
      );
      if (response.isSuccess) {
        if (response.result.available_ips.length > 0) {
          setIpList(response.result.available_ips);
          setCostIP(response?.result?.cost_per_ip);
        } else {
          const responseMsg = response;
          setError({
            text: 'No IPpool found! Please try again later.',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No IPpool found! Please try again later.',
          // });
        }
      } else {
        const responseMsg = response;
        setError({
          text: 'No IPpool found! Please try again later.',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No IPpool found! Please try again later.',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setError({
        text: 'No IPpool found! Please try again later.',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'No IPpool found! Please try again later.',
      // });
    }
  };

  // sorting Ip's

  const strAscending = [...ipList]?.sort((a, b) => (a.ip > b.ip ? 1 : -1));
  const extraAmount = formValues.static_ip_cost
    ? !planCgst
      ? planCost * 0.18
      : 0
    : 0;

  // discount
  //use effect for discount
  // useEffect(() => {
  //   let finalAmountdiscount =
  //     ((parseFloat(formValues?.discount_amount) *
  //       ((totalPlanCost) ))) / 100;

  //       setTotalPlanCost(
  //       Number(totalPlanCost) - Number(finalAmountdiscount)
  //   );
  //   console.log(finalAmountdiscount,"finalAmountdiscount")
  //   console.log(discountamount,"dis");
  //   console.log(totalPlanCost,"total");

  // }, [formValues?.discount_amount]);
  // console.log(formValues?.discount_amount,"dss")

  const calculateDis = value => {
    setDiscountAmount(value);
    let amount = planCost - planCost * (value / 100);
    setTotalPlanCost(amount + planSgst + planCgst);
  };

  useEffect(() => {
    console.log('serviceId', serviceId);
    if (serviceId) {
      calculateAmount();
    }
  }, [discountamount, poolData, serviceId, ipData]);

  const calculateAmount = async () => {
    setLoading({text: 'Loading...', visible: true});
    var data = {
      service_plan: serviceId,
      discount: Number(discountamount),
      ippool: poolData ? poolData : null,
      static_ip: ipData ? ipData : null,
    };

    const res = await KycCheckAmount(data);
    console.log(
      '🚀 ~ file: KYC_Add_Update.js:507 ~ calculateAmount ~ res:',
      res,
    );
    if (res.isSuccess) {
      setLoading({text: '', visible: false});
      setCalculateValue(res?.result);
    } else {
      setLoading({text: '', visible: false});
      setError({
        text: 'Something Went Wrong!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something Went Wrong!',
      // });
    }
  };

  // total amount
  const total_amount =
    Number(calculateValue?.amount ? calculateValue?.amount : '0') +
    Number(
      formValues.installationCharge ? formValues.installationCharge : '0',
    ) +
    Number(formValues.securityDeposit ? formValues.securityDeposit : '0');

  const checkBalance = async () => {
    // if (assignedTo && paymentMethod) {

    console.log(paymentMethod);
    if (paymentMethod) {
      if (paymentMethod == 'BNKTF') {
        if (
          formValues.bank_reference_no == null ||
          !formValues.bank_reference_no
        ) {
          setError({
            text: 'Bank Reference Is Required',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Bank Reference Is Required',
          // });
          return;
        }
      }
      setLoading({text: 'Loading...', visible: true});
      if (poolData) {
        var body = {
          plan: plan.id,
          area: area,
          ippool: poolData ? poolData : null,
        };
      } else {
        var body = {
          plan: plan.id,
          area: area,
        };
      }

      try {
        const response = await checkWalletInfo(body);
        console.log('banck transfering kumaran');
        if (response.isSuccess) {
          if (response.result.check) {
            setLoading({text: '', visible: false});
            makeOffPayment();
          } else {
            setLoading({text: '', visible: false});
            setError({
              text: 'You do not have enough balance.',
              visible: true,
            });
            // Toast.show({
            //   type: 'error',
            //   text1: 'You do not have enough balance.',
            // });
          }
        } else {
          const errorresponse = response;
          setLoading({text: '', visible: false});
          setError({
            text: 'Something went wrong! Please try again later.',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Something went wrong! Please try again later.',
          // });
        }
      } catch (err) {
        const errorresponse = err.toString();
        setLoading({text: '', visible: false});
        setError({
          text: 'Something went wrong! Please try again later.',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Something went wrong! Please try again later.',
        // });
      }
    } else {
      setError({
        text: 'Please fill up all the required fields!',
        visible: true,
      });
      // Toast.show({
      //   type: 'warning',
      //   text1: 'Please fill up all the required fields!',
      // });
    }
  };
  const makeOffPayment = async () => {
    setLoading({text: 'Loading...', visible: true});
    let body = {
      collected_by: props.userInfo?.id,
      payment_method: paymentMethod == 'BNKTF' ? 'BNKTF' : paymentMethod,
      amount: total_amount,
      discount_amount: discountamount,
      gst: {
        cgst: planCgst,
        sgst: planCgst,
      },
      installation_charges: formValues.installationCharge,
      plan_cost: planCost,
      security_deposit: formValues.securityDeposit,
      check_reference_no: formValues.check_reference_no
        ? formValues.check_reference_no
        : null,
      upi_reference_no: formValues.upi_reference_no
        ? formValues.upi_reference_no
        : null,
      transaction_no: formValues.transaction_no
        ? formValues.transaction_no
        : null,
      bank_reference_no: formValues.bank_reference_no
        ? formValues.bank_reference_no
        : null,
    };

    console.log(body, 'body');
    try {
      console.log('test', body);
      const response = await makeOfflinePayment(body);
      console.log(response);
      if (response.isSuccess) {
        setLoading({text: '', visible: false});
        Toast.show({
          type: 'success',
          text1: 'Payment Successful!',
        });
        postCustomer(response.result.payment_id);
      } else {
        const errorresponse = response;
        setLoading({text: '', visible: false});
        setError({
          text: 'Payment not Successful! Please try later.',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Payment not Successful! Please try later.',
        // });
      }
    } catch (err) {
      console.log(err, 'error');
      const errorresponse = err.toString();
      setLoading({text: '', visible: false});
      setError({
        text: 'Payment not Successful! Please try later.',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Payment not Successful! Please try later.',
      // });
    }
  };
  const nextNav = () => {
    var page = pageNo;
    if (page == 1) {
      const worFormat = /^[a-zA-Z ]+$/;

      if (!isProfilePicUri.length) {
        setError({
          text: 'Profile Picture is required!',
          visible: true,
        });
      } else if (!formValues.first_name || formValues.first_name === '') {
        setError({
          text: 'First Name is required!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'First Name is required!',
        // });
        return;
      } else if (/^[a-zA-Z ]+$/.test(formValues.first_name) === false) {
        setError({
          text: 'Only alphabets are allowed in First Name!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Only alphabets are allowed in First Name!',
        // });
        return;
      } else if (formValues.first_name?.length <= 2) {
        console.log('length', formValues.first_name?.length);
        setError({
          text: 'First Name length cannot be less than 3 Characters!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'First Name length cannot be less than 3 Characters!',
        // });
        return;
      } else if (/^[a-zA-Z ]+$/.test(formValues.last_name) === false) {
        setError({
          text: 'Only alphabets are allowed in Last Name!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Only alphabets are allowed in Last Name!',
        // });
        return;
      } else if (!formValues.mobile_no || formValues.mobile_no === '') {
        setError({
          text: 'Mobile No is required!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Mobile No is required!',
        // });
      } else if (formValues.mobile_no?.length < 10) {
        setError({
          text: 'Mobile No length cannot be less than 10 digits!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Mobile No length cannot be less than 10 digits!',
        // });
        return;
      } else if (formValues.email === '' || !formValues.email) {
        setError({
          text: 'Email is required!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Email is required!',
        // });
        return;
      } else if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(formValues.email) ===
        false
      ) {
        // Toast.show({
        //   type: 'error',
        //   text1: 'Please enter valid Email ID!',
        // });
        setError({
          text: 'Please enter valid Email ID!',
          visible: true,
        });
        return;
      } else if (formValues.pincode === '' || !formValues.pincode) {
        setError({
          text: 'Pincode is required!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Pincode is required!',
        // });
        return;
      } else if (formValues.pincode?.length < 6) {
        setError({
          text: 'Pincode length cannot be less than 6 digits!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Pincode length cannot be less than 6 digits!',
        // });
        return;
      } else if (formValues.street === '' || !formValues.street) {
        // Toast.show({
        //   type: 'error',
        //   text1: 'Street is Required',
        // });
        setError({
          text: 'Street is Required',
          visible: true,
        });
        return;
      } else if (formValues.landmark === '' || !formValues.landmark) {
        // Toast.show({
        //   type: 'error',
        //   text1: 'Landmark is Required',
        // });
        setError({
          text: 'Landmark is Required',
          visible: true,
        });
        return;
      } else if (/^[a-zA-Z0-9 ]+$/.test(formValues.landmark) === false) {
        setError({
          text: 'Landmark only allowed alphanumeric number',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Landmark only allowed alphanumeric number',
        // });
        return;
      } else if (formValues.state === '' || !formValues.state) {
        setError({
          text: 'State is Required',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'State is Required',
        // });
        return;
      } else if (/^[a-zA-Z0-9 ]+$/.test(formValues.state) === false) {
        setError({
          text: 'State only allowed alphanumeric number',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'State only allowed alphanumeric number',
        // });
        return;
      } else if (formValues.district === '' || !formValues.district) {
        setError({
          text: 'District is Required',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'District is Required',
        // });
        return;
      } else if (/^[a-zA-Z0-9 ]+$/.test(formValues.state) === false) {
        setError({
          text: 'District only allowed alphanumeric number',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'District only allowed alphanumeric number',
        // });
        return;
      } else if (formValues.country === '' || !formValues.country) {
        // Toast.show({
        //   type: 'error',
        //   text1: 'Country is Required',
        // });
        setError({
          text: 'Country is Required',
          visible: true,
        });
        return;
      } else if (/^[a-zA-Z0-9 ]+$/.test(formValues.country) === false) {
        setError({
          text: 'Country only allowed alphanumeric number',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Country only allowed alphanumeric number',
        // });
        return;
      } else {
        if (permanentAddreessChecked) {
          if (
            isProfilePicUri &&
            formValues.first_name &&
            formValues.last_name &&
            formValues.mobile_no &&
            formValues.email &&
            branch &&
            formValues.pincode &&
            //formValues.hNo &&
            formValues.street &&
            formValues.city &&
            formValues.state &&
            formValues.district &&
            formValues.country &&
            formValues.landmark
          ) {
            var pageno = pageNo + 1;
            setPageNo(pageno);
            setNextText('Next');
          } else {
            setError({
              text: 'Please fill up all the required fields before moving to next page!',
              visible: true,
            });
            // Toast.show({
            //   type: 'warning',
            //   text1:
            //     'Please fill up all the required fields before moving to next page!',
            // });
          }
        } else {
          if (
            isProfilePicUri &&
            formValues.first_name &&
            formValues.last_name &&
            formValues.mobile_no &&
            formValues.email &&
            branch &&
            formValues.pincode &&
            //formValues.hNo &&
            formValues.street &&
            formValues.city &&
            formValues.state &&
            formValues.permanentPincode &&
            formValues.permanentHNo &&
            formValues.permanentStreet &&
            formValues.permanentCity &&
            formValues.permanentState &&
            formValues.permanentDistrict &&
            formValues.permanentCountry
          ) {
            var pageno = pageNo + 1;
            setPageNo(pageno);
            setNextText('Next');
          } else {
            setError({
              text: 'Please fill up all the required fields before moving to next page!',
              visible: true,
            });
            // Toast.show({
            //   type: 'warning',
            //   text1:
            //     'Please fill up all the required fields before moving to next page!',
            // });
          }
        }
      }
    } else if (page == 2) {
      if (
        area &&
        plan.id &&
        upSpeed &&
        downSpeed &&
        dataLimit &&
        planCost &&
        totalPlanCost &&
        formValues.installationCharge &&
        formValues.securityDeposit
      ) {
        if (discountamount && discountamount > 100) {
          setError({
            text: 'Discount should not be more than 100% !',
            visible: true,
          });
          return;
        }
        var pageno = pageNo + 1;
        setPageNo(pageno);
        setNextText('Next');
      } else {
        setError({
          text: 'Please fill up all the required fields before moving to next page!',
          visible: true,
        });
        // Toast.show({
        //   type: 'warning',
        //   text1:
        //     'Please fill up all the required fields before moving to next page!',
        // });
      }
    } else if (page == 3) {
      if (card == 'adharCard') {
        if (formValues.aadhar_no == null || !formValues.aadhar_no) {
          setError({
            text: 'Aadhar Card No is Required!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Aadhar Card No is Required!',
          // });
          return;
        }
        if (formValues.aadhar_no?.length < 12) {
          setError({
            text: 'Aadhar Card No. Not less than 12 digit',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Aadhar Card No. Not less than 12 digit',
          // });
          return;
        }
      } else if (card == 'panCard') {
        if (formValues.pan_no == null || !formValues.pan_no) {
          setError({
            text: 'Pan Card No is Required!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Pan Card No is Required!',
          // });
          return;
        } else if (/^[a-zA-Z0-9]+$/.test(formValues.pan_no) === false) {
          setError({
            text: 'Pan is allowed alphanumeric number',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Pan is allowed alphanumeric number',
          // });
          return;
        }
      }

      if (
        isSignatureProofUri &&
        isAddressProofUri &&
        isIDProofUri
        // formValues.aadhar_no
      ) {
        var pageno = pageNo + 1;
        setPageNo(pageno);
        if (pageno == 4) {
          setNextText('Pay');
        } else {
          setNextText('Next');
        }
      } else {
        setError({
          text: 'Please fill up all the required fields before moving to next page!',
          visible: true,
        });
        // Toast.show({
        //   type: 'warning',
        //   text1:
        //     'Please fill up all the required fields before moving to next page!',
        // });
      }
    } else if (page == 4) {
      setNextText('Pay');
      if (checked == 'offline') {
        console.log('bank transfer on');
        checkBalance();
      } else {
        getPaymentMethodList();
      }
    }
  };

  const previousNav = () => {
    if (pageNo == 1) {
      setNextText('Next');
      navigation.goBack();
    } else {
      var pageno = pageNo - 1;
      setPageNo(pageno);
      setNextText('Next');
    }
  };

  const signProofclicked = () => {
    setCamerClick('signProof');
    signTermsRBSheet.current.open();
  };

  const funcToSetBillDate = () => {
    var today = new Date();
    today =
      today.getFullYear() +
      '-' +
      String(today.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(today.getDate()).padStart(2, '0');
    setBillDate(today);
    setDueDate(today);
  };
  const funcToSetDueDate = (timeUnit, unitType, offerTime) => {
    var today = new Date();
    today =
      today.getFullYear() +
      '-' +
      String(today.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(today.getDate()).padStart(2, '0');
    var bill_date = new Date(today);
    if (unitType == 'day') {
      var due_date = new Date(
        bill_date.setDate(bill_date.getDate() + timeUnit + offerTime),
      );
      setDueDate(format(due_date, 'yyyy-MM-dd'));
    } else if (unitType == 'mon') {
      var due_date = new Date(
        bill_date.setMonth(bill_date.getMonth() + timeUnit + offerTime),
      );
      setDueDate(format(due_date, 'yyyy-MM-dd'));
    }
  };

  const addressProofclicked = () => {
    setCamerClick('addressProof');
    profilePicRBSheet.current.open();
  };

  const idProofclicked = () => {
    setCamerClick('idProof');
    profilePicRBSheet.current.open();
  };

  const onCameraClicked = async () => {
    await Camera.openCameraPanel(
      isCameraClick,
      imageResponse => {
        profilePicRBSheet.current.close();
        if (imageResponse.picStatus == 'signProof') {
          setSignatureProofUri(
            'data:image/png;base64,' + imageResponse.imageData.data,
          );
        } else if (imageResponse.picStatus == 'addressProof') {
          setAddressProofUri(
            'data:image/png;base64,' + imageResponse.imageData.data,
          );
        } else if (imageResponse.picStatus == 'profilePic') {
          setProfilePicUri(
            'data:image/png;base64,' + imageResponse.imageData.data,
          );
        } else if (imageResponse.picStatus == 'idProof') {
          setIDProofUri(
            'data:image/png;base64,' + imageResponse.imageData.data,
          );
        } else if (imageResponse.picStatus == 'receipt') {
          setReceipt('data:image/png;base64,' + imageResponse.imageData.data);
        }
      },
      error => {
        const errorresponse = error.ToString();
      },
    );
  };

  const onGalleryClicked = async () => {
    await Camera.openGallery(
      isCameraClick,
      imageResponse => {
        profilePicRBSheet.current.close();
        if (imageResponse.picStatus == 'signProof') {
          setSignatureProofUri(
            'data:image/png;base64,' + imageResponse.imageData.data,
          );
        } else if (imageResponse.picStatus == 'addressProof') {
          setAddressProofUri(
            'data:image/png;base64,' + imageResponse.imageData.data,
          );
        } else if (imageResponse.picStatus == 'profilePic') {
          setProfilePicUri(
            'data:image/png;base64,' + imageResponse.imageData.data,
          );
        } else if (imageResponse.picStatus == 'idProof') {
          setIDProofUri(
            'data:image/png;base64,' + imageResponse.imageData.data,
          );
        } else if (imageResponse.picStatus == 'receipt') {
          setReceipt('data:image/png;base64,' + imageResponse.imageData.data);
        }
      },
      error => {
        const errorresponse = error.ToString();
      },
    );
  };

  const makePaymentRequest = async () => {
    paymentMethodRBSheet.current.close();
    setLoading({text: 'Loading...', visible: true});
    try {
      var body = {
        customer: {
          name: formValues.first_name + ' ' + formValues.last_name,
          email: formValues.email,
          contact: '+91' + formValues.mobile_no,
        },
        gst: {
          cgst: planCgst,
          sgst: planSgst,
        },
        amount: total_amount,
        plan_cost: planCost,
        gateway_id: paymentMethodChecked?.payment_gateway?.id,
        discount_amount: discountamount,
        // gst_exclude_charges: {
        //   installation: formValues.installationCharge,
        //   security: formValues.securityDeposit,
        // },
        installation_charges: formValues.installationCharge,
        security_deposit: formValues.securityDeposit,
        source: 'IP',
        static_ip_total_cost: ipData
          ? calculateValue.radius_info?.static_ip_total_cost
          : null,
        payload: {
          product: {
            id: plan.id.toString(),
            name: plan.name,
          },
          customer: {
            name: formValues.first_name + ' ' + formValues.last_name,
            email: formValues.email,
            contact: formValues.mobile_no,
          },
        },
      };
      console.log('body', body);
      const response = await makePayment(body);
      console.log('response', response);
      if (response.isSuccess) {
        setMakePaymentResponse(response.result);
        setLoading({text: '', visible: false});
        navigation.navigate('PaymentGateWayWebView', {
          url: response.result.next,
        });
        openWSConnection(response.result.payment_id);
      } else {
        const errorresponse = response.message;
        console.log('error', errorresponse);
        setLoading({text: '', visible: false});
        setError({
          text: 'Payment Error! Please try again later!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Payment Error! Please try again later.',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setLoading({text: '', visible: false});
      setError({
        text: 'Payment Error! Please try again later!',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Payment Error! Please try again later.',
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
      setError({
        text: 'Location details already fetched!',
        visible: true,
      });
      // Toast.show({
      //   type: 'warning',
      //   text1: 'Location details already fetched!',
      // });
    } else {
      setLoading({text: 'Fetching location...', visible: true});
      await locationServices.getGeoLocation(
        response => {
          if (response.responseCode) {
            let result = response.results[0];
            setFormValues({
              first_name: formValues.first_name,
              last_name: formValues.last_name,
              mobile_no: formValues.mobile_no,
              email: formValues.email,
              hNo: result.houseNumber,
              street: result.street,
              landmark: result.locality,
              city: result.city,
              state: result.state,
              district: result.district,
              country: result.area,
              pincode: result.pincode,
            });
            setLocationFetched(true);
            setLoading({text: '', visible: false});
          }
        },
        error => {
          setLocationFetched(false);
          setLoading({text: '', visible: false});
          setError({
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
  const openWSConnection = payment_id => {
    var client = new W3CWebSocket(
      `${apiConfig.REACT_APP_API_URL_BILLING}/ws/${payment_id}/listen/payment/status`,
    );
    client.onopen = () => {};
    client.onmessage = message => {
      const dataFromServer = JSON.parse(message.data);
      console.log(
        '🚀 ~ file: KYC_Add_Update.js:864 ~ openWSConnection ~ dataFromServer',
        dataFromServer,
      );
      if (dataFromServer.status === 1) {
        setTimeout(() => {
          navigation.navigate('KYC_List');
        }, 5000);
        postCustomer(payment_id);
      } else if (dataFromServer.status === 2) {
        setTimeout(() => {
          navigation.navigate('KYC_Add_Update');
        }, 5000);
      } else {
        setTimeout(() => {
          navigation.navigate('KYC_Add_Update');
        }, 5000);
      }
    };
    client.onclose = () => {};
  };

  const postCustomer = async payment_id => {
    setLoading({text: 'Creating Customer...', visible: true});
    try {
      var body = {
        customer: {
          address: {
            house_no: formValues.hNo === '' ? 'N/A' : formValues.hNo,
            street: formValues.street,
            landmark: formValues.landmark,
            city: formValues.city,
            district: formValues.district,
            state: formValues.state,
            country: formValues.country,
            pincode: formValues.pincode,
          },
          permanent_address: permanentAddreessChecked
            ? {
                house_no: formValues.hNo === '' ? 'N/A' : formValues.hNo,
                street: formValues.street,
                landmark: formValues.landmark,
                city: formValues.city,
                district: formValues.district,
                state: formValues.state,
                country: formValues.country,
                pincode: formValues.pincode,
              }
            : {
                house_no:
                  formValues.permanentHNo === ''
                    ? 'N/A'
                    : formValues.permanentHNo,
                street: formValues.permanentStreet,
                landmark: formValues.permanentLandmark,
                city: formValues.permanentCity,
                district: formValues.permanentDistrict,
                state: formValues.permanentState,
                country: formValues.permanentCountry,
                pincode: formValues.permanentPincode,
              },
          customer_documents: {
            CAF_form: 'CMP',
            customer_pic: isProfilePicUri,
            identity_proof: isIDProofUri,
            Aadhar_Card_No: formValues.aadhar_no ? formValues.aadhar_no : null,
            pan_card: formValues.pan_no ? formValues.pan_no : null,
            signature: isSignatureProofUri,
            address_proof: isAddressProofUri,
          },
          first_name: formValues.first_name,
          register_mobile: formValues.mobile_no,
          last_name: formValues.last_name,
          registered_email: formValues.email,
          alternate_mobile: null,
          branch: branch,
          area: area.toString(),
          otp_verification: false,
          account_status: 'INS',
          user_type: 'IND',
          account_type: 'REG',
          expiry_date: dueDate,
          last_invoice_id: '---',
          device_id: '---',
          service_plan: plan.id.toString(),
          security_deposit: formValues.securityDeposit,
          installation_charges: formValues.installationCharge,
          service_type: 'INTERNET',
          radius_info: {
            authentication_protocol: '15615451',
            ip_mode: '151515',
            ip_address: 'vinayaka nagar colony',
            mac_bind: formValues.mac_bind ? formValues.mac_bind : null,
            nasport_bind: '56132198465',
            option_82: '51191565466',
            static_ip_total_cost: ipData
              ? Number(calculateValue?.radius_info?.static_ip_total_cost)
              : null,
            static_ip_bind: ipData ? ipData : null,
            ippool: poolData ? poolData : null,
            static_ip_cost: ipData
              ? Number(calculateValue?.radius_info?.static_ip_cost)
              : null,
            static_ip_sgst: ipData ? 9 : null,
            static_ip_cgst: ipData ? 9 : null,
          },
          user_advance_info: {
            installation_charges: formValues.installationCharge,
            security_deposit: formValues.securityDeposit,
            service_type: 'Plan',
            billing_mode: 'bm1',
            CAF_number: '45851515',
            GSTIN: formValues.GSTIN ? formValues.GSTIN : null,
            registered_date: billDate,
          },
        },
        service: {
          service_plan: plan.id.toString(),
          upload_speed: upSpeed,
          download_speed: downSpeed,
          data_limit: dataLimit.toString(),
          plan_cost: planCost,
          plan_CGST: planCgst,
          plan_SGST: planSgst,
        },
        email_flag: true,
        sms_flag: true,
        whatsapp_flag: true,
        payment_id: payment_id,
        billing_date: billDate,
        discount_amount: discountamount,
        amount: total_amount.toString(),
        network_info: null,
        installation_charges: formValues.installationCharge,
        security_deposit: formValues.securityDeposit,
        duedate: dueDate,
      };
      console.log(body, 'body create');
      const response = await createCustomer(body);
      console.log(
        '🚀 ~ file: KYC_Add_Update.js:1255 ~ postCustomer ~ response:',
        response,
      );
      if (response.isSuccess) {
        const responseMsg = response.message;
        setLoading({text: '', visible: false});
        Toast.show({
          type: 'success',
          text1: 'Customer Created Successfully!!',
        });
        navigation.navigate('KYC_List');
      } else {
        const errorresponse = response.message;
        console.log('errorresponse', response?.message?.response?.data?.detail);
        setLoading({text: '', visible: false});
        setError({
          text: errorresponse?.response?.data?.detail,
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: errorresponse?.response?.data?.detail,
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setLoading({text: '', visible: false});
      setError({
        text: 'Customer Creation Failed! Please try again later.',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Customer Creation Failed! Please try again later.',
      // });
    }
  };

  // mac address format

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent backgroundColor={Colors.white} />
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <View style={styles.parent}>
          <View style={styles.child1}>
            <TouchableOpacity
              onPress={() => {
                setDecisionVisible({
                  text: 'Are you sure you want to go back? All of your changes will be discarded',
                  visible: true,
                });
              }}>
              <Ionicons
                name={'md-arrow-back-sharp'}
                size={33}
                color={Colors.orange_295CBF}
                style={{padding: 10}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.child}>
            <Text
              style={{
                color: Colors.orange_295CBF,
                fontSize: 16,
                fontFamily: 'Titillium-Semibold',
              }}>
              {strings('KYC_Form.Customer_KYC')}
            </Text>
          </View>
        </View>

        <View style={{flex: 1, backgroundColor: Colors.white, marginTop: -30}}>
          <ScrollView>
            {pageNo == 1 ? (
              <View>
                <View>
                  <View style={styles.title1}>
                    <View>
                      <Ionicons
                        name={'person'}
                        size={25}
                        color={Colors.black}
                        style={{padding: 10}}
                      />
                    </View>
                    <View style={styles.title1_child1}>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 16,
                          fontFamily: 'Titillium-Semibold',
                          marginTop: 12,
                        }}>
                        {strings('KYC_Form.PersonalDetails')}
                      </Text>
                    </View>
                    <View style={styles.title1_child2}>
                      <Image
                        source={require('../../../../assets/images/count1.png')}></Image>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 14,
                          fontFamily: 'Titillium-Semibold',
                        }}>
                        {'1/4'}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      color: Colors.orange_295CBF,
                      fontSize: 15,
                      fontFamily: 'Titillium-Semibold',
                      padding: 10,
                    }}>
                    Upload Profile Picture *
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      backgroundColor: Colors.white,
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 200,
                        width: '50%',
                        margin: 10,
                        borderStyle: 'dashed',
                        borderRadius: 2,
                        borderWidth: 3,
                        borderColor: Colors.grey_D0D0D0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      {isProfilePicUri.length <= 0 && (
                        <View style={{alignItems: 'center'}}>
                          <Image
                            source={require('../../../../assets/images/docicon1.png')}></Image>
                          <Text
                            style={{
                              color: Colors.grey_D0D0D0,
                              fontSize: 14,
                              fontFamily: 'Titillium-Semibold',
                              padding: 10,
                            }}>
                            Upload Profile Picture *
                          </Text>
                        </View>
                      )}

                      {isProfilePicUri.length > 0 && (
                        <Image
                          source={{uri: isProfilePicUri}}
                          style={{width: 200, height: 200, borderRadius: 5}}
                        />
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={profilePicclicked}
                      style={{
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '40%',
                        backgroundColor: '#FFCAAD',
                        padding: 5,
                        borderRadius: 5,
                        height: 40,
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 16,
                          fontFamily: 'Titillium-Semibold',
                        }}>
                        Upload
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      color: Colors.orange_295CBF,
                      fontSize: 15,
                      fontFamily: 'Titillium-Semibold',
                      padding: 10,
                    }}>
                    {strings('KYC_Form.PersonalInfo')}
                  </Text>

                  <View style={{backgroundColor: Colors.white}}>
                    <FormFieldInput
                      title={'First Name *'}
                      formKey={'first_name'}
                      isMandatory={true}
                      showInputField
                      isEnabled={true}
                      length={50}
                      value={formValues.first_name}
                      handleFormValueChange={handleFormValueChange}
                    />
                    <FormFieldInput
                      title={'Last Name *'}
                      formKey={'last_name'}
                      isMandatory={true}
                      showInputField
                      isEnabled={true}
                      length={50}
                      value={formValues.last_name}
                      handleFormValueChange={handleFormValueChange}
                    />
                    <FormFieldInput
                      title={strings('KYC_Form.Mobile_no') + ' *'}
                      formKey={'mobile_no'}
                      isMandatory={true}
                      showInputField
                      isEnabled={true}
                      length={10}
                      keyboardType="number-pad"
                      value={formValues.mobile_no}
                      handleFormValueChange={handleFormValueChange}
                    />

                    <FormFieldInput
                      title={strings('KYC_Form.Email') + ' *'}
                      formKey={'email'}
                      isMandatory={true}
                      showInputFieldEmail
                      isEnabled={true}
                      length={50}
                      value={formValues.email}
                      handleFormValueChange={handleFormValueChange}
                    />
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                      <View
                        style={{
                          flex: 0.97,
                          flexDirection: 'column',
                          marginLeft: 15,
                        }}>
                        <Dropdown
                          style={[styles.dropdown]}
                          containerStyle={{marginTop: -22}}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          data={areaData}
                          maxHeight={200}
                          labelField="name"
                          valueField="id"
                          placeholder="Select Area *"
                          value={area}
                          onFocus={() => {
                            setIsFocus(true);
                            getAreaList();
                            getBranchList();
                          }}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setAreas(item.id);
                            getZoneBranch(item.id);
                            setIsFocus(false);
                            setArea(item.id);
                            getPlanList(item.id);
                            // getingIPPoolList(item.id);
                          }}
                        />
                      </View>
                    </View>
                    <FormFieldInput
                      title={'Zone'}
                      formKey={'email'}
                      isMandatory={false}
                      showInputFieldAdd
                      isEnabled={false}
                      // length={10}
                      value={zone ? zone : ''}
                      handleFormValueChange={handleFormValueChange}
                    />
                    <FormFieldInput
                      title={'Branch'}
                      formKey={'email'}
                      isMandatory={false}
                      showInputFieldAdd
                      isEnabled={false}
                      // length={10}
                      value={branch ? branch : ''}
                      handleFormValueChange={handleFormValueChange}
                    />
                    {/* <View style={{flexDirection: 'row', marginTop: 5}}>
                      <View
                        style={{
                          flex: 0.97,
                          flexDirection: 'column',
                          marginLeft: 15,
                        }}>
                        <Dropdown
                          style={[styles.dropdown]}
                          containerStyle={{marginTop: -22}}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          data={isBranchData}
                          maxHeight={200}
                          labelField="name"
                          valueField="name"
                          placeholder="Branch"
                          value={branch}
                          onFocus={() => {
                            setIsFocus(true);
                            getBranchList();
                          }}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setBranch(item.name);
                            setIsFocus(false);
                          }}
                          disable
                        />
                      </View>
                    </View> */}

                    <Text
                      style={{
                        color: Colors.orange_295CBF,
                        fontSize: 15,
                        fontFamily: 'Titillium-Semibold',
                        padding: 10,
                        height: 40,
                      }}>
                      {strings('KYC_Form.CurrentAddress')}
                    </Text>

                    <View style={{backgroundColor: Colors.white}}>
                      <FormFieldInput
                        title={strings('KYC_Form.Pincode') + ' *'}
                        formKey={'pincode'}
                        isMandatory={true}
                        showInputField
                        isEnabled={true}
                        length={6}
                        keyboardType={'numeric'}
                        value={formValues.pincode}
                        handleFormValueChange={handleFormValueChange}
                      />

                      <FormFieldInput
                        title={strings('KYC_Form.HNo')}
                        formKey={'hNo'}
                        isMandatory={false}
                        showInputField
                        isEnabled={true}
                        length={50}
                        value={formValues.hNo}
                        handleFormValueChange={handleFormValueChange}
                      />

                      <FormFieldInput
                        title={strings('KYC_Form.Street') + ' *'}
                        formKey={'street'}
                        isMandatory={true}
                        showInputField
                        isEnabled={true}
                        length={50}
                        value={formValues.street}
                        handleFormValueChange={handleFormValueChange}
                      />

                      <FormFieldInput
                        title={strings('KYC_Form.Landmark') + '*'}
                        formKey={'landmark'}
                        isMandatory={false}
                        showInputField
                        isEnabled={true}
                        length={50}
                        value={formValues.landmark}
                        handleFormValueChange={handleFormValueChange}
                      />

                      <View style={{flex: 2, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <FormFieldInput
                            title={strings('KYC_Form.City_Town') + ' *'}
                            formKey={'city'}
                            isMandatory={true}
                            showInputField
                            isEnabled={true}
                            length={50}
                            value={formValues.city}
                            handleFormValueChange={handleFormValueChange}
                          />
                        </View>
                        <View style={{flex: 1}}>
                          <FormFieldInput
                            title={strings('KYC_Form.State') + ' *'}
                            formKey={'state'}
                            isMandatory={true}
                            showInputField
                            isEnabled={true}
                            length={50}
                            value={formValues.state}
                            handleFormValueChange={handleFormValueChange}
                          />
                        </View>
                      </View>

                      <View style={{flex: 2, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <FormFieldInput
                            title={'District *'}
                            formKey={'district'}
                            isMandatory={true}
                            showInputField
                            isEnabled={true}
                            length={70}
                            value={formValues.district}
                            handleFormValueChange={handleFormValueChange}
                          />
                        </View>
                        <View style={{flex: 1}}>
                          <FormFieldInput
                            title={'Country *'}
                            formKey={'country'}
                            isMandatory={true}
                            showInputField
                            isEnabled={true}
                            length={50}
                            value={formValues.country}
                            handleFormValueChange={handleFormValueChange}
                          />
                        </View>
                      </View>
                    </View>

                    <Text
                      style={{
                        color: Colors.orange_295CBF,
                        fontSize: 15,
                        fontFamily: 'Titillium-Semibold',
                        padding: 10,
                        height: 40,
                      }}>
                      {strings('KYC_Form.PermanentAddress')}
                    </Text>

                    <View style={{backgroundColor: Colors.white}}>
                      <View style={{flexDirection: 'row'}}>
                        <Checkbox
                          color={Colors.black}
                          status={
                            permanentAddreessChecked ? 'checked' : 'unchecked'
                          }
                          onPress={() => {
                            setpermanentAddreessChecked(
                              !permanentAddreessChecked,
                            );
                          }}
                        />
                        <Text
                          style={{
                            color: Colors.black,
                            fontSize: 15,
                            fontFamily: 'Titillium-Semibold',
                            marginTop: 7,
                          }}>
                          {strings('KYC_Form.SameBillingAddress')}
                        </Text>
                      </View>

                      <FormFieldInput
                        title={strings('KYC_Form.Pincode') + ' *'}
                        formKey={
                          permanentAddreessChecked
                            ? 'pincode'
                            : 'permanentPincode'
                        }
                        isMandatory={true}
                        showInputField
                        isEnabled={true}
                        length={6}
                        keyboardType={'numeric'}
                        value={
                          permanentAddreessChecked
                            ? formValues.pincode
                            : formValues.permanentPincode
                        }
                        handleFormValueChange={handleFormValueChange}
                      />
                      <FormFieldInput
                        title={strings('KYC_Form.HNo')}
                        formKey={
                          permanentAddreessChecked ? 'hNo' : 'permanentHNo'
                        }
                        isMandatory={false}
                        showInputField
                        isEnabled={true}
                        length={50}
                        value={
                          permanentAddreessChecked
                            ? formValues.hNo
                            : formValues.permanentHNo
                        }
                        handleFormValueChange={handleFormValueChange}
                      />
                      <FormFieldInput
                        title={strings('KYC_Form.Street') + ' *'}
                        formKey={
                          permanentAddreessChecked
                            ? 'street'
                            : 'permanentStreet'
                        }
                        isMandatory={true}
                        showInputField
                        isEnabled={true}
                        length={50}
                        value={
                          permanentAddreessChecked
                            ? formValues.street
                            : formValues.permanentStreet
                        }
                        handleFormValueChange={handleFormValueChange}
                      />
                      <FormFieldInput
                        title={strings('KYC_Form.Landmark') + '*'}
                        // title={strings('KYC_Form.Landmark')}
                        formKey={
                          permanentAddreessChecked
                            ? 'landmark'
                            : 'permanentLandmark'
                        }
                        isMandatory={false}
                        showInputField
                        isEnabled={true}
                        length={50}
                        value={
                          permanentAddreessChecked
                            ? formValues.landmark
                            : formValues.permanentLandmark
                        }
                        handleFormValueChange={handleFormValueChange}
                      />

                      <View style={{flex: 2, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <FormFieldInput
                            title={strings('KYC_Form.City_Town') + ' *'}
                            formKey={
                              permanentAddreessChecked
                                ? 'city'
                                : 'permanentCity'
                            }
                            isMandatory={true}
                            showInputField
                            isEnabled={true}
                            length={50}
                            value={
                              permanentAddreessChecked
                                ? formValues.city
                                : formValues.permanentCity
                            }
                            handleFormValueChange={handleFormValueChange}
                          />
                        </View>
                        <View style={{flex: 1}}>
                          <FormFieldInput
                            title={strings('KYC_Form.State') + ' *'}
                            formKey={
                              permanentAddreessChecked
                                ? 'state'
                                : 'permanentState'
                            }
                            isMandatory={true}
                            showInputField
                            isEnabled={true}
                            length={50}
                            value={
                              permanentAddreessChecked
                                ? formValues.state
                                : formValues.permanentState
                            }
                            handleFormValueChange={handleFormValueChange}
                          />
                        </View>
                      </View>
                      <View style={{flex: 2, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <FormFieldInput
                            title={'District *'}
                            formKey={
                              permanentAddreessChecked
                                ? 'district'
                                : 'permanentDistrict'
                            }
                            isMandatory={true}
                            showInputField
                            isEnabled={true}
                            length={50}
                            value={
                              permanentAddreessChecked
                                ? formValues.district
                                : formValues.permanentDistrict
                            }
                            handleFormValueChange={handleFormValueChange}
                          />
                        </View>
                        <View style={{flex: 1}}>
                          <FormFieldInput
                            title={'Country *'}
                            formKey={
                              permanentAddreessChecked
                                ? 'country'
                                : 'permanentCountry'
                            }
                            isMandatory={true}
                            showInputField
                            isEnabled={true}
                            length={50}
                            value={
                              permanentAddreessChecked
                                ? formValues.country
                                : formValues.permanentCountry
                            }
                            handleFormValueChange={handleFormValueChange}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <TouchableOpacity
                          style={{flex: 1, height: 40}}
                          onPress={onLocationEnablePressed}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                flex: 0.9,
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
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {pageNo == 2 ? (
              <View>
                <View style={styles.title1}>
                  <View style={{marginLeft: 10, justifyContent: 'center'}}>
                    <Image
                      source={require('../../../../assets/images/service_icon.png')}></Image>
                  </View>
                  <View style={styles.title1_child1}>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 16,
                        fontFamily: 'Titillium-Semibold',
                        marginTop: 15,
                        marginLeft: 15,
                      }}>
                      {strings('KYC_Form.ServiceDetails')}
                    </Text>
                  </View>
                  <View style={styles.title1_child2}>
                    <Image
                      source={require('../../../../assets/images/count2.png')}></Image>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 14,
                        fontFamily: 'Titillium-Semibold',
                      }}>
                      {'2/4'}
                    </Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        color: Colors.orange_295CBF,
                        fontSize: 15,
                        fontFamily: 'Titillium-Semibold',
                        padding: 10,
                      }}>
                      {strings('KYC_Form.ServicePlan')}
                    </Text>
                  </View>
                  {/* <View
                    style={{flex: 1, alignItems: 'flex-end', paddingRight: 20}}>
                    <Text
                      style={{
                        color: Colors.orange_295CBF,
                        fontSize: 15,
                        fontFamily: 'Titillium-Semibold',
                        padding: 10,
                      }}>
                      {strings('KYC_Form.All_Plans')}
                    </Text>
                  </View> */}
                </View>

                <View style={{backgroundColor: Colors.white}}>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View
                      style={{
                        flex: 0.97,
                        flexDirection: 'column',
                        marginLeft: 15,
                      }}>
                      <Dropdown
                        style={[styles.dropdown]}
                        containerStyle={{marginTop: -22}}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={areaData}
                        maxHeight={200}
                        labelField="name"
                        valueField="id"
                        placeholder="Select Area *"
                        value={area}
                        onFocus={() => {
                          setIsFocus(true);
                          getAreaList();
                        }}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setArea(item.id);
                          setIsFocus(false);
                          getPlanList(item.id);
                          getingIPPoolList(item.id);
                        }}
                      />
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View
                      style={{
                        flex: 0.97,
                        flexDirection: 'column',
                        marginLeft: 15,
                      }}>
                      <Dropdown
                        style={[styles.dropdown]}
                        containerStyle={{marginTop: -22}}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={planData}
                        maxHeight={200}
                        labelField="package_name"
                        valueField="id"
                        placeholder="Select Plan *"
                        value={plan.id}
                        onFocus={() => {
                          setIsFocus(true);
                        }}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setServiceId(item.id);
                          setPlan({id: item.id, name: item.package_name});
                          setUpSpeed(item.upload_speed);
                          setDownSpeed(item.download_speed);
                          setPlanCost(item.plan_cost);
                          setPlanSgst(item.plan_sgst);
                          setPlanCgst(item.plan_cgst);
                          setTotalPlanCost(item.total_plan_cost);
                          setDataLimit(item.fup_limit);
                          funcToSetBillDate();
                          funcToSetDueDate(
                            item.time_unit,
                            item.unit_type,
                            item?.offer_time_unit,
                          );
                          setTimeUnit(item.time_unit);
                          setIsFocus(false);
                        }}
                      />
                    </View>
                  </View>
                  {/* <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View
                      style={{
                        flex: 0.97,
                        flexDirection: 'column',
                        marginLeft: 15,
                      }}>
                      <Dropdown
                        style={[styles.dropdown]}
                        containerStyle={{marginTop: -22}}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        maxHeight={200}
                        labelField="package_name"
                        valueField="id"
                        placeholder="Service Type"
                        onFocus={() => {
                          setIsFocus(true);
                        }}
                        onBlur={() => setIsFocus(false)}
                      />
                    </View>
                  </View> */}
                  <View style={{flex: 2, flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={strings('KYC_Form.UploadSpeed') + ' *'}
                        formKey={'upSpeed'}
                        isMandatory={true}
                        showInputField
                        isEnabled={false}
                        length={50}
                        value={upSpeed.toString()}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={strings('KYC_Form.DownloadSpeed') + ' *'}
                        formKey={'downSpeed'}
                        isMandatory={true}
                        showInputField
                        isEnabled={false}
                        length={50}
                        value={downSpeed.toString()}
                      />
                    </View>
                  </View>

                  <View style={{flex: 2, flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={strings('KYC_Form.DataLimit') + ' *'}
                        formKey={'dataLimit'}
                        isMandatory={true}
                        showInputField
                        isEnabled={false}
                        length={50}
                        value={dataLimit.toString()}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={strings('KYC_Form.PlanCost') + ' *'}
                        formKey={'planCost'}
                        isMandatory={true}
                        showInputField
                        isEnabled={false}
                        length={50}
                        value={planCost.toString()}
                      />
                    </View>
                  </View>

                  <View style={{flex: 2, flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={strings('KYC_Form.PlanSgst')}
                        formKey={'planSgst'}
                        isMandatory={true}
                        showInputField
                        isEnabled={false}
                        length={50}
                        keyboardType={'numeric'}
                        value={planSgst.toString()}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={strings('KYC_Form.PlanCgst')}
                        formKey={'planCgst'}
                        isMandatory={true}
                        showInputField
                        isEnabled={false}
                        length={50}
                        keyboardType={'numeric'}
                        value={planCgst.toString()}
                      />
                    </View>
                  </View>
                  <View style={{margin: 8, marginHorizontal: 15}}>
                    <TextInput
                      mode="outlined"
                      label={'Discount'}
                      value={discountamount?.toString()}
                      placeholderStyle={{fontSize: 20}}
                      underlineColorAndroid="transparent"
                      style={{
                        fontSize: 15,
                        fontFamily: 'Titillium-Semibold',
                        fontWeight: 'normal',
                        backgroundColor: Colors.white,
                        paddingBottom: 0,
                      }}
                      onChangeText={text => {
                        const filteredText = text.replace(/\D/g, ''); // Allow only digits
                        setDiscountAmount(filteredText);
                      }}
                      theme={{
                        colors: {
                          placeholder: 'grey',
                          text: 'black',
                          primary: 'grey',
                          underlineColor: 'transparent',
                          backgroundColor: 'white',
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
                  {/* <FormFieldInput
                    title={'Discount'}
                    formKey={'totalPlanCost'}
                    isMandatory={true}
                    showInputField
                    isEnabled={false}
                    length={20}
                    value={discountamount?.toString()}
                  /> */}
                  <FormFieldInput
                    title={strings('KYC_Form.TotalPlanCost') + ' *'}
                    formKey={'totalPlanCost'}
                    isMandatory={true}
                    showInputField
                    isEnabled={false}
                    length={50}
                    value={totalPlanCost.toString()}
                  />
                  <Text
                    style={{
                      color: Colors.orange_295CBF,
                      fontSize: 15,
                      fontFamily: 'Titillium-Semibold',
                      padding: 10,
                      height: 40,
                    }}>
                    {'GSTIN'}
                  </Text>
                  <View style={{backgroundColor: Colors.white}}>
                    <View style={{flex: 2, flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <FormFieldInput
                          title={'GSTIN'}
                          formKey={'GSTIN'}
                          isMandatory={true}
                          showInputField
                          autoCapitalize="characters"
                          isEnabled={true}
                          length={15}
                          value={formValues.GSTIN}
                          handleFormValueChange={(e, v) =>
                            inputAlphaNumeric(v, value => {
                              handleFormValueChange(e, value);
                            })
                          }
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: Colors.orange_295CBF,
                      fontSize: 15,
                      fontFamily: 'Titillium-Semibold',
                      padding: 10,
                      height: 40,
                    }}>
                    {strings('KYC_Form.Macid')}
                  </Text>

                  <View style={{backgroundColor: Colors.white}}>
                    <View style={{flex: 2, flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        {/* <FormFieldInput
                          isEnabled={true}
                          keyboardType={'numeric'}
                          title={'discount Cost'}
                          formKey={'discount_amount'}
                          isMandatory={true}
                          showInputField
                          value={formValues.discount_amount}
                          handleFormValueChange={handleFormValueChange}
                        /> */}

                        <FormFieldInput
                          isEnabled={true}
                          title={'Mac ID'}
                          formKey={'mac_bind'}
                          isMandatory={true}
                          showInputField
                          value={formValues.mac_bind}
                          handleFormValueChange={(e, v) =>
                            handleFormValueChange(e, macAddressMask(v))
                          }
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: Colors.orange_295CBF,
                      fontSize: 15,
                      fontFamily: 'Titillium-Semibold',
                      padding: 10,
                      height: 40,
                    }}>
                    {strings('KYC_Form.StaticIp')}
                  </Text>
                  <View style={{backgroundColor: Colors.white}}>
                    <View style={{flex: 2, flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          <View
                            style={{
                              flex: 0.97,
                              flexDirection: 'column',
                              marginLeft: 15,
                            }}>
                            <View style={{flexDirection: 'row'}}>
                              {/* <Text
                                style={{
                                  fontFamily: 'Titillium-Semibold',
                                  color: Colors.grey_888888,
                                  fontSize: 14,
                                }}>
                                IP Pool
                              </Text> */}
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
                              placeholder={'IP Pool'}
                              value={poolData}
                              onFocus={() => {
                                setIsFocus(true);
                                // getingIPPoolList();
                              }}
                              onBlur={() => setIsFocus(false)}
                              onChange={item => {
                                setPoolData(item.id);
                                setIsFocus(false);
                              }}
                            />
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          <View
                            style={{
                              flex: 0.97,
                              flexDirection: 'column',
                              marginLeft: 15,
                            }}>
                            <View style={{flexDirection: 'row'}}>
                              {/* <Text
                                style={{
                                  fontFamily: 'Titillium-Semibold',
                                  color: Colors.grey_888888,
                                  fontSize: 14,
                                }}>
                                Static IP
                              </Text> */}
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
                              placeholder={'Static IP'}
                              value={ipData}
                              onFocus={() => {
                                setIsFocus(true);
                                getReaminingIPslist();
                              }}
                              onBlur={() => setIsFocus(false)}
                              onChange={item => {
                                setIPData(item.ip);
                                setIsFocus(false);
                              }}
                            />
                          </View>
                        </View>

                        <FormFieldInput
                          isEnabled={true}
                          keyboardType={'numeric'}
                          title={'Static IP Cost'}
                          formKey={'static_ip_cost'}
                          isMandatory={true}
                          showInputField
                          value={
                            formValues.static_ip_cost
                              ? formValues.static_ip_cost
                              : costIP
                              ? costIP.toString()
                              : '0'
                          }
                          handleFormValueChange={handleFormValueChange}
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: Colors.orange_295CBF,
                      fontSize: 15,
                      fontFamily: 'Titillium-Semibold',
                      padding: 10,
                      height: 40,
                    }}>
                    {strings('KYC_Form.InstallationCharges')}
                  </Text>

                  <View style={{backgroundColor: Colors.white}}>
                    <View style={{flex: 2, flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <FormFieldInput
                          title={strings('KYC_Form.InstallationCharges') + ' *'}
                          formKey={'installationCharge'}
                          isMandatory={true}
                          showInputField
                          isEnabled={true}
                          length={8}
                          value={formValues.installationCharge}
                          keyboardType={'numeric'}
                          handleFormValueChange={handleFormValueChange}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <FormFieldInput
                          title={strings('KYC_Form.SecurityDesposite') + ' *'}
                          formKey={'securityDeposit'}
                          isMandatory={true}
                          showInputField
                          isEnabled={true}
                          length={8}
                          value={formValues.securityDeposit}
                          keyboardType={'numeric'}
                          handleFormValueChange={handleFormValueChange}
                        />
                      </View>
                    </View>
                  </View>

                  <Text
                    style={{
                      color: Colors.orange_295CBF,
                      fontSize: 15,
                      fontFamily: 'Titillium-Semibold',
                      padding: 10,
                      height: 40,
                    }}>
                    Billing Dates
                  </Text>
                  <View style={{backgroundColor: Colors.white}}>
                    <View style={{flex: 2, flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <FormFieldInput
                          title={'Bill Date'}
                          formKey={'billDate'}
                          isMandatory={true}
                          showInputField
                          isEnabled={false}
                          length={50}
                          value={billDate}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <FormFieldInput
                          title={'Due Date'}
                          formKey={'dueDate'}
                          isMandatory={true}
                          showInputField
                          isEnabled={false}
                          length={50}
                          value={dueDate}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
            {pageNo == 3 ? (
              <View style={{flex: 1}}>
                <View style={styles.title1}>
                  <View style={{marginLeft: 10, justifyContent: 'center'}}>
                    <Image
                      source={require('../../../../assets/images/docicon.png')}></Image>
                  </View>
                  <View style={styles.title1_child1}>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 16,
                        fontFamily: 'Titillium-Semibold',
                        marginTop: 15,
                        marginLeft: 15,
                      }}>
                      {strings('KYC_Form.Documents')}
                    </Text>
                  </View>
                  <View style={styles.title1_child2}>
                    <Image
                      source={require('../../../../assets/images/count3.png')}></Image>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 14,
                        fontFamily: 'Titillium-Semibold',
                      }}>
                      {'3/4'}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: Colors.orange_295CBF,
                    fontSize: 15,
                    fontFamily: 'Titillium-Semibold',
                    padding: 10,
                  }}>
                  ID Proof
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <RadioButton
                    value="adharCard"
                    status={card === 'adharCard' ? 'checked' : 'unchecked'}
                    onPress={() => setCard('adharCard')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: Colors.grey_888888,
                      fontSize: 16,
                      marginRight: 10,
                    }}>
                    Aadhar Card
                  </Text>
                  <RadioButton
                    value="panCard"
                    status={card === 'panCard' ? 'checked' : 'unchecked'}
                    onPress={() => setCard('panCard')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: Colors.grey_888888,
                      fontSize: 16,
                    }}>
                    Pan Card
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 250,
                      width: '90%',
                      margin: 10,
                      borderStyle: 'dashed',
                      borderRadius: 2,
                      borderWidth: 3,
                      borderColor: Colors.grey_D0D0D0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    {isIDProofUri.length <= 0 && (
                      <View style={{alignItems: 'center'}}>
                        <Image
                          source={require('../../../../assets/images/docicon1.png')}></Image>
                        <Text
                          style={{
                            color: Colors.grey_D0D0D0,
                            fontSize: 14,
                            fontFamily: 'Titillium-Semibold',
                            padding: 10,
                          }}>
                          Add ID Proof
                        </Text>
                      </View>
                    )}
                    {isIDProofUri.length > 0 && (
                      <Image
                        source={{uri: isIDProofUri}}
                        style={{width: 330, height: 225, borderRadius: 5}}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginHorizontal: 20,
                    }}>
                    <TouchableOpacity
                      onPress={idProofclicked}
                      style={{
                        width: '90%',
                        padding: 5,
                        borderRadius: 5,
                        height: 50,
                      }}>
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
                          borderColor: '#FFCAAD',
                          borderWidth: 1,
                          marginLeft: 10,
                        }}>
                        ID Proof
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {card == 'adharCard' ? (
                  <FormFieldInput
                    title={'Aadhar Card No. *'}
                    formKey={'aadhar_no'}
                    isMandatory={true}
                    showInputField
                    isEnabled={true}
                    length={12}
                    keyboardType={'numeric'}
                    value={formValues.aadhar_no}
                    handleFormValueChange={handleFormValueChange}
                  />
                ) : (
                  <FormFieldInput
                    title={'Pan Card No. *'}
                    formKey={'pan_no'}
                    isMandatory={true}
                    showInputField
                    isEnabled={true}
                    length={10}
                    // keyboardType={'numeric'}
                    value={formValues.pan_no}
                    handleFormValueChange={handleFormValueChange}
                  />
                )}

                <Text
                  style={{
                    color: Colors.orange_295CBF,
                    fontSize: 15,
                    fontFamily: 'Titillium-Semibold',
                    padding: 10,
                  }}>
                  {strings('KYC_Form.AddressProof')}
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 250,
                      width: '90%',
                      margin: 10,
                      borderStyle: 'dashed',
                      borderRadius: 2,
                      borderWidth: 3,
                      borderColor: Colors.grey_D0D0D0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    {isAddressProofUri.length <= 0 && (
                      <View style={{alignItems: 'center'}}>
                        <Image
                          source={require('../../../../assets/images/docicon1.png')}></Image>
                        <Text
                          style={{
                            color: Colors.grey_D0D0D0,
                            fontSize: 14,
                            fontFamily: 'Titillium-Semibold',
                            padding: 10,
                          }}>
                          Add Address Proof
                        </Text>
                      </View>
                    )}

                    {isAddressProofUri.length > 0 && (
                      <Image
                        source={{uri: isAddressProofUri}}
                        style={{width: 330, height: 225, borderRadius: 5}}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginHorizontal: 20,
                    }}>
                    <TouchableOpacity
                      onPress={addressProofclicked}
                      style={{
                        width: '90%',
                        padding: 5,
                        borderRadius: 5,
                        height: 50,
                      }}>
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
                          borderColor: '#FFCAAD',
                          borderWidth: 1,
                          marginLeft: 10,
                        }}>
                        Address Proof
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text
                  style={{
                    color: Colors.orange_295CBF,
                    fontSize: 15,
                    fontFamily: 'Titillium-Semibold',
                    padding: 10,
                  }}>
                  Signature
                </Text>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 250,
                      width: '90%',
                      margin: 10,
                      borderStyle: 'dashed',
                      borderRadius: 2,
                      borderWidth: 3,
                      borderColor: Colors.grey_D0D0D0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    {isSignatureProofUri.length <= 0 && (
                      <View style={{alignItems: 'center'}}>
                        <Image
                          source={require('../../../../assets/images/docicon1.png')}></Image>
                        <Text
                          style={{
                            color: Colors.grey_D0D0D0,
                            fontSize: 14,
                            fontFamily: 'Titillium-Semibold',
                            padding: 10,
                          }}>
                          Add Signature
                        </Text>
                      </View>
                    )}

                    {isSignatureProofUri.length > 0 && (
                      <Image
                        source={{uri: isSignatureProofUri}}
                        style={{width: 300, height: 200, borderRadius: 5}}
                      />
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginHorizontal: 20,
                    }}>
                    <TouchableOpacity
                      onPress={signProofclicked}
                      style={{
                        width: '90%',
                        padding: 5,
                        borderRadius: 5,
                        height: 50,
                      }}>
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
                          borderColor: '#FFCAAD',
                          borderWidth: 1,
                        }}>
                        Signature
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : null}

            {pageNo == 4 ? (
              <View style={{flex: 1}}>
                <View style={styles.title1}>
                  <View style={{marginLeft: 10, justifyContent: 'center'}}>
                    <Image
                      source={require('../../../../assets/images/paymenticon.png')}></Image>
                  </View>
                  <View style={styles.title1_child1}>
                    <Text
                      style={{
                        color: Colors.orange_295CBF,
                        fontSize: 16,
                        fontFamily: 'Titillium-Semibold',
                        marginTop: 15,
                        marginLeft: 15,
                      }}>
                      Online Payment
                    </Text>
                  </View>
                  <View style={styles.title1_child2}>
                    <Image
                      source={require('../../../../assets/images/count4.png')}></Image>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 14,
                        fontFamily: 'Titillium-Semibold',
                      }}>
                      {'4/4'}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 15,
                          marginLeft: 13,
                        }}>
                        Total Payable Amount
                      </Text>
                    </View>
                    <View
                      style={{
                        marginHorizontal: 10,
                        height: 48,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        backgroundColor: '#FAFAFA',
                        borderColor: Colors.grey_C0C0C0,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          flex: 0.9,
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 16,
                        }}>
                        {/* {totalPlanCost + formValues.installationCharg} */}
                        {Number(
                          calculateValue?.amount ? calculateValue?.amount : '0',
                        ) +
                          Number(
                            formValues.installationCharge
                              ? formValues.installationCharge
                              : '0',
                          ) +
                          Number(
                            formValues.securityDeposit
                              ? formValues.securityDeposit
                              : '0',
                          )}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginTop: 25,
                    marginLeft: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <RadioButton
                      value="phone"
                      status={checked === 'phone' ? 'checked' : 'unchecked'}
                      onPress={() => setChecked('phone')}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        marginRight: 10,
                        marginTop: 5,
                      }}>
                      Online
                    </Text>
                  </View>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <RadioButton
                      value="qrCode"
                      status={checked === 'qrCode' ? 'checked' : 'unchecked'}
                      onPress={() => setChecked('qrCode')}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        marginRight: 10,
                        marginTop: 5,
                      }}>
                      Show QR Code
                    </Text>
                  </View> */}
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <RadioButton
                      value="offline"
                      status={checked === 'offline' ? 'checked' : 'unchecked'}
                      onPress={() => setChecked('offline')}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        marginRight: 10,
                        marginTop: 5,
                      }}>
                      Offline
                    </Text>
                  </View>
                </View>

                <View style={{flex: 1}}>
                  {/* <View style={{flexDirection: 'row', marginTop: 10}}>
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
                            Paid To
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
                        <Dropdown
                          style={[styles.dropdown]}
                          containerStyle={{marginTop: -22}}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          data={assignedToData}
                          maxHeight={200}
                          labelField="name"
                          valueField="id"
                          placeholder={''}
                          value={assignedTo}
                          onFocus={() => {
                            setIsFocus(true);
                            getAssignToUsers();
                          }}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setAssignedTo(item.id);
                            setIsFocus(false);
                          }}
                        />
                      </View>
                    </View> */}
                  <FormFieldInput
                    title={'Collected By *'}
                    formKey={'paid_to'}
                    isMandatory={false}
                    showInputField
                    isEnabled={false}
                    length={50}
                    value={props.userInfo?.username}
                  />
                  <FormFieldInput
                    title={'Paid Amount *'}
                    formKey={'paid_amt'}
                    isMandatory={true}
                    showInputField
                    isEnabled={false}
                    length={50}
                    value={
                      Number.isNaN(calculateValue?.discount_amount)
                        ? '0'
                        : parseFloat(calculateValue?.discount_amount).toFixed(2)
                    }
                  />
                  <FormFieldInput
                    title={'Final Amount To Be Paid *'}
                    formKey={'final_amt'}
                    isMandatory={true}
                    showInputField
                    isEnabled={false}
                    length={50}
                    value={Number(total_amount.toFixed(2)).toString()}
                  />
                  <FormFieldInput
                    title={'Start Date'}
                    formKey={'start_date'}
                    isMandatory={true}
                    showInputField
                    isEnabled={false}
                    length={50}
                    value={billDate}
                  />
                  <FormFieldInput
                    title={'Due Date'}
                    formKey={'start_date'}
                    isMandatory={true}
                    showInputField
                    isEnabled={false}
                    length={50}
                    value={dueDate}
                  />
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    {checked == 'offline' && (
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
                            Payment Method
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
                        <Dropdown
                          style={[styles.dropdown]}
                          containerStyle={{marginTop: -22}}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          data={offlinePaymentOptions}
                          maxHeight={200}
                          labelField="name"
                          valueField="id"
                          placeholder={''}
                          value={paymentMethod}
                          onFocus={() => {
                            setIsFocus(true);
                            getOfflinePaymentOptions();
                          }}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setPaymentMethod(item.id);
                            setIsFocus(false);
                          }}
                        />
                      </View>
                    )}
                  </View>
                  {paymentMethod === 'BNKTF' && checked == 'offline' && (
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={'Bank Reference No. *'}
                        formKey={'bank_reference_no'}
                        isMandatory={true}
                        showInputField
                        isEnabled={true}
                        value={formValues.bank_reference_no}
                        handleFormValueChange={handleFormValueChange}
                      />
                    </View>
                  )}
                  {paymentMethod === 'CHEK' && checked == 'offline' && (
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={'Cheque No.'}
                        formKey={'check_reference_no'}
                        isMandatory={false}
                        showInputField
                        isEnabled={true}
                        value={formValues.check_reference_no}
                        handleFormValueChange={handleFormValueChange}
                      />
                    </View>
                  )}
                  {paymentMethod === 'GPAY' && checked == 'offline' && (
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={'UTR No.'}
                        formKey={'upi_reference_no'}
                        isMandatory={false}
                        showInputField
                        isEnabled={true}
                        value={formValues.upi_reference_no}
                        handleFormValueChange={handleFormValueChange}
                      />
                    </View>
                  )}
                  {paymentMethod === 'PHNPE' && checked == 'offline' && (
                    <View style={{flex: 1}}>
                      <FormFieldInput
                        title={'UTR No.'}
                        formKey={'upi_reference_no'}
                        isMandatory={false}
                        showInputField
                        isEnabled={true}
                        value={formValues.upi_reference_no}
                        handleFormValueChange={handleFormValueChange}
                      />
                    </View>
                  )}
                  {paymentMethod === 'NEFT' && checked == 'offline' && (
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
                  )}
                  {checked == 'offline' && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: Colors.white,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          height: 200,
                          width: '50%',
                          margin: 10,
                          borderStyle: 'dashed',
                          borderRadius: 2,
                          borderWidth: 3,
                          borderColor: Colors.grey_D0D0D0,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        {receipt.length <= 0 && (
                          <View style={{alignItems: 'center'}}>
                            <Image
                              source={require('../../../../assets/images/docicon1.png')}></Image>
                          </View>
                        )}

                        {receipt.length > 0 && (
                          <Image
                            source={{uri: receipt}}
                            style={{width: 200, height: 200, borderRadius: 5}}
                          />
                        )}
                      </View>

                      <TouchableOpacity
                        onPress={receiptUpClicked}
                        style={{
                          marginTop: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '40%',
                          backgroundColor: '#FFCAAD',
                          padding: 5,
                          borderRadius: 5,
                          height: 40,
                          padding: 5,
                        }}>
                        <Text
                          style={{
                            color: Colors.black,
                            fontSize: 16,
                            fontFamily: 'Titillium-Semibold',
                          }}>
                          Upload Receipt
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>

        <View
          style={{
            height: 60,
            backgroundColor: Colors.white,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flex: 2}}>
            <TouchableOpacity
              onPress={previousNav}
              style={{flexDirection: 'row'}}>
              <Ionicons
                name={'md-arrow-back-sharp'}
                size={25}
                color={Colors.black}
                style={{padding: 10}}
              />
              <Text
                style={{
                  color: Colors.black,
                  fontSize: 16,
                  fontFamily: 'Titillium-Semibold',
                  marginTop: 12,
                }}>
                {strings('KYC_Form.Back')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={nextNav}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 120,
                backgroundColor: Colors.orange_295CBF,
                padding: 5,
                borderRadius: 5,
                flexDirection: 'row',
                height: 40,
                padding: 5,
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 16,
                  fontFamily: 'Titillium-Semibold',
                  textAlign: 'center',
                }}>
                {nextText}
              </Text>
              <Ionicons
                name={'arrow-forward-sharp'}
                size={25}
                color={Colors.white}
                style={{padding: 3}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <RBSheet
          ref={profilePicRBSheet}
          height={180}
          closeOnDragDown={true}
          closeOnPressMask={false}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <View
            style={{
              padding: 10,
              flexDirection: 'column',
              backgroundColor: Colors.grey_D0D0D0,
            }}>
            <TouchableOpacity
              style={{alignItems: 'flex-end'}}
              onPress={() => profilePicRBSheet.current.close()}>
              <Text style={styles.textStyle_close_attachment}>
                {strings('KYC_Form.Close')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={onCameraClicked}>
              <Image
                source={require('../../../../assets/images/camera_icon.png')}
                style={{width: 30, height: 30}}></Image>
              <Text style={[styles.textStyle_attachment, {marginLeft: 10}]}>
                {strings('KYC_Form.Camera')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}
              onPress={onGalleryClicked}>
              <Image
                source={require('../../../../assets/images/gallery_icon1.png')}
                style={{width: 30, height: 30}}></Image>
              <Text style={[styles.textStyle_attachment, {marginLeft: 10}]}>
                {strings('KYC_Form.Gallery')}
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
        <RBSheet
          ref={signTermsRBSheet}
          height={600}
          closeOnDragDown={true}
          closeOnPressMask={false}
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
          <View style={{flex: 3, marginVertical: 20}}>
            <View
              style={{flex: 2, flexDirection: 'row', paddingHorizontal: 20}}>
              <ScrollView
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}>
                <TouchableOpacity activeOpacity={1}>
                  <Text
                    style={[
                      styles.textStyle,
                      {marginTop: 10},
                      {fontWeight: 'bold'},
                    ]}>
                    By accessing or using the Service you agree to be bound by
                    these Terms. If you disagree with any part of the terms then
                    you may not access the Service.
                  </Text>
                  <Text
                    style={[
                      styles.textStyle,
                      {marginTop: 10},
                      {fontWeight: 'bold'},
                    ]}>
                    1. Changes
                  </Text>
                  <Text style={[styles.normalTextStyle, {marginTop: 5}]}>
                    We reserve the right, at our sole discretion, to modify or
                    replace these Terms at any time. If a revision is material
                    we will try to provide at least 30 (change this)​ day's
                    notice prior to any new terms taking effect. What
                    constitutes a material change will be determined at our sole
                    discretion.
                  </Text>
                  <Text
                    style={[
                      styles.textStyle,
                      {marginTop: 10},
                      {fontWeight: 'bold'},
                    ]}>
                    2.Purchases
                  </Text>
                  <Text style={[styles.normalTextStyle, {marginTop: 5}]}>
                    If you wish to purchase any product or service made
                    available through the Service ("Purchase"), you may be asked
                    to supply certain information relevant to your Purchase
                    including, without limitation
                  </Text>
                  <Text
                    style={[
                      styles.textStyle,
                      {marginTop: 10},
                      {fontWeight: 'bold'},
                    ]}>
                    3.Contact Us
                  </Text>
                  <Text style={[styles.normalTextStyle, {marginTop: 5}]}>
                    If you have any questions about these Terms, please contact
                    us.
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Checkbox
                color={Colors.black}
                status={isChecked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsChecked(!isChecked);
                }}
              />
              <Text
                style={{
                  color: Colors.black,
                  fontSize: 15,
                  fontFamily: 'Titillium-Semibold',
                }}>
                I have read and agree to the Terms and Conditions
              </Text>
            </View>
            <View style={{alignSelf: 'center', marginTop: 15}}>
              <TouchableOpacity
                onPress={() => {
                  if (isChecked) {
                    signTermsRBSheet.current.close();
                    setSignatureDisplay(true);
                  }
                }}
                style={{
                  backgroundColor: Colors.orange_295CBF,
                  borderRadius: 20,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 120}}>
                  <Text style={styles.button_text_style}>Accept</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
        <RBSheet
          ref={paymentMethodRBSheet}
          height={500}
          closeOnDragDown={true}
          closeOnPressMask={false}
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
          <View style={{padding: 10}}>
            <Text
              style={[styles.textStyle, {marginTop: 10}, {fontWeight: 'bold'}]}>
              Select Payment Method
            </Text>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginTop: 15,
                marginLeft: 5,
              }}>
              {paymentMethodListData.map(val => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <RadioButton
                      value={val.payment_gateway.gateway.name}
                      status={
                        Object.keys(paymentMethodChecked).length == 0
                          ? 'unchecked'
                          : paymentMethodChecked.payment_gateway.gateway
                              .name === val.payment_gateway.gateway.name
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => setPaymentMethodChecked(val)}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        marginRight: 10,
                        marginTop: 5,
                      }}>
                      {val.payment_gateway.gateway.name}
                    </Text>
                  </View>
                );
              })}
              <View
                style={{
                  height: 60,
                  backgroundColor: Colors.white,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1.5}}>
                  <TouchableOpacity
                    onPress={() => {
                      paymentMethodRBSheet.current.close();
                    }}
                    style={{
                      backgroundColor: Colors.grey_A9A9A9,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 100,
                      padding: 5,
                      borderRadius: 5,
                      flexDirection: 'row',
                      height: 40,
                      padding: 5,
                    }}>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 16,
                        fontFamily: 'Titillium-Semibold',
                      }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    onPress={makePaymentRequest}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 160,
                      backgroundColor: Colors.orange_295CBF,
                      padding: 5,
                      borderRadius: 5,
                      flexDirection: 'row',
                      height: 40,
                      padding: 5,
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: 14,
                        fontFamily: 'Titillium-Semibold',
                        textAlign: 'center',
                      }}>
                      Proceed To Pay
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RBSheet>
        <DialogView
          showAlertDialog
          visible={isError.visible}
          text={isError.text}
          onConfirm={() => {
            setError({text: '', visible: false});
          }}
          textConfirm={'Okay'}></DialogView>

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
          showSignatureDialog
          visible={isSignatureDisplay}
          onCancel={() => {
            setSignatureDisplay(false);
          }}
          onSignatureCapture={result => {
            setSignatureProofUri('data:image/png;base64,' + result);
            setSignatureDisplay(false);
          }}></DialogView>
        <DialogView
          showLoadingDialog
          visible={isLoading.visible}
          text={isLoading.text}></DialogView>
        <DialogView
          showDecisionDialog
          visible={isDecisionVisible.visible}
          text={isDecisionVisible.text}
          onCancel={() => {
            setDecisionVisible({text: '', visible: false});
          }}
          textCancel={'No'}
          onConfirm={() => {
            navigation.goBack();
            setDecisionVisible({text: '', visible: false});
          }}
          textConfirm={'Yes'}></DialogView>
      </View>
    </SafeAreaView>
  );
};
function mapStateToProps(state, props) {
  return {
    userInfo: state.mainReducers.main.userInfo,
  };
}

export default connect(mapStateToProps)(KYC_Add_Update);
// export default KYC_Add_Update;
