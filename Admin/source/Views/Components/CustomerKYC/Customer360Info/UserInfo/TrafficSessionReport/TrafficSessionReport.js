import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';
import {connect} from 'react-redux';
import {Colors} from '../../../../../Common/Colors';
import HeaderView from '../../../../../Common/HeaderView1';
import {
  getAuthReport,
  getTrafficReport,
  reconnect,
} from '../../../../../services/MainService';
import TableData from './TableData';
import Toast from 'react-native-toast-message';
import AuthTableData from './AuthTableData';
import Spinner from 'react-native-loading-spinner-overlay';
import globalStyles from '../../../../../Common/globalStyles';

function TrafficSessionReport(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [trafficInfo, setTrafficInfo] = useState({});
  const [authinfo, setAuthInfo] = useState({});
  const [checked, setChecked] = useState('traffic');
  const [isLoading, setLoading] = useState({
    spinner: false,
    spinnerText: '',
  });

  console.log('props', props);
  useEffect(() => {
    getTrafficSessionInfo(props?.customer?.user?.username);
  }, []);

  const getTrafficSessionInfo = async uid => {
    setLoading({spinner: true, spinnerText: 'Fetching Taffic/Session Data...'});
    const res = await getTrafficReport(uid, 10, 1);
    console.log(
      '🚀 ~ file: TrafficSessionReport.js:36 ~ getTrafficSessionInfo ~ res',
      res,
    );
    if (res?.isSuccess) {
      setTrafficInfo(res?.result?.sessions_data);
      console.log(
        '🚀 ~ file: TrafficSessionReport.js:18 ~ getTrafficSessionInfo ~ res',
        res,
      );
      setLoading({spinner: false, spinnerText: ''});
    } else {
      setLoading({spinner: false, spinnerText: ''});
    }
  };
  const getAuthInfo = async () => {
    setLoading({spinner: true, spinnerText: 'Fetching Authentication data...'});
    const res = await getAuthReport(props?.customer?.user?.username);
    console.log(
      '🚀 ~ file: TrafficSessionReport.js:46 ~ getAuthInfo ~ res',
      res,
    );
    if (res?.isSuccess) {
      setAuthInfo(res?.result);
      setLoading({spinner: false, spinnerText: ''});
    } else {
      setLoading({spinner: false, spinnerText: ''});
    }
  };

  const reconnectUser = async value => {
    setLoading({spinner: true, spinnerText: 'Reconnecting User...'});
    const res = await reconnect(value);
    console.log(
      '🚀 ~ file: TrafficSessionReport.js:33 ~ reconnectUser ~ res',
      res,
    );
    if (res?.detail) {
      setLoading({spinner: false, spinnerText: ''});
      Toast.show({
        type: 'success',
        text1: res?.result?.detail,
      });
    } else {
      setLoading({spinner: false, spinnerText: ''});
      Toast.show({
        type: 'error',
        text1: res?.result?.detail,
      });
    }
  };
  console.log('props => Report', trafficInfo);
  return (
    <View>
      <HeaderView
        username={'ID : C' + props?.customer?.id}
        showHeader
        onMenuClick={() => {
          setModalVisible(true);
        }}
      />
      <View style={{flexDirection: 'row'}}>
        <RadioButton
          value="traffic"
          status={checked === 'traffic' ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked('traffic');
            getTrafficSessionInfo();
          }}
        />
        <Text
          style={{
            fontFamily: 'Titillium-Semibold',
            color: Colors.grey_888888,
            fontSize: 16,
            marginRight: 10,
            marginTop: 6,
          }}>
          Traffic/Session Report
        </Text>
        <RadioButton
          value="auth"
          status={checked === 'auth' ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked('auth');
            getAuthInfo();
          }}
        />
        <Text
          style={{
            fontFamily: 'Titillium-Semibold',
            color: Colors.grey_888888,
            fontSize: 16,
            marginTop: 6,
          }}>
          Authentication
        </Text>
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{marginLeft: 15}}>
            <Text style={{fontWeight: 'bold'}}>
              CUSTOMER NAME : {props?.customer?.first_name}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={reconnectUser} style={{height: 40}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#ffffff',
                  fontSize: 16,
                  textAlign: 'center',
                  backgroundColor: '#DC631F',
                  padding: 5,
                  borderColor: '#DC631F',
                  borderWidth: 1,
                  marginRight: 15,
                }}>
                Reconnect
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {checked === 'traffic' ? (
        <ScrollView horizontal={true}>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 5,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  ID
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}>
                  User Name
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                    paddingLeft: 20,
                    paddingRight: 60,
                  }}>
                  Start Time
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                    paddingLeft: 20,
                    paddingRight: 40,
                  }}>
                  Stop Time
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  Online Time
                </Text>
              </View>
              <View
                style={{
                  flex: 0.6,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}>
                  Download
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}>
                  Upload
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingLeft: 35,
                  paddingRight: 35,
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                  }}>
                  Total
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingLeft: 10,
                  paddingRight: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                  }}>
                  IP Address
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingLeft: 15,
                  paddingRight: 15,
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                  }}>
                  NAS IP
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingLeft: 10,
                  paddingRight: 20,
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 12,
                  }}>
                  MAC ID
                </Text>
              </View>
            </View>

            {trafficInfo && (
              <FlatList
                data={trafficInfo}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index}
                enableEmptySections={true}
                renderItem={({item, index}) => (
                  <TableData data={trafficInfo[index]} />
                )}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 12,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}>
                ID
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 12,
                  paddingLeft: 50,
                  paddingRight: 10,
                }}>
                User Name
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 12,
                  paddingLeft: 50,
                  paddingRight: 10,
                }}>
                Reply Type
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 12,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}>
                Date
              </Text>
            </View>
          </View>
          {authinfo && (
            <FlatList
              data={authinfo}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              enableEmptySections={true}
              renderItem={({item, index}) => (
                <AuthTableData data={authinfo[index]} />
              )}
            />
          )}
        </View>
      )}

      {modalVisible && (
        <HeaderView
          showSideMenu
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        />
      )}
      <Spinner
        animation={'fade'}
        overlayColor={Colors.orange_295CBF}
        indicatorStyle={globalStyles.loader}
        visible={isLoading.spinner}
        textContent={isLoading.spinnerText}
        textStyle={globalStyles.spinnerTextStyle}
      />
    </View>
  );
}

function mapStateToProps(state, props) {
  return {
    customer: state.mainReducers.main.customer,
    userInfo: state.mainReducers.main.userInfo,
  };
}

export default connect(mapStateToProps)(TrafficSessionReport);
