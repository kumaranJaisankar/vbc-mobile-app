import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Colors} from '../../../../../Common/Colors';
import DialogView from '../../../../../Common/DialogView';
import NoData from '../../../../../Common/NoData';
import {useNavigation} from '@react-navigation/native';
import Headerview from '../../../../../Common/HeaderView1';
import {
  getCustomerCurrentPlan,
  getCustomerChangePlans,
  getCustomerUpgradePlans,
  getWalletInfo,
  currentPlanInfoData,
  customerUpgradePlan,
  customerChangePlan,
} from '../../../../../services/MainService';
import CurrentPlanTable from './CurrentPlanTable/CurrentPlanTable';
import {RadioButton, Checkbox} from 'react-native-paper';
import ChangeUpgradePlanTable from './ChangeUpgradePlanTable/ChangeUpgradePlanTable';
//redux
import {connect} from 'react-redux';
import {operations} from '../../../../../../redux/Main';
import {bindActionCreators} from 'redux';
import Search from '../../../../../Common/Search';

const PlanRenewal = props => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [currentPlanData, setCurrentPlanData] = useState({});
  const [allPlanData, setAllPlanData] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [allUpgradePlanData, setAllUpgradePlanData] = useState([]);
  const [isDataAvailable, setDataAvailable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState('renew');
  const [walletInfo, setWalletInfo] = useState({});
  const permission = props.userInfo.permissions;
  const [isChecked, setIsChecked] = React.useState(false);
  const [upgradeType, setUpgradeType] = useState('gb');
  console.log('ccccc', props);
  useEffect(() => {
    getCurrentPlan();
  }, []);

  const getCustomerWalletInfo = async () => {
    setLoading(true);
    try {
      const response = await getWalletInfo(props?.customer?.user);
      if (response.isSuccess) {
        setWalletInfo(response.result);
        setLoading(false);
      } else {
        const responseMsg = response;
        setLoading(false);
      }
    } catch (error) {
      const errorresponse = error.toString();
      setLoading(false);
    }
  };
  const getCurrentPlan = async () => {
    console.log(props?.customer?.id,"props customer ID")
    setLoading(true);
    try {
      const response = await currentPlanInfoData(props?.customer?.id);
      console.log(
        '🚀 ~ file: PlanRenewal.js ~ line 67 ~ getCurrentPlan ~ response',
        response,
      );
      if (response?.isSuccess) {
        setCurrentPlanData(response.result);
        props.updateCustomerCurrentPlan(response.result);
        setDataAvailable(true);
        setLoading(false);
      } else {
        console.log('else here');
        const responseMsg = response;
        console.log('responseMsg else', responseMsg);
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (err) {
      console.log(err,'err here123');
      const responseMsg = err.toString();
      console.log('responseMsg err', responseMsg);
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const getChangePlans = async () => {
    setLoading(true);
    try {
      const response = await getCustomerChangePlans(
        currentPlanData?.area,
        currentPlanData?.id,
        props?.customer?.id
      );
      console.log('resss', response);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          var unique = [];
          var value;
          setAdditionalData(response?.result);
          console.log('response?.result', response?.result);
          // let arr = response?.result;
          // console.log(
          //   '🚀 ~ file: PlanRenewal.js:113 ~ getChangePlans ~ arr:',
          //   arr,
          // );

          // let newPlan = await arr?.map(item => {
          //   return {sub: item.sub_plans, cgst: item.id};
          // });
          // console.log(
          //   '🚀 ~ file: PlanRenewal.js:115 ~ getChangePlans ~ newPlan:',
          //   newPlan,
          // );

          for (const element of response?.result) {
            value = element.sub_plans;
            unique.push(
              ...value.sort(
                (a, b) =>
                  parseFloat(a.total_plan_cost) > parseFloat(b.total_plan_cost),
              ),
            );
          }
          console.log('unique', unique);

          setAllPlanData(unique);

          setDataAvailable(true);
          setLoading(false);
        } else {
          const responseMsg = response;
          setDataAvailable(false);
          setLoading(false);
        }
      } else {
        const responseMsg = response;
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (err) {
      const responseMsg = err.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const getUpgradePlans = async value => {
    console.log('here');
    console.log('here', currentPlanData?.area);
    setLoading(true);
    try {
      if (value === 1) {
        console.log('gb here', currentPlanData?.area, currentPlanData?.id);
        var response = await getCustomerUpgradePlans(
          currentPlanData?.area,
          currentPlanData?.id,
        );
      } else if (value === 2) {
        console.log('days here');
        var response = await customerUpgradePlan(
          currentPlanData?.area,
          currentPlanData?.id,
        );
      }

      console.log('upgrade gb days', response);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setAllUpgradePlanData(
            response.result?.sort((a, b) =>
              parseFloat(a.total_plan_cost) > parseFloat(b.total_plan_cost)
                ? 1
                : -1,
            ),
          );
          setDataAvailable(true);
          setLoading(false);
        } else {
          const responseMsg = response;
          console.log('here up', responseMsg);
          setDataAvailable(false);
          setLoading(false);
        }
      } else {
        console.log('here up2', responseMsg);
        const responseMsg = response;
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (err) {
      const responseMsg = err.toString();
      console.log('err', err);
      setDataAvailable(false);
      setLoading(false);
    }
  };
  console.log('all-change', allPlanData);
  return (
    <SafeAreaView style={{flex: 1}}>
      {/*   */}
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <Headerview
          showHeader1
          username={'Renew Plan'}
          onMenuClick={() => {
            setModalVisible(true);
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 25,
            marginLeft: 10,
          }}>
          {permission.find(code => code === 445) && (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <RadioButton
                value="renew"
                status={checked === 'renew' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked('renew');
                  getCurrentPlan();
                  getCustomerWalletInfo();
                }}
              />
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.black,
                  fontSize: 16,
                  // marginRight: 10,
                  marginTop: 5,
                }}>
                Renew
              </Text>
            </View>
          )}
          {permission.find(code => code === 444) && (
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <RadioButton
                  value="change"
                  status={checked === 'change' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked('change');
                    getChangePlans();
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.black,
                    fontSize: 16,
                    // marginRight: 10,
                    marginTop: 5,
                  }}>
                  Change Plan
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <RadioButton
                  value="upgrade"
                  status={checked === 'upgrade' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked('upgrade');
                    getUpgradePlans(1);
                    getCustomerWalletInfo();
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.black,
                    fontSize: 16,
                    // marginRight: 10,
                    marginTop: 5,
                  }}>
                  Upgrade Plan
                </Text>
              </View>
            </View>
          )}
        </View>
        {permission.find(code => code === 444) && (
          <View>
            {checked === 'upgrade' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <RadioButton
                    value="gb"
                    status={upgradeType === 'gb' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setUpgradeType('gb');
                      getUpgradePlans(1);
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: Colors.black,
                      fontSize: 16,
                      // marginRight: 10,
                      marginTop: 5,
                    }}>
                    GB
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <RadioButton
                    value="days"
                    status={upgradeType === 'days' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setUpgradeType('days');
                      getUpgradePlans(2);
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: Colors.black,
                      fontSize: 16,
                      // marginRight: 10,
                      marginTop: 5,
                    }}>
                    Days
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={{flex: 1}}>
          <View>
            <ScrollView
              style={{}}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
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
                  {isDataAvailable ? (
                    <View>
                      {checked == 'renew' && (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                backgroundColor: Colors.orange_295CBF,
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'Titillium-Semibold',
                                  color: '#ffffff',
                                  fontSize: 14,
                                  padding: 5,
                                }}>
                                Current Plan
                              </Text>
                            </View>
                          </View>
                          <CurrentPlanTable
                            data={currentPlanData}
                            paymentType={checked}
                          />
                        </View>
                      )}

                      {checked == 'change' && (
                        <>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              backgroundColor: Colors.orange_295CBF,
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#ffffff',
                                fontSize: 14,
                                padding: 5,
                              }}>
                              All Plans
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginVertical: 5,
                            }}>
                            <View style={{flex: 0.6, flexDirection: 'row'}}>
                              <Text
                                style={{
                                  fontFamily: 'Titillium-Semibold',
                                  color: '#000000',
                                  fontSize: 12,
                                }}>
                                Plan Name
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
                                }}>
                                Price
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
                                }}>
                                Speed
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
                                }}>
                                Data Type
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
                                }}>
                                Select
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              backgroundColor: Colors.grey_A9A9A9,
                              height: 2,
                              marginTop: 5,
                            }}></View>
                          <FlatList
                            data={allPlanData}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index}
                            enableEmptySections={true}
                            renderItem={({item, index}) => (
                              <ChangeUpgradePlanTable
                                data={allPlanData[index]}
                                walletInfo={walletInfo.wallet_info}
                                paymentType={checked}
                                extraData={currentPlanData}
                                upgradeType={upgradeType}
                                additionalData={additionalData[index]}
                              />
                            )}
                          />
                        </>
                      )}

                      {checked == 'upgrade' && (
                        <>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              backgroundColor: Colors.orange_295CBF,
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: '#ffffff',
                                fontSize: 14,
                                padding: 5,
                              }}>
                              All Plans
                            </Text>
                          </View>
                          {/* <Search
                            // value={search}
                            placeholderText={'User ID'}
                            // onChangeText={text => setSearch(text)}
                            // onClearText={() => setSearch('')}
                            // onMICClicked={() => {}}
                            // onSearchPressed={() => {
                            //   getSearchedItem();
                            // }}
                          /> */}
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginVertical: 5,
                            }}>
                            <View style={{flex: 0.6, flexDirection: 'row'}}>
                              <Text
                                style={{
                                  fontFamily: 'Titillium-Semibold',
                                  color: '#000000',
                                  fontSize: 12,
                                }}>
                                Plan Name
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
                                }}>
                                Price
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
                                }}>
                                Speed
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
                                }}>
                                Data Type
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
                                }}>
                                Select
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              backgroundColor: Colors.grey_A9A9A9,
                              height: 2,
                              marginTop: 5,
                            }}></View>
                          <FlatList
                            data={allUpgradePlanData}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index}
                            enableEmptySections={true}
                            renderItem={({item, index}) => (
                              <ChangeUpgradePlanTable
                                data={allUpgradePlanData[index]}
                                walletInfo={walletInfo.wallet_info}
                                paymentType={checked}
                                extraData={currentPlanData}
                                upgradeType={upgradeType}
                              />
                            )}
                          />
                        </>
                      )}
                    </View>
                  ) : (
                    <View style={{marginTop: 150}}>
                      <NoData />
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <DialogView
        showLoadingDialog
        visible={isLoading}
        text={'Loading...'}></DialogView>
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
    customer: state.mainReducers.main.customer,
    updateCustomerCurrentPlan:
      state.mainReducers.main.updateCustomerCurrentPlan,
    userInfo: state.mainReducers.main.userInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(operations, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanRenewal);
