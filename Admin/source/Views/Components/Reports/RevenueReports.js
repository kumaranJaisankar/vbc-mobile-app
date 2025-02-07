import React, {useEffect} from 'react';
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
import {getRevenueListData} from '../../services/MainService';
import NoData from '../../Common/NoData';
import Toast from 'react-native-toast-message';
import DialogView from '../../Common/DialogView';

const RevenueReports = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [revenueReportsData, setRevenueReportsData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    getRevenueReports();
  }, []);

  const getRevenueReports = async () => {
    setLoading(true);
    const res = await getRevenueListData(10, 1);
    if (res.isSuccess) {
      setLoading(false);
      setRevenueReportsData(res?.result?.results);
    }else {
      setLoading(false);
      // setBillingDatas([]);
      Toast.show({
        type: 'error',
        text1: 'No Data Found',
      });
    }
  };
  const loadMoreData = async () => {
    setLoading(true);
    setPage(page + 1);
    setLimit(10);
    try {
      const res = await getRevenueListData(10, page + 1);
      if (res?.result?.results?.length > 0) {
        setLoading(false);
        setRevenueReportsData(res?.result?.results);
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
    }
  };

  const B = props => (
    <Text style={{fontWeight: 'bold', fontSize: 15}}>{props.children}</Text>
  );

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <HeaderView1
            showHeader1
            username={'Revenue Reports'}
            onMenuClick={() => {
              setModalVisible(true);
            }}
            showRefreshIcon
            onRefreshClicked={() => {
              //   billingData();
            }}
          />
          <View style={{marginBottom:10}}></View>
          {revenueReportsData?.length > 0 ? (
            <AccordionList
              data={revenueReportsData ? revenueReportsData : []}
              customTitle={item => (
                <Text>
                  <B>User ID: </B>
                  {item?.customer_username}
                </Text>
              )}
              customBody={item => (
                <Text>
                     <B>Mobile No: </B>
                  {item?.mobile_number}
                  {'\n'}
                  {'\n'}
                  <B>Customer Name: </B>
                  {item?.customer_name}
                  {'\n'}
                  {'\n'}
                  <B>Payment ID: </B>
                  {item?.payment_id}
                  {'\n'}
                  {'\n'}
                  <B>Payment Method: </B>
                  {item?.pickup_type}
                  {'\n'}
                  {'\n'}
                  <B>Payment Type: </B>
                  {item?.payment_method}
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
        {revenueReportsData?.length > 0 && (
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

export default RevenueReports;
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
