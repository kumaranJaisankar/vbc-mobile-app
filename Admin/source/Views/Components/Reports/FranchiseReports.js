import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-paper';
import HeaderView1 from '../../Common/HeaderView1';
import {AccordionList} from 'react-native-accordion-list-view';
import {Colors} from '../../Common/Colors';
import {
  branchList,
  filterList,
  getFranchiseByBranchId,
  getFranchiseListData,
  getFranchiseOptions,
} from '../../services/MainService';
import NoData from '../../Common/NoData';
import Toast from 'react-native-toast-message';
import DialogView from '../../Common/DialogView';
import {formatDate} from '../../Common/utility';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {format} from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import config from '../../services/api/config';
const FranchiseReports = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [franchiseReportsData, setFranchiseReportsData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [rgbHeight, setRgbHeight] = React.useState(370);
  const [selectedDate, setSelectedDate] = useState(1);
  const [isFocus, setIsFocus] = useState(false);
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
  const [franchisesms, setFranchisesms] = useState([]);
  const [franchisetype, setFranchisetype] = useState([]);
  const [franchisestatus, setFranchisestatus] = useState();
  const [franchisesmsID, setFranchisesmsID] = useState('');
  const [franchisetypeID, setFranchisetypeID] = useState('');
  const [franchisestatusID, setFranchisestatusID] = useState('');
  const refRBSheet = useRef();
  useEffect(() => {
    getRevenueReports();
    getBranchList();
    getFranchiseFilterOptions();
  }, []);

  const getRevenueReports = async () => {
    setLoading(true);
    const res = await getFranchiseListData(10, 1);
    if (res.isSuccess) {
      setLoading(false);
      setFranchiseReportsData(res?.result?.results);
    }
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
  const Sorting = (data, key) => {
    const SortingMethod = data.sort((dropdownData, sortDropdownData) =>
      dropdownData[key].localeCompare(sortDropdownData[key]),
    );
    return SortingMethod;
  };
  const getFranchiseFilterOptions = async () => {
    try {
      const response = await getFranchiseOptions();
      console.log(response.result.sms, 'Franchise options');
      if (response.isSuccess) {
        response.result.status.push({
          id: 0,
          name: 'All',
        });
        response.result.type.push({
          id: 0,
          name: 'All',
        });
        response.result.sms.push({
          id: 0,
          name: 'All',
        });
        let {status, type, sms} = response.result;

        setFranchisesms([...sms], 'name');

        setFranchisestatus([...status], 'name');

        setFranchisetype([...type], 'name');
      } else {
        console, log('error');
        // setError({
        //   text: 'Something went wrong! Please try again later.',
        //   visible: true,
        // });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Something went wrong! Please try again later.',
        // });
      }
    } catch (error) {
      console.log(error, 'franchise error');
    }
  };
  const getStatusWiseFilteredData = async () => {
    refRBSheet.current.close();
    // setLimit(10);
    // setPage(1);
    setLoading(true);
    var query = `${config.REACT_APP_API_URL_ADMIN}/accounts/reports/franchise?limit=${limit}&page=${page}`;

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
    if (franchisetypeID) {
      if (franchisetypeID !== 'All') {
        query = query + `&type=${franchisetypeID}`;
      }
    }
    if (franchisestatusID) {
      if (franchisestatusID !== 'All') {
        query = query + `&status=${franchisestatusID}`;
      }
    }
    if (franchisesmsID) {
      if (franchisesmsID !== 'All') {
        query = query + `&sms_gateway_type=${franchisesmsID}`;
      }
    }
    console.log(query, 'query');
    try {
      setLoading(true);
      const res = await filterList(query);
      console.log(res, 'ledger response');
      if (res.isSuccess) {
        setLoading(false);
        setFranchiseReportsData(res?.result?.results);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  // const loadMoreData = async () => {
  //   setLoading(true);
  //   setPage(page + 1);
  //   setLimit(10);
  //   try {
  //     const res = await getFranchiseListData(10, page + 1);
  //     if (res?.result?.results?.length > 0) {
  //       setLoading(false);
  //       setFranchiseReportsData(res?.result?.results);
  //     } else {
  //       setLoading(false);
  //       Toast.show({
  //         type: 'error',
  //         text1: 'No Data Found',
  //       });
  //     }
  //   } catch (err) {
  //     setLoading(false);
  //   }
  // };

  const loadMoreData = async () => {
    setPage(page + 1);
    setLimit(10);
    setLoading(true);
    var query = `${
      config.REACT_APP_API_URL_ADMIN
    }/accounts/reports/franchise?limit=${limit}&page=${page + 1}`;
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
    if (franchisetypeID) {
      if (franchisetypeID !== 'All') {
        query = query + `&type=${franchisetypeID}`;
      }
    }
    if (franchisestatusID) {
      if (franchisestatusID !== 'All') {
        query = query + `&status=${franchisestatusID}`;
      }
    }
    if (franchisesmsID) {
      if (franchisesmsID !== 'All') {
        query = query + `&sms_gateway_type=${franchisesmsID}`;
      }
    }
    try {
      const res = await filterList(query);
      if (res?.result?.results?.length > 0) {
        setLoading(false);
        setFranchiseReportsData(res?.result?.results);
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
  const showDatePicker = () => {
    showMode('date');
  };

  const showDatePicker2 = () => {
    showMode2('date');
  };
  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showMode2 = currentMode => {
    setShow2(true);
    setMode2(currentMode);
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
          username={'Franchise Reports'}
          onMenuClick={() => {
            setModalVisible(true);
          }}
          showRefreshIcon
          onRefreshClicked={() => {
            getRevenueReports();
            getBranchList();
            getFranchiseFilterOptions();
          }}
        />
        <View style={styles.container}>
          <View style={{marginBottom: 10}}>
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
          </View>
          {franchiseReportsData?.length > 0 ? (
            <AccordionList
              data={franchiseReportsData ? franchiseReportsData : []}
              customTitle={item => (
                <Text>
                  <B>Franchise Name: </B>
                  {item?.name}
                </Text>
              )}
              customBody={item => (
                <Text>
                  <B>Franchise Code: </B>
                  {item?.code}
                  {'\n'}
                  {'\n'}
                  <B>Branch: </B>
                  {item?.branch?.name}
                  {'\n'}
                  {'\n'}
                  <B>Type: </B>
                  {item?.type?.name}
                  {'\n'}
                  {'\n'}
                  <B>Wallet Amount: </B>
                  {item?.wallet_amount}
                  {'\n'}
                  {'\n'}
                  <B>Renewal Balance: </B>
                  {item?.renewal_amount}
                  {'\n'}
                  {'\n'}
                  <B>No.of Customers: </B>
                  {item?.customer_count}
                  {'\n'}
                  {'\n'}
                  <B>Status: </B>
                  {item?.status?.name}
                  {'\n'}
                  {'\n'}
                  <B>SMS Gateway: </B>
                  {item?.sms_gateway_type?.name}
                  {'\n'}
                  {'\n'}
                  <B>Created At: </B>
                  {formatDate(item?.created_at)}
                  {'\n'}
                  {'\n'}
                  <B>Updated At: </B>
                  {formatDate(item?.updated_at)}
                  {'\n'}
                  {'\n'}
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
        {franchiseReportsData?.length > 0 && (
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
                        data={franchisetype}
                        maxHeight={200}
                        labelField="name"
                        valueField="name"
                        placeholder="Franchise Type"
                        value={franchisetypeID}
                        onFocus={() => {
                          setIsFocus(true);
                        }}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setFranchisetypeID(item?.name);
                          setIsFocus(false);
                        }}
                      />
                    </View>
                    <View style={{flex: 1, marginLeft: 5}}>
                      <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={franchisestatus}
                        maxHeight={200}
                        labelField="name"
                        valueField="name"
                        placeholder="Franchise Status"
                        value={franchisestatusID}
                        onFocus={() => {
                          setIsFocus(true);
                        }}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setFranchisestatusID(item?.name);
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
                        data={franchisesms}
                        maxHeight={200}
                        labelField="name"
                        valueField="name"
                        placeholder="SMS Gateway"
                        value={franchisesmsID}
                        onFocus={() => {
                          setIsFocus(true);
                        }}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setFranchisesmsID(item?.name);
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

export default FranchiseReports;
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
