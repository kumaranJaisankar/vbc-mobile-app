import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import {Colors} from '../../../../../../Common/Colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import {TextInput} from 'react-native-paper';
import PlanDetailsPopup from './PlanDetailsPopup';
import {Checkbox, RadioButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import apiConfig from '../../../../../../services/api/config';
import {
  checkWalletInfo,
  getPaymentMethodListData,
  getAssignUsers,
  getPaymentOptions,
  makeOfflineRenew,
  changeOfflinePlanEnc,
  getIpPoolData,
  getReaminingIPs,
  makeOnlineRenew,
  makeOnlineChange,
  getSessionInfo,
  checkRenewalDate,
  renewAmountCalculations,
  changeUpgradeAmountCalculations,
  checkAmount,
  getPaymentGatewayMethods,
} from '../../../../../../services/MainService';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import PaymentMethodOptions from './PaymentMethodOptions';
import styles from '../../../styles';
import {Dropdown} from 'react-native-element-dropdown';
import FormFieldInput from '../../../../../CustomerKYC/FormFields/KYC_FormField1';
import {
  formatCustomDate,
  formatDate,
  formatDateV2,
  formatDateV3,
  fullDateTime,
} from '../../../../../../Common/utility';
import format from 'date-fns/format';
import {strings} from '../../../../../../../strings/i18n';
import Camera from '../../../../../../Common/Camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {formData} from '../../../../../../Common/formData';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
//redux
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import DialogView from '../../../../../../Common/DialogView';
import PaymentGatewayOptions from './PaymentGatewayOptions';

const PlanDetailsBottomSheet = props => {

  // console.log('props data check', props.additionalData);
  // console.log('props.extraProps', props.data.id);
  // console.log('clicked', props.extraProps);

  // console.log('props.customerCurrentPlan', props.customerCurrentPlan);
  const navigation = useNavigation();
  const [staticCost, setStaticCost] = useState('');
  const [chequeno, setChequeno] = useState('');
  const [bankref, setBankRef] = useState('');

  const [urtref, setUrtref] = useState('');
  const [transactionNo, setTansactionNO] = useState('');
  const windowHeight = Dimensions.get('window').height;
  const [checked, setChecked] = useState('online');
  const [tempRenewal, setTempRenewal] = useState(false);
  const [staticIp, setStaticIP] = useState(
    props.customerCurrentPlan?.static_ip_bind ? true : false,
  );
  const [discountCheck, setDiscountCheck] = useState(false);
  const [discountamount, setDiscountAmount] = React.useState(0.0);
  const [totalPlanCost, setTotalPlanCost] = React.useState(0.0);
  const [paymentMethodListData, setPaymentMethodListData] = useState({});
  const paymentMethodRBSheet = useRef();
  const [walletAmtCheck, setWalletAmtCheck] = useState(false);
  const [assignedToData, setAssignedToData] = useState([]);
  const [offlinePaymentOptions, setOfflinePaymentOptions] = useState([]);
  const [assignedTo, setAssignedTo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const profilePicRBSheet = useRef();
  const [isCameraClick, setCamerClick] = React.useState('');
  const [receipt, setReceipt] = useState('');
  const [amount, setAmount] = useState(null);
  const [isLoading, setLoading] = useState({spinner: false, spinnerText: ''});
  const [loaders, setLoaders] = useState(false);

  const [ipPoolList, setIpPoolList] = useState([]);
  const [poolData, setPoolData] = useState('');
  const [ipList, setIpList] = useState([]);
  const [ipData, setIPData] = useState('');
  const [valuess, setValuess] = useState('');

  const [withDiscount, setWithDiscount] = React.useState(0.0);
  const [calculateIp, setCalucateIp] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const [sessionData, setSessionData] = useState({});
  const [isDecisionVisible, setDecisionVisible] = React.useState({
    text: '',
    visible: false,
  });

  const [renewCalculations, setRenewCalculations] = useState([]);

  const [text, setText] = React.useState('');

  const [finalAMount, setFinalAmount] = useState('');

  const [walletAmount, setWalletAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [discountPercentageError, setDiscountPercentageError] = useState(false);
  const [amountAllowed, setAmountAllowed] = useState(true);

  const [customer_paid, setCustomerPaid] = React.useState(0);
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });
  const [isError, setError] = React.useState({
    text: '',
    visible: false,
  });
  console.log('monirssssssssss', discountamount);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [paymentGateways,setPaymentGateways]=useState([])
  const [selectedGatewayObj, setSelectedGatewayObj] = useState([]);
  const handleGatewayClick = (gateway) => {
    console.log("handleGatewayClick",gateway)
    setSelectedGateway(gateway?.id);
    setSelectedGatewayObj(gateway);
  };
  useEffect(() => {
    getPaymentGateWays();
  }, []);
  const getPaymentGateWays = async()=>{
    console.log(props,"props data")
    const response = await getPaymentGatewayMethods(props?.customer?.user?.id);
    console.log(response,"paymentgateways response ----149---")
    if (response?.isSuccess === 200) {
      setPaymentGateways(response?.result);
    } else {
      const responseMsg = response;
      console.log(responseMsg)
    }
    
  //   let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
  //   billingaxios
  //   .get("/payment/cstmr/payment/gateways/" + customerInfo?.user)
  //   .then((res) => {
       
  //       console.log(res?.data,"paymentGateways");
  // setPaymentGateways(res?.data);
        
  //     })
  }

  useEffect(() => {
    setCalucateIp(
      (Number(props.customerCurrentPlan?.radius_info?.static_ip_total_cost) /
        Number(props.customerCurrentPlan?.plan_time_unit)) *
        Number(props?.data?.time_unit),
    );
  }, [
    props.customerCurrentPlan?.radius_info?.static_ip_total_cost,
    props.customerCurrentPlan?.plan_time_unit,
    props.data?.time_unit,
  ]);

  // console.log('calculate', calculateIp);

  // console.log(
  //   'testing amount1',
  //   parseFloat(renewCalculations?.amount) +
  //     (walletAmount ? parseFloat(walletAmount) : 0) -
  //     parseFloat(props?.extraData?.balance),
  // );
  // console.log(
  //   'testing amount2',
  //   parseFloat(renewCalculations?.amount) +
  //     (walletAmount ? parseFloat(walletAmount) : 0),
  // );

  // console.log('PropsAmountCheck', props?.extraData);

  // console.log('testing amount4', parseFloat(walletAmount));
  // console.log('testing amount5', parseFloat(renewCalculations?.amount));

  // console.log(
  //   'static_ip_total_cost',
  //   (Number(props.customerCurrentPlan?.radius_info?.static_ip_total_cost) /
  //     Number(props.customerCurrentPlan?.plan_time_unit)) *
  //     Number(props?.data?.time_unit),
  // );

  // console.log(
  //   'plan_time_unit',
  //   props.customerCurrentPlan?.radius_info?.static_ip_total_cost,
  // );

  // console.log('adasd', props.customerCurrentPlan?.radius_info);

  // console.log('time_unit', props?.data?.time_unit);

  // console.log('calaculateIP', calculateIp);

  useEffect(() => {
    getsessionData();
    if (props.paymentType !== 'renew') {
      if(!dueDate){
        funcToSetDueDate(props?.data?.time_unit)
      }
    } 
  }, []);

  // useEffect for calculation
  useEffect(() => {
    if (props.paymentType === 'renew') {
      if (props?.customerCurrentPlan?.plan_id && !staticIp) {
        getRenewData(1);
      } else if (
        staticIp &&
        !props.data?.radius_info?.static_ip_bind &&
        !valuess
      ) {
        getRenewData(2);
      } else if (ipData || props.data?.radius_info?.static_ip_bind) {
        getRenewData(3);
      }
    }
  }, [staticIp, ipData, walletAmtCheck, discountamount]);

  useEffect(() => {
    if (props.paymentType === 'change' && props.extraProps) {
      console.log('this useEffect', props.customerCurrentPlan);
      console.log(
        'props.data?.customerCurrentPlan?.static_ip_bind ',
        props?.customerCurrentPlan?.static_ip_bind,
      );

      if (props.data.id && !staticIp) {
        console.log('change here 1');
        getChangeUpgradeData(1);
      } else if (
        staticIp &&
        !props?.customerCurrentPlan?.static_ip_bind &&
        !valuess
      ) {
        console.log('change here 2');
        getChangeUpgradeData(2);
      } else if (
        ipData ||
        props.customerCurrentPlan?.radius_info?.static_ip_bind
      ) {
        console.log('change here 3');
        getChangeUpgradeData(3);
      }
    }
  }, [staticIp, ipData, walletAmtCheck, props.extraProps, discountamount]);

  useEffect(() => {
    if (props.paymentType === 'upgrade' && props.extraProps) {
      console.log('this useEffect', props.customerCurrentPlan);
      console.log(
        'props.data?.customerCurrentPlan?.static_ip_bind ',
        props?.customerCurrentPlan?.static_ip_bind,
      );

      if (props.data.id && !staticIp) {
        console.log('change here 1');
        getUpgradeData(1);
      } else if (
        staticIp &&
        !props?.customerCurrentPlan?.static_ip_bind &&
        !valuess
      ) {
        console.log('change here 2');
        getUpgradeData(2);
      } else if (
        ipData ||
        props.customerCurrentPlan?.radius_info?.static_ip_bind
      ) {
        console.log('change here 3');
        getUpgradeData(3);
      }
    }
  }, [staticIp, ipData, walletAmtCheck, props.extraProps, discountamount]);

  // useEffect(() => {
  //   if (walletAmount) {
  //     checkWalletAmtInput(walletAmount);
  //   }
  // }, [walletAmount]);

  const checkWalletAmtInput = async value => {
    console.log('walletAmount here', value);
    const data = {
      wallet_amount: value ? Number(value) : 0,
    };
    console.log('walletAmount data', data);
    try {
      const res = await checkAmount(
        props?.customerCurrentPlan?.customer_id,
        data,
      );
      if (res.result.check) {
        setAmountAllowed(true);
      } else {
        setAmountAllowed(false);
        setError({
          text: `Wallet amount of max ${res.result.remaining_wallet_amount} RS. is allowed.`,
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: `Wallet amount of max ${res.result.remaining_wallet_amount} RS. is allowed.`,
        // });
      }

      console.log('response for check', res);
    } catch (err) {
      console.log('err', err);
    }
  };

  const getRenewData = async data => {
    setLoaders(true);
    // setLoading({spinner: true, spinnerText: 'Getting Renew Data...'});
    if (data === 1) {
      console.log('come here', data);
      var data = {
        discount: discountamount ? Number(discountamount) : 0,
        service_plan: props?.customerCurrentPlan?.plan_id,
        use_wallet: walletAmtCheck,
      };
    } else if (data === 2) {
      console.log('come here', data);
      var data = {
        discount: discountamount ? Number(discountamount) : 0,
        service_plan: props?.customerCurrentPlan?.plan_id,
        use_wallet: walletAmtCheck,
        radius_info: {
          id: props?.customerCurrentPlan?.radius_info?.id,
          ippool_id: null,
          static_ip_bind: null,
        },
      };
    } else if (data === 3) {
      console.log('come here', data);

      var data = {
        discount: discountamount ? Number(discountamount) : 0,
        service_plan: props?.customerCurrentPlan?.plan_id,
        use_wallet: walletAmtCheck,
        radius_info: {
          id: props?.customerCurrentPlan?.radius_info?.id,
          ippool_id: poolData ? poolData : props.data?.radius_info?.ippool,
          static_ip_bind: ipData
            ? ipData
            : props.data?.radius_info?.static_ip_bind,
        },
      };
    }
    console.log('renew data body', data);
    const res = await renewAmountCalculations(
      props?.customerCurrentPlan?.customer_id,
      data,
    );
    console.log(
      '🚀 ~ file: PlanDetailsBottomSheet.js:197 ~ getRenewData ~ res:',
      res,
    );
    if (res.isSuccess) {
      setLoaders(false);
      setLoading({spinner: false, spinnerText: 'Getting Renew Data...'});
      setRenewCalculations(res?.result);
    } else {
      setLoaders(false);
      setLoading({spinner: false, spinnerText: 'Getting Renew Data...'});
      setError({
        text: `Wallet amount of max ${res.result.remaining_wallet_amount} RS. is allowed.`,
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something Went Wrong',
      // });
    }
  };

  const getUpgradeData = async data => {
    console.log('here come');
    setLoaders(true);
    // setLoading({spinner: true, spinnerText: 'Getting  Data...'});
    if (data === 1) {
      console.log('come here', data);
      var data = {
        discount: discountamount ? Number(discountamount) : 0,
        service_plan: props.data.id,
        use_wallet: walletAmtCheck,
        balance:
          props.upgradeType === 'gb'
            ? props?.extraData?.balance_by_days
            : props?.extraData?.balance_by_monthly,
      };
    } else if (data === 2) {
      console.log('come here', data);
      var data = {
        discount: discountamount ? Number(discountamount) : 0,
        service_plan: props.data.id,
        use_wallet: walletAmtCheck,
        balance:
          props.upgradeType === 'gb'
            ? props?.extraData?.balance_by_days
            : props?.extraData?.balance_by_monthly,
        radius_info: {
          id: renewCalculations?.radius_info?.id,
          ippool_id: null,
          static_ip_bind: null,
        },
      };
    } else if (data === 3) {
      console.log('come here', data);
      var data = {
        discount: discountamount ? Number(discountamount) : 0,
        service_plan: props.data.id,
        use_wallet: walletAmtCheck,
        balance:
          props.upgradeType === 'gb'
            ? props?.extraData?.balance_by_days
            : props?.extraData?.balance_by_monthly,
        radius_info: {
          id: props?.customerCurrentPlan?.radius_info?.id,
          ippool_id: poolData ? poolData : props.data?.radius_info?.ippool,
          static_ip_bind: ipData
            ? ipData
            : props.data?.radius_info?.static_ip_bind,
        },
        radius_info: {
          id: renewCalculations?.radius_info?.id,
          ippool_id: poolData
            ? poolData
            : props.customerCurrentPlan?.radius_info?.ippool,
          static_ip_bind: ipData
            ? ipData
            : props.customerCurrentPlan?.radius_info?.static_ip_bind,
        },
      };
    }
    console.log('update data body', data);
    const res = await changeUpgradeAmountCalculations(
      props?.customerCurrentPlan?.customer_id,
      data,
    );
    console.log(
      '🚀 ~ file: PlanDetailsBottomSheet.js:197 ~ getRenewData ~ res:',
      res,
    );
    if (res.isSuccess) {
      setLoaders(false);
      setLoading({spinner: false, spinnerText: 'Getting Renew Data...'});
      setRenewCalculations(res?.result);
    } else {
      setLoading({spinner: false, spinnerText: 'Getting Renew Data...'});
      setLoaders(false);
      setError({
        text: 'Something Went Wrong',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something Went Wrong',
      // });
    }
  };

  const getChangeUpgradeData = async data => {
    console.log('here come');
    setLoaders(true);
    // setLoading({spinner: true, spinnerText: 'Getting  Data...'});
    if (data === 1) {
      console.log('come here', data);
      var data = {
        discount: discountamount ? Number(discountamount) : 0,
        service_plan: props.data.id,
        use_wallet: walletAmtCheck,
      };
    } else if (data === 2) {
      console.log('come here', data);
      var data = {
        discount: discountamount ? Number(discountamount) : 0,
        service_plan: props.data.id,
        use_wallet: walletAmtCheck,
        radius_info: {
          id: renewCalculations?.radius_info?.id,
          ippool_id: null,
          static_ip_bind: null,
        },
      };
    } else if (data === 3) {
      console.log('come here', data);
      var data = {
        discount: discountamount ? Number(discountamount) : 0,
        service_plan: props.data.id,
        use_wallet: walletAmtCheck,
        radius_info: {
          id: props?.customerCurrentPlan?.radius_info?.id,
          ippool_id: poolData ? poolData : props.data?.radius_info?.ippool,
          static_ip_bind: ipData
            ? ipData
            : props.data?.radius_info?.static_ip_bind,
        },
        radius_info: {
          id: renewCalculations?.radius_info?.id,
          ippool_id: poolData
            ? poolData
            : props.customerCurrentPlan?.radius_info?.ippool,
          static_ip_bind: ipData
            ? ipData
            : props.customerCurrentPlan?.radius_info?.static_ip_bind,
        },
      };
    }
    console.log('renew data body', data);
    const res = await changeUpgradeAmountCalculations(
      props?.customerCurrentPlan?.customer_id,
      data,
    );
    console.log(
      '🚀 ~ file: PlanDetailsBottomSheet.js:197 ~ getRenewData ~ res:',
      res,
    );
    if (res.isSuccess) {
      setLoaders(false);
      setLoading({spinner: false, spinnerText: 'Getting Renew Data...'});
      setRenewCalculations(res?.result);
    } else {
      setLoading({spinner: false, spinnerText: 'Getting Renew Data...'});
      setLoaders(false);
      setError({
        text: 'Something Went Wrong',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something Went Wrong',
      // });
    }
  };

  console.log('propssssssss', props);

  var totalPlanCostCal =
    props?.data?.total_plan_cost - props?.extraData?.balance;

  var showPlanCost = props?.data?.total_plan_cost;

  console.log('props?.data?.total_plan_cost', props?.data?.total_plan_cost);

  const callRenew = async () => {
    if (staticIp) {
      if (!ipData && !props.customerCurrentPlan?.static_ip_bind) {
        setError({
          text: 'Please Select the Static IP',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Please Select the Static IP',
        // });
        return;
      }
    }
    if (paymentMethod == 'Bank_transfer') {
      if (bankref == null || !bankref) {
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
    setLoading({spinner: true, spinnerText: 'Checking Renewal Date.....'});
    const response = await checkRenewalDate(props?.customer?.id);
    if (response?.result?.status) {
      setLoading({spinner: false, spinnerText: ''});
      setRenewRecent({visible: true});
      setText(response?.result?.detail);
    } else {
      setLoading({spinner: false, spinnerText: ''});
      setDecisionVisible({visible: true});
    }
  };
  const getsessionData = async () => {
    const response = await getSessionInfo(
      props?.customer?.username,
      props?.customer?.user,
    );
    console.log(
      '🚀 ~ file: PlanDetailsBottomSheet.js:105 ~ getsessionData ~ response',
      response,
    );
    if (response?.isSuccess === 200) {
      setSessionData(response?.result);
    } else {
      const responseMsg = response;
    }
  };

  console.log(paymentMethodListData, 'paymentMethodListData');
  var walletInfo = !props.isAllPlan
    ? props.data.customer_wallet_amount
    : props.customerCurrentPlan?.customer_wallet_amount != undefined
    ? props.customerCurrentPlan?.customer_wallet_amount
    : '';

  console.log('props.wallet', props);

  var paymentType = props.paymentType;

  const checkBalance = async () => {
    setDecisionVisible({text: '', visible: false});
    setRenewRecent({
      text: '',
      visible: false,
    });
    setLoading({spinner: true, spinnerText: 'Loading'});

    if (staticIp && (poolData || props?.data?.radius_info?.ippool)) {
      console.log(
        '🚀 ~ file: PlanDetailsBottomSheet.js:123 ~ checkBalance ~ props',
        props,
      );
      var body = {
        plan: props?.data?.id,
        area: props.customerCurrentPlan.area,
        ippool: poolData ? poolData : props?.data?.radius_info?.ippool,
      };
    } else {
      var body = {
        plan: props?.data?.id,
        area: props.customerCurrentPlan.area,
      };
    }
    console.log(
      '🚀 ~ file: PlanDetailsBottomSheet.js:127 ~ checkBalance ~ body',
      body,
    );
    try {
      const response = await checkWalletInfo(body);
      console.log(
        '🚀 ~ file: PlanDetailsBottomSheet.js:131 ~ checkBalance ~ response',
        response,
      );
      if (response.isSuccess) {
        console.log('checked', checked);
        if (response.result.check) {
          if (checked == 'offline') {
            console.log('here');
            setLoading({spinner: false, spinnerText: ''});
            makeOffPayment();
          } else {
            setLoading({spinner: false, spinnerText: ''});
            console.log('this is it');
            getPaymentMethodList();
          }
        } else {
          setLoading({spinner: false, spinnerText: ''});
          setError({
            text: 'You do not have enough balance',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'You do not have enough balance.',
          // });
        }
      } else {
        const errorresponse = response;
        console.log(errorresponse, 'hi1');
        setLoading({spinner: false, spinnerText: ''});
        setError({
          text: 'Something went wrong! Please try again later',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Something went wrong! Please try again later.',
        // });
      }
    } catch (err) {
      console.log(errorresponse, 'hi12');
      const errorresponse = err.toString();
      setLoading({spinner: false, spinnerText: ''});
      setError({
        text: 'Something went wrong! Please try again later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something went wrong! Please try again later.',
      // });
    }
  };

  console.log('Test plan time ', props?.data?.plan_time_unit);
  // static ip cost caluculation renew
  const totalStaticCost = parseFloat(
    parseFloat(
      staticCost
        ? staticCost
        : props.customerCurrentPlan?.radius_info?.static_ip_total_cost,
      // staticCost * props?.data?.plan_time_unit
      //   ? props?.data?.plan_time_unit
      //   : 1
      //   ? staticCost * props?.data?.plan_time_unit
      //     ? props?.data?.plan_time_unit
      //     : 1
      //   : props.customerCurrentPlan?.static_ip_cost
      //   ? props.customerCurrentPlan?.static_ip_cost
      //   : null,
    ),
  );

  console.log(
    'aaaaaaaa',
    props.customerCurrentPlan?.radius_info?.static_ip_total_cost,
  );
  console.log(
    '🚀 ~ file: PlanDetailsBottomSheet.js:184 ~ staticCost',
    staticCost,
  );

  const extraAmount = staticIp
    ? !props?.data?.plan_cgst
      ? props?.data.total_plan_cost * 0.18
      : 0
    : 0;

  console.log('props?.data?.plan_cgst', props?.data?.plan_cgst);

  const extraAmountRenew = staticIp
    ? !props?.data?.plan_cgst
      ? props?.data?.plan_cost * 0.18
      : 0
    : 0;
  const extraAmountChange = staticIp
    ? !props?.additionalData?.plan_cgst
      ? props?.data?.plan_cost * 0.18
      : 0
    : 0;

  console.log('props?.additionalData?.plan_cgst', props?.additionalData);
  console.log('extraAmount', extraAmount);

  const totalAmount =
    Number(staticIp ? (totalStaticCost ? totalStaticCost : 0) : 0) +
    Number(props?.data?.plan_cost ? props?.data?.plan_cost : 0);
  Number(withDiscount ? withDiscount : 0);

  console.log('total', totalAmount);
  console.log('total', props?.data);

  console.log(
    '🚀 ~ file: PlanDetailsBottomSheet.js ~ line 147 ~ PlanDetailsBottomSheet ~ withDiscount',
    withDiscount,
  );
  console.log(
    '🚀 ~ file: PlanDetailsBottomSheet.js ~ line 147 ~ PlanDetailsBottomSheet ~ plan_cost',
    Number(props.data.plan_cost),
  );
  console.log(
    '🚀 ~ file: PlanDetailsBottomSheet.js ~ line 147 ~ PlanDetailsBottomSheet ~ totalStaticCost',
    totalStaticCost,
  );

  console.log('lll', totalAmount);
  // static ip cost caluculation chamge plan
  const totalstaticCostChange = parseFloat(
    parseFloat(
      staticCost * props.data.time_unit
        ? staticCost * props.data.time_unit
        : calculateIp,
    ),
  );

  console.log('hahdfjbg', props.customerCurrentPlan?.static_ip_cost);
  console.log('calculate', calculateIp);

  const totalChangeAmount =
    Number(props.data.total_plan_cost) +
    Number(staticIp ? (totalstaticCostChange ? totalstaticCostChange : 0) : 0) -
    Number(withDiscount);

  console.log('chnage amount ', totalChangeAmount);

  const totalUpgradeAmount =
    Number(props.data.total_plan_cost) +
    Number(staticIp ? (totalstaticCostChange ? totalstaticCostChange : 0) : 0) -
    Number(withDiscount) -
    Number(props?.extraData?.balance);

  const showTotalUpgrade =
    Number(props.data.total_plan_cost) +
    Number(staticIp ? (totalstaticCostChange ? totalstaticCostChange : 0) : 0);
  console.log(
    '🚀 ~ file: PlanDetailsBottomSheet.js ~ line 178 ~ PlanDetailsBottomSheet ~ props',
    props.data,
  );

  console.log('props?.extraData?.balance', props?.extraData?.balance);

  console.log(
    '🚀 ~ file: PlanDetailsBottomSheet.js ~ line 174 ~ PlanDetailsBottomSheet ~ totalUpgradeAmount',
    totalUpgradeAmount,
  );

  console.log(
    '🚀 ~ file: PlanDetailsBottomSheet.js ~ line 174 ~ PlanDetailsBottomSheet ~ totalUpgradeAmount',
    extraAmount,
  );
  const calculateDis = value => {
    setDiscountAmount(value);

    var amount = parseFloat(
      props.data.plan_cost - props.data.plan_cost * (value / 100),
    );
    setWithDiscount(props.data.plan_cost * (value / 100));

    console.log('Test plan time ', props?.data?.plan_time_unit);
    if (paymentType == 'renew') {
      let staticPlanCost = parseFloat(
        staticCost * props?.data?.plan_time_unit
          ? staticCost * props?.data?.plan_time_unit
          : 0,
      );
      setTotalPlanCost(amount + staticPlanCost);
    } else {
      let staticPlanCost = parseFloat(
        staticCost * props.data.time_unit
          ? staticCost * props.data.time_unit
          : 0,
      );
      setTotalPlanCost(amount + staticPlanCost);
    }
  };

  console.log('change props', props);
  const makeOffPayment = async () => {
    console.log('amount renew', Number(renewCalculations?.amount));
    console.log('amount wallet', walletAmount);
    console.log(
      'Renew Total Amount',
      Number(renewCalculations?.amount) +
        (walletAmount ? Number(walletAmount) : 0),
    );

    // if (assignedTo && paymentMethod) {
    if (paymentMethod) {
      if (paymentType == 'renew') {
        // if (parseFloat(finalAMount) < parseFloat(totalAmount)) {
        //   Toast.show({
        //     type: 'error',
        //     text1: 'Total amount cannot less than required amount!',
        //   });
        //   return;
        // }
        if (paymentMethod === 'GPAY' || paymentMethod === 'PHNPE') {
          if (urtref === '' || urtref == null) {
            setError({
              text: 'UTR No. is Required!',
              visible: true,
            });
            // Toast.show({
            //   type: 'error',
            //   text1: 'UTR No. is Required!',
            // });
            return;
          }
        }
        if (paymentMethod === 'CHEK') {
          if (chequeno === '' || chequeno == null) {
            setError({
              text: 'Cheque No. is Required!',
              visible: true,
            });
            // Toast.show({
            //   type: 'error',
            //   text1: 'Cheque No. is Required!',
            // });
            return;
          }
        }
        props.onClose();
        setLoading({spinner: true, spinnerText: 'Loading'});
        let body = {
          customer_id: props?.customer?.id,
          service_plan: props?.data?.id,
          radius_info: {},
          amount: walletAmount
            ? Number(renewCalculations?.amount) + Number(walletAmount)
            : Number(renewCalculations?.amount),
          ledger_amount: renewCalculations?.ledger_amount,
          discount: discountamount ? discountamount : '0.00',
          discount_amount: renewCalculations.discount_amount
            ? renewCalculations.discount_amount
            : 0,

          payment_receipt: receipt ? receipt : null,
          use_wallet: walletAmtCheck,
          paid_to: props?.userInfo?.id,
          payment_method:
            paymentMethod == 'Bank_transfer' ? 'BNKTF' : paymentMethod,
          paid_date: formatCustomDate(),
          gst: {cgst: props?.data?.plan_cgst, sgst: props?.data?.plan_sgst},

          check_reference_no: chequeno ? chequeno : null,
          upi_reference_no: urtref ? urtref : null,
          transaction_no: transactionNo ? transactionNo : null,
          bank_reference_no: bankref ? bankref : null,
        };

        if (walletAmtCheck) {
          body.wallet_amount = walletAmtCheck
            ? renewCalculations?.wallet_amount
            : null;
        }
        if (props.data?.radius_info?.id) {
          body.radius_info.id = renewCalculations.radius_info.id
            ? renewCalculations.radius_info.id
            : props.data?.radius_info?.id;
          if (staticIp && (poolData || props?.data?.radius_info?.ippool)) {
            body.radius_info.static_ip_total_cost =
              renewCalculations?.radius_info?.static_ip_total_cost;
            body.radius_info.static_ip_cost =
              renewCalculations?.radius_info?.static_ip_cost;

            body.radius_info.static_ip_bind = ipData
              ? ipData
              : renewCalculations?.radius_info?.static_ip_bind;

            body.radius_info.ippool_id = poolData
              ? poolData
              : renewCalculations?.radius_info?.ippool_id;
            body.radius_info.static_ip_sgst =
              renewCalculations.radius_info.static_ip_sgst;
            body.radius_info.static_ip_cgst =
              renewCalculations.radius_info.static_ip_cgst;
          }
        }

        console.log('body renew', body);

        try {
          const response = await makeOfflineRenew(body, props?.customer?.id);
          if (response.isSuccess) {
            setLoading({spinner: false, spinnerText: ''});
            Toast.show({
              type: 'success',
              text1: 'Payment Successful!',
              position: 'top',
              visibilityTime: 5000,
            });
            navigation.navigate('Customer360Info', {
              param1: 'update',
            });
          } else {
            const errorresponse = response;
            console.log(errorresponse, 'errorresponse1 renew');
            setLoading({spinner: false, spinnerText: ''});
            setError({
              text: 'Payment not Successful! Please try later',
              visible: true,
            });
            // Toast.show({
            //   type: 'error',
            //   text1: 'Payment not Successful! Please try later',
            // });
            Toast.show({
              type: 'error',
              text1: errorresponse?.message?.response?.data?.detail,
              position: 'top',
              visibilityTime: 5000,
            });
          }
        } catch (err) {
          console.log(err, 'error');
          const errorresponse = err.toString();
          setLoading({spinner: false, spinnerText: ''});
          setError({
            text: 'Payment not Successful! Please try later',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Payment not Successful! Please try later.',
          // });
        }
      } else if (paymentType == 'upgrade') {
        // if (parseFloat(finalAMount) < parseFloat(totalUpgradeAmount)) {
        //   Toast.show({
        //     type: 'error',
        //     text1: 'Total amount cannot less than required amount!',
        //   });
        //   return;
        // }

        props.onClose();
        setLoading({spinner: true, spinnerText: 'Loading'});
        let body = {
          customer_id: props?.customer?.id,
          previous_service_plan: props?.customerCurrentPlan?.id,
          new_service_plan: props?.data?.id,
          payment_receipt: receipt ? receipt : null,
          use_wallet: walletAmtCheck,
          paid_to: props.userInfo?.id,
          payment_method:
            paymentMethod == 'Bank_transfer' ? 'BNKTF' : paymentMethod,
          amount: walletAmount
            ? Number(renewCalculations?.amount) + Number(walletAmount)
            : Number(renewCalculations?.amount),
          balance: Number(renewCalculations?.balance),
          discount: discountamount ? discountamount : '0.00',
          discount_amount: renewCalculations.discount_amount
            ? renewCalculations.discount_amount
            : 0,
          paid_date: formatCustomDate(),
          ledger_amount: renewCalculations?.ledger_amount,
          plan: props?.data?.id,
          check_reference_no: chequeno ? chequeno : null,
          upi_reference_no: urtref ? urtref : null,
          bank_reference_no: bankref ? bankref : null,
          transaction_no: transactionNo ? transactionNo : null,
          gst: {cgst: props?.data?.plan_cgst, sgst: props?.data?.plan_sgst},
          radius_info: {},
        };

        if (walletAmtCheck) {
          body.wallet_amount = walletAmtCheck
            ? renewCalculations?.wallet_amount
            : null;
        }
        if (
          props.customerCurrentPlan?.radius_info?.id ||
          renewCalculations.radius_info.id
        ) {
          body.radius_info.id = renewCalculations.radius_info.id
            ? renewCalculations.radius_info.id
            : props.customerCurrentPlan?.radius_info?.id;
          if (
            staticIp &&
            (poolData || props?.customerCurrentPlan?.radius_info?.ippool)
          ) {
            body.radius_info.static_ip_total_cost = renewCalculations
              ?.radius_info?.static_ip_total_cost
              ? renewCalculations?.radius_info?.static_ip_total_cost
              : props?.customerCurrentPlan?.radius_info?.static_ip_total_cost;
            body.radius_info.static_ip_cost = renewCalculations?.radius_info
              ?.static_ip_cost
              ? renewCalculations?.radius_info?.static_ip_cost
              : props?.customerCurrentPlan?.radius_info?.static_ip_cost;

            body.radius_info.static_ip_bind = ipData
              ? ipData
              : renewCalculations?.radius_info?.static_ip_bind
              ? renewCalculations?.radius_info?.static_ip_bind
              : props?.customerCurrentPlan?.radius_info?.static_ip_bind;

            body.radius_info.ippool_id = poolData
              ? poolData
              : renewCalculations?.radius_info?.ippool_id
              ? renewCalculations?.radius_info?.ippool_id
              : props?.customerCurrentPlan?.radius_info?.ippool_id;
            body.radius_info.static_ip_sgst = renewCalculations.radius_info
              .static_ip_sgst
              ? renewCalculations.radius_info.static_ip_sgst
              : props?.customerCurrentPlan?.radius_info.static_ip_sgst;
            body.radius_info.static_ip_cgst = renewCalculations.radius_info
              .static_ip_cgst
              ? renewCalculations.radius_info.static_ip_cgst
              : props?.customerCurrentPlan?.radius_info.static_ip_cgst;
          }
        }

        console.log('upgrade bodyyyyyy', body);

        try {
          const response = await changeOfflinePlanEnc(
            body,
            props?.customer?.id,
          );
          if (response.isSuccess) {
            setLoading({spinner: false, spinnerText: ''});
            Toast.show({
              type: 'success',
              text1: 'Payment Successful!',
              position: 'top',
              visibilityTime: 5000,
            });
            // navigation.navigate('Customer360Info');
            navigation.navigate('Customer360Info', {
              param1: 'update',
            });
          } else {
            const errorresponse = response;
            console.log('error Test', errorresponse);
            setLoading({spinner: false, spinnerText: ''});
            setError({
              text: 'Payment not Successful! Please try later',
              visible: true,
            });
            Toast.show({
              type: 'error',
              text1: errorresponse?.message?.response?.data?.detail,
              position: 'top',
              visibilityTime: 5000,
            });
          }
        } catch (err) {
          const errorresponse = err.toString();
          console.log('catch', errorresponse);
          setLoading({spinner: false, spinnerText: ''});
          setError({
            text: 'Payment not Successful! Please try later',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Payment not Successful! Please try later.',
          // });
          Toast.show({
            type: 'error',
            text1: errorresponse?.message?.response?.data?.detail,
            position: 'top',
            visibilityTime: 5000,
          });
        }
      } else {
        // if (parseFloat(finalAMount) < parseFloat(totalChangeAmount)) {
        //   Toast.show({
        //     type: 'error',
        //     text1: 'Total amount cannot less than required amount!',
        //   });
        //   return;
        // }
        props.onClose();
        setLoading({spinner: true, spinnerText: 'Loading'});
        let body = {
          customer_id: props?.customer?.id,
          previous_service_plan: props?.customerCurrentPlan?.id,
          new_service_plan: props?.data?.id,
          ledger_amount: renewCalculations?.ledger_amount,
          balance: props?.data?.balance,
          payment_receipt: receipt ? receipt : null,
          use_wallet: walletAmtCheck,
          paid_to: props.userInfo?.id,
          payment_method:
            paymentMethod == 'Bank_transfer' ? 'BNKTF' : paymentMethod,
          amount: walletAmount
            ? Number(renewCalculations?.amount) + Number(walletAmount)
            : Number(renewCalculations?.amount),

          discount: discountamount ? discountamount : '0.00',
          discount_amount: renewCalculations.discount_amount
            ? renewCalculations.discount_amount
            : 0,
          paid_date: formatCustomDate(),
          plan: props?.data?.id,
          check_reference_no: chequeno ? chequeno : null,
          upi_reference_no: urtref ? urtref : null,
          bank_reference_no: bankref ? bankref : null,
          transaction_no: transactionNo ? transactionNo : null,
          gst: {
            cgst: props?.additionalData?.plan_cgst,
            sgst: props?.additionalData?.plan_sgst,
          },
          radius_info: {},
        };

        if (walletAmtCheck) {
          body.wallet_amount = walletAmtCheck
            ? renewCalculations?.wallet_amount
            : null;
        }
        if (
          props.customerCurrentPlan?.radius_info?.id ||
          renewCalculations.radius_info.id
        ) {
          body.radius_info.id = renewCalculations.radius_info.id
            ? renewCalculations.radius_info.id
            : props.customerCurrentPlan?.radius_info?.id;
          if (
            staticIp &&
            (poolData || props?.customerCurrentPlan?.radius_info?.ippool)
          ) {
            body.radius_info.static_ip_total_cost = renewCalculations
              ?.radius_info?.static_ip_total_cost
              ? renewCalculations?.radius_info?.static_ip_total_cost
              : props?.customerCurrentPlan?.radius_info?.static_ip_total_cost;
            body.radius_info.static_ip_cost = renewCalculations?.radius_info
              ?.static_ip_cost
              ? renewCalculations?.radius_info?.static_ip_cost
              : props?.customerCurrentPlan?.radius_info?.static_ip_cost;

            body.radius_info.static_ip_bind = ipData
              ? ipData
              : renewCalculations?.radius_info?.static_ip_bind
              ? renewCalculations?.radius_info?.static_ip_bind
              : props?.customerCurrentPlan?.radius_info?.static_ip_bind;

            body.radius_info.ippool_id = poolData
              ? poolData
              : renewCalculations?.radius_info?.ippool_id
              ? renewCalculations?.radius_info?.ippool_id
              : props?.customerCurrentPlan?.radius_info?.ippool_id;
            body.radius_info.static_ip_sgst = renewCalculations.radius_info
              .static_ip_sgst
              ? renewCalculations.radius_info.static_ip_sgst
              : props?.customerCurrentPlan?.radius_info.static_ip_sgst;
            body.radius_info.static_ip_cgst = renewCalculations.radius_info
              .static_ip_cgst
              ? renewCalculations.radius_info.static_ip_cgst
              : props?.customerCurrentPlan?.radius_info.static_ip_cgst;
          }
        }

        console.log('change bodyyyyyy', body);
        try {
          const response = await changeOfflinePlanEnc(body, props.customer.id);
          if (response.isSuccess) {
            setLoading({spinner: false, spinnerText: ''});
            Toast.show({
              type: 'success',
              text1: 'Payment Successful!',
              position: 'top',
              visibilityTime: 5000,
            });
            // navigation.navigate('Customer360Info');
            navigation.navigate('Customer360Info', {
              param1: 'update',
            });
          } else {
            const errorresponse = response;
            console.log('error Test', errorresponse);
            setLoading({spinner: false, spinnerText: ''});
            setError({
              text: errorresponse?.message?.response?.data?.detail,
              visible: true,
            });
            Toast.show({
              type: 'error',
              text1: errorresponse?.message?.response?.data?.detail,
              position: 'top',
              visibilityTime: 5000,
            });
          }
        } catch (err) {
          const errorresponse = err.toString();
          console.log('catch', errorresponse);
          setLoading({spinner: false, spinnerText: ''});
          setError({
            text: 'Payment not Successful! Please try later.',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Payment not Successful! Please try later.',
          // });
        }
      }
    } else {
      setError({
        text: 'Please fill up all the required fields!',
        visible: true,
      });
      Toast.show({
        type: 'warning',
        text1: 'Please fill up all the required fields!',
        position: 'top',
        visibilityTime: 5000,
      });
    }
  };

  console.log('props', props);

  // online payment
  const getPaymentMethodList = async () => {
    // online renew
    if (paymentType == 'renew') {
      // if (parseFloat(finalAMount) < parseFloat(totalAmount)) {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Total amount cannot less than required amount!',
      //   });
      //   return;
      // }
      // let body = {
      //   amount: parseFloat(renewCalculations?.amount),
      //   cgst: props?.data?.plan_cgst,
      //   sgst: props?.data?.plan_sgst,
      //   radius_info: {},
      //   plan: props.customerCurrentPlan.id,
      // };
      let body = {
        customer_id: props.customer.id,
        service_plan: props.customerCurrentPlan.id,
        radius_info: {},
        amount: parseFloat(renewCalculations?.amount),
        ledger_amount: renewCalculations?.ledger_amount,
        discount: discountamount ? discountamount : '0.00',
        discount_amount: renewCalculations.discount_amount
          ? renewCalculations.discount_amount
          : 0,
        wallet_amount: 0,
        use_wallet: false,
      };
      console.log(body, 'online renew');

      if (props.data?.radius_info?.id) {
        body.radius_info.id = renewCalculations?.radius_info?.id
          ? renewCalculations.radius_info.id
          : props.data?.radius_info?.id;
        if (staticIp && (poolData || props?.data?.radius_info?.ippool)) {
          body.radius_info.static_ip_total_cost =
            renewCalculations?.radius_info?.static_ip_total_cost;
          body.radius_info.static_ip_cost =
            renewCalculations?.radius_info?.static_ip_cost;
          body.radius_info.static_ip_bind = ipData
            ? ipData
            : renewCalculations?.radius_info?.static_ip_bind;

          body.radius_info.ippool_id = poolData
            ? poolData
            : renewCalculations?.radius_info?.ippool_id;
          body.radius_info.static_ip_sgst =
            renewCalculations.radius_info.static_ip_sgst;
          body.radius_info.static_ip_cgst =
            renewCalculations.radius_info.static_ip_cgst;
        } else {
          body.radius_info.static_ip_total_cost = 0;
          body.radius_info.static_ip_cost = 0;
          body.radius_info.static_ip_bind = null;

          body.radius_info.ippool_id = null;
          body.radius_info.static_ip_sgst = 0;
          body.radius_info.static_ip_cgst = 0;
        }
      }
      body.payment_gateway_id=selectedGatewayObj?.id;
    body.payment_gateway_type=selectedGatewayObj?.gateway_type;
      console.log(body, 'body2 renew');
      try {
        const response = await makeOnlineRenew(props.customer.id, body);
        console.log(response);
        // if (response.isSuccess) {
        //   if (response.result.length > 0) {
        //     setPaymentMethodListData(response.result);
        //     props.onClose();
        //     setLoading({text: '', visible: false});
        //     paymentMethodRBSheet.current.open();
        //     navigation.navigate('PaymentGateWayWebView', {
        //       url: response.result.next,
        //     });
        //     openWSConnection(response.result.payment_id);
        //   } else {
        //     const responseMsg = response;
        //     Toast.show({
        //       type: 'error',
        //       text1: 'Something went wrong! Please try again later.',
        //     });
        //   }
        // }
        if (response.isSuccess) {
          console.log(response.isSuccess, '');
          setPaymentMethodListData(response.result);
          setLoading({text: '', visible: false});
          navigation.navigate('PaymentGateWayWebView', {
            url: response.result.next,
          });
          openWSConnection(response.result.payment_id);
        } else {
          const responseMsg = response?.message;
          console.log(responseMsg, 'come here');
          setError({
            text:
              response?.message?.response?.data?.detail ||
              'Something Went Wrong!',
            visible: true,
          });
          Toast.show({
            type: 'error',
            text1:
              response?.message?.response?.data?.detail ||
              'Something Went Wrong!',
            position: 'top',
            visibilityTime: 5000,
          });
        }
      } catch (error) {
        console.log(error, 'errorresponse2');
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
    } else if (paymentType == 'upgrade') {
      console.log('upgrade here', props);

      // let body = {
      //   amount: parseFloat(renewCalculations?.amount),
      //   cgst: props?.data?.plan_cgst,
      //   sgst: props?.data?.plan_sgst,
      //   plan: props?.data?.id,
      //   balance: renewCalculations?.balance
      //     ? Number(renewCalculations?.balance)
      //     : 0,
      //   radius_info: {},
      // };

      let body = {
        customer_id: props.customer.id,
        previous_service_plan: props?.customerCurrentPlan?.id,
        new_service_plan: props?.data?.id,
        radius_info: {},
        amount: parseFloat(
          renewCalculations?.amount ? renewCalculations?.amount : 0,
        ),
        ledger_amount: renewCalculations?.ledger_amount,
        balance: renewCalculations?.balance
          ? Number(renewCalculations?.balance)
          : 0,
        discount: discountamount ? discountamount : '0.00',
        discount_amount: renewCalculations.discount_amount
          ? renewCalculations.discount_amount
          : 0,
        wallet_amount: 0,
        use_wallet: false,
        plan: props?.data?.id,
      };
      console.log('upgrade here', Number(renewCalculations?.balance));

      if (
        props?.customerCurrentPlan?.radius_info?.id ||
        renewCalculations?.radius_info?.id
      ) {
        body.radius_info.id = renewCalculations?.radius_info?.id
          ? renewCalculations?.radius_info?.id
          : props?.customerCurrentPlan?.radius_info?.id;
        if (
          staticIp &&
          (poolData || props?.customerCurrentPlan?.radius_info?.ippool)
        ) {
          console.log('upgrade here 1');
          body.radius_info.static_ip_total_cost =
            renewCalculations?.radius_info?.static_ip_total_cost;
          body.radius_info.static_ip_cost =
            renewCalculations?.radius_info?.static_ip_cost;
          body.radius_info.static_ip_bind = ipData
            ? ipData
            : renewCalculations?.radius_info?.static_ip_bind;

          body.radius_info.ippool_id = poolData
            ? poolData
            : renewCalculations?.radius_info?.ippool_id;
          body.radius_info.static_ip_sgst =
            renewCalculations?.radius_info?.static_ip_sgst;
          body.radius_info.static_ip_cgst =
            renewCalculations?.radius_info?.static_ip_cgst;
        }
      }
      body.payment_gateway_id=selectedGatewayObj?.id;
      body.payment_gateway_type=selectedGatewayObj?.gateway_type;
      console.log('upgrade here body', body);
      try {
        const response = await makeOnlineChange(props?.customer?.id, body);
        if (response.isSuccess) {
          console.log(response.isSuccess, '');
          setPaymentMethodListData(response.result);
          setLoading({text: '', visible: false});
          navigation.navigate('PaymentGateWayWebView', {
            url: response?.result?.next,
          });
          openWSConnection(response?.result?.payment_id);
        } else {
          const responseMsg = response;
          console.log(responseMsg, 'responseMsg');
          setError({
            text:
              response?.message?.response?.data?.detail ||
              'Something went wrong! Please try again later.',
            visible: true,
          });
          Toast.show({
            type: 'error',
            text1:
              response?.message?.response?.data?.detail ||
              'Something went wrong! Please try again later.',
            position: 'top',
            visibilityTime: 5000,
          });
        }
      } catch (error) {
        console.log(error, 'errorresponse2');
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
    }
    // change plan online
    else {
      // if (parseFloat(finalAMount) < parseFloat(totalChangeAmount)) {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Total amount cannot less than required amount!',
      //   });
      //   return;
      // }
      // let body = {
      //   amount: parseFloat(renewCalculations?.amount),
      //   cgst: props?.customerCurrentPlan?.plan_cgst,
      //   sgst: props?.customerCurrentPlan?.plan_sgst,
      //   plan: props.data.id,
      //   radius_info: {},
      // };
      let body = {
        customer_id: props.customer.id,
        previous_service_plan: props?.customerCurrentPlan?.id,
        new_service_plan: props?.data?.id,
        radius_info: {},
        amount: parseFloat(
          renewCalculations?.amount ? renewCalculations?.amount : 0,
        ),
        ledger_amount: renewCalculations?.ledger_amount,
        balance: renewCalculations?.balance
          ? Number(renewCalculations?.balance)
          : 0,
        discount: discountamount ? discountamount : '0.00',
        discount_amount: renewCalculations.discount_amount
          ? renewCalculations.discount_amount
          : 0,
        wallet_amount: 0,
        use_wallet: false,
        plan: props?.data?.id,
      };
      if (
        props.customerCurrentPlan?.radius_info?.id ||
        renewCalculations.radius_info.id
      ) {
        body.radius_info.id = renewCalculations?.radius_info?.id
          ? renewCalculations.radius_info.id
          : props.customerCurrentPlan?.radius_info?.id;
        if (
          staticIp &&
          (poolData || props?.customerCurrentPlan?.radius_info?.ippool)
        ) {
          body.radius_info.static_ip_total_cost =
            renewCalculations?.radius_info?.static_ip_total_cost;
          body.radius_info.static_ip_cost =
            renewCalculations?.radius_info?.static_ip_cost;
          body.radius_info.static_ip_bind = ipData
            ? ipData
            : renewCalculations?.radius_info?.static_ip_bind;

          body.radius_info.ippool_id = poolData
            ? poolData
            : renewCalculations?.radius_info?.ippool_id;
          body.radius_info.static_ip_sgst =
            renewCalculations.radius_info.static_ip_sgst;
          body.radius_info.static_ip_cgst =
            renewCalculations.radius_info.static_ip_cgst;
        }
      }
      body.payment_gateway_id=selectedGatewayObj?.id;
      body.payment_gateway_type=selectedGatewayObj?.gateway_type;
      console.log('change body', body);
      try {
        const response = await makeOnlineChange(props.customer.id, body);
        if (response.isSuccess) {
          console.log(response.isSuccess, '');
          setPaymentMethodListData(response.result);
          setLoading({text: '', visible: false});
          navigation.navigate('PaymentGateWayWebView', {
            url: response.result.next,
          });
          openWSConnection(response.result.payment_id);
        } else {
          const responseMsg = response;
          console.log(responseMsg, 'responseMsg');
          setError({
            text:
              response?.message?.response?.data?.detail ||
              'Something went wrong! Please try again later.',
            visible: true,
          });
          Toast.show({
            type: 'error',
            text1:
              response?.message?.response?.data?.detail ||
              'Something went wrong! Please try again later.',
            position: 'top',
            visibilityTime: 5000,
          });
        }
      } catch (error) {
        console.log(error, 'errorresponse2');
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
    }
  };

  // websocket

  const openWSConnection = payment_id => {
    var client = new W3CWebSocket(
      `${apiConfig.REACT_APP_API_URL_BILLING}/ws/${payment_id}/listen/payment/status`,
    );
    client.onopen = () => {};
    client.onmessage = message => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.status === 1) {
        setTimeout(() => {
          // navigation.navigate('KYC_List');
          // navigation.navigate('Customer360Info');
          navigation.navigate('Customer360Info', {
            param1: 'update',
          });
        }, 5000);
      } else if (dataFromServer.status === 2) {
        setTimeout(() => {
          // navigation.navigate('KYC_List');
          // navigation.navigate('Customer360Info');
          navigation.navigate('Customer360Info', {
            param1: 'update',
          });
        }, 5000);
      } else {
        setTimeout(() => {
          // navigation.navigate('KYC_List');
          // navigation.navigate('Customer360Info');
          navigation.navigate('Customer360Info', {
            param1: 'update',
          });
        }, 5000);
      }
    };
    client.onclose = () => {};
  };

  const timeDate = new Date().toLocaleString(undefined, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  console.log('aad', timeDate);

  const getAssignToUsers = async () => {
    try {
      const response = await getAssignUsers();
      if (response.isSuccess) {
        if (response.result.assigned_to.length > 0) {
          setAssignedToData(response.result.assigned_to);
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
      setDropdownLoading(false);
    }
  };

  // ippool list
  const getIPPoolList = async () => {
    try {
      const response = await getIpPoolData(props.customerCurrentPlan.area);
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
        console.log(
          '🚀 ~ file: PlanDetailsBottomSheet.js:618 ~ getIPPoolList ~ response',
          response,
        );
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

  console.log('value', value);
  console.log('plan cost', props.data.total_plan_cost);

  console.log('toital', value * props?.data?.plan_cost);

  const getReaminingIP = async () => {
    try {
      const response = await getReaminingIPs(poolData);
      if (response.isSuccess) {
        if (response.result.available_ips.length > 0) {
          setIpList(response.result.available_ips);
          setValue(response?.result?.cost_per_ip);
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

  const getOfflinePaymentOptions = async () => {
    try {
      const response = await getPaymentOptions();
      if (response.isSuccess) {
        if (response.result.offline_payment_modes.length > 0) {
          const value = response.result.offline_payment_modes?.map(item =>
            item.name === 'Google pay' ? {...item, name: 'Google Pay'} : item,
          );
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
  const calculateFinalAmt = amount => {
    let final_amount = parseFloat(amount);
    let wallet_amount = parseFloat(walletInfo);
    if (walletAmtCheck) {
      let result;
      if (final_amount > wallet_amount) {
        result = final_amount - wallet_amount;
      } else if (wallet_amount > final_amount) {
        result = wallet_amount - final_amount;
      } else {
        result = wallet_amount - final_amount;
      }
      setAmount(result);
      return result;
    } else {
      return final_amount;
    }
  };

  const calculateFinalAmtOnl = amount => {
    let final_amount = parseFloat(amount);
  };

  const addMonthsToDate = (startDate, monthsToAdd) => {
    console.log(monthsToAdd, 'monthsToAdd');
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    console.log(date, 'date');
    let formattedDate = formatDateV3(date);
    // let formattedDate = format(new Date(date), 'dd MMM, yyyy hh:mm:ss 	aa');
    
    console.log(formattedDate.toString(), 'formattedDate');
    if(!dueDate){
      setDueDate(formattedDate.toString())
    }
    //return formattedDate.toString();
  };

  // Usage
  const funcToSetDueDate = timeUnit => {
    console.log(props?.data?.time_unit,"props?.data?.time_unit")
    const currentDate = new Date(); // Current date
    const monthsToAdd = timeUnit ? timeUnit : 1; // Number of months to add
    const futureDate = addMonthsToDate(currentDate, monthsToAdd);
    //     let dt = new Date();
    //     const due_date = dt.setMonth(dt.getMonth() + parseInt(timeUnit));
    // console.log(due_date,"due_date")
    // let dateValue = new Date(due_date).toLocaleString(undefined, {
    //   day: 'numeric',
    //   month: 'numeric',
    //   year: 'numeric',
    //   hour: '2-digit',
    //   minute: '2-digit',
    // });

    // format(dateValue);

    // return format(new Date(dateValue), 'dd MMM, yyyy hh:mm:ss 	aa');
    // today =
    //   today.getFullYear() +
    //   '-' +
    //   String(today.getMonth() + 1).padStart(2, '0') +
    //   '-' +
    //   String(today.getDate()).padStart(2, '0');
    // var bill_date = new Date(today);
    // if (unitType == 'day') {
    //   var due_date = format(
    //     new Date(bill_date.setDate(bill_date.getDate() + timeUnit)),
    //     'yyyy-MM-dd',
    //   );
    //   return due_date;
    // } else if (unitType == 'mon') {
    //   var due_date = format(
    //     new Date(bill_date.setMonth(bill_date.getMonth() + timeUnit)),
    //     'dd MMM, yyyy hh:mm:ss 	aa',
    //   );
    //   return due_date;
    // }
  };
  const profilePicclicked = () => {
    setCamerClick('receipt');
    profilePicRBSheet.current.open();
  };
  const onCameraClicked = async () => {
    await Camera.openCameraPanel(
      isCameraClick,
      imageResponse => {
        profilePicRBSheet.current.close();
        setReceipt('data:image/png;base64,' + imageResponse.imageData.data);
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
        setReceipt('data:image/png;base64,' + imageResponse.imageData.data);
      },
      error => {
        const errorresponse = error.ToString();
      },
    );
  };
  const setWalletOnchange = input => {
    console.log(
      parseInt(input) - renewCalculations?.amount,
      'parseFloat(parseInt(text)-renewCalculations?.amount)',
    );
    setCustomerPaid(Number(input));
  };
  useEffect(() => {
    console.log(
      (customer_paid - renewCalculations?.amount).toString(),
      'customer_paid',
    );
    if (customer_paid > renewCalculations?.amount) {
      let amount = (customer_paid - renewCalculations?.amount).toString();
      console.log(amount, 'amount changed');
      setWalletAmount(amount);
    } else {
      setWalletAmount('');
    }
  }, [customer_paid]);
  console.log(
    'agvsdfh',
    props.customerCurrentPlan?.radius_info?.static_ip_total_cost,
  );
  console.log(walletAmount, 'wallet changed');

  const onChangeDicountPercentage = (percentage) => {
    if(!(/^\d*\.?\d{0,2}$/.test(percentage))) {
      return;
    }
    setDiscountAmount(percentage);
    const value = parseFloat(percentage);
    if (value <= 100) {
      setDiscountPercentageError(false);
    } else {
      setDiscountPercentageError(true);
    }
  }

  return (
    <SafeAreaView>
      <View>
        <RBSheet
          ref={props.sheetRef}
          closeOnDragDown={false}
          closeOnPressMask={false}
          height={500}
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity onPress={() => props.onClose()}>
                <Ionicons
                  name={'ios-close'}
                  size={33}
                  color={'#DC631F'}
                  style={{padding: 5, alignSelf: 'center'}}
                />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={{padding: 20}}>
                <View style={{flexDirection: 'column'}}>
                  <PlanDetailsPopup
                    showPopupData
                    title={'Plan Name'}
                    value={
                      props.isAllPlan
                        ? props.data.package_name
                        : props.data.plan_name
                    }
                  />
                  {paymentType == 'renew' ? (
                    <PlanDetailsPopup
                      showPopupData
                      title={'Plan Cost'}
                      value={
                        props.isAllPlan
                          ? parseFloat(props.data.total_plan_cost)
                          : parseFloat(props.data.plan_cost)
                      }
                    />
                  ) : (
                    <PlanDetailsPopup
                      showPopupData
                      title={'Plan Cost'}
                      value={
                        props.isAllPlan
                          ? parseFloat(props.data.total_plan_cost)
                          : parseFloat(props.data.plan_cost)
                      }
                    />
                  )}

                  {/* <PlanDetailsPopup
                    showPopupData
                    title={'Plan Cost'}
                    value={
                      props.isAllPlan
                        ? parseFloat(props.data.total_plan_cost)
                        : parseFloat(props.data.plan_cost)
                    }
                  /> */}
                  {paymentType == 'renew' ? (
                    <PlanDetailsPopup
                      showPopupData
                      title={'Download Speed'}
                      value={props.data.download_speed + ' ' + 'MB'}
                    />
                  ) : (
                    <PlanDetailsPopup
                      showPopupData
                      title={'Download Speed'}
                      value={props.data.time_unit + ' ' + 'MB'}
                    />
                  )}
                  {paymentType == 'renew' ? (
                    <PlanDetailsPopup
                      showPopupData
                      title={'Upload Speed'}
                      value={props.data.upload_speed + ' ' + 'MB'}
                    />
                  ) : (
                    <PlanDetailsPopup
                      showPopupData
                      title={'Upload Speed'}
                      value={props.data.time_unit + ' ' + 'MB'}
                    />
                  )}

                  <PlanDetailsPopup
                    showPopupData
                    title={'Validity'}
                    value={
                      props.isAllPlan
                        ? props?.data?.time_unit +
                          ' ' +
                          props.data.unit_type +
                          '(s)'
                        : props?.data?.plan_time_unit +
                          ' ' +
                          props.data.plan_unit_type +
                          '(s)'
                    }
                  />
                  {/* <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginLeft: -10,
                }}>
                <Checkbox
                  color={Colors.black}
                  status={tempRenewal ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setTempRenewal(!tempRenewal);
                  }}
                />
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 14,
                    fontFamily: 'Titillium-Semibold',
                    marginTop: 7,
                  }}>
                  {'Temporary Renewal'}
                </Text>
              </View> */}
                  {/* {!tempRenewal && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 14,
                        marginTop: 5,
                        marginRight: 7,
                      }}>
                      Payment Mode
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 14,
                        marginTop: 4,
                        marginRight: 10,
                      }}>
                      :
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <RadioButton
                      value="online"
                      status={checked === 'online' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked('online');
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 14,
                        marginRight: 10,
                        marginTop: 5,
                      }}>
                      Online
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <RadioButton
                      value="offline"
                      status={checked === 'offline' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked('offline');
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 14,
                        marginRight: 10,
                        marginTop: 5,
                      }}>
                      Offline
                    </Text>
                  </View>
                </View>
              )} */}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 14,
                          marginTop: 5,
                          marginRight: 7,
                        }}>
                        Payment Mode
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 14,
                          marginTop: 4,
                          marginRight: 10,
                        }}>
                        :
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <RadioButton
                        value="online"
                        status={checked === 'online' ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setChecked('online');
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 14,
                          marginRight: 10,
                          marginTop: 5,
                        }}>
                        Online
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <RadioButton
                        value="offline"
                        status={checked === 'offline' ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setChecked('offline');
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 14,
                          marginRight: 10,
                          marginTop: 5,
                        }}>
                        Offline
                      </Text>
                    </View>
                  </View>

                  <View style={{flex: 1}}>
                    {checked === 'offline' && (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                          marginLeft: -10,
                        }}>
                        <Checkbox
                          color={Colors.black}
                          status={walletAmtCheck ? 'checked' : 'unchecked'}
                          onPress={() => {
                            setWalletAmtCheck(!walletAmtCheck);
                          }}
                        />
                        <Text
                          style={{
                            color: Colors.black,
                            fontSize: 14,
                            fontFamily: 'Titillium-Semibold',
                            marginTop: 7,
                          }}>
                          {'Wallet Amount: ' + `₹${walletInfo.toString()}`}
                        </Text>
                      </View>
                    )}

                    <FormFieldInput
                      title={'Collected By *'}
                      formKey={'paid_to'}
                      isMandatory={false}
                      showInputField
                      isEnabled={false}
                      length={20}
                      value={props.userInfo?.username}
                    />
                    <FormFieldInput
                      title={'Plan Cost *'}
                      formKey={'paid_amt'}
                      isMandatory={true}
                      showInputField
                      isEnabled={false}
                      length={20}
                      value={
                        paymentType == 'renew'
                          ? parseFloat(props.data.plan_cost).toFixed(2)
                          : paymentType == 'upgrade'
                          ? parseFloat(showPlanCost ? showPlanCost : 0).toFixed(
                              2,
                            )
                          : parseFloat(props?.data?.total_plan_cost).toFixed(2)
                      }
                    />
                    <FormFieldInput
                      title={'Final Amount To Be Paid *'}
                      formKey={'paid_amt'}
                      isMandatory={true}
                      showInputField
                      isEnabled={false}
                      length={20}
                      value={
                        paymentType == 'renew'
                          ? parseFloat(renewCalculations?.amount).toFixed(2)
                          : paymentType == 'change'
                          ? parseFloat(renewCalculations?.amount).toFixed(2)
                          : parseFloat(renewCalculations?.amount).toFixed(2)
                      }
                    />
                    {checked === 'offline' ? (
                      <>
                        <View>
                          <Text style={{marginLeft: 15}}>Customer Paid</Text>

                          <TextInput
                            // label={'Final Amount to be Paid *'}
                            formKey={'final_amt'}
                            keyboardType="number-pad"
                            isMandatory={true}
                            showInputField
                            isEnabled={false}
                            length={20}
                            mode="outlined"
                            // underlineColorAndroid="transparent"
                            multiline={false}
                            placeholder={'Customer Paid '}
                            value={customer_paid}
                            onChangeText={text => {
                              setWalletOnchange(text);
                            }}
                            style={{
                              fontSize: 15,
                              fontFamily: 'Titillium-Semibold',
                              fontWeight: 'normal',
                              backgroundColor: Colors.white,
                              paddingBottom: 0,
                              width: '90%',
                              marginLeft: 15,
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
                          {!(
                            parseInt(renewCalculations?.amount) <=
                            parseInt(customer_paid)
                          ) && (
                            <View>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: 'Titillium-Semibold',
                                  fontWeight: 'normal',
                                  backgroundColor: Colors.white,
                                  paddingBottom: 0,
                                  width: '90%',
                                  marginLeft: 15,
                                  color: 'red',
                                }}>
                                Customer paid amount should be greater than
                                final amount to be paid
                              </Text>
                            </View>
                          )}
                        </View>
                        <FormFieldInput
                          title={'Wallet Amount'}
                          formKey={'paid_amt'}
                          isMandatory={true}
                          showInputField
                          isEnabled={false}
                          length={20}
                          value={
                            walletAmount ? Number(walletAmount).toFixed(2) : 0
                          }
                        />
                        {/* <View>
                        <Text style={{marginLeft: 15}}>Wallet Amount</Text>

                        <TextInput
                          // label={'Final Amount to be Paid *'}
                          formKey={'final_amt'}
                          isMandatory={true}
                          showInputField
                          isEnabled={false}
                          length={20}
                          mode="outlined"
                          // underlineColorAndroid="transparent"
                          multiline={false}
                          placeholder={'Wallet Amount'}
                          value={walletAmount}
                          // onChangeText={text => {
                          //   setWalletAmount(text);
                          //   checkWalletAmtInput(text);
                          // }}
                          style={{
                            fontSize: 15,
                            fontFamily: 'Titillium-Semibold',
                            fontWeight: 'normal',
                            backgroundColor: Colors.white,
                            paddingBottom: 0,
                            width: '90%',
                            marginLeft: 15,
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
                      </View> */}
                      </>
                    ) : (
                      <Text></Text>
                    )}

                    {/* <Text style={{marginLeft: 15}}>
                      Final Amount To Be Paid *
                    </Text>
                    {paymentType == 'renew' ? (
                      <TextInput
                        // label={'Final Amount to be Paid *'}
                        formKey={'final_amt'}
                        isMandatory={true}
                        showInputField
                        isEnabled={true}
                        length={20}
                        mode="outlined"
                        // underlineColorAndroid="transparent"
                        multiline={false}
                        placeholder={
                          walletAmtCheck
                            ? calculateFinalAmt(props.data.plan_cost).toFixed(2)
                            : (
                                parseFloat(totalAmount) +
                                parseFloat(extraAmountRenew)
                              ).toFixed(2)
                        }
                        value={finalAMount}
                        onChangeText={text => setFinalAmount(text)}
                        style={{
                          fontSize: 15,
                          fontFamily: 'Titillium-Semibold',
                          fontWeight: 'normal',
                          backgroundColor: Colors.white,
                          paddingBottom: 0,
                          width: '90%',
                          marginLeft: 15,
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
                    ) : paymentType == 'upgrade' ? (
                      <TextInput
                        formKey={'final_amt'}
                        isMandatory={true}
                        showInputField
                        isEnabled={true}
                        length={20}
                        mode="outlined"
                        // underlineColorAndroid="transparent"
                        multiline={false}
                        placeholder={parseFloat(showTotalUpgrade).toFixed(2)}
                        value={finalAMount}
                        onChangeText={text => setFinalAmount(text)}
                        style={{
                          fontSize: 15,
                          fontFamily: 'Titillium-Semibold',
                          fontWeight: 'normal',
                          backgroundColor: Colors.white,
                          paddingBottom: 0,
                          width: '90%',
                          marginLeft: 15,
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
                    ) : (
                      <TextInput
                        formKey={'final_amt'}
                        isMandatory={true}
                        showInputField
                        isEnabled={true}
                        length={20}
                        mode="outlined"
                        underlineColorAndroid="transparent"
                        multiline={false}
                        placeholder={parseFloat(totalChangeAmount).toFixed(2)}
                        value={finalAMount}
                        onChangeText={text => setFinalAmount(text)}
                        style={{
                          fontSize: 15,
                          fontFamily: 'Titillium-Semibold',
                          fontWeight: 'normal',
                          backgroundColor: Colors.white,
                          paddingBottom: 0,
                          width: '90%',
                          marginLeft: 15,
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
                    )} */}
                    <FormFieldInput
                      title={'Start Date'}
                      showInputField
                      isEnabled={false}
                      value={format(new Date(), 'dd MMM, yyyy hh:mm:ss 	aa')}
                    />

                    {paymentType === 'renew' ? (
                      <FormFieldInput
                        title={'Due Date'}
                        showInputField
                        isEnabled={false}
                        value={formatDateV3(props?.data?.plan_end_date)}
                      />
                    ) : (
                      <FormFieldInput
                        title={'Due Date'}
                        showInputField
                        isEnabled={false}
                        value={dueDate}
                      />
                    )}
                    <FormFieldInput
                      title={'Last Renew Date'}
                      // formKey={'mobile'}
                      // isMandatory={true}
                      showInputField
                      isEnabled={false}
                      value={
                        props?.customer?.monthly_date
                          ? formatDateV3(props?.customer?.monthly_date)
                          : 'Not found'
                      }
                    />
                    {/* static ip */}
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        marginLeft: -10,
                      }}>
                      <Checkbox
                        color={Colors.black}
                        status={staticIp ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setStaticIP(!staticIp);
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
                    {checked === 'online' && ( <PaymentGatewayOptions  paymentGateways={paymentGateways} selectedGateway={selectedGateway} handleGatewayClick={handleGatewayClick}/>)}

                    {checked === 'offline' && (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                          marginLeft: -10,
                        }}>
                        <Checkbox
                          color={Colors.black}
                          status={discountCheck ? 'checked' : 'unchecked'}
                          onPress={() => {
                            setDiscountCheck(!discountCheck);
                          }}
                        />
                        <Text
                          style={{
                            color: Colors.black,
                            fontSize: 14,
                            fontFamily: 'Titillium-Semibold',
                            marginTop: 7,
                          }}>
                          {'Discount'}
                        </Text>
                      </View>
                    )}
                    {discountCheck && (
                      <View style={{margin: 8, marginHorizontal: 15}}>
                        <TextInput
                          mode="outlined"
                          label={'Discount in % '}
                          value={discountamount?.toString()}
                          placeholderStyle={{fontSize: 20}}
                          underlineColorAndroid="transparent"
                          keyboardType="numeric"
                          style={{
                            fontSize: 15,
                            fontFamily: 'Titillium-Semibold',
                            fontWeight: 'normal',
                            backgroundColor: Colors.white,
                            paddingBottom: 0,
                          }}
                          onChangeText={text => onChangeDicountPercentage(text)}
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
                        {discountPercentageError && (
                            <View>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: 'Titillium-Semibold',
                                  fontWeight: 'normal',
                                  backgroundColor: Colors.white,
                                  paddingBottom: 0,
                                  width: '90%',
                                  marginLeft: 15,
                                  color: 'red',
                                }}>
                                  Percentage can't be bigger than 100%
                              </Text>
                            </View>
                          )}
                      </View>
                    )}
                    {staticIp && (
                      <View>
                        {!props.customerCurrentPlan?.static_ip_bind && (
                          <>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
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
                                    setPoolData(item?.id);
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
                                    setValuess(2);
                                    setIsFocus(false);
                                    {
                                      paymentType == 'renew'
                                        ? setStaticCost(
                                            (value *
                                            props.customerCurrentPlan
                                              ?.plan_time_unit
                                              ? value *
                                                props.customerCurrentPlan
                                                  ?.plan_time_unit
                                              : 0
                                            ).toString(),
                                          )
                                        : setStaticCost(
                                            (value * props?.data?.time_unit
                                              ? value * props?.data?.time_unit
                                              : 0
                                            ).toString(),
                                          );
                                    }
                                  }}
                                />
                              </View>
                            </View>
                            <TextInput
                              mode="outlined"
                              label={'Static IP Cost '}
                              value={
                                renewCalculations?.radius_info?.static_ip_total_cost.toString()
                                  ? renewCalculations?.radius_info?.static_ip_total_cost.toString()
                                  : 0
                              }
                              returnKeyType="next"
                              autoCapitalize="none"
                              keyboardType="numeric"
                              placeholderStyle={{fontSize: 20}}
                              underlineColorAndroid="transparent"
                              disabled
                              style={{
                                marginTop: 15,
                                fontSize: 15,
                                marginLeft: 15,
                                width: '92%',
                                fontFamily: 'Titillium-Semibold',
                                fontWeight: 'normal',
                                paddingBottom: 0,
                                backgroundColor: '#FAFAFA',
                              }}
                              // onChangeText={text => setStaticCost(text)}
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
                          </>
                        )}

                        {props.customerCurrentPlan?.static_ip_bind && (
                          <View style={{flex: 2, flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                              <FormFieldInput
                                title={'Static IP'}
                                formKey={'static_ip_bind'}
                                isMandatory={false}
                                showInputField
                                isEnabled={false}
                                length={20}
                                value={
                                  props.customerCurrentPlan?.static_ip_bind
                                }
                              />
                            </View>

                            <View style={{flex: 1}}>
                              <FormFieldInput
                                title={'Static IP Cost'}
                                formKey={'static_ip_cost'}
                                isMandatory={false}
                                showInputField
                                isEnabled={false}
                                length={20}
                                value={renewCalculations?.radius_info?.static_ip_total_cost.toString()}
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                    {checked === 'offline' && (
                      <View style={{flexDirection: 'row', marginTop: 10}}>
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
                              setPaymentMethod(item?.id);
                              setIsFocus(false);
                            }}
                          />
                        </View>
                      </View>
                    )}
                    {paymentMethod === 'Bank_transfer' &&
                      checked === 'offline' && (
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          <View
                            style={{
                              flex: 0.97,
                              flexDirection: 'column',
                              marginLeft: 10,
                            }}>
                            <TextInput
                              mode="outlined"
                              label={'Bank Reference No.'}
                              value={bankref}
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
                              onChangeText={text => setBankRef(text)}
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

                    {paymentMethod === 'CHEK' && checked === 'offline' && (
                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View
                          style={{
                            flex: 0.97,
                            flexDirection: 'column',
                            marginLeft: 10,
                          }}>
                          <TextInput
                            mode="outlined"
                            label={'Cheque No.'}
                            value={chequeno}
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
                            onChangeText={text => setChequeno(text)}
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
                    {paymentMethod === 'GPAY' && checked === 'offline' && (
                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View
                          style={{
                            flex: 0.97,
                            flexDirection: 'column',
                            marginLeft: 10,
                          }}>
                          <TextInput
                            mode="outlined"
                            label={'UTR No.'}
                            value={urtref}
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
                            onChangeText={text => setUrtref(text)}
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
                    {paymentMethod === 'PHNPE' && checked === 'offline' && (
                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View
                          style={{
                            flex: 0.97,
                            flexDirection: 'column',
                            marginLeft: 10,
                          }}>
                          <TextInput
                            mode="outlined"
                            label={'UTR No.'}
                            value={urtref}
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
                            onChangeText={text => setUrtref(text)}
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
                    {paymentMethod === 'NEFT' && checked === 'offline' && (
                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View
                          style={{
                            flex: 0.97,
                            flexDirection: 'column',
                            marginLeft: 10,
                          }}>
                          <TextInput
                            mode="outlined"
                            label={'Transaction No.'}
                            value={transactionNo}
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
                            onChangeText={text => setTansactionNO(text)}
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
                    {checked === 'offline' && (
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
                                source={require('../../../../../../../assets/images/docicon1.png')}></Image>
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
                          onPress={profilePicclicked}
                          style={{
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '50%',
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
                      onPress={() => props.onClose()}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 16,
                          textAlign: 'center',
                        }}>
                        Close
                      </Text>
                    </TouchableOpacity>
                    {checked === 'offline' ? (
                      <TouchableOpacity
                        disabled={
                          !(
                            parseInt(renewCalculations?.amount) <=
                            parseInt(customer_paid)
                          ) || (discountPercentageError)
                        }
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          backgroundColor: '#DC631F',
                          borderRadius: 10,
                          padding: 10,
                          borderColor: '#DC631F',
                          borderWidth: 1,
                        }}
                        onPress={() => {
                          // checkBalance();
                          callRenew();
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#ffffff',
                            fontSize: 16,
                            textAlign: 'center',
                          }}>
                          {paymentType == 'renew'
                            ? 'Renew'
                            : paymentType == 'change'
                            ? 'Change Plan'
                            : 'Upgrade Plan'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                     
                      <TouchableOpacity
                        disabled={!amountAllowed}
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          backgroundColor: '#DC631F',
                          borderRadius: 10,
                          padding: 10,
                          borderColor: '#DC631F',
                          borderWidth: 1,
                        }}
                        onPress={() => {
                          // checkBalance();
                          callRenew();
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#ffffff',
                            fontSize: 16,
                            textAlign: 'center',
                          }}>
                          {paymentType == 'renew'
                            ? 'Renew'
                            : paymentType == 'change'
                            ? 'Change Plan'
                            : 'Upgrade Plan'}
                        </Text>
                      </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          <DialogView
            showDecisionDialog
            visible={isDecisionVisible.visible}
            text="Are you sure want to renew?"
            onCancel={() => {
              setDecisionVisible({text: '', visible: false});
            }}
            textCancel={'No'}
            onConfirm={() => {
              checkBalance();
            }}
            textConfirm={'Yes'}></DialogView>

          <DialogView
            showDecisionDialog
            visible={isRenewRecent.visible}
            text={`Are you sure want to renew?${text ? text : ''}`}
            onCancel={() => {
              setRenewRecent({text: '', visible: false});
            }}
            textCancel={'No'}
            onConfirm={() => {
              checkBalance();
            }}
            textConfirm={'Yes'}></DialogView>
        </RBSheet>
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
                source={require('../../../../../../../assets/images/camera_icon.png')}
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
                source={require('../../../../../../../assets/images/gallery_icon1.png')}
                style={{width: 30, height: 30}}></Image>
              <Text style={[styles.textStyle_attachment, {marginLeft: 10}]}>
                {strings('KYC_Form.Gallery')}
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
        <PaymentMethodOptions
          paymentMethodRBSheet={paymentMethodRBSheet}
          paymentMethodListData={paymentMethodListData}
          isCurrentPlan={!props.isAllPlan}
          allPlanData={props.data}
        />
        <Spinner
          animation={'fade'}
          overlayColor={Colors.orange_295CBF}
          indicatorStyle={styles.loader}
          visible={isLoading.spinner}
          textContent={isLoading.spinnerText}
          textStyle={styles.spinnerTextStyle}
        />
        <DialogView
          showAlertDialog
          visible={isError.visible}
          text={isError.text}
          onConfirm={() => {
            setError({text: '', visible: false});
          }}
          textConfirm={'Okay'}></DialogView>
        <DialogView
          showLoadingDialog
          visible={loaders}
          text={'Loading...'}></DialogView>
      </View>
    </SafeAreaView>
  );
};

function mapStateToProps(state, props) {
  return {
    customerCurrentPlan: state.mainReducers.main.customerCurrentPlan,
    customer: state.mainReducers.main.customer,
    userInfo: state.mainReducers.main.userInfo,
  };
}

export default connect(mapStateToProps)(PlanDetailsBottomSheet);
