import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../../Common/Colors';
import HeaderView from '../../Common/HeaderView1';
import Feather from 'react-native-vector-icons/Feather';
import {
  getComplaintsData,
  getComplaintsListData,
  getPlanListData,
  getNAS,
  getAssignUsers,
  getAssignUsersV2,
  getAssignUsersV3,
  getComplaintsListDataDateWise,
} from '../../services/MainService';
import DialogView from '../../Common/DialogView';
import ComplaintsForm from './ComplaintsForm';
import ComplaintsList from './ComplaintsList';
import styles from './styles';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation, useRoute} from '@react-navigation/native';
import NoData from '../../Common/NoData';
import Search from '../../Common/Search';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
const AddComplaints = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const paramTxt = route?.params?.paramTxt;
  const valueFromser = route?.params?.valueFromser;
  const [modalVisible, setModalVisible] = useState(false);
  const [customerIDData, setCustomerIDData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [assignedToData, setAssignedToData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [isData, setData] = useState({});
  const [complaintsList, setComplaintsList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isDataAvailable, setDataAvailable] = useState(true);
  const [ticketAdd, setTicketAdd] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [complaintItem, setComplaintItem] = useState({});
  const [isFocus, setIsFocus] = useState(false);
  const [status, setStatus] = useState('');
  const [range, setRange] = useState('');
  const [search, setSearch] = useState('');
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });
  const addComplaintRedirect = props.route?.params?.addComplaint;
  const permission = props.userInfo.permissions;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getComplaintsListOnPageLoad();
      if (addComplaintRedirect) {
        showTicketAdd();
      }
      if (paramTxt === 'opn') {
        setStatus('OPN');
      }
      if (paramTxt === 'asn') {
        setStatus('ASN');
      }
      if (paramTxt === 'inp') {
        setStatus('INP');
      }
      if (paramTxt === 'rsl') {
        setStatus('RSL');
      }
      if (paramTxt === 'cld') {
        setStatus('CLD');
      }
    });
    return unsubscribe;
  }, [navigation]);

  console.log('complaintsList', complaintsList);
  const getAllOptions = async () => {
    setLoading(true);
    try {
      const response = await getComplaintsData();
      console.log(
        '🚀 ~ file: AddComplaints.js:86 ~ getAllOptions ~ response',
        response,
      );
      console.log(response);
      if (response.isSuccess) {
        const cusRes = await getAssignUsersV3();

        console.log('CUSS', cusRes);
        if (cusRes.isSuccess) {
          setCustomerIDData(cusRes?.result?.customers);
        }

        setData(response.result);
        setCategoryData(response.result.category);
        setPriorityData(response.result.priority_sla);
        setStatusData(response.result.status);
        // setSubCategoryData(response.result.subcategory);
        setDataAvailable(true);
        setLoading(false);
      } else {
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorresponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };
  const getComplaintsListLoadMore = async () => {
    setLoading(true);
    try {
      const response = await getComplaintsListData(
        limit + 10,
        page + 1,
        search,
        status,
      );
      if (response.isSuccess) {
        setLimit(prevState => prevState + 10);
        setPage(prevState => prevState + 1);
        if (response.result.results.length > 0) {
          setComplaintsList([...complaintsList, ...response.result.results]);
        }
        setDataAvailable(true);
        setLoading(false);
      } else {
        setLoading(false);
        setRenewRecent({
          text: 'No More Data Available!',
          visible: true,
        });
        // Toast.show({
        //   type: 'info',
        //   text1: 'No More Data Available!',
        //   position: 'bottom',
        // });
        //setDataAvailable(false);
      }
    } catch (error) {
      const errorresponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const getComplaintsListOnPageLoad = async () => {
    setLoading(true);
    setStatus(null);
    setLimit(10);
    setPage(1);
    setSearch(null);
    try {
      const response = await getComplaintsListData(10, 1);
      console.log(
        '🚀 ~ file: AddComplaints.js:153 ~ getComplaintsListOnPageLoad ~ response',
        response,
      );
      if (response.isSuccess) {
        if (response?.result?.results.length > 0) {
          setComplaintsList(response?.result?.results);
        }
        setDataAvailable(true);
        setLoading(false);
      } else {
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorresponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const showTicketAdd = () => {
    setIsEditClicked(false);
    setTicketAdd(0);
    getAllOptions();
  };
  const showTicketEdit = item => {
    setTicketAdd(2);
    setIsEditClicked(true);
    setComplaintItem(item);
    getAllOptions();
  };

  const showTicketList = () => {
    setIsEditClicked(false);
    setTicketAdd(1);
    getComplaintsListOnPageLoad();
  };
  // setStatus
  const statusList = [
    {name: 'Open', id: 'OPN'},
    {name: 'Closed', id: 'CLD'},
    {name: 'In-Progress', id: 'INP'},
    {name: 'Resolved', id: 'RSL'},
    {name: 'Assigned', id: 'ASN'},
  ];

  const DateRange = [
    {name: '1 day', id: '1'},
    {name: '2 days', id: '2'},
    {name: 'Greter than 3 days', id: '3'},
  ];
  useEffect(() => {
    if (paramTxt === 'opn') {
      setStatus('OPN');
    }
    if (paramTxt === 'asn') {
      setStatus('ASN');
    }
    if (paramTxt === 'inp') {
      setStatus('INP');
    }
    if (paramTxt === 'rsl') {
      setStatus('RSL');
    }
    if (paramTxt === 'cld') {
      setStatus('CLD');
    }
    if (status) {
      getStatusWiseFilteredData(status);
    }
  }, [status]);

  const getStatusWiseFilteredData = async status => {
    setComplaintsList([]);
    setLoading(true);
    setLimit(10);
    setPage(1);
    const response = await getComplaintsListData(10, 1, search, status);
    console.log(
      '🚀 ~ file: AddComplaints.js:225 ~ getStatusWiseFilteredData ~ response:',
      response,
    );
    if (response.isSuccess) {
      if (response.result.results.length > 0) {
        setComplaintsList(response.result.results);
        setDataAvailable(true);
        setLoading(false);
        return;
      } else {
        setComplaintsList([]);
        setDataAvailable(false);
        setLoading(false);
      }
      setLoading(false);
    } else {
      setDataAvailable(false);
      setLoading(false);
    }
  };
  const getDateWiseFilteredData = async status => {
    setLoading(true);
    setLimit(10);
    setPage(1);
    if (status === 1) {
      var open_date = format(new Date(), 'yyyy-MM-dd');
      var resolve_date = format(new Date(), 'yyyy-MM-dd');
    }
    const response = await getComplaintsListDataDateWise(
      10,
      1,
      '2023-01-26',
      '2023-01-28',
    );
    console.log(
      '🚀 ~ file: AddComplaints.js:242 ~ getDateWiseFilteredData ~ response',
      response,
    );
    if (response.isSuccess) {
      if (response.result.results.length > 0) {
        setComplaintsList(response.result.results);
        setDataAvailable(true);
      } else {
        setComplaintsList([]);
        setDataAvailable(false);
      }
      setLoading(false);
    } else {
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const getSearchedItem = async () => {
    setLoading(true);
    try {
      setLimit(10);
      setPage(1);
      const response = await getComplaintsListData(10, 1, search, status);
      if (response.isSuccess) {
        if (response.result.results.length > 0) {
          setComplaintsList(response.result.results);
          setDataAvailable(true);
        } else {
          setComplaintsList([]);
          setDataAvailable(false);
        }
        setLoading(false);
      } else {
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorresponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        {ticketAdd == 1 && (
          <HeaderView
            username={'Helpdesk'}
            showHeader
            placeholderText={'Customer ID'}
            showRefreshIcon
            onMenuClick={() => {
              setModalVisible(true);
            }}
            onRefreshClicked={() => {
              getComplaintsListOnPageLoad();
            }}
          />
        ) }
         {ticketAdd == 0 &&  (
          <HeaderView
            username={'Add Complaint'}
            showHeader
            onMenuClick={() => {
              setModalVisible(true);
            }}
          />
        )}
         {ticketAdd == 2 &&  (
          <HeaderView
            username={'Edit Complaint'}
            showHeader
            onMenuClick={() => {
              setModalVisible(true);
            }}
          />
        )}
        <View style={{flex: 1}}>
          {ticketAdd == 1 && (
            <View style={{padding: 5, marginTop: 20}}>
              <Search
                value={search}
                placeholderText={'Customer ID'}
                onChangeText={text => setSearch(text)}
                onClearText={() => setSearch(null)}
                onMICClicked={() => {}}
                onSearchPressed={() => {
                  getSearchedItem();
                }}
              />
              {permission.find(code => code === 376) && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 5,
                  }}>
                  <View style={{flex: 0.4}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      containerStyle={{marginTop: -22}}
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
                        getStatusWiseFilteredData(item.id);
                        setIsFocus(false);
                      }}
                      disable={paramTxt}
                    />
                  </View>
                  {/* <View style={{flex: 0.4}}>
                    <Dropdown
                      style={[styles.dropdown]}
                      containerStyle={{marginTop: -22}}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={DateRange}
                      maxHeight={200}
                      labelField="name"
                      valueField="id"
                      placeholder="Date Range"
                      value={range}
                      onFocus={() => {
                        setIsFocus(true);
                      }}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setRange(item?.id);
                        getDateWiseFilteredData(item?.id);
                        setIsFocus(false);
                      }}
                    />
                  </View> */}
                </View>
              )}
            </View>
          )}
          <View style={{flex: 1}}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              style={{}}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  justifyContent: 'center',
                  flex: 1,
                  alignItems: 'center',
                  marginTop: 5,
                  width: '100%',
                  height: '100%',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    flex: 1,
                    alignItems: 'center',
                    marginTop: ticketAdd == 1 ? 5 : 30,
                  }}>
                  <View
                    style={{
                      padding: 1,
                      borderRadius: 7,
                      borderColor: '#CACACA',
                      borderWidth: 1,
                      //width: 400,
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity onPress={() => showTicketList()}>
                      <View
                        style={
                          ticketAdd == 1
                            ? styles.nas_clicked
                            : styles.nas_normal
                        }>
                        <Text
                          style={
                            ticketAdd == 1
                              ? styles.txt_clicked
                              : styles.txt_normal
                          }>
                          List
                        </Text>
                        <Feather
                          name={'menu'}
                          size={22}
                          color={ticketAdd == 1 ? '#ffffff' : '#777777'}
                          style={{alignSelf: 'center'}}
                        />
                      </View>
                    </TouchableOpacity>
                    {props?.userInfo?.user_type === 'Staff' ? (
                      <View></View>
                    ) : (
                      <TouchableOpacity onPress={() => showTicketAdd()}>
                        <View
                          style={
                            ticketAdd == 0
                              ? styles.nas_clicked
                              : styles.nas_normal
                          }>
                          <Text
                            style={
                              ticketAdd == 0
                                ? styles.txt_clicked
                                : styles.txt_normal
                            }>
                            Add
                          </Text>
                          <Feather
                            name={'plus'}
                            size={22}
                            color={ticketAdd == 0 ? '#ffffff' : '#777777'}
                            style={{alignSelf: 'center'}}
                          />
                        </View>
                      </TouchableOpacity>
                    )}
                    {isEditClicked && (
                      <TouchableOpacity>
                        <View
                          style={
                            ticketAdd == 2
                              ? styles.nas_clicked
                              : styles.nas_normal
                          }>
                          <Text
                            style={
                              ticketAdd == 2
                                ? styles.txt_clicked
                                : styles.txt_normal
                            }>
                            Edit
                          </Text>
                          <Feather
                            name={'edit'}
                            size={22}
                            color={ticketAdd == 2 ? '#ffffff' : '#777777'}
                            style={{alignSelf: 'center'}}
                          />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {ticketAdd == 0 &&
                  !isEditClicked &&
                  permission.find(code => code === 226) && (
                    <View style={{width: '100%'}}>
                      <ComplaintsForm
                        customers={customerIDData}
                        category={categoryData}
                        priority={priorityData}
                        status={statusData}
                        subcategory={subCategoryData}
                        customerID={valueFromser}
                      />
                    </View>
                  )}
                {ticketAdd == 2 &&
                  isEditClicked &&
                  permission.find(code => code === 228) && (
                    <View style={{width: '100%'}}>
                      <ComplaintsForm
                        customers={customerIDData}
                        category={categoryData}
                        priority={priorityData}
                        status={statusData}
                        subcategory={subCategoryData}
                        isEditClicked={isEditClicked}
                        complaintItem={complaintItem}
                        showTicketList={showTicketList}
                      />
                    </View>
                  )}
                {ticketAdd == 1 && (
                  <>
                    {isDataAvailable &&
                    permission.find(code => code === 227) ? (
                      <View style={{width: '100%', marginTop: 20}}>
                        <ScrollView keyboardShouldPersistTaps="always">
                          <ComplaintsList
                            complaintsList={complaintsList}
                            isAvailable={isDataAvailable}
                            onEditClick={item => {
                              showTicketEdit(item);
                            }}
                          />
                          <View style={styles.footer}>
                            <TouchableOpacity
                              activeOpacity={0.9}
                              onPress={getComplaintsListLoadMore}
                              style={styles.loadMoreBtn}>
                              <Text style={styles.btnText}>Load More</Text>
                              {isLoading ? (
                                <ActivityIndicator
                                  color="white"
                                  style={{marginLeft: 8}}
                                />
                              ) : null}
                            </TouchableOpacity>
                          </View>
                        </ScrollView>
                      </View>
                    ) : (
                      <View
                        style={{
                          height: '80%',
                          marginTop: 30,
                        }}>
                        <NoData />
                      </View>
                    )}
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            height: 50,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowRadius: 2,
            margin: 1,
            shadowOffset: {
              width: 0,
              height: -1,
            },
            shadowColor: '#000000',
            elevation: 4,
          }}>
          <HeaderView showFooter />
        </View>
      </View>
      <DialogView
        showAlertDialog
        visible={isRenewRecent.visible}
        text={isRenewRecent.text}
        onConfirm={() => {
          setRenewRecent({text: '', visible: false});
        }}
        textConfirm={'Okay'}></DialogView>
      <DialogView
        showLoadingDialog
        visible={isLoading}
        text="Loading Complaints..."></DialogView>
      {modalVisible && (
        <HeaderView
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
  };
}
export default connect(mapStateToProps)(AddComplaints);
