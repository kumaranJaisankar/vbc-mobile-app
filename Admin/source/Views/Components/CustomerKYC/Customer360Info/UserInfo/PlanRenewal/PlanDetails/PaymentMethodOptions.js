import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Colors} from '../../../../../../Common/Colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import {RadioButton} from 'react-native-paper';
import {makePayment} from '../../../../../../services/MainService';
import Spinner from 'react-native-loading-spinner-overlay';
import globalStyles from '../../../../../../Common/globalStyles';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import apiConfig from '../../../../../../services/api/config';
import {openWSConnection} from '../../../../../../services/api';
//redux
import {connect} from 'react-redux';

const PaymentMethodOptions = props => {
  const navigation = useNavigation();
  const [paymentMethodChecked, setPaymentMethodChecked] = useState({});
  const [isLoading, setLoading] = useState({spinner: false, spinnerText: ''});
  const [paymentResponse, setPaymentResponse] = useState({});

  const makePaymentRequest = async () => {
    props?.paymentMethodRBSheet.current.close();
    setLoading({spinner: true, spinnerText: 'Loading'});
    try {
      let body = {
        customer: {
          name: props?.customerCurrentPlan.customer_name,
          email: props?.customerCurrentPlan.email,
          contact: props?.customerCurrentPlan.mobile_number,
        },
        gst: {
          cgst: props?.isCurrentPlan
            ? props?.customerCurrentPlan.plan_cgst
            : props?.allPlanData.plan_cgst,
          sgst: props?.isCurrentPlan
            ? props?.customerCurrentPlan.plan_sgst
            : props?.allPlanData.plan_sgst,
        },
        amount: props?.isCurrentPlan
          ? props?.customerCurrentPlan.plan_cost
          : props?.allPlanData.total_plan_cost.toString(),
        gateway_id: paymentMethodChecked.id,
        source: 'IP',
        payload: {
          product: {
            id: props?.isCurrentPlan
              ? props?.customerCurrentPlan.id
              : props?.allPlanData.id,
            name: props?.isCurrentPlan
              ? props?.customerCurrentPlan.plan_name
              : props?.allPlanData.package_name,
          },
          customer: {
            name: props?.customerCurrentPlan.customer_name,
            email: props?.customerCurrentPlan.email,
            contact: props?.customerCurrentPlan.mobile_number,
          },
        },
      };
      const response = await makePayment(body);
      if (response.isSuccess) {
        setPaymentResponse(response.result);
        setLoading({spinner: false, spinnerText: ''});
        navigation.navigate('PaymentGateWayWebView', {
          url: response.result.next,
        });
        openWSConnection(response.result.payment_id, navigation);
      } else {
        const errorresponse = response;
        setLoading({spinner: false, spinnerText: ''});
      }
    } catch (error) {
      const errorresponse = error.toString();
      setLoading({spinner: false, spinnerText: ''});
    }
  };


  return (
    <View>
      <RBSheet
        ref={props?.paymentMethodRBSheet}
        height={500}
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
              height: -20,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 20,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View style={{padding: 10}}>
          <Text
            style={[styles.textStyle, {marginTop: 10}, {fontWeight: 'bold'}]}>
            Select Payment Method
          </Text>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginTop: 15,
              marginLeft: 5,
            }}>
            {/* {props?.paymentMethodListData?.map(val => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <RadioButton
                    value={val.gateway.name}
                    status={
                      Object.keys(paymentMethodChecked).length == 0
                        ? 'unchecked'
                        : paymentMethodChecked.gateway.name === val.gateway.name
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => setPaymentMethodChecked(val)}
                  />
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: Colors.black,
                      fontSize: 16,
                      marginRight: 10,
                      marginTop: 5,
                    }}>
                    {val.gateway.name}
                  </Text>
                </View>
              );
            })} */}
            <View
              style={{
                height: 60,
                backgroundColor: Colors.white,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flex: 1.5}}>
                <TouchableOpacity
                  onPress={() => {
                    props?.paymentMethodRBSheet?.current.close();
                  }}
                  style={{
                    backgroundColor: Colors.grey_A9A9A9,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 100,
                    padding: 5,
                    borderRadius: 5,
                    flexDirection: 'row',
                    height: 40,
                    padding: 5,
                  }}>
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: 16,
                      fontFamily: 'Titillium-Semibold',
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  onPress={() => {
                    makePaymentRequest();
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 130,
                    backgroundColor: Colors.orange_295CBF,
                    padding: 5,
                    borderRadius: 5,
                    flexDirection: 'row',
                    height: 40,
                    padding: 5,
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 16,
                      fontFamily: 'Titillium-Semibold',
                      textAlign: 'center',
                    }}>
                    Proceed To Pay
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </RBSheet>
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
};

function mapStateToProps(state, props) {
  return {
    customer: state.mainReducers.main.customer,
    customerCurrentPlan: state.mainReducers.main.customerCurrentPlan,
  };
}

export default connect(mapStateToProps)(PaymentMethodOptions);

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    alignSelf: 'center',
    fontSize: 18,
    textAlign: 'center',
  },
});
