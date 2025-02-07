import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../Common/Colors';
import Headerview from '../../Common/HeaderView1';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import config from '../../services/api/config';
import {formatCustomDateWithTime} from '../../Common/utility';
import {
  getCustomerDasboardInfo,
  getPaymentDasboardInfo,
  getBranchDateWiseComplaintsData,
} from '../../services/MainService';
import {connect} from 'react-redux';

const DashBoard = props => {
  const navigation = useNavigation();
  var [buttonPressed, setbuttonPressed] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isData, setData] = useState([]);
  const [isExpDate, setExpDate] = useState('');
  const [dashboardData, setDashboardData] = useState({});
  const [paymentData, setPaymentData] = useState('');
  const [leadData, setLeadData] = useState({});
  const [TicektsData, SetTicektsData] = useState({});
  const [formatted, setFormatted] = useState('');
  const permission = props.userInfo.permissions;
  console.log(paymentData, 'paymentData');
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCustomerDashboardData();
      getPaymentDashboardData();
      getHelpdeskDashboardData();
    });
    return unsubscribe;
  }, [navigation]);

  console.log('this payment state', leadData);

  const checkEnvironment = () => {
    let environment = '';
    if (config.serverUrl == 'https://admin.sparkradius.in') {
      environment = 'prod';
    } else if (config.serverUrl == 'https://qa.sparkradius.in') {
      environment = 'qa';
    } else {
      environment = 'dev';
    }
    return environment;
  };
  // customer
  const getCustomerDashboardData = async () => {
    try {
      const response = await getCustomerDasboardInfo();
      if (response.isSuccess) {
        setDashboardData(response.result);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorresponse = error.toString();
    }
  };

  // payment
  const getPaymentDashboardData = async () => {
    try {
      const response = await getPaymentDasboardInfo();
      if (response.isSuccess) {
        const formattedNumber = parseInt(
          response?.result?.total_payments,
        ).toLocaleString('en-US', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        setPaymentData(formattedNumber);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorresponse = error.toString();
    }
  };

  // ticekts
  const getHelpdeskDashboardData = async () => {
    try {
      const response = await getBranchDateWiseComplaintsData();
      if (response.isSuccess) {
        SetTicektsData(response.result);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorresponse = error.toString();
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/*   */}
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <Headerview
          username={'Admin'}
          showDashboardHeader
          onMenuClick={() => {
            setModalVisible(true);
          }}
        />
        <View style={{flex: 1, marginTop: 5, padding: 20}}>
          <View style={{}}>
            <ScrollView
              style={{}}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {permission.find(code => code === 277) && (
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 16,
                  }}>
                  User Metrics
                </Text>
              )}
              <ScrollView
                horizontal={true}
                style={{flex: 1, marginTop: 15}}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                {permission.find(code => code === 277) && (
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        width: 150,
                        height: 108,
                        backgroundColor: '#DC631F',
                        borderRadius: 10,
                        flexDirection: 'row',
                        padding: 5,
                      }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('KYC_List')}>
                        <View style={{width: 95}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#ffffff',
                              fontSize: 12,
                              marginTop: 30,
                              marginLeft: 10,
                            }}>
                            TOTAL USERS
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#ffffff',
                              fontSize: 18,
                              marginLeft: 10,
                            }}>
                            {dashboardData?.total_no_of_customers
                              ? dashboardData?.total_no_of_customers
                              : '0'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        width: 150,
                        height: 108,
                        backgroundColor: '#456EFD',
                        borderRadius: 10,
                        flexDirection: 'row',
                        padding: 5,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('KYC_List', {
                            paramTxt: 'suspend',
                          })
                        }>
                        <View style={{width: 95}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#ffffff',
                              fontSize: 12,
                              marginTop: 30,
                              marginLeft: 10,
                            }}>
                            Suspended
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#ffffff',
                              fontSize: 18,
                              marginLeft: 10,
                            }}>
                            {/* {dashboardData ? '#' : ''} */}
                            {dashboardData?.total_no_of_suspended_customers
                              ? dashboardData?.total_no_of_suspended_customers
                              : '0'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        width: 150,
                        height: 108,
                        backgroundColor: '#35CD9D',
                        borderRadius: 10,
                        flexDirection: 'row',
                        padding: 5,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('KYC_List', {
                            paramTxt: 'expiry',
                          })
                        }>
                        <View style={{width: 95}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#ffffff',
                              fontSize: 12,
                              marginTop: 30,
                              marginLeft: 10,
                            }}>
                            Expiry
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#ffffff',
                              fontSize: 18,
                              marginLeft: 10,
                            }}>
                            {/* {dashboardData ? '#' : ''} */}
                            {dashboardData?.customers_by_status?.exp
                              ? dashboardData?.customers_by_status?.exp
                              : '0'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        width: 150,
                        height: 108,
                        backgroundColor: '#B039FD',
                        borderRadius: 10,
                        flexDirection: 'row',
                        padding: 5,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('KYC_List', {
                            paramTxt: 'online',
                          })
                        }>
                        <View style={{width: 95}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#ffffff',
                              fontSize: 12,
                              marginTop: 30,
                              marginLeft: 10,
                            }}>
                            Online
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#ffffff',
                              fontSize: 18,
                              marginLeft: 10,
                            }}>
                            {/* {'#'} */}
                            {dashboardData
                              ? dashboardData?.status_counts?.online
                              : '0'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        width: 150,
                        height: 108,
                        backgroundColor: '#F44848',
                        borderRadius: 10,
                        flexDirection: 'row',
                        padding: 5,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('KYC_List', {
                            paramTxt: 'active',
                          })
                        }>
                        <View style={{width: 95}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#ffffff',
                              fontSize: 12,
                              marginTop: 30,
                              marginLeft: 10,
                            }}>
                            Active
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#ffffff',
                              fontSize: 18,
                              marginLeft: 10,
                            }}>
                            {/* {'#'} */}
                            {dashboardData
                              ? dashboardData?.total_no_of_customers_active
                              : '0'}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 5,
                    }}>
                    <Ionicons
                      name={'arrow-down-circle-sharp'}
                      size={20}
                      color={Colors.white}
                      style={{padding: 3}}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 13,
                      }}>
                      -3.2% mo
                    </Text>
                  </View> */}
                    </View>
                  </View>
                )}
                {permission.find(code => code === 279) && (
                  <View
                    style={{
                      marginLeft: 10,
                      width: 150,
                      height: 108,
                      backgroundColor: '#FBAF2A',
                      borderRadius: 10,
                      flexDirection: 'row',
                      padding: 5,
                    }}>
                    <View style={{width: 125}}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#ffffff',
                          fontSize: 12,
                          marginTop: 30,
                          marginLeft: 10,
                        }}>
                        Total Payments
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#ffffff',
                          fontSize: 18,
                          marginLeft: 10,
                        }}>
                        {paymentData.toString()}
                      </Text>
                    </View>
                  </View>
                )}
                {permission.find(code => code === 278) && (
                  <View
                    style={{
                      marginLeft: 10,
                      width: 150,
                      height: 108,
                      backgroundColor: '#ff6699',
                      borderRadius: 10,
                      flexDirection: 'row',
                      padding: 5,
                    }}>
                    <View style={{width: 95}}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#ffffff',
                          fontSize: 12,
                          marginTop: 30,
                          marginLeft: 10,
                        }}>
                        Tickets
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#ffffff',
                          fontSize: 18,
                          marginLeft: 10,
                        }}>
                        {/* {TicektsData ? '#' : ''} */}
                        {TicektsData?.total_no_of_tickets
                          ? TicektsData?.total_no_of_tickets
                          : '0'}
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 16,
                  marginTop: 20,
                }}>
                All Activities
              </Text>

              <View style={{}}>
                <View style={{width: '100%', flexDirection: 'column'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 5,
                    }}>
                    <ScrollView
                      horizontal={true}
                      style={{flex: 1, marginTop: 15}}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}>
                      <TouchableOpacity onPress={() => setbuttonPressed(1)}>
                        <Text
                          // style={{
                          //   textAlign: 'center',
                          //   fontFamily: 'Titillium-Semibold',
                          //   color: '#ffffff',
                          //   fontSize: 13,
                          //   backgroundColor: '#DC631F',
                          //   padding: 5,
                          //   borderRadius: 7,
                          //   width: 90,
                          // }}
                          style={
                            buttonPressed == 1
                              ? styles.btnPress
                              : styles.btnNormal
                          }>
                          Today
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setbuttonPressed(2)}>
                        <Text
                          style={
                            buttonPressed == 2
                              ? styles.btnPress
                              : styles.btnNormal
                          }>
                          Yesterday
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setbuttonPressed(3)}>
                        <Text
                          style={
                            buttonPressed == 3
                              ? styles.btnPress1
                              : styles.btnNormal1
                          }>
                          Next 7 Days
                        </Text>
                      </TouchableOpacity>
                      {/* <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 13,
                          marginHorizontal: 10,
                          backgroundColor: '#D0D0D0',
                          padding: 5,
                          borderRadius: 7,
                          width: 90,
                        }}>
                        1 Month
                      </Text> */}
                      {/* <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 13,
                          marginHorizontal: 10,
                          backgroundColor: '#D0D0D0',
                          padding: 5,
                          borderRadius: 7,
                          width: 90,
                        }}>
                        3 Months
                      </Text>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 13,
                          marginHorizontal: 10,
                          backgroundColor: '#D0D0D0',
                          padding: 5,
                          borderRadius: 7,
                          width: 90,
                        }}>
                        6 Months
                      </Text>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 13,
                          marginHorizontal: 10,
                          backgroundColor: '#D0D0D0',
                          padding: 5,
                          borderRadius: 7,
                          width: 90,
                        }}>
                        1 Year
                      </Text>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 13,
                          marginHorizontal: 10,
                          backgroundColor: '#D0D0D0',
                          padding: 5,
                          borderRadius: 7,
                          width: 90,
                        }}>
                        2 Years
                      </Text> */}
                    </ScrollView>
                  </View>
                  {buttonPressed == 1 && (
                    <View
                      style={{
                        flexDirection: 'column',
                        borderRadius: 5,
                        marginTop: 15,
                        backgroundColor: Colors.grey_F8F8F8,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Activations
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {dashboardData?.today_no_of_customers
                              ? dashboardData?.today_no_of_customers
                              : 0}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Expiry
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {dashboardData?.today_expiry
                              ? dashboardData?.today_expiry
                              : 0}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 2,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Renewal
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData?.today_renewal?.count
                                ? dashboardData?.today_renewal?.count
                                : 0}
                              /
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.today_renewal?.amount
                                ? dashboardData?.today_renewal?.amount.toFixed(
                                    2,
                                  )
                                : 0}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Payments
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData?.today_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.today_payments &&
                                    dashboardData.today_payments.reduce(
                                      (a, v) => (a = a + v.count),

                                      0,
                                    )}
                                </>
                              ) : (
                                0
                              )}
                              /{' '}
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.today_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.today_payments &&
                                    dashboardData.today_payments
                                      .reduce(
                                        (a, v) => (a = a + v.amount),

                                        0,
                                      )
                                      .toFixed(2)}
                                </>
                              ) : (
                                0
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Online Pay
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData.today_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.today_payments &&
                                    dashboardData.today_payments

                                      .filter(
                                        item => item.pickup_type === 'ONL',
                                      )

                                      .reduce((acc, curr) => {
                                        if (curr) {
                                          acc = acc + curr.count;
                                        }

                                        return acc;
                                      }, 0)}
                                </>
                              ) : (
                                0
                              )}
                              /{' '}
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.today_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.today_payments &&
                                    dashboardData.today_payments

                                      .filter(
                                        item => item.pickup_type === 'ONL',
                                      )

                                      .reduce((acc, curr) => {
                                        if (curr) {
                                          acc = acc + curr.amount;
                                        }

                                        return acc;
                                      }, 0)}
                                </>
                              ) : (
                                0
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  {buttonPressed == 2 && (
                    <View
                      style={{
                        flexDirection: 'column',
                        borderRadius: 5,
                        marginTop: 15,
                        backgroundColor: Colors.grey_F8F8F8,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Activations
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {dashboardData?.yesterday_activations
                              ? dashboardData?.yesterday_activations
                              : 0}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Expiry
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {dashboardData?.yesterday_expiry
                              ? dashboardData?.yesterday_expiry
                              : 0}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 2,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Renewal
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData?.yesterday_renewal
                                ?.yesterday_renwals
                                ? dashboardData?.yesterday_renewal
                                    ?.yesterday_renwals
                                : 0}
                              /
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.yesterday_renewal?.amount
                                ? dashboardData?.yesterday_renewal?.amount.toFixed(
                                    2,
                                  )
                                : 0}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Payments
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData?.yesterday_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.yesterday_payments &&
                                    dashboardData.yesterday_payments.reduce(
                                      (a, v) => (a = a + v.count),

                                      0,
                                    )}
                                </>
                              ) : (
                                0
                              )}
                              /{' '}
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.yesterday_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.yesterday_payments &&
                                    dashboardData.yesterday_payments
                                      .reduce(
                                        (a, v) => (a = a + v.amount),

                                        0,
                                      )
                                      .toFixed(2)}
                                </>
                              ) : (
                                0
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Online Pay
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {' '}
                              {dashboardData?.yesterday_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.yesterday_payments &&
                                    dashboardData.yesterday_payments

                                      .filter(
                                        item => item.pickup_type === 'ONL',
                                      )

                                      .reduce((acc, curr) => {
                                        if (curr) {
                                          acc = acc + curr.count;
                                        }

                                        return acc;
                                      }, 0)}
                                </>
                              ) : (
                                0
                              )}
                              /{' '}
                            </Text>
                            <FontAwesome
                              name={'rupee'}
                              size={15}
                              color={Colors.black}
                              style={{padding: 3}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 12,
                              }}>
                              {dashboardData?.yesterday_payments ? (
                                <>
                                  {dashboardData &&
                                    dashboardData.yesterday_payments &&
                                    dashboardData.yesterday_payments

                                      .filter(
                                        item => item.pickup_type === 'ONL',
                                      )

                                      .reduce((acc, curr) => {
                                        if (curr) {
                                          acc =
                                            acc + curr.amount
                                              ? acc + curr.amount
                                              : 0;
                                        }

                                        return acc;
                                      }, 0)}
                                </>
                              ) : (
                                0
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  {buttonPressed == 3 && (
                    <View
                      style={{
                        flexDirection: 'column',
                        borderRadius: 5,
                        marginTop: 15,
                        backgroundColor: Colors.grey_F8F8F8,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            Expiry
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {dashboardData?.upcoming_user_expiry_next7days
                              ? dashboardData?.upcoming_user_expiry_next7days
                              : 0}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
              {/* complaints */}
              {buttonPressed == 1 && (
                <>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      marginTop: 20,
                    }}>
                    Complaints
                  </Text>
                  <View style={{}}>
                    <View style={{width: '100%', flexDirection: 'column'}}>
                      <View
                        style={{
                          flexDirection: 'column',
                          borderRadius: 5,
                          marginTop: 15,
                          backgroundColor: Colors.grey_F8F8F8,
                          padding: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Open
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.today_complaint_counts?.opn
                                ? dashboardData?.today_complaint_counts?.opn
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Assigned
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.today_complaint_counts?.asn
                                ? dashboardData?.today_complaint_counts?.asn
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              In Progress
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.today_complaint_counts?.inp
                                ? dashboardData?.today_complaint_counts?.inp
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Resolved
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.today_complaint_counts?.rsl
                                ? dashboardData?.today_complaint_counts?.rsl
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Closed
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.today_complaint_counts?.cld
                                ? dashboardData?.today_complaint_counts?.cld
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                      </View>
                    </View>
                  </View>
                  {/* <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 16,
                  marginTop: 20,
                }}>
                Leads & New Registrations
              </Text> */}
                  {/* <View style={{}}>
                <View style={{width: '100%', flexDirection: 'column'}}>
                <View
                      style={{
                        flexDirection: 'column',
                        borderRadius: 5,
                        marginTop: 15,
                        backgroundColor: Colors.grey_F8F8F8,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                           Leads
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {0}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          height: 2,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>
                          <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                         
                              New Registrations
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {0}
                          </Text>
                        </View>
                      </View>
                    </View>
                </View>
                </View> */}
                </>
              )}
              {/* leads */}
              {buttonPressed == 2 && (
                <>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      marginTop: 20,
                    }}>
                    Complaints
                  </Text>
                  <View style={{}}>
                    <View style={{width: '100%', flexDirection: 'column'}}>
                      <View
                        style={{
                          flexDirection: 'column',
                          borderRadius: 5,
                          marginTop: 15,
                          backgroundColor: Colors.grey_F8F8F8,
                          padding: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Open
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.yesterday_complaint_counts?.opn
                                ? dashboardData?.yesterday_complaint_counts?.opn
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Assigned
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.yesterday_complaint_counts?.asn
                                ? dashboardData?.yesterday_complaint_counts?.asn
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              In Progress
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.yesterday_complaint_counts?.inp
                                ? dashboardData?.yesterday_complaint_counts?.inp
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Resolved
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.yesterday_complaint_counts?.rsl
                                ? dashboardData?.yesterday_complaint_counts?.rsl
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              Closed
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#000000',
                                fontSize: 14,
                              }}>
                              {dashboardData?.yesterday_complaint_counts?.cld
                                ? dashboardData?.yesterday_complaint_counts?.cld
                                : 0}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: '#989898',
                            marginVertical: 5,
                          }}></View>
                      </View>
                    </View>
                  </View>
                  {/* <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 16,
                  marginTop: 20,
                }}>
                Leads & New Registrations
              </Text>
              <View style={{}}>
                <View style={{width: '100%', flexDirection: 'column'}}>
                <View
                      style={{
                        flexDirection: 'column',
                        borderRadius: 5,
                        marginTop: 15,
                        backgroundColor: Colors.grey_F8F8F8,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                           Leads
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {0}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          height: 2,
                          width: '100%',
                          backgroundColor: '#989898',
                          marginVertical: 5,
                        }}></View>
                          <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                         
                              New Registrations
                          </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontFamily: 'Titillium-Semibold',
                              color: '#000000',
                              fontSize: 14,
                            }}>
                            {0}
                          </Text>
                        </View>
                      </View>
                    </View>
                </View>
                </View> */}
                </>
              )}
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            marginBottom: 5,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontFamily: 'Titillium-Semibold',
              color: Colors.orange_295CBF,
            }}>
            {'Prod' + '-' + '22-12-2022 12:30'}
          </Text>
        </View>

        <View
          style={{
            height: 50,
            backgroundColor: Colors.grey_F8F8F8,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowRadius: 2,
            margin: 1,
            shadowOffset: {
              width: 0,
              height: -1,
            },
            shadowColor: '#000000',
            elevation: 5,
          }}>
          <Headerview showFooter />
        </View>
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
  };
}
export default connect(mapStateToProps)(DashBoard);

const styles = StyleSheet.create({
  btnNormal: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#000000',
    fontSize: 14,
    width: 78,
    height: 38,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
  btnPress: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#ffffff',
    fontSize: 14,
    width: 78,
    height: 38,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
  btnNormal1: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#000000',
    fontSize: 14,
    width: 90,
    height: 38,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
  btnPress1: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#ffffff',
    fontSize: 14,
    width: 90,
    height: 38,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
});
