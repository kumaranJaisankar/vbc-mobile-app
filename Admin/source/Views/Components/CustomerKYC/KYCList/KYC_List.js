import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Colors} from '../../../Common/Colors';
import {strings} from '../../../../strings/i18n';
import Headerview from '../../../Common/HeaderView1';
import Search from '../../../Common/Search';
import {
  getActCustomersListData,
  getCustomersListData,
  getDeactiveCustomersListData,
  getExpCustomersListData,
  getHoldCustomersListData,
  getOnlineCustomersListData,
  getProvCustomersListData,
  getSuspendCustomersListData,
} from '../../../services/MainService';
import DialogView from '../../../Common/DialogView';
import NoData from '../../../Common/NoData';
import KYC_ListCell from './KYC_ListCell';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './styles';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
//redux
import {operations} from '../../../../redux/Main';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {useDebounce} from '../../../../hooks/useDebounce';

const KYC_List = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const paramTxt = route?.params?.paramTxt;
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const [isData, setData] = useState({});
  const [customerData, setCustomerData] = useState([]);
  const [isDataAvailable, setDataAvailable] = useState(false);
  const [isNoDataAvailable, setNoDataAvailable] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isSearched, setIsSearched] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const permission = props.userInfo.permissions;
  const searchQuery = useDebounce(search, 1500);
  useEffect(() => {
    getCustomerList();
  }, []);

  useEffect(() => {
    if (searchQuery || search?.length < 0) getSearchedItem();
  }, [searchQuery]);

  const getCustomerList = async () => {
    setIsSearched(0);
    setLoading(true);
    setSearch('');
    setLimit(10);
    setPage(1);
    if (paramTxt === 'expiry') {
      try {
        const response = await getExpCustomersListData(10, 1);
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData(response.result.results);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          console.log(
            '🚀 ~ file: KYC_List.js:77 ~ getCustomerList ~ responseMsg',
            responseMsg,
          );
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'active') {
      try {
        const response = await getActCustomersListData(10, 1);
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData(response.result.results);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'online') {
      try {
        const response = await getOnlineCustomersListData(10, 1);
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData(response.result.results);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'suspend') {
      try {
        const response = await getSuspendCustomersListData(10, 1);
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData(response.result.results);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'prov') {
      try {
        const response = await getProvCustomersListData(10, 1);
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData(response.result.results);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'hld') {
      try {
        const response = await getHoldCustomersListData(10, 1);
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData(response.result.results);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'dct') {
      try {
        const response = await getDeactiveCustomersListData(10, 1);
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData(response.result.results);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else {
      try {
        const response = await getCustomersListData(10, 1);
        console.log(
          '🚀 ~ file: KYC_List.js:166 ~ getCustomerList ~ response:',
          response,
        );
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData(response.result.results);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    }
  };
  const loadMoreData = async () => {
    setIsSearched(0);
    setLoading(true);
    setLimit(10);
    setPage(page + 1);
    if (paramTxt === 'expiry') {
      try {
        const response = await getExpCustomersListData(limit, page + 1, search);
        console.log(
          '🚀 ~ file: KYC_List.js:119 ~ loadMoreData ~ response',
          response,
        );
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData([...customerData, ...response.result.results]);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'active') {
      try {
        const response = await getExpCustomersListData(limit, page + 1, search);
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData([...customerData, ...response.result.results]);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'online') {
      try {
        const response = await getOnlineCustomersListData(
          limit,
          page + 1,
          search,
        );
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData([...customerData, ...response.result.results]);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'suspend') {
      try {
        const response = await getSuspendCustomersListData(
          limit,
          page + 1,
          search,
        );
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData([...customerData, ...response.result.results]);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'prov') {
      try {
        const response = await getProvCustomersListData(
          limit,
          page + 1,
          search,
        );
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData([...customerData, ...response.result.results]);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'hld') {
      try {
        const response = await getHoldCustomersListData(
          limit,
          page + 1,
          search,
        );
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData([...customerData, ...response.result.results]);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else if (paramTxt === 'dct') {
      try {
        const response = await getDeactiveCustomersListData(
          limit,
          page + 1,
          search,
        );
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData([...customerData, ...response.result.results]);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else {
      try {
        const response = await getCustomersListData(limit, page + 1, search);
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData([...customerData, ...response.result.results]);
          }
          setDataAvailable(true);
          setNoDataAvailable(false);
          setLoading(false);
        } else {
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    }
  };
  const getComplaintsListOnPageLoad = async () => {
    setIsSearched(0);
    setSearch('');
    setLoading(true);
    try {
      if (paramTxt === 'expiry') {
        var response = await getExpCustomersListData(10, 1, search);
      } else if (paramTxt === 'active') {
        var response = await getActCustomersListData(10, 1, search);
      } else if (paramTxt === 'online') {
        var response = await getOnlineCustomersListData(10, 1, search);
      } else if (paramTxt === 'suspend') {
        var response = await getSuspendCustomersListData(10, 1, search);
      } else if (paramTxt === 'prov') {
        var response = await getProvCustomersListData(10, 1, search);
      } else if (paramTxt === 'hld') {
        var response = await getHoldCustomersListData(10, 1, search);
      } else if (paramTxt === 'dct') {
        var response = await getDeactiveCustomersListData(10, 1, search);
      } else {
        var response = await getCustomersListData(10, 1, search);
      }
      if (response.isSuccess) {
        setLimit(prevLimit => prevLimit + 10);
        setPage(prevPage => prevPage + 1);
        console.log(response);
        setData(response.result);
        if (response.result.results.length > 0) {
          setCustomerData(response.result.results);
        }
        setDataAvailable(true);
        setNoDataAvailable(false);
        setLoading(false);
      } else {
        const responseMsg = response;
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorresponse = error.toString();
      setNoDataAvailable(true);
      setDataAvailable(false);
      setLoading(false);
    }
  };
  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={loadMoreData}
          disabled={customerData.length < 10}
          style={[
            styles.loadMoreBtn,
            customerData.length < 10 && styles.disabledBtn,
          ]}>
          <Text style={styles.btnText}>Load More</Text>
          {/* {isLoading ? (
            <ActivityIndicator color="white" style={{marginLeft: 8}} />
          ) : null} */}
        </TouchableOpacity>
      </View>
    );

    return null;
  };
  const getSearchedItem = async () => {
    if (search) {
      setLoading(true);
      try {
        if (paramTxt === 'expiry') {
          var response = await getExpCustomersListData(10, 1, search);
        } else if (paramTxt === 'active') {
          var response = await getActCustomersListData(10, 1, search);
        } else if (paramTxt === 'online') {
          var response = await getOnlineCustomersListData(10, 1, search);
        } else if (paramTxt === 'suspend') {
          var response = await getSuspendCustomersListData(10, 1, search);
        } else {
          var response = await getCustomersListData(10, 1, search);
        }
        if (response.isSuccess) {
          setData(response.result);
          if (response.result.results.length > 0) {
            setCustomerData(response.result.results);
            setLimit(10);
            setPage(1);
            setLoading(false);
          } else {
            setCustomerData([]);
            setNoDataAvailable(true);
            setDataAvailable(false);
            setLoading(false);
          }
          // setDataAvailable(true);
          // setNoDataAvailable(false);
          // setLoading(false);
        } else {
          setCustomerData([]);
          const responseMsg = response;
          setNoDataAvailable(true);
          setDataAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } else {
      getCustomerList();
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        {permission.find(code => code === 364) ? (
          <Headerview
            showHeader1
            showAddIcon
            username={
              paramTxt === 'expiry'
                ? 'Expired List'
                : paramTxt === 'active'
                ? 'Active List'
                : paramTxt === 'online'
                ? 'Online Customer List'
                : paramTxt === 'suspend'
                ? 'Suspended Customer List'
                : paramTxt === 'prov'
                ? 'Provisioning Customer List'
                : paramTxt === 'hld'
                ? 'Hold Customer List'
                : paramTxt === 'dct'
                ? 'Deactivated Customer List'
                : 'Customer List'
            }
            onAddClicked={() => {
              navigation.navigate('KYC_Add_Update', {
                status: 'add',
              });
            }}
            onMenuClick={() => {
              setModalVisible(true);
            }}
            showRefreshIcon
            onRefreshClicked={() => {
              getComplaintsListOnPageLoad();
            }}
          />
        ) : (
          <Headerview
            showHeader1
            username={'Customer List'}
            onMenuClick={() => {
              setModalVisible(true);
            }}
            showRefreshIcon
            onRefreshClicked={() => {
              getComplaintsListOnPageLoad();
            }}
          />
        )}
        <View style={{flex: 1, margin: 10}}>
          <Search
            value={search}
            placeholderText={'User ID'}
            onChangeText={text => setSearch(text)}
            onClearText={() => setSearch('')}
            onMICClicked={() => {}}
            onSearchPressed={() => {
              getSearchedItem();
            }}
          />
          {customerData?.length > 0 ? (
            <FlatList
              data={customerData}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => (
                <KYC_ListCell
                  itemdata={customerData[index]}
                  onItemClick={() => {
                    props.updateCustomerInformation(customerData[index]);
                    navigation.navigate('Customer360Info');
                  }}
                />
              )}
              ListFooterComponent={isSearched == 0 ? renderFooter : null}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={getComplaintsListOnPageLoad}
                />
              }
              style={{marginTop: 5}}
            />
          ) : (
            <View style={{height: '80%'}}>
              <NoData />
            </View>
          )}
        </View>

        <DialogView
          showLoadingDialog
          visible={isLoading}
          text={
            paramTxt === 'expiry'
              ? 'Loading Expired Customers List...'
              : paramTxt === 'active'
              ? 'Loading Active Customers List...'
              : paramTxt === 'online'
              ? 'Loading Online Customers List...'
              : paramTxt === 'suspend'
              ? 'Loading Suspended Customers List...'
              : 'Loading Customer List...'
          }></DialogView>
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

export default connect(mapStateToProps, mapDispatchToProps)(KYC_List);
