import {format} from 'date-fns';
import React from 'react';
import {useState} from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderView1 from '../../Common/HeaderView1';
import {useNavigation, useRoute} from '@react-navigation/native';

import {
  getActivationToday,
  getActivationYesterday,
  getExpiredNextDay,
  getExpiredToday,
  getExpiredYesterday,
  getExpToday,
} from '../../services/MainService';
import {useEffect} from 'react';
import KYC_ListCell from '../CustomerKYC/KYCList/KYC_ListCell';
import {Colors} from '../../Common/Colors';
import NoData from '../../Common/NoData';
import DialogView from '../../Common/DialogView';
import styles from './styles';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';
import {operations} from '../../../redux/Main';
import {bindActionCreators} from 'redux';

const ExpiryList = props => {
  const route = useRoute();
  const navigation = useNavigation();
  const windowHeight = Dimensions.get('window').height - 200;
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const paramTxt = route?.params?.paramTxt;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isSearched, setIsSearched] = useState(0);

  const [nextDay, setNextDay] = useState();

  useEffect(() => {
    if (paramTxt === 'TEXP') {
      getListOfCustomersExp();
    } else if (paramTxt === 'TEXPD') {
      getListOfCustomersExpired();
    } else if (paramTxt === 'YEXPD') {
      getExpiredListYesterday();
    } else if (paramTxt == 'NXT') {
      getExpiredNextDays();
    } else if (paramTxt == 'NXT1') {
      getExpiredNextDays1();
    } else if (paramTxt == 'NXT2') {
      getExpiredNextDays2();
    } else if (paramTxt == 'NXT3') {
      getExpiredNextDays3();
    } else if (paramTxt == 'YACT') {
      getActivationYesterdayApi();
    } else if (paramTxt == 'TACT') {
      getActivationTodayApi();
    }
  }, [paramTxt]);

  const loadMoreData = async () => {
    setIsSearched(0);
    setLoading(true);
    setLimit(10);
    setPage(page + 1);
    if (paramTxt === 'TEXP') {
      setLoading(true);
      try {
        const response = await getExpToday(
          format(new Date(), 'yyyy-MM-dd'),
          format(new Date(), 'yyyy-MM-dd'),
          limit,
          page + 1,
        );
        if (response?.isSuccess) {
          setLoading(false);
          setDataList(response?.result?.results);
        } else {
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
        console.log('response', response);
      } catch (error) {
        console.log('err', error);
        setLoading(false);
      }
    } else if (paramTxt === 'TEXPD') {
      try {
        setLoading(true);
        const response = await getExpiredToday(
          format(new Date(), 'yyyy-MM-dd'),
          format(new Date(), 'yyyy-MM-dd'),
          limit,
          page + 1,
        );
        console.log('response', response);
        if (response?.isSuccess) {
          setDataList(response?.result?.results);
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        console.log('err', error);
        setLoading(false);
      }
    } else if (paramTxt === 'YEXPD') {
      try {
        setLoading(true);
        var date = new Date();
        var end = date.setDate(date.getDate() - 1);
        const response = await getExpiredYesterday(
          format(new Date(end), 'yyyy-MM-dd'),
          format(new Date(end), 'yyyy-MM-dd'),
          limit,
          page + 1,
        );
        console.log('response', response);
        if (response?.isSuccess) {
          setDataList(response?.result?.results);
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        console.log('err', error);
        setLoading(false);
      }
    } else if (paramTxt == 'NXT') {
      try {
        setLoading(true);
        var date = new Date();
        var end = date.setDate(date.getDate() + 1);
        const response = await getExpiredNextDay(
          format(new Date(end), 'yyyy-MM-dd'),
          format(new Date(end), 'yyyy-MM-dd'),
          limit,
          page + 1,
        );
        console.log('response', response);
        if (response?.isSuccess) {
          setDataList(response?.result?.results);
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        console.log('err', error);
        setLoading(false);
      }
    } else if (paramTxt == 'NXT1') {
      //   getExpiredNextDays1();
      try {
        setLoading(true);
        var date = new Date();
        var end = date.setDate(date.getDate() + 2);
        const response = await getExpiredNextDay(
          format(new Date(end), 'yyyy-MM-dd'),
          format(new Date(end), 'yyyy-MM-dd'),
          limit,
          page + 1,
        );
        console.log('response', response);
        if (response?.isSuccess) {
          setDataList(response?.result?.results);
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        console.log('err', error);
        setLoading(false);
      }
    } else if (paramTxt == 'NXT2') {
      //   getExpiredNextDays2();
      try {
        setLoading(true);
        var date = new Date();
        var end = date.setDate(date.getDate() + 3);
        const response = await getExpiredNextDay(
          format(new Date(end), 'yyyy-MM-dd'),
          format(new Date(end), 'yyyy-MM-dd'),
          limit,
          page + 1,
        );
        console.log('response', response);
        if (response?.isSuccess) {
          setDataList(response?.result?.results);
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        console.log('err', error);
        setLoading(false);
      }
    } else if (paramTxt == 'NXT3') {
      try {
        setLoading(true);
        var date = new Date();
        var end = date.setDate(date.getDate() + 4);
        const response = await getExpiredNextDay(
          format(new Date(end), 'yyyy-MM-dd'),
          format(new Date(end), 'yyyy-MM-dd'),
          limit,
          page + 1,
        );
        console.log('response', response);
        if (response?.isSuccess) {
          setDataList(response?.result?.results);
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show({
            type: 'info',
            text1: 'No More Data Available!',
            position: 'bottom',
          });
        }
      } catch (error) {
        console.log('err', error);
        setLoading(false);
      }
    }
  };
  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={loadMoreData}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {/* {isLoading ? (
            <ActivityIndicator color="white" style={{marginLeft: 8}} />
          ) : null} */}
        </TouchableOpacity>
      </View>
    );

    return null;
  };

  const getActivationTodayApi = async () => {
    setLimit(10);
    setPage(1);
    setLoading(true);
    try {
      const response = await getActivationToday(
        format(new Date(), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
        1,
      );
      if (response?.isSuccess) {
        setLoading(false);
        setDataList(response?.result?.results);
      }
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  };

  const getActivationYesterdayApi = async () => {
    setLimit(10);
    setPage(1);
    setLoading(true);
    try {
      const date = new Date();
      const end = date.setDate(date.getDate() - 1);
      const response = await getActivationYesterday(
        format(new Date(end), 'yyyy-MM-dd'),
        format(new Date(end), 'yyyy-MM-dd'),
        1,
      );
      if (response?.isSuccess) {
        setLoading(false);
        setDataList(response?.result?.results);
      }
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  };

  const getListOfCustomersExp = async () => {
    setLimit(10);
    setPage(1);
    setLoading(true);
    try {
      const response = await getExpToday(
        format(new Date(), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
        limit,
        page,
      );
      if (response?.isSuccess) {
        setLoading(false);
        setDataList(response?.result?.results);
      }
      console.log('response', response);
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  };

  const getListOfCustomersExpired = async () => {
    setLimit(10);
    setPage(1);
    try {
      setLoading(true);
      const response = await getExpiredToday(
        format(new Date(), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
        limit,
        page,
      );
      console.log('response', response);
      if (response?.isSuccess) {
        setDataList(response?.result?.results);
        setLoading(false);
      }
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  };

  const getExpiredListYesterday = async () => {
    setLimit(10);
    setPage(1);
    try {
      setLoading(true);
      var date = new Date();
      var end = date.setDate(date.getDate() - 1);
      const response = await getExpiredYesterday(
        format(new Date(end), 'yyyy-MM-dd'),
        format(new Date(end), 'yyyy-MM-dd'),
        limit,
        page,
      );
      console.log('response', response);
      if (response?.isSuccess) {
        setDataList(response?.result?.results);
        setLoading(false);
      }
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  };

  const getExpiredNextDays = async () => {
    setLimit(10);
    setPage(1);
    try {
      setLoading(true);
      var date = new Date();
      var end = date.setDate(date.getDate() + 1);
      setNextDay(format(new Date(end), 'dd MMM, yyyy'));
      const response = await getExpiredNextDay(
        format(new Date(end), 'yyyy-MM-dd'),
        format(new Date(end), 'yyyy-MM-dd'),
        limit,
        page,
      );
      console.log('response', response);
      if (response?.isSuccess) {
        setDataList(response?.result?.results);
        setLoading(false);
      }
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  };
  const getExpiredNextDays1 = async () => {
    setLimit(10);
    setPage(1);
    try {
      setLoading(true);
      var date = new Date();
      var end = date.setDate(date.getDate() + 2);
      setNextDay(format(new Date(end), 'dd MMM, yyyy'));
      const response = await getExpiredNextDay(
        format(new Date(end), 'yyyy-MM-dd'),
        format(new Date(end), 'yyyy-MM-dd'),
        limit,
        page,
      );
      console.log('response', response);
      if (response?.isSuccess) {
        setDataList(response?.result?.results);
        setLoading(false);
      }
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  };
  const getExpiredNextDays2 = async () => {
    setLimit(10);
    setPage(1);
    try {
      setLoading(true);
      var date = new Date();
      var end = date.setDate(date.getDate() + 3);
      setNextDay(format(new Date(end), 'dd MMM, yyyy'));
      const response = await getExpiredNextDay(
        format(new Date(end), 'yyyy-MM-dd'),
        format(new Date(end), 'yyyy-MM-dd'),
        limit,
        page,
      );
      console.log('response', response);
      if (response?.isSuccess) {
        setDataList(response?.result?.results);
        setLoading(false);
      }
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  };
  const getExpiredNextDays3 = async () => {
    setLimit(10);
    setPage(1);
    try {
      setLoading(true);
      var date = new Date();
      var end = date.setDate(date.getDate() + 4);
      setNextDay(format(new Date(end), 'dd MMM, yyyy'));

      const response = await getExpiredNextDay(
        format(new Date(end), 'yyyy-MM-dd'),
        format(new Date(end), 'yyyy-MM-dd'),
        limit,
        page,
      );
      console.log('response', response);
      if (response?.isSuccess) {
        setDataList(response?.result?.results);
        setLoading(false);
      }
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderView1
        showHeader1
        username={
          paramTxt === 'TEXP'
            ? 'Today Expiry'
            : paramTxt === 'TEXPD'
            ? 'Today Expired'
            : paramTxt === 'YEXPD'
            ? 'Yesterday Expired'
            : paramTxt === 'TACT'
            ? 'Today Activations'
            : paramTxt === 'YACT'
            ? 'Yesterday Activations'
            : paramTxt === 'YEXPD'
            ? 'Yesterday Expired'
            : `Upcoming Expiry (${nextDay ? nextDay : ''})`
        }
        onMenuClick={() => {
          setModalVisible(true);
        }}
      />
      <View style={{flex: 1, margin: 10}}>
        <View>
          <View style={{backgroundColor: Colors.white}}>
            {dataList.length > 0 ? (
              <FlatList
                data={dataList}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
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
                ListFooterComponent={renderFooter}
                refreshControl={
                  <RefreshControl
                  // refreshing={isLoading}
                  //   onRefresh={getComplaintsListOnPageLoad}
                  />
                }
              />
            ) : (
              <View style={{height: windowHeight}}>
                <NoData />
              </View>
            )}
          </View>
        </View>
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
    </SafeAreaView>
  );
};

// export default ExpiryList;
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

export default connect(mapStateToProps, mapDispatchToProps)(ExpiryList);
