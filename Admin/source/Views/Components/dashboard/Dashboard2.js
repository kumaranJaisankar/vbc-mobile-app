import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native';
import {Colors} from '../../Common/Colors';
import Headerview from '../../Common/HeaderView1';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import config from '../../services/api/config';
import {formatCustomDateWithTime, formatDateV4} from '../../Common/utility';
import {
  getCustomerDasboardInfo,
  getPaymentDasboardInfo,
  getBranchDateWiseComplaintsData,
  getCustomerData,
  getAnalytics,
  getPaymentInfo,
  getNetworkInfo,
  getTicketsInfo,
  getTicketsInfoDash,
  getNASList,
  getOLTList,
  getExpToday,
  getExpiredToday,
  getActivationToday,
  getActivationYesterday,
  getExpiredYesterday,
  getExpiredNextDay,
  getTicketsInfoDashAll,
  getExpandPayment,
  expandUser,
  getLeadsAndRegistrationCount
} from '../../services/MainService';
import {connect} from 'react-redux';
import {
  BarChart,
  LineChart,
  PieChart,
  ProgressChart,
  StackedBarChart,
} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import {addWeeks, format} from 'date-fns';
import DialogView from '../../Common/DialogView';
import OLTList from '../AddNetwork/OLT/OLTList';
import {render} from 'react-dom';
import RBSheet from 'react-native-raw-bottom-sheet';
import NoData from '../../Common/NoData';
import KYC_ListCell from '../CustomerKYC/KYCList/KYC_ListCell';
import {bindActionCreators} from 'redux';
import {operations} from '../../../redux/Main';
import {Rect, Text as TextSVG, Svg} from 'react-native-svg';
import IdleTimeout from '../../Common/IdleTimeout';

const DashBoard = props => {
  const userType=props?.userInfo?.user_type;
  const windowHeight = Dimensions.get('window').height;
  const refRBSheet = useRef();
  const navigation = useNavigation();
  var [buttonPressed, setbuttonPressed] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isData, setData] = useState([]);
  const [isExpDate, setExpDate] = useState('');
  const [dashboardData, setDashboardData] = useState({});
  const [paymentData, setPaymentData] = useState('');
  const [leadData, setLeadData] = useState({});
  const [TicektsData, SetTicektsData] = useState({});
  const [formatted, setFormatted] = useState('');
  const permission = props.userInfo.permissions;

  const [customerInfo, setCustomerInfo] = useState({});
  const [analyticsInfo, setAnalyticsInfo] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});
  const [networkInfo, setNetworkInfo] = useState([]);
  const [extendsPayInfo, setExtendsPayInfo] = useState([]);
  const [extendsPayDtInfo, setExtendsPayDtInfo] = useState([]);
  const [networkInfoTotal, setNetworkInfoTotal] = useState({});
  const [isOLTData, setOLTData] = useState([]);
  const [isDataAvailable, setDataAvailable] = useState(true);
