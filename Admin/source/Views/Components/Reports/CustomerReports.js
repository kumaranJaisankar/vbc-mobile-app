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
  getCustomersListData,
  getFilterCustomerData,
  getFranchiseByBranchId,
  getZoneByFranchiseId,
  getAreaByZoneId,
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

const CustomerReports = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [customerReportsData, setCustomerReportsData] = React.useState([]);
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
  const [zonesList, setZonesList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [branchID, setBranchID] = useState('');
  const [franchiseID, setFranchiseID] = useState('');
  const [zoneID, setZoneID] = useState('');
  const [areaID, setAreaID] = useState('');

  const refRBSheet = useRef();
  useEffect(() => {
    getCustomerReports();
    getBranchList();
  }, []);

  const getCustomerReports = async () => {
    var query = `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/new?limit=10&page=1&created=${start_date}&created_end=${end_date}`;
    setLoading(true);
    const res = await getFilterCustomerData(query);
    if (res.isSuccess) {
      setLoading(false);
      setCustomerReportsData(res?.result?.results);
    }
  };

  const getStatusWiseFilteredData = async () => {
    refRBSheet.current.close();
    setLimit(10);
    setPage(1);
    setLoading(true);
    var query = `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/new?limit=${limit}&page=${page}`;

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
    if (zoneID) {
      query = query + `&zone=${zoneID}`;
    }
    if (areaID) {
      query = query + `&area=${areaID}`;
    }
    try {
      setLoading(true);
      const res = await getFilterCustomerData(query);
      if (res.isSuccess) {
        setLoading(false);
        setCustomerReportsData(res?.result?.results);
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
      setAreaList(res?.result);
    } else {
      setAreaList([]);
    }
  };
  const loadMoreData = async () => {
    setPage(page + 1);
    setLimit(10);
    setLoading(true);
    var query = `${
      config.REACT_APP_API_URL_CUSTOMER
    }/customers/v3/list/new?limit=${limit}&page=${page + 1}`;
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
    if (zoneID) {
      query = query + `&zone=${zoneID}`;
    }
    if (areaID) {
      query = query + `&area=${areaID}`;
    }
    try {
      const res = await getFilterCustomerData(query);
      if (res?.result?.results?.length > 0) {
        setLoading(false);
        setCustomerReportsData(res?.result?.results);
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
    console.log('date', date);
    dateTime = format(new Date(date), 'dd/MM/yyyy');
    // dateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return dateTime;
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
      setEnd_date(format(new Date(currentDate), 'yyyy-MM-dd'));
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
          username={'Customer Reports'}
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
          {customerReportsData?.length > 0 ? (
            <AccordionList
              data={customerReportsData ? customerReportsData : []}
              customTitle={item => (
                <Text>
                  <B>Customer ID: </B>
                  {item?.user?.username}
                </Text>
              )}
              customBody={item => (
                <Text>
                  <B>Status: </B>
                  {item?.status}
                  {'\n'}
                  {'\n'}
                  <B>Mobile No: </B>
                  {item?.register_mobile}
                  {'\n'}
                  {'\n'}
                  <B>Name: </B>
                  {item?.first_name}
                  {'\n'}
                  {'\n'}
                  <B>Plan: </B>
                  {item?.service_plan?.package_name}
                  {'\n'}
                  {'\n'}
                  <B>Plan Updated: </B>
                  {formatDate(item?.plan_updated)}
                  {'\n'}
                  {'\n'}
                  <B>Plan Due Date: </B>
                  {formatDate(item?.expiry_date)}
                  {'\n'}
                  {'\n'}
                  <B>Branch: </B>
                  {item?.area?.zone?.branch?.name}
                  {'\n'}
                  {'\n'}
                  <B>Franchise: </B>
                  {item?.area?.franchise?.name}
                  {'\n'}
                  {'\n'}
                  <B>Zone: </B>
                  {item?.area?.zone?.name}
                  {'\n'}
                  {'\n'}
                  <B>Area: </B>
                  {item?.area?.name}
                  {'\n'}
                  {'\n'}
                  <B>Email: </B>
                  {item?.registered_email}
                  {'\n'}
                  {'\n'}
                  <B>Invoice No: </B>
                  {item?.last_invoice_id}
                  {'\n'}
                  {'\n'}
                  <B>Installation Charges: </B>
                  {item?.user_advance_info?.installation_charges}
                  {'\n'}
                  {'\n'}
                  <B>Security Deposit: </B>
                  {item?.user_advance_info?.security_deposit}
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
        {customerReportsData?.length > 0 && (
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
                          getZones(item?.id);
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
                    padding: 10,
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
                      data={areaList?.sort((a, b) => a.id - b.id)}
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

export default CustomerReports;
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
