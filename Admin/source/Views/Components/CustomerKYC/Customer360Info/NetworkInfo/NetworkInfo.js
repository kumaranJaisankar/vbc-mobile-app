import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {Colors} from '../../../../Common/Colors';
import DialogView from '../../../../Common/DialogView';
import NoData from '../../../../Common/NoData';
import HeaderView1 from '../../../../Common/HeaderView1';
import {getNetworkInfo} from '../../../../services/MainService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../styles';
import NetworkInfoTable from './NetworkInfoTable';
//redux
import {connect} from 'react-redux';

const NetworkInfo = props => {
  const windowHeight = Dimensions.get('window').height - 200;
  const [networkData, setNetworkData] = useState({});
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    setNetworkData(props?.networkData);
    // getSessionData();
  }, []);

  // const getSessionData = async () => {
  //   setIsDataLoading(true);
  //   try {
  //     const response = await getNetworkInfo(
  //       props.customer.username,
  //       props.customer.user,
  //     );
  //     if (response.isSuccess) {
  //       setSessionData(response.result);
  //       setIsDataAvailable(true);
  //       setIsDataLoading(false);
  //     } else {
  //       const responseMsg = response;
  //       setIsDataAvailable(false);
  //       setIsDataLoading(false);
  //     }
  //   } catch (err) {
  //     const errorresponse = err.toString();
  //     setIsDataAvailable(false);
  //     setIsDataLoading(false);
  //   }
  // };

  return (
    <View>
      <ScrollView>
        <View>
          <View style={styles.title1}>
            <View>
              <AntDesign
                name={'infocirlceo'}
                size={25}
                color={Colors.orange_295CBF}
                style={{padding: 10}}
              />
            </View>
            <View style={styles.title1_child1}>
              <Text
                style={{
                  color: Colors.orange_295CBF,
                  fontSize: 16,
                  fontFamily: 'Titillium-Semibold',
                  marginTop: 12,
                }}>
                Network Info
              </Text>
            </View>
          </View>
          <View style={{backgroundColor: Colors.white}}>
            <View style={{flex: 1}}>
              <View>
                <View
                  style={{
                    backgroundColor: Colors.white,
                    borderRadius: 10,
                    padding: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}>
                    {networkData ? (
                      <View>
                        <View>
                          <NetworkInfoTable data={networkData} />
                        </View>
                      </View>
                    ) : (
                      <View style={{height: windowHeight}}>
                        <NoData />
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <DialogView
        showLoadingDialog
        visible={isDataLoading}
        text={'Loading Session Info...'}></DialogView>
    </View>
  );
};

function mapStateToProps(state, props) {
  return {
    customer: state.mainReducers.main.customer,
  };
}

export default NetworkInfo;