// console.log(networkInfo,"networkInfo")
  const [ticketInfo, setTicketInfo] = useState([]);
  const [ticketInfoTotal, setTicketInfoTotal] = useState({});

  const [todayPayments, setTodaypayments] = useState([]);
  const [yesterdayPayments, setYesterdaypayments] = useState([]);

  const [openT, setOpenT] = useState(0);
  const [assignT, setAssignT] = useState(0);
  const [inpT, setInpT] = useState(0);
  const [reslvT, setReslvT] = useState(0);
  const [cldT, setCldT] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dataList, setDataList] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [expands, setExpand] = useState(false);
  const [expUserLabel, setExpUserLabel] = useState([]);
  const [expUserCount, setExpUserCount] = useState(false);
  const [expUserCountValue, setExpUserCountValue] = useState([
    0, 0, 0, 0, 0, 0,
  ]);
  const [renewUserCount, setRenewUserCount] = useState([0, 0]);
  const [TotalUserCount, setTotalUserCount] = useState([0, 0]);
  const [leadRegistrationCount, setLeadRegistrationCount] = useState({
    lead_count: 0,
    new_registration_count: 0
  })

  const [expantUser, setExpandUser] = useState(false);
  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    await getTicketsData(!isEnabled);
  };

  const screenWidth = Dimensions.get('window').width;
  console.log(dataList, 'dataList');
  console.log(todayPayments, 'abc');

  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCustomerInfo();
      getAnlytics();
      getPaymentInfoData();
      getNetworkInfoData();
      getTicketsData(false);
      getOLTData();
      setIsEnabled(false);
      getLeadCount();
      // getTodayExpiringList();
    });
    return unsubscribe;
  }, [navigation]);

  const getOLTData = async () => {
    setLoading(true);
    try {
      const response = await getOLTList(10, 1);
      console.log(response);
      if (response.isSuccess) {
        setOLTData(response.result.results);
        setDataAvailable(true);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const getListOfCustomers = async (value, type) => {
    setDataList([]);
    setLoading(true);
    setPage(1);
    if (value === 'TACT') {
      var response = await getActivationToday(
        format(new Date(), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
        1,
      );
    } else if (value === 'TEXP') {
      var response = await getExpToday(
        format(new Date(), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
        10,
        1,
      );
    } else if (value === 'TEXPD') {
      var response = await getExpiredToday(
        format(new Date(), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
        10,
        1,
      );
    } else if (value === 'YACT') {
      var date = new Date();
      var end = date.setDate(date.getDate() - 1);
      var response = await getActivationYesterday(
        format(new Date(end), 'yyyy-MM-dd'),
        format(new Date(end), 'yyyy-MM-dd'),
        1,
      );
    } else if (value === 'YEXPD') {
      var date = new Date();
      var end = date.setDate(date.getDate() - 1);
      var response = await getExpiredYesterday(
        format(new Date(end), 'yyyy-MM-dd'),
        format(new Date(end), 'yyyy-MM-dd'),
        10,
        1,
      );
    } else if (type === 'NXTEXP') {
      if (value === 'NXT') {
        var date = new Date();
        var end = date.setDate(date.getDate() + 1);
      } else if (value === 'NXT1') {
        var date = new Date();
        var end = date.setDate(date.getDate() + 2);
      } else if (value === 'NXT2') {
        var date = new Date();
        var end = date.setDate(date.getDate() + 3);
      } else if (value === 'NXT3') {
        var date = new Date();
        var end = date.setDate(date.getDate() + 4);
      }
      var response = await getExpiredNextDay(
        format(new Date(end), 'yyyy-MM-dd'),
        format(new Date(end), 'yyyy-MM-dd'),
        10,
        1,
      );
      console.log(
        '🚀 ~ file: Dashboard2.js:210 ~ getListOfCustomers ~ response',
        response,
      );
    }
    if (response?.isSuccess) {
      setDataList(response?.result?.results);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  var act = customerInfo?.act ? customerInfo?.act : 0;
  var exp = customerInfo?.exp ? customerInfo?.exp : 0;

  var actt = act / (act + exp) ? act / (act + exp) : 0;
  var inact = exp / (act + exp) ? exp / (act + exp) : 0;

  const data = {
    labels: ['active', 'expired', ,], // optional
    data: [actt, inact],
    colors: ['#4A79E5', '#A6A6A6'],
  };

  const bardata = {
    labels: [
      `NAS(${networkInfo ? (networkInfo[0] ? networkInfo[0] : 0) : 0})`,
      `OLT(${networkInfo ? (networkInfo[1] ? networkInfo[1] : 0) : 0})`,
      `PDP(${networkInfo ? (networkInfo[2] ? networkInfo[2] : 0) : 0})`,
      `CDP(${networkInfo ? (networkInfo[3] ? networkInfo[3] : 0) : 0})`,
      `CPE(${networkInfo ? (networkInfo[4] ? networkInfo[4] : 0) : 0})`,
    ],
    datasets: [
      {
        data: networkInfo ? networkInfo : [],
      },
    ],
  };

  const bardata1 = {
    labels: extendsPayDtInfo,
    datasets: [
      {
        data: extendsPayInfo ? extendsPayInfo : [],
      },
    ],
  };

  const bardata2 = {
    labels: [
      `Open(${ticketInfo ? (openT ? openT : 0) : 0})`,
      `Assigned(${ticketInfo ? (assignT ? assignT : 0) : 0})`,
      `In Progress(${ticketInfo ? (inpT ? inpT : 0) : 0})`,
      `Resolved(${ticketInfo ? (reslvT ? reslvT : 0) : 0})`,
      `Closed(${ticketInfo ? (cldT ? cldT : 0) : 0})`,
    ],
    datasets: [
      {
        data: ticketInfo
          ? [
              openT ? openT : 0,
              assignT ? assignT : 0,
              inpT ? inpT : 0,
              reslvT ? reslvT : 0,
              cldT ? cldT : 0,
            ]
          : [],
      },
    ],
  };
  const leadsandReg = {
    labels: ['Leads', 'New Registrations'],
    datasets: [
      {
        data: [leadRegistrationCount.lead_count, leadRegistrationCount.new_registration_count],
      },
    ],
  };
  const checkEnvironment = () => {
    let environment = '';
    if (config.serverUrl == 'https://admin.sparkradius.in') {
      environment = 'prod';
    } else if (config.serverUrl == 'https://qa.sparkradius.in') {
      environment = 'qa';
    } else {
      environment = 'dev';
    }
    return environment;
  };
  // customer
  const getCustomerDashboardData = async () => {
    try {
      const response = await getCustomerDasboardInfo();
      if (response.isSuccess) {
        setDashboardData(response.result);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorresponse = error.toString();
    }
  };

  // payment
  const getPaymentDashboardData = async () => {
    try {
      const response = await getPaymentDasboardInfo();
      if (response.isSuccess) {
        const formattedNumber = parseInt(
          response?.result?.total_payments,
        ).toLocaleString('en-US', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        setPaymentData(formattedNumber);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorresponse = error.toString();
    }
  };

  // ticekts
  const getHelpdeskDashboardData = async () => {
    try {
      const response = await getBranchDateWiseComplaintsData();
      if (response.isSuccess) {
        SetTicektsData(response.result);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorresponse = error.toString();
    }
  };

  const getCustomerInfo = async () => {
    setLoading(true);
    const response = await getCustomerData();
    console.log(
      '🚀 ~ file: Dashboard2.js:234 ~ getCustomerInfo ~ response',
      response,
    );
    if (response?.isSuccess) {
      setLoading(false);
      setCustomerInfo(response?.result?.context);
    } else {
      setLoading(false);
    }
  };

  const getAnlytics = async () => {
    setLoading(true);
    const response = await getAnalytics();
    console.log(
      '🚀 ~ file: Dashboard2.js:249 ~ getAnlytics ~ response',
      response,
    );
    if (response?.isSuccess) {
      setLoading(false);
      setTodaypayments(response?.result?.today_payments);
      setYesterdaypayments(response?.result?.yesterday_payments);
      setAnalyticsInfo(response?.result);
    } else {
      setLoading(false);
    }
  };

  const getPaymentInfoData = async () => {
    var date = new Date();
    var end = date.setDate(date.getDate() + 1);
    setLoading(true);
    const response = await getPaymentInfo(
      format(new Date(), 'yyyy-MM-dd'),
      format(new Date(end), 'yyyy-MM-dd'),
    );
    console.log(
      '🚀 ~ file: Dashboard2.js:408 ~ getPaymentInfoData ~ response:',
      response,
    );

    if (response.isSuccess) {
      setLoading(false);
      setPaymentInfo(response?.result);
    } else {
      setLoading(false);
    }
  };

  const getNetworkInfoData = async () => {
    let body = {
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(new Date(new Date().getTime() + 86400000), 'yyyy-MM-dd'),
    };
    setLoading(true);
    const response = await getNetworkInfo(body);
    if (response.isSuccess) {
      setLoading(false);
      setNetworkInfoTotal(response?.result);
      console.log(response?.result,"response?.result")
      let propertyValues = Object.values(response?.result);
      console.log(propertyValues,"propertyValues")
      let popped = propertyValues.pop();
      setNetworkInfo(propertyValues);
    } else {
      setLoading(false);
    }
  };

  const getTicketsData = async value => {
    console.log('isEnabled', value);
    var date = new Date();
    var end = date.setDate(date.getDate() + 1);
    setLoading(true);
    if (value) {
      console.log('hello');
      var response = await getTicketsInfoDashAll();
    } else {
      console.log('hi');
      var response = await getTicketsInfoDash(
        format(new Date(), 'yyyy-MM-dd'),
        format(new Date(end), 'yyyy-MM-dd'),
      );
    }

    console.log(
      '🚀 ~ file: Dashboard2.js:218 ~ getTicketsData ~ response',
      response,
    );
    if (response.isSuccess) {
      setLoading(false);
      setTicketInfoTotal(response?.result?.context);
      let propertyValues = Object.values(response?.result?.context);

      setTicketInfo(propertyValues);
      let labelValue = [response?.result.context];
      labelValue?.map(val => {
        setOpenT(val?.opn);
        setAssignT(val?.asn);
        setReslvT(val?.rsl);
        setCldT(val?.cld);
        setInpT(val?.inp);
      });
    } else {
      setLoading(false);
    }
  };

  const expandPayments = async value => {
    if (value === 'expand') {
      setExpand(true);
      const res = await getExpandPayment(format(new Date(), 'yyyy-MM-dd'));
      if (res?.isSuccess) {
        let amountPay = res?.result?.parent_amount?.map(function (obj) {
          // if (obj.amount >= 1000000) {
          //   return (obj.amount / 1000000).toFixed(1) + 'm';
          // } else if (obj.amount >= 1000) {
          //   return (obj.amount / 1000).toFixed(1) + 'k';
          // } else {
          //   return obj.amount.toString();
          // }
          return obj.amount.toString();
        });
        let datePay = res?.result?.parent_amount?.map(function (obj) {
          return format(new Date(obj?.date), 'dd-MM');
        });
        if (amountPay) {
          console.log('amountpay', amountPay);
          setExtendsPayInfo(amountPay);
          setExtendsPayDtInfo(datePay);
        }
      }
    } else if (value === 'close') {
      setExpand(false);
    }
  };

  const getExpandUser = async value => {
    if (value === 'expand') {
      setExpUserCount(true);
      const res = await expandUser(format(new Date(), 'yyyy-M-dd'));
      console.log('userres', res);
      if (res?.isSuccess) {
        let names = res?.result?.renewal_users?.map(function (obj) {
          return format(new Date(obj?.renewal_date), 'dd/MM');
        });
        let expiredUser = res?.result?.expiried_users?.map(function (obj) {
          return parseInt(obj.account_status__count);
        });
        let renewalUser = res?.result?.renewal_users?.map(function (obj) {
          return parseInt(obj.user_id__count);
        });
        let totalUser = res?.result?.total_users?.map(function (obj) {
          return parseInt(obj.user_id__count);
        });
        console.log(
          '🚀 ~ file: Dashboard2.js:492 ~ renewalUser ~ renewalUser',
          renewalUser,
        );
        // console.log('names', names);
        setRenewUserCount(renewalUser);
        setExpUserCountValue(expiredUser);
        setTotalUserCount(totalUser);
        // setExpUserLabel(names);
      }
    } else if (value === 'close') {
      setExpUserCount(false);
    }
  };
  useEffect(() => {
    getCustomerInfo();
  }, []);

  //Get lead and registration count to show in the dashboard
  const getLeadCount = async () => {
    console.log("get lead function is running")
    const createdDate = format(new Date(), 'yyyy-MM-dd');
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    endDate = format(endDate, 'yyyy-MM-dd');

    try {
      const response = await getLeadsAndRegistrationCount(endDate, createdDate);
      if (response.isSuccess) {
        // console.log("its the success", response.result);
        const lead_count = response.result.leads[0]?.count || 0
        const new_registration_count = response.result.registered_leads[0]?.count || 0;
        setLeadRegistrationCount({
          lead_count,
          new_registration_count
        })
        console.log("its the lead count and registration count", lead_count, new_registration_count);
      } else {
        console.log("its the error", response)
        const responseMsg = response;
      }
    } catch (error) {
      const errorresponse = error.toString();
      console.log("its the error catch", error);
    }
  }

  const yAxisInterval = Math.max(...bardata1.datasets[0].data) / 5;
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <IdleTimeout /> */}
      {/*   */}
      <View style={{flex: 1, backgroundColor: '#F4F6F9'}}>
        <Headerview
          username={userType}
          showDashboardHeader
          onMenuClick={() => {
            setModalVisible(true);
          }}
        />
        <View
          style={{
            flex: 1,
            marginTop: 5,
            padding: 20,
          }}>
          <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  shadowOffset: {width: -2, height: 4},
                  shadowColor: '#171717',
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  borderRadius: 8,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  width: '100%',
                  marginVertical: 10,
                }}>
                {/* {permission.find(code => code === 277) && ( */}
                <Text
                  onPress={() => navigation.navigate('KYC_List')}
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 16,
                  }}>
                  CUSTOMERS
                </Text>
                <View style={{flexDirection: 'row', width: '100%'}}>
                  <View style={{width: '52%'}}>
                    <View>
                      <View>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('KYC_List')}>
                          <Text style={{color: Colors.grey_888888}}>{customerInfo?.all}</Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <View>
                          <ProgressChart
                            data={data}
                            width={150}
                            height={100}
                            strokeWidth={7}
                            hasLegend={true}
                            hideLegend={true}
                            withCustomBarColorFromData={true}
                            radius={35}
                            fromZero={true}
                            chartConfig={{
                              backgroundGradientFromOpacity: 0.5,
                              backgroundGradientToOpacity: 1,
                              backgroundColor: 'white',
                              backgroundGradientFrom: 'white',
                              backgroundGradientTo: 'white',
                              decimalPlaces: 0,
                              color: (opacity = 1, _index) =>
                                `rgba(0,0,0,${opacity})`,
                            }}
                            style={{marginVertical: 8, borderRadius: 10}}
                          />
                          {/* <PieChart
                            doughnut={true}
                            data={data}
                            width={100}
                            height={100}
                            hasLegend={false}
                            chartConfig={{
                              backgroundColor: '#e26a00',
                              backgroundGradientFrom: '#fb8c00',
                              backgroundGradientTo: '#ffa726',
                              decimalPlaces: 0, // optional, defaults to 2dp
                              color: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                              labelColor: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                              style: {
                                borderRadius: 16,
                              },
                              propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: '#ffa726',
                              },
                            }}
                            accessor={'population'}
                            backgroundColor={'transparent'}
                            center={[25, 10]}
                          /> */}
                        </View>

                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'row'}}>
                            <FontAwesome
                              name={'circle'}
                              size={10}
                              color={'#4A79E5'}
                              style={{marginTop: 2}}
                            />
                            <Text style={{marginLeft: 7, fontSize: 10, color: Colors.grey_888888}}>
                              Active
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('KYC_List', {
                                  paramTxt: 'active',
                                })
                              }>
                              <Text style={{marginLeft: 3, fontSize: 10, color: Colors.grey_888888}}>
                                {customerInfo?.act}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row', marginLeft: 5}}>
                            <FontAwesome
                              name={'circle'}
                              size={10}
                              color={'#A6A6A6'}
                              style={{marginTop: 2}}
                            />
                            <Text style={{marginLeft: 7, fontSize: 10, color: Colors.grey_888888}}>
                              Expired
                            </Text>
                            <Text style={{marginLeft: 3, fontSize: 10, color: Colors.grey_888888}}>
                              {customerInfo?.exp}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <FontAwesome
                        name={'circle'}
                        size={13}
                        color={'#4A79E5'}
                        style={{marginTop: 4}}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text style={{marginLeft: 5, color: Colors.grey_888888}}>Active</Text>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('KYC_List', {
                              paramTxt: 'active',
                            })
                          }>
                          <Text style={{marginLeft: 70, color: Colors.grey_888888}}>
                            {customerInfo?.act}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <FontAwesome
                        name={'circle'}
                        size={13}
                        color={'#A6A6A6'}
                        style={{marginTop: 4}}
                      />
                      <Text style={{marginLeft: 5, color: Colors.grey_888888}}>Expired</Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('KYC_List', {
                            paramTxt: 'expiry',
                          })
                        }>
                        <Text style={{marginLeft: 62, color: Colors.grey_888888}}>
                          {customerInfo?.exp}
                          {/* {customerInfo?.total_no_of_expired_customers} */}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <FontAwesome
                        name={'circle'}
                        size={13}
                        color={'#FCCD3A'}
                        style={{marginTop: 4}}
                      />
                      <Text style={{marginLeft: 5, color: Colors.grey_888888}}>Suspended</Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('KYC_List', {
                            paramTxt: 'suspend',
                          })
                        }>
                        <Text style={{marginLeft: 37, color: Colors.grey_888888}}>
                          {customerInfo?.spd}
                          {/* {customerInfo?.total_no_of_suspended_customers} */}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <FontAwesome
                        name={'circle'}
                        size={13}
                        color={'#FF8B7B'}
                        style={{marginTop: 4}}
                      />
                      <Text style={{marginLeft: 5, color: Colors.grey_888888}}>Provisioning</Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('KYC_List', {
                            paramTxt: 'prov',
                          })
                        }>
                        <Text style={{marginLeft: 30, color: Colors.grey_888888}}>
                          {customerInfo?.prov}
                          {/* {customerInfo?.total_no_of_provisioning_customers} */}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <FontAwesome
                        name={'circle'}
                        size={13}
                        color={'#FFE346'}
                        style={{marginTop: 4}}
                      />
                      <Text style={{marginLeft: 5, color: Colors.grey_888888}}>Hold</Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('KYC_List', {
                            paramTxt: 'hld',
                          })
                        }>
                        <Text style={{marginLeft: 78, color: Colors.grey_888888}}>
                          {customerInfo?.hld}
                          {/* {customerInfo?.total_no_of_customers_hold} */}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <FontAwesome
                        name={'circle'}
                        size={13}
                        color={'#C30420'}
                        style={{marginTop: 4}}
                      />
                      <Text style={{marginLeft: 5, color: Colors.grey_888888}}>Deactive</Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('KYC_List', {
                            paramTxt: 'dct',
                          })
                        }>
                        <Text style={{marginLeft: 53, color: Colors.grey_888888}}>
                          {customerInfo?.dct}
                          {/* {customerInfo?.total_no_of_customers_deactive} */}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {/* )} */}
              </View>
              {!expUserCount && (
                <View
                  style={{
                    marginTop: 20,
                    backgroundColor: '#FFFFFF',
                    shadowOffset: {width: -2, height: 4},
                    shadowColor: '#171717',
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    borderRadius: 8,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    width: '100%',
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 16,
                      }}>
                      TODAY
                    </Text>
                    {/* <TouchableOpacity>
                      <Ionicons
                        name={'trending-up-outline'}
                        size={20}
                        color={Colors.grey_888888}
                        style={{alignSelf: 'center'}}
                      />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() => {
                        getExpandUser('expand');
                      }}>
                      <Ionicons
                        name={'trending-up-outline'}
                        size={20}
                        color={Colors.grey_888888}
                        style={{alignSelf: 'center'}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      marginTop: 10,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          width: '30%',
                          padding: 5,
                          backgroundColor: '#EFF4FB',
                        }}>
                        <Text style={{color: Colors.black}}>Activations</Text>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('ExpiryList', {
                              paramTxt: 'TACT',
                            })
                          }
                          // onPress={() => {
                          //   refRBSheet.current.open();
                          //   getListOfCustomers('TACT');
                          // }}
                        >
                          <Text style={{color: Colors.black}}>{analyticsInfo?.today_activations}</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: '32%',
                          marginLeft: 15,
                          backgroundColor: '#EFF4FB',
                          padding: 5,
                        }}>
                        <Text style={{color: Colors.black}}>Expiry - Expired</Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 2,
                            justifyContent: 'space-around',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('ExpiryList', {
                                paramTxt: 'TEXP',
                              })
                            }
                            // onPress={() => {
                            //   refRBSheet.current.open();
                            //   getListOfCustomers('TEXP');
                            // }}
                          >
                            <Text style={{color: Colors.black}}>
                              {analyticsInfo?.today_expiry_of_active_customers}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('ExpiryList', {
                                paramTxt: 'TEXPD',
                              })
                            }
                            // onPress={() => {
                            //   refRBSheet.current.open();
                            //   getListOfCustomers('TEXPD');
                            // }}
                          >
                            <Text style={{color: Colors.black}}>
                              {analyticsInfo?.today_expiry_of_expired_customers}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          width: '30%',
                          marginLeft: 15,
                          backgroundColor: '#EFF4FB',
                          padding: 5,
                        }}>
                        <Text style={{color: Colors.black}}>Renewals</Text>
                        <Text style={{color: Colors.black}}>
                          {analyticsInfo?.today_renewal?.count
                            ? analyticsInfo?.today_renewal?.count
                            : 0}{' '}
                          /{' '}
                          <FontAwesome
                            name={'rupee'}
                            size={13}
                            color={Colors.black}
                            style={{padding: 5}}
                          />
                          {analyticsInfo?.today_renewal?.amount
                            ? parseInt(analyticsInfo?.today_renewal?.amount)
                            : 0}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View
                      style={{
                        width: '29%',
                        marginLeft: 2,
                        backgroundColor: '#EFF4FB',
                        marginTop: 15,
                        padding: 5,
                      }}>
                      <Text style={{color: Colors.black}}>Payments</Text>
                      {todayPayments?.map(val => {
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('BillingHistory', {
                                paramTxt: 'today',
                              })
                            }>
                            <Text style={{color: Colors.black}}>
                              {val?.count}
                              {'/'}
                              <FontAwesome
                                name={'rupee'}
                                size={13}
                                color={Colors.black}
                                style={{padding: 5}}
                              />
                              {parseInt(val?.amount ? val?.amount : 0.0)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      marginTop: 15,
                    }}>
                    YESTERDAY
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      marginTop: 10,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          width: '30%',
                          padding: 5,
                          backgroundColor: '#EFF4FB',
                        }}>
                        <Text style={{color: Colors.black}}>Activations</Text>
                        <TouchableOpacity
                          // onPress={() => {
                          //   refRBSheet.current.open();
                          //   getListOfCustomers('YACT');
                          // }}
                          onPress={() =>
                            navigation.navigate('ExpiryList', {
                              paramTxt: 'YACT',
                            })
                          }>
                          <Text style={{color: Colors.black}}>{analyticsInfo?.yesterday_activations}</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: '32%',
                          marginLeft: 15,
                          backgroundColor: '#EFF4FB',
                          padding: 5,
                        }}>
                        <Text style={{color: Colors.black}}>Expired</Text>
                        <TouchableOpacity
                          // onPress={() => {
                          //   refRBSheet.current.open();
                          //   getListOfCustomers('YEXPD');
                          // }}
                          onPress={() =>
                            navigation.navigate('ExpiryList', {
                              paramTxt: 'YEXPD',
                            })
                          }>
                          <Text style={{color: Colors.black}}>{analyticsInfo?.yesterday_expiry}</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: '30%',
                          marginLeft: 15,
                          backgroundColor: '#EFF4FB',
                          padding: 5,
                        }}>
                        <Text style={{color: Colors.black}}>Renewals</Text>
                        <Text style={{color: Colors.black}}>
                          {analyticsInfo?.yesterday_renewal?.yesterday_renwals
                            ? analyticsInfo?.yesterday_renewal
                                ?.yesterday_renwals
                            : 0}{' '}
                          /{' '}
                          <FontAwesome
                            name={'rupee'}
                            size={13}
                            color={Colors.black}
                            style={{padding: 5}}
                          />
                          {parseInt(
                            analyticsInfo?.yesterday_renewal?.amount
                              ? analyticsInfo?.yesterday_renewal?.amount
                              : '0',
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View
                      style={{
                        width: '29%',
                        marginLeft: 2,
                        backgroundColor: '#EFF4FB',
                        marginTop: 15,
                        padding: 5,
                      }}>
                      <Text style={{color: Colors.black}}>Payments</Text>
                      {yesterdayPayments?.map(val => {
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('BillingHistory', {
                                paramTxt: 'yesterday',
                              })
                            }>
                            <Text style={{color: Colors.black}}>
                              {val?.count}
                              {'/'}
                              <FontAwesome
                                name={'rupee'}
                                size={13}
                                color={Colors.black}
                                style={{padding: 5}}
                              />
                              {parseInt(val?.amount ? val?.amount : 0.0)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      marginTop: 15,
                    }}>
                    UPCOMING EXPIRY
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      marginTop: 10,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          width: '30%',
                          padding: 5,
                          backgroundColor: '#EFF4FB',
                        }}>
                        <Text style={{color: Colors.black}}>
                          {formatDateV4(
                            new Date(new Date().getTime() + 86400000),
                          )}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('ExpiryList', {
                              paramTxt: 'NXT',
                            })
                          }
                          // onPress={() => {
                          //   refRBSheet.current.open();
                          //   getListOfCustomers('NXT', 'NXTEXP');
                          // }}
                        >
                          <Text style={{color: Colors.black}}>
                            {analyticsInfo?.upcoming_user_expiry_tomorrow}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: '32%',
                          marginLeft: 15,
                          backgroundColor: '#EFF4FB',
                          padding: 5,
                        }}>
                        <Text style={{color: Colors.black}}>
                          {formatDateV4(
                            new Date(new Date().getTime() + 86400000 * 2),
                          )}
                        </Text>
                        <TouchableOpacity
                          // onPress={() => {
                          //   refRBSheet.current.open();
                          //   getListOfCustomers('NXT1', 'NXTEXP');
                          // }}
                          onPress={() =>
                            navigation.navigate('ExpiryList', {
                              paramTxt: 'NXT1',
                            })
                          }>
                          <Text style={{color: Colors.black}}>
                            {
                              analyticsInfo?.upcoming_user_expiry_day_after_tomorrow
                            }
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: '30%',
                          marginLeft: 15,
                          backgroundColor: '#EFF4FB',
                          padding: 5,
                        }}>
                        <Text style={{color: Colors.black}}>
                          {formatDateV4(
                            new Date(new Date().getTime() + 86400000 * 3),
                          )}
                        </Text>
                        <TouchableOpacity
                          // onPress={() => {
                          //   refRBSheet.current.open();
                          //   getListOfCustomers('NXT2', 'NXTEXP');
                          // }}
                          onPress={() =>
                            navigation.navigate('ExpiryList', {
                              paramTxt: 'NXT2',
                            })
                          }>
                          <Text style={{color: Colors.black}}>
                            {analyticsInfo?.upcoming_user_expiry_next2days}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View
                      style={{
                        width: '29%',
                        marginLeft: 2,
                        backgroundColor: '#EFF4FB',
                        marginTop: 15,
                        padding: 5,
                      }}>
                      <Text style={{color: Colors.black}}>
                        {formatDateV4(
                          new Date(new Date().getTime() + 86400000 * 4),
                        )}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ExpiryList', {
                            paramTxt: 'NXT3',
                          })
                        }
                        // onPress={() => {
                        //   refRBSheet.current.open();
                        //   getListOfCustomers('NXT3', 'NXTEXP');
                        // }}
                      >
                        <Text style={{color: Colors.black}}>
                          {analyticsInfo?.upcoming_user_expiry_next3days}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* )} */}
                </View>
              )}

              {expUserCount && (
                <View
                  style={{
                    marginTop: 20,
                    backgroundColor: '#FFFFFF',
                    shadowOffset: {width: -2, height: 4},
                    shadowColor: '#171717',
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    borderRadius: 8,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    width: '100%',
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 16,
                      }}>
                      LAST & NEXT WEEK EXPIRY USERS
                    </Text>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          getExpandUser('close');
                        }}>
                        <Ionicons
                          name={'close-outline'}
                          size={20}
                          color={Colors.grey_888888}
                          style={{alignSelf: 'center'}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', width: '100%'}}>
                    <View style={{width: '100%'}}>
                      <View>
                        <View>
                          <View style={{marginTop: 10}}>
                            <ScrollView horizontal={true}>
                              <LineChart
                                data={{
                                  // labels: [
                                  //   'January',
                                  //   'February',
                                  //   'March',
                                  //   'April',
                                  // ],
                                  datasets: [
                                    {
                                      data: renewUserCount,
                                      color: (opacity = 1) =>
                                        `rgba(1, 218, 181, ${opacity})`, // optional
                                    },
                                    {
                                      data: TotalUserCount,
                                      color: (opacity = 1) =>
                                        `rgba(0, 0, 0, ${opacity})`, // optional
                                    },
                                  ],
                                }}
                                width={Dimensions.get('window').width - 16} // from react-native
                                height={220}
                                chartConfig={{
                                  backgroundColor: '#1cc910',
                                  backgroundGradientFrom: '#eff3ff',
                                  backgroundGradientTo: '#efefef',
                                  decimalPlaces: 2, // optional, defaults to 2dp
                                  color: (opacity = 255) =>
                                    `rgba(0, 0, 0, ${opacity})`,
                                  style: {
                                    borderRadius: 16,
                                  },
                                }}
                                // bezier
                                style={{
                                  marginVertical: 8,
                                  borderRadius: 16,
                                }}
                                decorator={() => {
                                  return tooltipPos.visible ? (
                                    <View>
                                      <Svg>
                                        <Rect
                                          x={tooltipPos.x - 15}
                                          y={tooltipPos.y + 10}
                                          width="40"
                                          height="30"
                                          fill="black"
                                        />
                                        <TextSVG
                                          x={tooltipPos.x + 5}
                                          y={tooltipPos.y + 30}
                                          fill="white"
                                          fontSize="16"
                                          fontWeight="bold"
                                          textAnchor="middle">
                                          {tooltipPos.value}
                                        </TextSVG>
                                      </Svg>
                                    </View>
                                  ) : null;
                                }}
                                onDataPointClick={data => {
                                  let isSamePoint =
                                    tooltipPos.x === data.x &&
                                    tooltipPos.y === data.y;

                                  isSamePoint
                                    ? setTooltipPos(previousState => {
                                        return {
                                          ...previousState,
                                          value: data.value,
                                          visible: !previousState.visible,
                                        };
                                      })
                                    : setTooltipPos({
                                        x: data.x,
                                        value: data.value,
                                        y: data.y,
                                        visible: true,
                                      });
                                }}
                              />
                              {/* <StackedBarChart
                                data={{
                                  labels: expUserLabel ? expUserLabel : [],
                                  legend: ['Expired', 'Renewal', 'Total'],
                                  data: [
                                    [expUserCount ? expUserCount : []],
                                    // [renewUserCount ? renewUserCount : []],
                                  ],
                                  barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
                                }}
                                width={Dimensions.get('window').width - 16}
                                height={220}
                                chartConfig={{
                                  backgroundColor: '#1cc910',
                                  backgroundGradientFrom: '#eff3ff',
                                  backgroundGradientTo: '#efefef',
                                  decimalPlaces: 2,
                                  color: (opacity = 1) =>
                                    `rgba(0, 0, 0, ${opacity})`,
                                  style: {
                                    borderRadius: 16,
                                  },
                                }}
                                style={{
                                  marginVertical: 8,
                                  borderRadius: 16,
                                }}
                              /> */}
                              {/* <LineChart
                                bezier
                                withHorizontalLabels={true}
                                withVerticalLabels={true}
                                showValuesOnTopOfBars={true}
                                fromZero={true}
                                data={{
                                  // labels: expUserLabel ? expUserLabel : [],
                                  labels: ['A', 'a'],
                                  datasets: [
                                    {
                                      data: [1, 2, 4],
                                      strokeWidth: 2,
                                      colors: '#AA4A44',
                                    },
                                    {
                                      data: [1, 2, 4],
                                      strokeWidth: 2,
                                    },
                                  ],
                                  legend: ['Expired', 'Renewal'],
                                }}
                                width="100%"
                                height={200}
                                chartConfig={{
                                  bezier: {
                                    strokeColor: '#FF5733', // Change this color to your desired color
                                    strokeWidth: 2,
                                  },
                                  legend: {
                                    enabled: true,
                                    labels: {
                                      fontSize: 12,
                                      fontWeight: 'bold',
                                      fontColor: '#333',
                                    },
                                    markerSize: 12,
                                    markerShape: 'square',
                                    markerBorderColor: 'transparent',
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 1,
                                    symbolRadius: 4,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    renderMarker: (legendColor, legendItem) => {
                                      return (
                                        <View
                                          style={{
                                            backgroundColor: legendColor,
                                            width: 10,
                                            height: 10,
                                          }}
                                        />
                                      );
                                    },
                                  },
                                  useShadowColorFromDataset: true,
                                  backgroundColor: '#1cc910',
                                  backgroundGradientFrom: '#eff3ff',
                                  backgroundGradientTo: '#efefef',
                                  decimalPlaces: 0,
                                  color: (opacity = 1) =>
                                    `rgba(0, 0, 0, ${opacity})`,
                                  style: {
                                    borderRadius: 16,
                                  },
                                }}
                                style={{
                                  borderRadius: 16,
                                }}
                              /> */}
                              {/* <LineChart
                              bezier
                              withHorizontalLabels={true}
                              withVerticalLabels={true}
                              showBarTops={false}
                              showValuesOnTopOfBars={true}
                              withInnerLines={true}
                              fromZero={true}
                              data={{
                                labels: expUserLabel ? expUserLabel : [],
                                datasets: [
                                  {
                                    data: expUserCount ? expUserCount : [],
                                    strokeWidth: 2,
                                  },
                                  {
                                    data: renewUserCount ? renewUserCount : [],
                                    strokeWidth: 2,
                                  },
                                ],
                                legend: ['Expired', 'Renewal'],
                              }}
                              width={screenWidth}
                              height={250}
                              chartConfig={{
                                backgroundColor: '#1cc910',
                                backgroundGradientFrom: '#eff3ff',
                                backgroundGradientTo: '#efefef',
                                decimalPlaces: 0,
                                fromZero: true,
                                color: (opacity = 1) =>
                                  `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                  borderRadius: 16,
                                },
                              }}
                              verticalLabelRotation={-88}
                              style={{
                                borderRadius: 0,
                              }}
                            /> */}
                            </ScrollView>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {!expands && (
                <View
                  style={{
                    marginTop: 20,
                    backgroundColor: '#FFFFFF',
                    shadowOffset: {width: -2, height: 4},
                    shadowColor: '#171717',
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    borderRadius: 8,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    width: '100%',
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 16,
                      }}>
                      PAYMENTS
                    </Text>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          expandPayments('expand');
                        }}>
                        <Ionicons
                          name={'trending-up-outline'}
                          size={20}
                          color={Colors.grey_888888}
                          style={{alignSelf: 'center'}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', width: '100%'}}>
                    <View style={{width: '100%'}}>
                      <View>
                        <View>
                          <View style={{flexDirection: 'row'}}>
                            <FontAwesome
                              name={'rupee'}
                              size={12}
                              color={Colors.black}
                              style={{marginTop: 5}}
                            />
                            <Text style={{marginLeft: 5, color: Colors.grey_888888}}>
                              {paymentInfo?.total_payment_count?.toFixed(2)}
                            </Text>
                          </View>
                          <View style={{marginTop: 10}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <Text style={{color: Colors.grey_888888}}>Cash</Text>
                              <View style={{flexDirection: 'row'}}>
                                <FontAwesome
                                  name={'rupee'}
                                  size={12}
                                  color={Colors.black}
                                  style={{marginTop: 5}}
                                />
                                <Text style={{marginLeft: 5, color: Colors.grey_888888}}>
                                  {paymentInfo?.cash_payment_count?.toFixed(2)}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <Text style={{color: Colors.grey_888888}}>Cheque</Text>
                              <View style={{flexDirection: 'row'}}>
                                <FontAwesome
                                  name={'rupee'}
                                  size={12}
                                  color={Colors.black}
                                  style={{marginTop: 5}}
                                />
                                <Text style={{marginLeft: 5, color: Colors.grey_888888}}>
                                  {paymentInfo?.cheque_payment_count?.toFixed(
                                    2,
                                  )}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <Text style={{color: Colors.grey_888888}}>UPI</Text>
                              <View style={{flexDirection: 'row'}}>
                                <FontAwesome
                                  name={'rupee'}
                                  size={12}
                                  color={Colors.black}
                                  style={{marginTop: 5}}
                                />
                                <Text style={{marginLeft: 5, color: Colors.grey_888888}}>
                                  {paymentInfo?.upi_payment_count?.toFixed(2)}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <Text style={{color: Colors.grey_888888}}>Online</Text>
                              <View style={{flexDirection: 'row'}}>
                                <FontAwesome
                                  name={'rupee'}
                                  size={12}
                                  color={Colors.black}
                                  style={{marginTop: 5}}
                                />
                                <Text style={{marginLeft: 5, color: Colors.grey_888888}}>
                                  {paymentInfo?.payment_gatway_count?.toFixed(
                                    2,
                                  )}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <Text style={{color: Colors.grey_888888}}>Banking</Text>
                              <View style={{flexDirection: 'row'}}>
                                <FontAwesome
                                  name={'rupee'}
                                  size={12}
                                  color={Colors.black}
                                  style={{marginTop: 5}}
                                />
                                <Text style={{marginLeft: 5, color: Colors.grey_888888}}>
                                  {paymentInfo?.bank_transfer_count?.toFixed(2)}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* )} */}
                </View>
              )}

              {expands && (
                <View
                  style={{
                    marginTop: 20,
                    backgroundColor: '#FFFFFF',
                    shadowOffset: {width: -2, height: 4},
                    shadowColor: '#171717',
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    borderRadius: 8,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    width: '100%',
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 16,
                        }}>
                        PAYMENT STATS
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          expandPayments('close');
                        }}>
                        <Ionicons
                          name={'close-outline'}
                          size={20}
                          color={Colors.grey_888888}
                          style={{alignSelf: 'center'}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', width: '100%'}}>
                    <View style={{width: '100%'}}>
                      <View>
                        <View>
                          <View style={{marginTop: 15, overflow: 'scroll'}}>
                            <ScrollView horizontal={true}>
                              <BarChart
                                // style={graphStyle}
                                data={bardata1}
                                width={900}
                                height={250}
                                showBarTops={true}
                                showValuesOnTopOfBars={true}
                                withInnerLines={true}
                                fromZero={true}
                                segments={5}
                                flatColor={true}
                                groupSpacing={0.5}
                                chartConfig={{
                                  barPercentage: 0.5,
                                  backgroundGradientFrom: '#fff',
                                  backgroundGradientTo: '#fff',
                                  fillShadowGradient: `rgb(71,93,199)`,
                                  fillShadowGradientOpacity: 1,
                                  decimalPlaces: 0, // optional, defaults to 2dp
                                  color: (opacity = 1) => `rgb(71,93,199)`,
                                  labelColor: (opacity = 1) => `rgb(71,93,199)`,
                                  style: {
                                    borderRadius: 16,
                                  },
                                  propsForDots: {
                                    r: '6',
                                    strokeWidth: '2',
                                    stroke: '#ffa726',
                                  },
                                  propsForBackgroundLines: {
                                    strokeWidth: 1,
                                    stroke: '#e3e3e3',
                                    strokeDasharray: '0',
                                  },
                                  propsForLabels: {
                                    fontSize: 10,
                                  },
                                }}
                                verticalLabelRotation={0}
                                backgroundColor={'transparent'}
                                center={[25, 10]}
                              />
                            </ScrollView>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* )} */}
                </View>
              )}

              <View
                style={{
                  marginTop: 20,
                  backgroundColor: '#FFFFFF',
                  shadowOffset: {width: -2, height: 4},
                  shadowColor: '#171717',
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  borderRadius: 8,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  width: '100%',
                  marginVertical: 10,
                }}>
                <Text
                  onPress={() => navigation.navigate('AddNetwork')}
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 16,
                  }}>
                  NETWORK
                </Text>
                <View style={{flexDirection: 'row', width: '100%'}}>
                  <View style={{width: '100%'}}>
                    <View>
                      <View>
                        <View style={{flexDirection: 'row'}}>
                          <FontAwesome
                            name={'wifi'}
                            size={12}
                            color={Colors.black}
                            style={{marginTop: 5}}
                          />
                          <Text style={{marginLeft: 5, color: Colors.grey_888888}}>
                            {networkInfoTotal?.total}
                          </Text>
                        </View>
                        <View style={{marginTop: 15}}>
                          <BarChart
                            // style={graphStyle}
                            data={bardata}
                            width={350}
                            height={250}
                            showBarTops={false}
                            showValuesOnTopOfBars={true}
                            withInnerLines={true}
                            fromZero={true}
                            segments={3}
                            flatColor={true}
                            chartConfig={{
                              barPercentage: 0.5,
                              barRadius: 10,
                              backgroundGradientFrom: '#fff',
                              backgroundGradientTo: '#fff',
                              fillShadowGradient: `rgb(71,93,199)`,
                              fillShadowGradientOpacity: 1,
                              decimalPlaces: 0, // optional, defaults to 2dp
                              color: (opacity = 1) => `rgb(71,93,199)`,
                              labelColor: (opacity = 1) => `#767577`,
                              style: {
                                borderRadius: 16,
                              },
                              propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: '#ffa726',
                              },
                              propsForBackgroundLines: {
                                strokeWidth: 1,
                                stroke: '#e3e3e3',
                                strokeDasharray: '0',
                              },
                            }}
                            yAxisInterval={50}
                            verticalLabelRotation={0}
                            backgroundColor={'transparent'}
                            center={[25, 10]}
                          />
                          <View style={styles.netWorkPressableView}>
                            {/* <TouchableOpacity
                              onPress={() => navigation.navigate('AddNetwork')}>
                              <Text style={styles.hiddenNetworkLbl}> </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('AddNetwork', {
                                  paramTxt: 'olt',
                                })
                              }>
                              <Text style={styles.hiddenNetworkLbl}> </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('AddNetwork', {
                                  paramTxt: 'dp',
                                })
                              }>
                              <Text style={styles.hiddenNetworkLbl}> </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('AddNetwork', {
                                  paramTxt: 'cpe',
                                })
                              }>
                              <Text style={styles.hiddenNetworkLbl}> </Text>
                            </TouchableOpacity> */}
                          </View>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                              marginLeft: 15,
                            }}>
                            <TouchableOpacity
                              onPress={() => navigation.navigate('AddNetwork')}>
                              <Text
                                style={{
                                  marginLeft: 20,
                                  color: 'rgb(71,93,199)',
                                }}>
                                {networkInfo
                                  ? networkInfo[0]
                                    ? networkInfo[0]
                                    : 0
                                  : 0}
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('AddNetwork', {
                                  paramTxt: 'olt',
                                })
                              }>
                              <Text style={{color: 'rgb(71,93,199)'}}>
                                {networkInfo
                                  ? networkInfo[1]
                                    ? networkInfo[1]
                                    : 0
                                  : 0}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('AddNetwork', {
                                  paramTxt: 'dp',
                                })
                              }>
                              <Text style={{color: 'rgb(71,93,199)'}}>
                                {networkInfo
                                  ? networkInfo[2]
                                    ? networkInfo[2]
                                    : 0
                                  : 0}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('AddNetwork', {
                                  paramTxt: 'dp',
                                })
                              }>
                              <Text style={{color: 'rgb(71,93,199)'}}>
                                {networkInfo
                                  ? networkInfo[3]
                                    ? networkInfo[3]
                                    : 0
                                  : 0}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('AddNetwork', {
                                  paramTxt: 'cpe',
                                })
                              }>
                              <Text style={{color: 'rgb(71,93,199)'}}>
                                {networkInfo
                                  ? networkInfo[4]
                                    ? networkInfo[4]
                                    : 0
                                  : 0}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                {/* )} */}
              </View>
              <View
                style={{
                  marginTop: 20,
                  backgroundColor: '#FFFFFF',
                  shadowOffset: {width: -2, height: 4},
                  shadowColor: '#171717',
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  borderRadius: 8,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  width: '100%',
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    onPress={() => navigation.navigate("Add_Complaints")}
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                    }}>
                    COMPLAINTS
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: isEnabled ? '#81b0ff' : '#000000',
                        fontSize: 14,
                      }}>
                      Till Now
                    </Text>
                    <Switch
                      trackColor={{false: '#767577', true: '#81b0ff'}}
                      thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                      style={{marginTop: -3}}
                    />
                  </View>
                </View>

                <View style={{flexDirection: 'row', width: '100%'}}>
                  <View style={{width: '100%'}}>
                    <View>
                      <View>
                        <View style={{flexDirection: 'row'}}>
                          <FontAwesome
                            name={'sticky-note-o'}
                            size={12}
                            color={Colors.black}
                            style={{marginTop: 5}}
                          />
                          <Text style={{marginLeft: 5, color: Colors.grey_888888}}>
                            {ticketInfoTotal?.all}
                          </Text>
                        </View>
                        <View style={{marginTop: 15}}>
                          <ScrollView horizontal>
                            <BarChart
                              // style={graphStyle}
                              data={bardata2}
                              width={Dimensions.get("window").width * 1.2}
                              height={250}
                              showBarTops={false}
                              showValuesOnTopOfBars={true}
                              withInnerLines={true}
                              fromZero={true}
                              segments={3}
                              flatColor={true}
                              chartConfig={{
                                barPercentage: 0.5,
                                barRadius: 10,
                                backgroundGradientFrom: '#fff',
                                backgroundGradientTo: '#fff',
                                fillShadowGradient: `rgb(71,93,199)`,
                                fillShadowGradientOpacity: 1,
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgb(71,93,199)`,
                                labelColor: (opacity = 1) => `#767577`,
                                style: {
                                  borderRadius: 16,
                                },
                                propsForDots: {
                                  r: '6',
                                  strokeWidth: '2',
                                  stroke: '#ffa726',
                                },
                                propsForBackgroundLines: {
                                  strokeWidth: 1,
                                  stroke: '#e3e3e3',
                                  strokeDasharray: '0',
                                },
                                propsForLabels: {
                                  fontSize: 10,
                                },
                              }}
                              verticalLabelRotation={0}
                              backgroundColor={'transparent'}
                              center={[25, 10]}
                            />
                          </ScrollView>
                          <View style={styles.complaintPressableView}>
                              {/* <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Add_Complaints', {
                                    paramTxt: 'opn',
                                  })
                                }>
                                <Text style={styles.hiddenComplaintLbl}> </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Add_Complaints', {
                                    paramTxt: 'asn',
                                  })
                                }>
                                <Text style={styles.hiddenComplaintLbl}> </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Add_Complaints', {
                                    paramTxt: 'inp',
                                  })
                                }>
                                <Text style={styles.hiddenComplaintLbl}> </Text>
                              </TouchableOpacity> */}
                              {/* <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Add_Complaints', {
                                    paramTxt: 'rsl',
                                  })
                                }>
                                <Text style={styles.hiddenComplaintLbl}> </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Add_Complaints', {
                                    paramTxt: 'cld',
                                  })
                                }>
                                <Text style={styles.hiddenComplaintLbl}> </Text>
                              </TouchableOpacity> */}
                            </View>
                            <ScrollView 
                              horizontal 
                              contentContainerStyle={{
                                width: Dimensions.get("window").width * 1.2,
                                justifyContent: 'space-around'
                              }}>
                              <TouchableOpacity
                                style={{marginLeft: 20}}
                                onPress={() =>
                                  navigation.navigate('Add_Complaints', {
                                    paramTxt: 'opn',
                                  })
                                }>
                                <Text
                                  style={{
                                    marginLeft: 15,
                                    color: 'rgb(71,93,199)',
                                  }}>
                                  {ticketInfo ? (openT ? openT : 0) : 0}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Add_Complaints', {
                                    paramTxt: 'asn',
                                  })
                                }>
                                <Text style={{color: 'rgb(71,93,199)'}}>
                                  {ticketInfo ? (assignT ? assignT : 0) : 0}
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Add_Complaints', {
                                    paramTxt: 'inp',
                                  })
                                }>
                                <Text style={{color: 'rgb(71,93,199)'}}>{ticketInfo ? (inpT ? inpT : 0) : 0}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Add_Complaints', {
                                    paramTxt: 'rsl',
                                  })
                                }>
                                <Text style={{color: 'rgb(71,93,199)'}}>
                                  {ticketInfo ? (reslvT ? reslvT : 0) : 0}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Add_Complaints', {
                                    paramTxt: 'cld',
                                  })
                                }>
                                <Text style={{color: 'rgb(71,93,199)'}}>
                                  {ticketInfo ? (cldT ? cldT : 0) : 0}
                                </Text>
                              </TouchableOpacity>
                            </ScrollView>
                        </View>
                        
                      </View>
                    </View>
                  </View>
                </View>
                {/* )} */}
              </View>
              <View
                style={{
                  marginTop: 20,
                  backgroundColor: '#FFFFFF',
                  shadowOffset: {width: -2, height: 4},
                  shadowColor: '#171717',
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  borderRadius: 8,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  width: '100%',
                  marginVertical: 10,
                }}>
                <Text
                  onPress={() => navigation.navigate("Leads")}
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 16,
                  }}>
                  LEADS & NEW REGISTRATIONS
                </Text>
                <View style={{flexDirection: 'row', width: '100%'}}>
                  <View style={{width: '100%'}}>
                    <View>
                      <View>
                        <View style={{flexDirection: 'row'}}>
                          <FontAwesome
                            name={'sticky-note-o'}
                            size={12}
                            color={Colors.black}
                            style={{marginTop: 5}}
                          />
                          <Text style={{marginLeft: 5, color: Colors.grey_888888}}>
                            {leadRegistrationCount.lead_count + leadRegistrationCount.new_registration_count}
                          </Text>
                        </View>
                        <View style={{marginTop: 15}}>
                          <BarChart
                            // style={graphStyle}
                            data={leadsandReg}
                            width={350}
                            height={250}
                            showBarTops={false}
                            showValuesOnTopOfBars={true}
                            withInnerLines={true}
                            fromZero={true}
                            segments={3}
                            flatColor={true}
                            chartConfig={{
                              barPercentage: 0.5,
                              barRadius: 10,
                              backgroundGradientFrom: '#fff',
                              backgroundGradientTo: '#fff',
                              fillShadowGradient: `rgb(71,93,199)`,
                              fillShadowGradientOpacity: 1,
                              decimalPlaces: 0, // optional, defaults to 2dp
                              color: (opacity = 1) => `rgb(71,93,199)`,
                              labelColor: (opacity = 1) => `rgb(71,93,199)`,
                              style: {
                                borderRadius: 16,
                              },
                              propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: '#ffa726',
                              },
                              propsForBackgroundLines: {
                                strokeWidth: 1,
                                stroke: '#e3e3e3',
                                strokeDasharray: '0',
                              },
                            }}
                            verticalLabelRotation={0}
                            backgroundColor={'transparent'}
                            center={[25, 10]}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                {/* )} */}
              </View>
              {/* <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 16,
                  marginTop: 20,
                }}>
                All Activities
              </Text>

              <View style={{}}>
                <View style={{width: '100%', flexDirection: 'column'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 5,
                    }}>
                    <ScrollView
                      horizontal={true}
                      style={{flex: 1, marginTop: 15}}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}>
                      <TouchableOpacity onPress={() => setbuttonPressed(1)}>
                        <Text
                          style={
                            buttonPressed == 1
                              ? styles.btnPress
                              : styles.btnNormal
                          }>
                          Today
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setbuttonPressed(2)}>
                        <Text
                          style={
                            buttonPressed == 2
                              ? styles.btnPress
                              : styles.btnNormal
                          }>
                          Yesterday
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setbuttonPressed(3)}>
                        <Text
                          style={
                            buttonPressed == 3
                              ? styles.btnPress1
                              : styles.btnNormal1
                          }>
                          Next 7 Days
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                  {buttonPressed == 1 && (
                    <View
                      style={{
                        flexDirection: 'column',
                        borderRadius: 5,
                        marginTop: 15,
                        backgroundColor: Colors.grey_F8F8F8,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Activations
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {dashboardData?.today_no_of_customers
                              ? dashboardData?.today_no_of_customers
                              : 0}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Expiry
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {dashboardData?.today_expiry
                              ? dashboardData?.today_expiry
                              : 0}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 2,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Renewal
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData?.today_renewal?.count
                                ? dashboardData?.today_renewal?.count
                                : 0}
                              /
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.today_renewal?.amount
                                ? dashboardData?.today_renewal?.amount.toFixed(
                                    2,
                                  )
                                : 0}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Payments
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData?.today_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.today_payments &&
                                    dashboardData.today_payments.reduce(
                                      (a, v) => (a = a + v.count),

                                      0,
                                    )}
                                </>
                              ) : (
                                0
                              )}
                              /{' '}
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.today_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.today_payments &&
                                    dashboardData.today_payments
                                      .reduce(
                                        (a, v) => (a = a + v.amount),

                                        0,
                                      )
                                      .toFixed(2)}
                                </>
                              ) : (
                                0
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Online Pay
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData.today_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.today_payments &&
                                    dashboardData.today_payments

                                      .filter(
                                        item => item.pickup_type === 'ONL',
                                      )

                                      .reduce((acc, curr) => {
                                        if (curr) {
                                          acc = acc + curr.count;
                                        }

                                        return acc;
                                      }, 0)}
                                </>
                              ) : (
                                0
                              )}
                              /{' '}
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.today_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.today_payments &&
                                    dashboardData.today_payments

                                      .filter(
                                        item => item.pickup_type === 'ONL',
                                      )

                                      .reduce((acc, curr) => {
                                        if (curr) {
                                          acc = acc + curr.amount;
                                        }

                                        return acc;
                                      }, 0)}
                                </>
                              ) : (
                                0
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  {buttonPressed == 2 && (
                    <View
                      style={{
                        flexDirection: 'column',
                        borderRadius: 5,
                        marginTop: 15,
                        backgroundColor: Colors.grey_F8F8F8,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Activations
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {dashboardData?.yesterday_activations
                              ? dashboardData?.yesterday_activations
                              : 0}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Expiry
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {dashboardData?.yesterday_expiry
                              ? dashboardData?.yesterday_expiry
                              : 0}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 2,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Renewal
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData?.yesterday_renewal
                                ?.yesterday_renwals
                                ? dashboardData?.yesterday_renewal
                                    ?.yesterday_renwals
                                : 0}
                              /
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.yesterday_renewal?.amount
                                ? dashboardData?.yesterday_renewal?.amount.toFixed(
                                    2,
                                  )
                                : 0}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Payments
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData?.yesterday_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.yesterday_payments &&
                                    dashboardData.yesterday_payments.reduce(
                                      (a, v) => (a = a + v.count),

                                      0,
                                    )}
                                </>
                              ) : (
                                0
                              )}
                              /{' '}
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.yesterday_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.yesterday_payments &&
                                    dashboardData.yesterday_payments
                                      .reduce(
                                        (a, v) => (a = a + v.amount),

                                        0,
                                      )
                                      .toFixed(2)}
                                </>
                              ) : (
                                0
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Online Pay
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData?.yesterday_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.yesterday_payments &&
                                    dashboardData.yesterday_payments

                                      .filter(
                                        item => item.pickup_type === 'ONL',
                                      )

                                      .reduce((acc, curr) => {
                                        if (curr) {
                                          acc = acc + curr.count;
                                        }

                                        return acc;
                                      }, 0)}
                                </>
                              ) : (
                                0
                              )}
                              /{' '}
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.yesterday_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.yesterday_payments &&
                                    dashboardData.yesterday_payments

                                      .filter(
                                        item => item.pickup_type === 'ONL',
                                      )

                                      .reduce((acc, curr) => {
                                        if (curr) {
                                          acc =
                                            acc + curr.amount
                                              ? acc + curr.amount
                                              : 0;
                                        }

                                        return acc;
                                      }, 0)}
                                </>
                              ) : (
                                0
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  {buttonPressed == 3 && (
                    <View
                      style={{
                        flexDirection: 'column',
                        borderRadius: 5,
                        marginTop: 15,
                        backgroundColor: Colors.grey_F8F8F8,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Expiry
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {dashboardData?.upcoming_user_expiry_next7days
                              ? dashboardData?.upcoming_user_expiry_next7days
                              : 0}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View> */}
              {/* complaints */}
              {/* {buttonPressed == 1 && (
                <>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      marginTop: 20,
                    }}>
                    Complaints
                  </Text>
                  <View style={{}}>
                    <View style={{width: '100%', flexDirection: 'column'}}>
                      <View
                        style={{
                          flexDirection: 'column',
                          borderRadius: 5,
                          marginTop: 15,
                          backgroundColor: Colors.grey_F8F8F8,
                          padding: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Open
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.today_complaint_counts?.opn
                                ? dashboardData?.today_complaint_counts?.opn
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Assigned
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.today_complaint_counts?.asn
                                ? dashboardData?.today_complaint_counts?.asn
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              In Progress
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.today_complaint_counts?.inp
                                ? dashboardData?.today_complaint_counts?.inp
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Resolved
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.today_complaint_counts?.rsl
                                ? dashboardData?.today_complaint_counts?.rsl
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Closed
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.today_complaint_counts?.cld
                                ? dashboardData?.today_complaint_counts?.cld
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                      </View>
                    </View>
                  </View>
                </>
              )} */}
              {/* leads */}
              {/* {buttonPressed == 2 && (
                <>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      marginTop: 20,
                    }}>
                    Complaints
                  </Text>
                  <View style={{}}>
                    <View style={{width: '100%', flexDirection: 'column'}}>
                      <View
                        style={{
                          flexDirection: 'column',
                          borderRadius: 5,
                          marginTop: 15,
                          backgroundColor: Colors.grey_F8F8F8,
                          padding: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Open
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.yesterday_complaint_counts?.opn
                                ? dashboardData?.yesterday_complaint_counts?.opn
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Assigned
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.yesterday_complaint_counts?.asn
                                ? dashboardData?.yesterday_complaint_counts?.asn
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              In Progress
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.yesterday_complaint_counts?.inp
                                ? dashboardData?.yesterday_complaint_counts?.inp
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Resolved
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.yesterday_complaint_counts?.rsl
                                ? dashboardData?.yesterday_complaint_counts?.rsl
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Closed
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.yesterday_complaint_counts?.cld
                                ? dashboardData?.yesterday_complaint_counts?.cld
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                      </View>
                    </View>
                  </View>
                </>
              )} */}
            </ScrollView>
          </View>
          <DialogView
            showLoadingDialog
            visible={isLoading}
            text="Loading Dashboard Data"></DialogView>
        </View>
        <View>
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={false}
            // height={windowHeight}
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
                height: 1200,
              },
              draggableIcon: {
                backgroundColor: '#000',
              },
            }}>
            <View style={{padding: 20}}>
              <View style={{backgroundColor: Colors.white}}>
                {dataList.length > 0 ? (
                  <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}>
                    <FlatList
                      data={dataList}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, index) => index}
                      renderItem={({item, index}) => (
                        <KYC_ListCell
                          itemdata={dataList[index]}
                          onItemClick={() => {
                            props.updateCustomerInformation(dataList[index]);
                            navigation.navigate('Customer360Info');
                          }}
                        />
                      )}
                      // refreshControl={
                      //   <RefreshControl
                      //     // refreshing={isLoading}
                      //     onRefresh={getComplaintsListOnPageLoad}
                      //   />
                      // }
                      style={{marginTop: 5}}
                    />
                  </ScrollView>
                ) : (
                  <Text style={{color: Colors.grey_888888}}>Please wait...</Text>
                )}

                {/* // ) : (
                //   <View style={{height: '80%'}}>
                //     <NoData />
                //   </View>
                // )} */}
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => refRBSheet.current.close()}>
                <Ionicons
                  name={'ios-close-circle-outline'}
                  size={45}
                  color={Colors.grey_888888}
                />
                {/* <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 18,
                  marginLeft: 15,
                  padding: 10,
                  backgroundColor: '#F4F4F4',
                  width: 111,
                  textAlign: 'center',
                  borderRadius: 8,
                }}>
                Close
              </Text> */}
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>
        <View
          style={{
            marginBottom: 5,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontFamily: 'Titillium-Semibold',
              color: Colors.orange_295CBF,
            }}>
            {/* {'Prod' + '-' + '11-05-2023 12:10'} */}
          </Text>
        </View>

        <View
          style={{
            height: 50,
            backgroundColor: Colors.grey_F8F8F8,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowRadius: 2,
            margin: 1,
            shadowOffset: {
              width: 0,
              height: -1,
            },
            shadowColor: '#000000',
            elevation: 5,
          }}>
          <Headerview showFooter />
        </View>
      </View>

      {modalVisible && (
        <Headerview
          showSideMenu
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        />
      )}
    </SafeAreaView>
  );
};

function mapStateToProps(state, props) {
  return {
    userInfo: state.mainReducers.main.userInfo,
    updateCustomerInformation:
      state.mainReducers.main.updateCustomerInformation,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(operations, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);

const styles = StyleSheet.create({
  btnNormal: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#000000',
    fontSize: 14,
    width: 78,
    height: 38,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
  btnPress: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#ffffff',
    fontSize: 14,
    width: 78,
    height: 38,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
  btnNormal1: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#000000',
    fontSize: 14,
    width: 90,
    height: 38,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
  btnPress1: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#ffffff',
    fontSize: 14,
    width: 90,
    height: 38,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
  netWorkPressableView: {
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 30,
    height: 30,
    width: 300,
    position: 'absolute',
    flexDirection: 'row',
  },
  hiddenNetworkLbl: {textAlign: 'center', marginLeft: 25, padding: 10},

  complaintPressableView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 30,
    height: 30,
    width: 400,
    position: 'absolute',
    flexDirection: 'row',
  },
  hiddenComplaintLbl: {textAlign: 'center', marginLeft: 25},
});
