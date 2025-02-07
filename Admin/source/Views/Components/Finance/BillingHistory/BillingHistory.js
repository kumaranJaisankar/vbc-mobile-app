import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {Colors} from '../../../Common/Colors';
import HeaderView1 from '../../../Common/HeaderView1';
import {AccordionList} from 'react-native-accordion-list-view';
import {
  branchList,
  filterList,
  getAreaByZoneId,
  getAssignUsersV3,
  getBillingHistory,
  getBillingHistoryFailed,
  getBillingHistoryPending,
  getBillingHistorySuccess,
  getFranchiseByBranchId,
  getZoneByFranchiseId,
  paymentMethodList,
  pdfDownloadAPIAPI,
  pdfPreviewAPI,
} from '../../../services/MainService';
import {format} from 'date-fns';
import Toast from 'react-native-toast-message';
import DialogView from '../../../Common/DialogView';
import PdfViewBill from './PdfViewBill';
import {useNavigation, useRoute} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import NoData from '../../../Common/NoData';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import config from '../../../services/api/config';

const BillingHistory = () => {
  const route = useRoute();
  const paramText = route?.params?.paramTxt;
  const refRBSheet = useRef();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [donwloading, setDownloading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [billingDatas, setBillingDatas] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  const [days, setDates] = useState(1);
  const [branchLists, setBranchList] = useState([]);
  const [franchiseList, setFranshiseList] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  const [areasList, setAreasList] = useState([]);

  const [start_date, setStart_date] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [end_date, setEnd_date] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [gst, setGst] = useState();
  const [branchID, setBranchID] = useState('');
  const [franchiseID, setFranchiseID] = useState('');
  const [status, setStatus] = useState(1);
  const [zoneID, setZoneID] = useState('');
  const [areaID, setAreaID] = useState('');
  const [on_pay_method, setOn_pay_method] = useState('');
  const [pickup_type, setPickup_type] = useState('');
  const [collected_by, setCollected_by] = useState('');

  const [offPaymentMehList, setOffPaymentMehList] = useState([]);
  const [onPaymentMehList, setOnPaymentMehList] = useState([]);

  const [userList, setUserList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(1);
  const [showCustom, setShowCustom] = useState(false);
  const [rgbHeight, setRgbHeight] = useState(500);

  const [show, setShow] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [time, setTime] = React.useState(new Date());
  const [mode, setMode] = React.useState('date');

  const [show2, setShow2] = React.useState(false);
  const [date2, setDate2] = React.useState(new Date());
  const [time2, setTime2] = React.useState(new Date());
  const [mode2, setMode2] = React.useState('date');

  useEffect(() => {
    setGst();
    setBranchID('');
    setFranchiseID('');
    setStatus(1);
    setZoneID('');
    setAreaID('');
    setOn_pay_method('');
    setPickup_type('');
    setCollected_by('');
    billingData();
    getBranchList();
    getPaymentMethodList();
    getUsers();
  }, []);

  const getBranchList = async () => {
    const res = await branchList();
    console.log('🚀 ~ file: BillingHistory.js:97 ~ getBranchList ~ res:', res);
    if (res.isSuccess) {
      res.result.push({
        id: 0,
        name: 'All',
      });
      setBranchList(res?.result);
    } else {
      setBranchList([]);
    }
  };
  const getFranchise = async value => {
    const res = await getFranchiseByBranchId(value);
    console.log('🚀 ~ file: BillingHistory.js:83 ~ getFranchise ~ res:', res);
    if (res.isSuccess) {
      res.result.push({
        id: 0,
        name: 'All',
      });
      setFranshiseList(res?.result);
    } else {
      setFranshiseList([]);
    }
  };
  const getZones = async value => {
    const res = await getZoneByFranchiseId(value);
    if (res.isSuccess) {
      res.result.push({
        id: 0,
        name: 'All',
      });
      setZonesList(res?.result);
    } else {
      setZonesList([]);
    }
  };

  const getAreas = async value => {
    const res = await getAreaByZoneId(value);
    if (res.isSuccess) {
      res.result.push({
        id: 0,
        name: 'All',
      });
      setAreasList(res?.result);
    } else {
      setAreasList([]);
    }
  };
  const getPaymentMethodList = async () => {
    const res = await paymentMethodList();
    console.log(
      '🚀 ~ file: BillingHistory.js:110 ~ getPaymentMethodList ~ res:',
      res,
    );
    if (res.isSuccess) {
      const offlMethod = res.result.offline_payment_methods.map(
        (item, index) => {
          return {
            name: item,
            id: index,
          };
        },
      );
      setOffPaymentMehList(offlMethod);
      const onlMethod = res.result.online_payment_methods.map((item, index) => {
        return {
          name: item,
          id: index,
        };
      });
      setOnPaymentMehList(onlMethod);
    } else {
      setOffPaymentMehList([]);
      setOnPaymentMehList([]);
    }
  };

  const getUsers = async () => {
    const res = await getAssignUsersV3();
    console.log('🚀 ~ file: BillingHistory.js:129 ~ getUsers ~ res:', res);
    if (res.isSuccess) {
      setUserList(res.result.assigned_to);
    } else {
      setUserList([]);
    }
  };
  var dateTime = '';
  const formatDate = date => {
    console.log('date', date);
    dateTime = format(new Date(date), 'dd/MM/yyyy');
    // dateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return dateTime;
  };

  var dateTime2 = '';
  const formatDate2 = date => {
    console.log('date', date);
    dateTime2 = format(new Date(date), 'dd/MM/yyyy');
    // dateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return dateTime2;
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showMode2 = currentMode => {
    setShow2(true);
    setMode2(currentMode);
  };

  const showDatePicker = () => {
    showMode('date');
  };

  const showDatePicker2 = () => {
    showMode2('date');
  };

  const onChangeformDate = (event, selectedValue) => {
    setShow(Platform.OS === 'ios');
    if (mode == 'date') {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
      setStart_date(format(new Date(currentDate), 'yyyy-MM-dd'));
      // setShow(Platform.OS !== 'ios');
      setShow(false);
      setMode('date');
    } else {
      const selectedTime = selectedValue || new Date();
      setTime(selectedTime);
      // setShow(Platform.OS === 'ios');
      setShow(false);
      setMode('date');
    }
  };
  const onChangetoDate = (event, selectedValue) => {
    setShow2(Platform.OS === 'ios');
    if (mode2 == 'date') {
      const currentDate = selectedValue || new Date();
      setDate2(currentDate);
      setEnd_date(format(new Date(currentDate2), 'yyyy-MM-dd'));
      // setShow(Platform.OS !== 'ios');
      setShow2(false);
      setMode2('date');
    } else {
      const selectedTime = selectedValue || new Date();
      setTime2(selectedTime);
      // setShow(Platform.OS === 'ios');
      setShow2(false);
      setMode2('date');
    }
  };

  const dateCalculate = async value => {
    if (value == 1) {
      setStart_date(format(new Date(), 'yyyy-MM-dd'));
      setEnd_date(format(new Date(), 'yyyy-MM-dd'));
    } else if (value == 2) {
      var dateT = new Date();
      var end = dateT.setDate(dateT.getDate() - 1);
      setStart_date(format(new Date(end), 'yyyy-MM-dd'));
      setEnd_date(format(new Date(end), 'yyyy-MM-dd'));
    } else if (value == 3) {
      const today = new Date();
      const previousSunday = new Date(
        today.setDate(today.getDate() - today.getDay() - 7),
      );
      const previousSaturday = new Date(today.setDate(today.getDate() + 6));
      setStart_date(format(new Date(previousSunday), 'yyyy-MM-dd'));
      setEnd_date(format(new Date(previousSaturday), 'yyyy-MM-dd'));
    } else if (value == 4) {
      const today = new Date();
      const previousday = new Date(today.setDate(today.getDate() - 7));
      setStart_date(format(new Date(previousday), 'yyyy-MM-dd'));
      setEnd_date(format(new Date(), 'yyyy-MM-dd'));
    } else if (value == 5) {
      const today = new Date();
      const previousday = new Date(today.setDate(today.getDate() - 15));
      setStart_date(format(new Date(previousday), 'yyyy-MM-dd'));
      setEnd_date(format(new Date(), 'yyyy-MM-dd'));
    } else if (value == 6) {
      const today = new Date();
      const previousday = new Date(today.setDate(today.getDate() - 30));
      setStart_date(format(new Date(previousday), 'yyyy-MM-dd'));
      setEnd_date(format(new Date(), 'yyyy-MM-dd'));
    } else if (value == 7) {
      const today = new Date();
      const firstDayLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      );
      const lastDayLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
      );
      setStart_date(format(new Date(firstDayLastMonth), 'yyyy-MM-dd'));
      setEnd_date(format(new Date(lastDayLastMonth), 'yyyy-MM-dd'));
    } else if (value == 8) {
      setShowCustom(true);
      setRgbHeight(680);
    }
  };
  const getStatusWiseFilteredData = async () => {
    refRBSheet.current.close();
    setLimit(10);
    setPage(1);
    setLoading(true);
    var query = `${config.REACT_APP_API_URL_BILLING}/payment/enh/list?limit=${limit}&page=${page}&start_date=${start_date}&end_date=${end_date}`;
    if (gst) {
      query = query + `&is_gst=${gst}`;
    }
    if (branchID) {
      query = query + `&branch=${branchID}`;
    }
    if (franchiseID) {
      query = query + `&franchise=${franchiseID}`;
    }
    if (zoneID) {
      query = query + `&zone=${zoneID}`;
    }
    if (areaID) {
      query = query + `&area=${areaID}`;
    }
    if (pickup_type) {
      query =
        query +
        `&${
          pickup_type == 'ONL'
            ? 'online_payment_method'
            : 'offline_payment_method'
        }=${on_pay_method}`;
    }
    if (status) {
      query = query + `&status=${status}`;
    }
    if (pickup_type) {
      query = query + `&pickup_type=${pickup_type}`;
    }
    if (collected_by) {
      query = query + `&collected_by=${collected_by}`;
    }

    console.log('query', query);
    try {
      const res = await filterList(query);
      console.log(
        '🚀 ~ file: BillingHistory.js:184 ~ getStatusWiseFilteredData ~ res:',
        res,
      );
      if (res?.result?.results?.length > 0) {
        setBillingDatas(res?.result?.results);
        setLoading(false);
      } else {
        setLoading(false);
        setBillingDatas([]);
        Toast.show({
          type: 'error',
          text1: 'No data found! Please try later.',
        });
      }
    } catch (err) {
      setLoading(false);
      console.log('err', err);
    }
  };

  // setStatus
  const statusList = [
    {name: 'Success', id: 1},
    {name: 'Pending', id: 2},
    {name: 'Failed', id: 3},
  ];

  const dateList = [
    {name: 'Today', id: 1},
    {name: 'Yesterday', id: 2},
    {name: 'Last Week', id: 3},
    {name: 'Last 7 Days', id: 4},
    {name: 'Last 15 Days', id: 5},
    {name: 'Last 30 Days', id: 6},
    {name: 'Last Month', id: 7},
    {name: 'Custom', id: 8},
  ];

  const GSTINList = [
    {name: 'Yes', id: 'True'},
    {name: 'No', id: 'False'},
  ];

  const B = props => (
    <Text style={{fontWeight: 'bold', fontSize: 15}}>{props.children}</Text>
  );

  const A = props => (
    <Text
      onPress={() => {
        preViewPdf(props.children);
      }}>
      <Text style={{color: Colors.green_36BE39}}>
        {props.children ? 'View' : ''}
      </Text>
    </Text>
  );

  const preViewPdf = async filePath => {
    let data = {
      file_path: filePath,
    };
    console.log('file_path', data);
    const res = await pdfPreviewAPI(data);
    if (res?.isSuccess) {
      PreviewPdfs(res?.result?.preview_url);
    }
    console.log('🚀 ~ file: BillingHistory.js:428 ~ preViewPdf ~ res:', res);
  };

  const D = props => (
    <Text
      onPress={() => {
        checkPermission(props.children, props.type);
      }}>
      <Text style={{color: Colors.green_36BE39}}>
        {props.children ? 'Download' : ''}
      </Text>
    </Text>
  );

  const PreviewPdfs = async data => {
    navigation.navigate('PdfViewBill', {
      data: data,
    });
  };

  const checkPermission = async (props, type) => {
    console.log(Platform, 'Platform');
    if (Platform.OS === 'ios') {
      DownloadPdf(props, type);
    } else {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        downValue(props, type);
      } else {
        try {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            // {
            //   title: 'storage title',
            //   message: 'storage_permission',
            // },
          ).then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Storage Permission Granted.');
              downValue(props, type);
              // DownloadPdf(props);
            }
            //  else {
            //   Alert.alert('storage_permission');
            // }
          });
        } catch (err) {
          console.log('error', err);
        }
      }
    }
  };

  const downValue = async (file_path, type) => {
    let data = {
      file_path: file_path,
    };
    const res = await pdfDownloadAPIAPI(data);
    if (res?.isSuccess) {
      DownloadPdf(res?.result?.download_url, type);
    }
  };

  const DownloadPdf = (props, type = 'invoice') => {
    setDownloading(true);
    const {config, fs} = RNFetchBlob;
    let DownloadDir = fs.dirs.DownloadDir;
    let date = format(new Date(), 'yyyy-MM-dd');
    const pdfType = type == 'invoice' ? '/Invoice_' : '/Receipt_';
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: DownloadDir + pdfType + date + '.pdf',
        description: type == 'invoice' ? 'Invoice' : 'Receipt',
      },
    };
    config(options)
      .fetch('GET', props)
      .then(res => {
        setDownloading(false);
        console.log('res -> ', JSON.stringify(res));
        Alert.alert(
          'Download Successful!',
          type == 'invoice'
            ? 'Invoice downloaded successfully to your device.'
            : 'Receipt downloaded successfully to your device.',
          // 'Invoice downloaded successfully to your device.',
        );
        billingData();
      })
      .catch(err => {
        setDownloading(false);
        Alert.alert('Error!', 'Facing Problem to download pdf');
        console.log('res -> ', JSON.stringify(err));
      });
  };

  const billingData = async () => {
    setLimit(10);
    setPage(1);
    setLoading(true);
    if (paramText === 'yesterday') {
      var dateT = new Date();
      var end = dateT.setDate(dateT.getDate() - 1);
      console.log('end', format(new Date(end), 'yyyy-MM-dd'));
      var dateEnd = format(new Date(end), 'yyyy-MM-dd');
      setStart_date(format(new Date(end), 'yyyy-MM-dd'));
      setEnd_date(format(new Date(end), 'yyyy-MM-dd'));
    } else {
      setStart_date(format(new Date(), 'yyyy-MM-dd'));
      setEnd_date(format(new Date(), 'yyyy-MM-dd'));
    }
    try {
      console.log('dates', dateEnd);
      if (paramText === 'yesterday') {
        console.log('here come');
        var res = await getBillingHistory(dateEnd, dateEnd, 10, 1);
      } else {
        var res = await getBillingHistory(start_date, end_date, 10, 1);
      }

      console.log('🚀 ~ file: BillingHistory.js:511 ~ billingData ~ res:', res);
      if (res?.result?.results?.length > 0) {
        setBillingDatas(res?.result?.results);
        setLoading(false);
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'No data found! Please try later.',
        });
      }
    } catch (err) {
      setLoading(false);
      console.log('err', err);
    }
  };
  const loadMoreData = async () => {
    setPage(page + 1);
    setLimit(10);
    setLoading(true);
    var query = `${
      config.REACT_APP_API_URL_BILLING
    }/payment/enh/list?limit=${limit}&page=${
      page + 1
    }&start_date=${start_date}&end_date=${end_date}`;
    if (gst) {
      query = query + `&is_gst=${gst}`;
    }
    if (branchID) {
      query = query + `&branch=${branchID}`;
    }
    if (franchiseID) {
      query = query + `&franchise=${franchiseID}`;
    }
    if (zoneID) {
      query = query + `&zone=${zoneID}`;
    }
    if (areaID) {
      query = query + `&area=${areaID}`;
    }
    if (pickup_type) {
      query =
        query +
        `&${
          pickup_type == 'ONL'
            ? 'online_payment_method'
            : 'offline_payment_method'
        }=${on_pay_method}`;
    }
    if (status) {
      query = query + `&status=${status}`;
    }
    if (pickup_type) {
      query = query + `&pickup_type=${pickup_type}`;
    }
    if (collected_by) {
      query = query + `&collected_by=${collected_by}`;
    }

    console.log('query', query);
    try {
      const res = await filterList(query);
      console.log(
        '🚀 ~ file: BillingHistory.js:184 ~ getStatusWiseFilteredData ~ res:',
        res,
      );
      if (res?.result?.results?.length > 0) {
        setBillingDatas(res?.result?.results);
        setLoading(false);
      } else {
        setLoading(false);
        // setBillingDatas([]);
        Toast.show({
          type: 'error',
          text1: 'No Data Found',
        });
      }
    } catch (err) {
      setLoading(false);
      console.log('err', err);
    }
  };

  const paymentModeList = [
    {name: 'Online', id: 'ONL'},
    {name: 'Offline', id: 'OFL'},
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={{backgroundColor: Colors.white}}>
          <HeaderView1
            showHeader1
            username={'Payments'}
            onMenuClick={() => {
              setModalVisible(true);
            }}
            showRefreshIcon
            onRefreshClicked={() => {
              billingData();
            }}
          />

          <View style={styles.container}>
            <TouchableOpacity
              style={{alignItems: 'flex-end'}}
              onPress={() => {
                refRBSheet.current.open();
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 8,
                  // backgroundColor: Colors.white,
                  marginBottom: 10,
                  borderWidth: 2,
                  borderRadius: 4,
                  borderColor: Colors.orange_295CBF,
                }}>
                <Ionicons
                  name={'filter-outline'}
                  size={18}
                  color={Colors.orange_295CBF}
                  style={{
                    padding: 5,
                  }}
                />
                <Text style={{color: Colors.orange_295CBF}}>Filters</Text>
              </View>
            </TouchableOpacity>

            {billingDatas?.length > 0 ? (
              <AccordionList
                data={billingDatas ? billingDatas : []}
                customTitle={item => (
                  <Text>
                    <B>Customer ID: </B>
                    {item?.customer_username}
                  </Text>
                )}
                customBody={item => (
                  <Text>
                    {'\n'}
                    <B>Customer Name: </B>
                    {item?.customer_name} {'\n'}
                    {'\n'}
                    <B>Franchise: </B>
                    {item?.franchise}
                    {'\n'}
                    {'\n'}
                    <B>Payment ID: </B>
                    {item?.payment_id}
                    {'\n'}
                    {'\n'}
                    <B>Payment Method: </B>
                    {item?.offline_payment_mode ? 'Offline' : 'Online'}
                    {'\n'}
                    {'\n'}
                    <B>Payment Status: </B>
                    {item?.status}
                    {'\n'}
                    {'\n'}
                    <B>Payment Type: </B>
                    {item?.payment_method}
                    {'\n'}
                    {'\n'}
                    <B>Package Name: </B>
                    {item?.package_name}
                    {'\n'}
                    {'\n'}
                    <B>Package Amount: </B>
                    {item?.plan_cost?.toFixed(2)}
                    {'\n'}
                    {'\n'}
                    <B>CGST: </B>
                    {item?.cgst_amount}
                    {'\n'}
                    {'\n'}
                    <B>SGST: </B>
                    {item?.sgst_amount}
                    {'\n'}
                    {'\n'}
                    <B>Total GST: </B>
                    {item?.cgst_amount + item?.sgst_amount}
                    {'\n'}
                    {'\n'}
                    <B>Static IP Cost: </B>
                    {item?.static_ip_total_cost
                      ? item?.static_ip_total_cost
                      : '0'}
                    {'\n'}
                    {'\n'}
                    <B>Total Amount: </B>
                    {item?.amount?.toFixed(2)}
                    {'\n'}
                    {'\n'}
                    <B>Collected By: </B>
                    {item?.collected_by_username}
                    {'\n'}
                    {'\n'}
                    <B>Collected Date: </B>
                    {format(
                      new Date(item?.completed_date),
                      'dd MMM, yyyy hh:mm:ss 	aa',
                    )}
                    {'\n'}
                    {'\n'}
                    <B>Preview Invoice: </B>
                    <A>{item?.file_path ? item?.file_path : ''}</A>
                    {'\n'}
                    {'\n'}
                    <B>Download Invoice: </B>
                    <D type="invoice">
                      {item?.file_path ? item?.file_path : ''}
                    </D>
                    {'\n'}
                    {'\n'}
                    <B>Preview Receipt: </B>
                    <A>
                      {item?.receipt_file_path ? item?.receipt_file_path : ''}
                    </A>
                    {'\n'}
                    {'\n'}
                    <B>Download Receipt: </B>
                    <D type="receipt">
                      {item?.receipt_file_path ? item?.receipt_file_path : ''}
                    </D>
                  </Text>
                )}
                animationDuration={400}
                expandMultiple={false}
                key={item => item.id}
              />
            ) : (
              <View style={{marginTop: 120}}>
                <NoData />
              </View>
            )}
            {billingDatas?.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={loadMoreData}
                style={styles.loadMoreBtn}>
                <Text style={styles.btnText}>Load More</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      <View>
        <RBSheet
          ref={refRBSheet}
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
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 20,
              height: rgbHeight,
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <View style={{padding: 20}}>
            <View style={{padding: 20}}>
              <View style={{backgroundColor: Colors.white}}>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                    marginTop: 50,
                  }}>
                  <View style={{flex: 1}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={branchLists?.sort((a, b) => a.id - b.id)}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Branch"
                      value={branchID}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setBranchID(item?.id);
                        setIsFocus(false);
                        getFranchise(item?.id);
                      }}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 5}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={franchiseList?.sort((a, b) => a.id - b.id)}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Franchise"
                      value={franchiseID}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setFranchiseID(item?.id);
                        setIsFocus(false);
                        getZones(item?.id);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                    marginTop: 50,
                  }}>
                  <View style={{flex: 1}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={zonesList?.sort((a, b) => a.id - b.id)}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Zone"
                      value={zoneID}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setZoneID(item?.id);
                        setIsFocus(false);
                        getAreas(item?.id);
                      }}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 5}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={areasList?.sort((a, b) => a.id - b.id)}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Area"
                      value={areaID}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setAreaID(item?.id);
                        setIsFocus(false);
                        // getAreas(item?.id);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                    marginTop: 50,
                  }}>
                  <View style={{flex: 1}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={paymentModeList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Payment Mode"
                      value={pickup_type}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setPickup_type(item?.id);
                        setIsFocus(false);
                        // getAreas(item?.id);
                      }}
                    />
                  </View>
                  {pickup_type ? (
                    <View style={{flex: 1, marginLeft: 5}}>
                      <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={
                          pickup_type == 'ONL'
                            ? onPaymentMehList
                            : offPaymentMehList
                        }
                        maxHeight={200}
                        labelField="name"
                        valueField="name"
                        placeholder="Payment Type"
                        value={on_pay_method}
                        onFocus={() => {
                          setIsFocus(true);
                        }}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          // setAreaID(item?.id);
                          setIsFocus(false);
                          setOn_pay_method(item?.name);
                          // getAreas(item?.id);
                        }}
                      />
                    </View>
                  ) : (
                    <View></View>
                  )}
                </View>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                    marginTop: 50,
                  }}>
                  <View style={{flex: 1}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={userList}
                      maxHeight={200}
                      labelField="username"
                      valueField="id"
                      placeholder="Collected By"
                      value={collected_by}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setCollected_by(item?.id);
                        setIsFocus(false);
                        // getAreas(item?.id);
                      }}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 5}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={statusList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Status"
                      value={status}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setStatus(item?.id);
                        setIsFocus(false);
                        // getAreas(item?.id);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                    marginTop: 50,
                  }}>
                  <View style={{flex: 1}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={dateList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Select Date Range"
                      value={selectedDate}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setSelectedDate(item?.id);
                        setIsFocus(false);
                        dateCalculate(item?.id);
                        // getAreas(item?.id);
                      }}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 5}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={GSTINList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="GSTIN"
                      value={gst}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setGst(item?.id);
                        setIsFocus(false);
                        // getAreas(item?.id);
                      }}
                    />
                  </View>
                </View>
                {showCustom && (
                  <View style={{marginTop: 5}}>
                    <Text style={{marginLeft: 10}}>From Date</Text>
                    <View
                      style={{
                        marginHorizontal: 5,
                        height: 48,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 12,
                        backgroundColor: '#FAFAFA',
                        borderColor: Colors.grey_C0C0C0,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.grey_888888,
                          fontSize: 15,
                        }}>
                        {date ? formatDate(date) : ''}
                      </Text>
                      <TouchableOpacity
                        style={{flex: 0.1, alignItems: 'center'}}
                        onPress={showDatePicker}>
                        <Ionicons
                          name={'calendar'}
                          size={20}
                          color={Colors.grey_888888}
                          style={{alignSelf: 'center'}}
                        />
                      </TouchableOpacity>
                    </View>
                    {show && (
                      <DateTimePicker
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeformDate}
                      />
                    )}
                  </View>
                )}
                {showCustom && (
                  <View style={{marginTop: 10}}>
                    <Text style={{marginLeft: 10}}>To Date</Text>
                    <View
                      style={{
                        marginHorizontal: 5,
                        height: 48,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 12,
                        backgroundColor: '#FAFAFA',
                        borderColor: Colors.grey_C0C0C0,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.grey_888888,
                          fontSize: 15,
                        }}>
                        {date2 ? formatDate(date2) : ''}
                      </Text>
                      <TouchableOpacity
                        style={{flex: 0.1, alignItems: 'center'}}
                        onPress={showDatePicker2}>
                        <Ionicons
                          name={'calendar'}
                          size={20}
                          color={Colors.grey_888888}
                          style={{alignSelf: 'center'}}
                        />
                      </TouchableOpacity>
                    </View>
                    {show2 && (
                      <DateTimePicker
                        value={date2}
                        mode={mode2}
                        is24Hour={true}
                        display="default"
                        onChange={onChangetoDate}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>
            <View style={{flex: 1, padding: 10}}>
              <TouchableOpacity
                style={{height: 40}}
                onPress={getStatusWiseFilteredData}>
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
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={{padding: 20}}>
            <View style={{padding: 20}}>
              <View style={{backgroundColor: Colors.white}}>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                    marginTop: 50,
                  }}>
                  <View style={{flex: 1}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={branchLists}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Branch"
                      value={status}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setStatus(item?.id);
                        setIsFocus(false);
                        getFranchise(item?.id);
                      }}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 10}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={franchiseList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Franchise"
                      value={franchiseList}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setStatus(item.id);
                        setIsFocus(false);
                        getZones(item?.id);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                    marginTop: 50,
                  }}>
                  <View style={{flex: 1}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={zonesList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Zone"
                      value={status}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setStatus(item.id);
                        setIsFocus(false);
                        getAreas(item?.id);
                      }}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 10}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={areasList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Area"
                      value={status}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setStatus(item.id);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                    marginTop: 50,
                  }}>
                  <View style={{flex: 1}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={statusList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Payment Mode"
                      value={status}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setStatus(item.id);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 10}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={statusList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Collected By"
                      value={status}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setStatus(item.id);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                    marginTop: 50,
                  }}>
                  <View style={{flex: 1}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={statusList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Status"
                      value={status}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setStatus(item.id);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 10}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={statusList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Select Date Range"
                      value={status}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setStatus(item.id);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                    marginTop: 50,
                  }}>
                  <View style={{flex: 1}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={statusList}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="GSTIN"
                      value={status}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setStatus(item.id);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <TouchableOpacity style={{height: 40}}>
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
                        Apply
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
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
              
            </TouchableOpacity>
          </View> */}
        </RBSheet>
      </View>
      {modalVisible && (
        <HeaderView1
          showSideMenu
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        />
      )}
      <DialogView
        showLoadingDialog
        visible={isLoading}
        text="Loading  Data"></DialogView>
      <DialogView
        showLoadingDialog
        visible={donwloading}
        text="Downloading PDF"></DialogView>
    </SafeAreaView>
  );
};

export default BillingHistory;
const styles = StyleSheet.create({
  container: {
    paddingVertical: '2%',
    paddingHorizontal: '3%',
    // height: '100%',
    backgroundColor: '#f2f2f2',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
  },
  dropdown: {
    marginTop: 5,
    borderColor: Colors.grey_C0C0C0,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  placeholderStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.grey_888888,
    fontSize: 12,
  },
  selectedTextStyle: {
    fontFamily: 'Titillium-Semibold',
    color: '#000000',
    fontSize: 14,
  },
});
