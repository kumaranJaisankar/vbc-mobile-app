import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {formatDate} from '../../Common/utility';
import {Text} from 'react-native-paper';
import HeaderView1 from '../../Common/HeaderView1';
import {AccordionList} from 'react-native-accordion-list-view';
import {Colors} from '../../Common/Colors';
import {
  branchList,
  filterList,
  getCustomersListData,
  getFilterCustomerData,
  getFranchiseByBranchId,
  pdfDownloadAPIAPI,
  pdfPreviewAPI,
} from '../../services/MainService';
import NoData from '../../Common/NoData';
import Toast from 'react-native-toast-message';
import DialogView from '../../Common/DialogView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {format} from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import config from '../../services/api/config';
import {useNavigation} from '@react-navigation/native';
import {Platform} from 'react-native';
const GstReports = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [gstReportsData, setGstReportsData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [rgbHeight, setRgbHeight] = React.useState(370);
  const [selectedDate, setSelectedDate] = useState(1);
  const [isFocus, setIsFocus] = useState(false);
  const [gst, setGst] = useState(true);

  const [start_date, setStart_date] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [end_date, setEnd_date] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showCustom, setShowCustom] = useState(false);

  const [show, setShow] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [time, setTime] = React.useState(new Date());
  const [mode, setMode] = React.useState('date');

  const [show2, setShow2] = React.useState(false);
  const [date2, setDate2] = React.useState(new Date());
  const [time2, setTime2] = React.useState(new Date());
  const [mode2, setMode2] = React.useState('date');

  const [branchLists, setBranchList] = useState([]);
  const [franchiseList, setFranshiseList] = useState([]);

  const [branchID, setBranchID] = useState('');
  const [franchiseID, setFranchiseID] = useState('');

  const refRBSheet = useRef();
  const navigation = useNavigation();
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

  const DownloadPdf = (props, type = 'GST') => {
    setDownloading(true);
    const {config, fs} = RNFetchBlob;
    let DownloadDir = fs.dirs.DownloadDir;
    let date = format(new Date(), 'yyyy-MM-dd');
    const pdfType = type == 'GST' ? '/GST_' : '/Receipt_';
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: DownloadDir + pdfType + date + '.pdf',
        description: type == 'GST' ? 'GST' : 'Receipt',
      },
    };
    config(options)
      .fetch('GET', props)
      .then(res => {
        setDownloading(false);
        console.log('res -> ', JSON.stringify(res));
        Alert.alert(
          'Download Successful!',
          type == 'GST'
            ? 'GST downloaded successfully to your device.'
            : 'Receipt downloaded successfully to your device.',
          // 'GST downloaded successfully to your device.',
        );
        billingData();
      })
      .catch(err => {
        setDownloading(false);
        Alert.alert('Error!', 'Facing Problem to download pdf');
        console.log('res -> ', JSON.stringify(err));
      });
  };

  useEffect(() => {
    getGstReports();
    getBranchList();
  }, []);

  const getGstReports = async () => {
    var query = `${config.REACT_APP_API_URL_BILLING}/payment/enh/list?limit=10&page=1&start_date=${start_date}&end_date=${end_date}`;
    if (gst) {
      query = query + `&is_gst=True`;
    }
    setLoading(true);
    const res = await filterList(query);
    if (res.isSuccess) {
      setLoading(false);
      setGstReportsData(res?.result?.results);
    }
  };

  const getStatusWiseFilteredData = async () => {
    refRBSheet.current.close();
    // setLimit(10);
    // setPage(1);
    setLoading(true);
    var query = `${
      config.REACT_APP_API_URL_BILLING
    }/payment/enh/list?limit=${10}&page=${1}`;

    if (start_date) {
      query = query + `&start_date=${start_date}`;
    }
    if (end_date) {
      query = query + `&end_date=${end_date}`;
    }
    if (branchID) {
      query = query + `&branch=${branchID}`;
    }
    if (franchiseID) {
      query = query + `&franchise=${franchiseID}`;
    }
    if (gst) {
      query = query + `&is_gst=True`;
    }
    try {
      setLoading(true);
      const res = await filterList(query);
      console.log(res, 'gst response');
      if (res.isSuccess) {
        setLoading(false);
        setGstReportsData(res?.result?.results);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

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

  const loadMoreData = async () => {
    setPage(page + 1);
    setLimit(10);
    setLoading(true);
    var query = `${
      config.REACT_APP_API_URL_BILLING
    }/payment/enh/list?limit=${limit}&page=${page + 1}`;
    if (start_date) {
      query = query + `&created=${start_date}`;
    }
    if (end_date) {
      query = query + `&created_end=${end_date}`;
    }
    if (branchID) {
      query = query + `&branch=${branchID}`;
    }
    if (franchiseID) {
      query = query + `&franchise=${franchiseID}`;
    }
    if (gst) {
      query = query + `&is_gst=True`;
    }

    try {
      const res = await filterList(query);
      if (res?.result?.results?.length > 0) {
        setLoading(false);
        setGstReportsData(res?.result?.results);
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

  var dateTime = '';
  const formatDate = date => {
    if (date) {
      console.log('date', date);
      dateTime = format(new Date(date), 'dd/MM/yyyy');
      // dateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      return dateTime;
    }
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

  const dateList = [
    {name: 'Today', id: 1},
    {name: 'Yesterday', id: 2},
    {name: 'Last Week', id: 3},
    {name: 'Last 7 Days', id: 4},
    {name: 'Last 15 Days', id: 5},
    {name: 'Last 30 Days', id: 6},
    {name: 'Last Month', id: 7},
    {name: 'Custom', id: 8},
    {name: 'Until Today', id: 9},
  ];

  const security_deposit_list = [
    {name: 'Yes', id: 'True'},
    {name: 'False', id: 'False'},
  ];

  const dateCalculate = async value => {
    console.log('value here', value);
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
      setEnd_date(format(new Date(), 'yyyy-MM-dd'));
      const previousday = new Date(today.setDate(today.getDate() - 7));
      setStart_date(format(new Date(previousday), 'yyyy-MM-dd'));
    } else if (value == 5) {
      const today = new Date();
      const previousday = new Date(today.setDate(today.getDate() - 15));
      setStart_date(format(new Date(previousday), 'yyyy-MM-dd'));
      setEnd_date(format(new Date(today), 'yyyy-MM-dd'));
    } else if (value == 6) {
      const today = new Date();
      setEnd_date(format(new Date(), 'yyyy-MM-dd'));
      console.log('data here', end_date);
      const previousday = new Date(today.setDate(today.getDate() - 30));
      setStart_date(format(new Date(previousday), 'yyyy-MM-dd'));
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
    } else if (value == 9) {
      setStart_date('');
      setEnd_date('');
    }
  };
  const B = props => (
    <Text style={{fontWeight: 'bold', fontSize: 15}}>{props.children}</Text>
  );

  return (
    <SafeAreaView>
      <ScrollView>
        <HeaderView1
          showHeader1
          username={'GST Reports'}
          onMenuClick={() => {
            setModalVisible(true);
          }}
          showRefreshIcon
          onRefreshClicked={() => {
            //   billingData();
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
          {gstReportsData?.length > 0 ? (
            <AccordionList
              data={gstReportsData ? gstReportsData : []}
              customTitle={item => (
                <Text>
                  <B>Customer ID: </B>
                  {item?.user_id}
                </Text>
              )}
              customBody={item => (
                <Text>
                  <B>Customer Name: </B>
                  {item?.customer_name}
                  {'\n'}
                  {'\n'}
                  <B>Branch: </B>
                  {item?.branch}
                  {'\n'}
                  {'\n'}
                  <B>Franchise: </B>
                  {item?.franchise}
                  {'\n'}
                  {'\n'}
                  <B>Mobile No: </B>
                  {item?.mobile_number}
                  {'\n'}
                  {'\n'}

                  <B>Payment Id: </B>
                  {item?.payment_id}
                  {'\n'}
                  {'\n'}
                  <B>Payment Method: </B>
                  {item?.pickup_type === 'OFL' ? 'Offline' : 'Online'}
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
                  {item?.area?.franchise?.name}
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
                  {/* <B>Total GST: </B>
                  {item?.registered_email}
                  {'\n'}
                  {'\n'} */}
                  <B>Total Amount: </B>
                  {item?.amount}
                  {'\n'}
                  {'\n'}
                  <B>Collected By: </B>
                  {item?.collected_by_name}
                  {'\n'}
                  {'\n'}
                  <B>Preview: </B>
                  <A>{item?.file_path ? item?.file_path : ''}</A>
                  {'\n'}
                  {'\n'}
                  <B>Download: </B>
                  <D type="GST">{item?.file_path ? item?.file_path : ''}</D>
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
        </View>
        {gstReportsData?.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={loadMoreData}
            style={styles.loadMoreBtn}>
            <Text style={styles.btnText}>Load More</Text>
          </TouchableOpacity>
        )}
        <DialogView
          showLoadingDialog
          visible={isLoading}
          text="Loading  Data"></DialogView>
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
                    // marginTop: 50,
                  }}></View>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                  }}>
                  <View style={{flex: 2, marginLeft: 4}}>
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
                  {/* <View style={{flex: 1, marginLeft: 5}}></View> */}
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
                        }}
                      />
                    </View>
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
                  }}></View>
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
            <View style={{flex: 1, paddingHorizontal: 25}}>
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
    </SafeAreaView>
  );
};

export default GstReports;
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
