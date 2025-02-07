import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
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
  getAssignUsers,
} from '../../services/MainService';
import DialogView from '../../Common/DialogView';
import ComplaintsList from '../Complaints/ComplaintsList';
import styles from '../Complaints/styles';
import {useNavigation} from '@react-navigation/native';
import NoData from '../../Common/NoData';
import Search from '../../Common/Search';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
const PickUpLists = props => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [customerIDData, setCustomerIDData] = useState([]);
  const [isData, setData] = useState({});
  const [pickUpList, setPickUpsList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isDataAvailable, setDataAvailable] = useState(true);
  const [ticketAdd, setTicketAdd] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [complaintItem, setComplaintItem] = useState({});
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const addComplaintRedirect = props.route?.params?.addComplaint;
  const permission = props.userInfo.permissions;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getComplaintsListOnPageLoad();
      if (addComplaintRedirect) {
        showTicketAdd();
      }
    });
    return unsubscribe;
  }, [navigation]);

  const getAllOptions = async () => {
    setLoading(true);
    try {
      const response = await getComplaintsData();
      console.log(response);
      if (response.isSuccess) {
        const cusRes = await getAssignUsers();
        if (cusRes.isSuccess) {
          setCustomerIDData(cusRes.result.customers);
        }
        setData(response.result);
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
          setPickUpsList([...pickUpList, ...response.result.results]);
        }
        setDataAvailable(true);
        setLoading(false);
      } else {
        setLoading(false);
        Toast.show({
          type: 'info',
          text1: 'No More Data Available!',
          position: 'bottom',
        });
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
      if (response.isSuccess) {
        if (response.result.results.length > 0) {
          setPickUpsList(response.result.results);
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

 
  const getSearchedItem = async () => {
    setLoading(true);
    try {
      setLimit(10);
      setPage(1);
      const response = await getComplaintsListData(10, 1, search, status);
      if (response.isSuccess) {
        if (response.result.results.length > 0) {
          setPickUpsList(response.result.results);
          setDataAvailable(true);
        } else {
          setPickUpsList([]);
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
        {ticketAdd == 1 ? (
          <HeaderView
            username={'PickUps'}
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
        ) : (
          <HeaderView
            username={'Add Complaint'}
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
                   
                  </View>
                </View>
               
                {ticketAdd == 1 && (
                  <>
                    {isDataAvailable &&
                    permission.find(code => code === 227) ? (
                      <View style={{width: '100%', marginTop: 20}}>
                        <ScrollView keyboardShouldPersistTaps="always">
                          <ComplaintsList
                            complaintsList={pickUpList}
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
export default connect(mapStateToProps)(PickUpLists);
