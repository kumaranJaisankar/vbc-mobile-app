import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../../Common/Colors';
import DialogView from '../../../Common/DialogView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import NoData from '../../../Common/NoData';
import UserInfo from './UserInfo/UserInfo';
import BasicInfo from './BasicInfo/BasicInfo';
import styles from './styles';
import Headerview from '../../../Common/HeaderView1';
import ComplaintInfo from './ComplaintInfo/ComplaintInfo';
import {showAppInstruction} from '../../../Common/Common';
import SessionInfo from './SessionInfo/SessionInfo';
import RadiusInfo from './RadiusInfo/RadiusInfo';
import {connect} from 'react-redux';
import {customerInfoData} from '../../../services/MainService';
import WalletInfo from './WalletInfo/WalletInfo';
import Installation from './InstallationAddress/Installation';
import {useNavigation, useRoute} from '@react-navigation/native';
import CpeInformation from './CpeInformation/CpeInformation';
import NetworkInfo from './NetworkInfo/NetworkInfo';

const Customer360Info = props => {
  const navigation = useNavigation();
  const route = useRoute();

  const [buttonPressed, setbuttonPressed] = React.useState(1);
  const [customerData, setCustomerData] = useState({});
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [sessionData, setSessionData] = useState({});
  const [userInfoData, setUserInfoData] = useState({});
  const [permanetAddress, setParmanentAddress] = useState({});
  const [networkData, setNetworkData] = useState({});
  
console.log(route.params,"route.params")
  useEffect(() => {
    console.log("customer 360 useeffect")
    getCustomerInfo();
  }, []);
  useEffect(() => {
    console.log("customer 360 useeffect updated")
    getCustomerInfo();
  }, [route.params]);
  
  const getCustomerInfo = async () => {
    setIsDataLoading(true);
    const response = await customerInfoData(
      props?.customer?.user?.id,
      props?.customer?.user?.username,
    );
    console.log(
      '🚀 ~ file: UserInfo.js:74 ~ getCustomerInfo360 ~ response',
      response,
    );
    if (response?.isSuccess) {
      console.log('hi');
      setIsDataLoading(false);
      setParmanentAddress(response?.result?.permanent_address);
      setCustomerData(response?.result);
      setNetworkData({
        olt_serial_no:response?.result?.olt_serial_no,
        parentdp_serial_no:response?.result?.parentdp_serial_no,
        childp_serial_no:response?.result?.childp_serial_no,
        cpe_serial_no:response?.result?.cpe_serial_no
      })
      setSessionData({
        id: response?.result?.id,
        last_invoice_id: response?.result?.last_invoice_id,
        created: response?.result?.created,
        package_name: response?.result?.service_plan?.package_name,
        upload_speed: response?.result?.service_plan?.upload_speed,
        download_speed: response?.result?.service_plan?.download_speed,
        account_status: response?.result?.account_status,
        account_type: response?.result?.account_type,
        next_date_of_data_addition: response?.result?.next_date_of_data_addition,
        current_plan: response?.result?.current_plan
      });
      setUserInfoData({
        user: {
          username: response?.result?.user?.username,
          cleartext_password: response?.result?.user?.cleartext_password,
        },
        customer_documents: {
          customer_pic_preview:
            response?.result?.customer_documents?.customer_pic_preview,
        },
        first_name: response?.result?.first_name,
        last_name: response?.result?.last_name,
        register_mobile: response?.result?.register_mobile,
        account_status: response?.result?.account_status,
        monthly_date: response?.result?.monthly_date,
        expiry_date: response?.result?.expiry_date,
      });
    } else {
      setIsDataLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <StatusBar translucent backgroundColor={Colors.white} /> */}
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <View style={styles.parent}>
          <View style={styles.child1}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Ionicons
                name={'md-arrow-back-sharp'}
                size={33}
                color={Colors.orange_295CBF}
                style={{padding: 10}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          horizontal={true}
          style={{flex: 1, marginTop: -20}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress={() => setbuttonPressed(1)}>
            <Text
              style={buttonPressed == 1 ? styles.btnPress : styles.btnNormal}>
              User Information
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setbuttonPressed(2);
            }}>
            <Text
              style={buttonPressed == 2 ? styles.btnPress : styles.btnNormal}>
              Basic Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setbuttonPressed(9);
            }}>
            <Text
              style={buttonPressed == 9 ? styles.btnPress : styles.btnNormal}>
              Installation Address
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setbuttonPressed(3);
            }}>
            <Text
              style={buttonPressed == 3 ? styles.btnPress : styles.btnNormal}>
              Complaints
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setbuttonPressed(4);
            }}>
            <Text
              style={buttonPressed == 4 ? styles.btnPress : styles.btnNormal}>
              Wallet Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setbuttonPressed(5);
            }}>
            <Text
              style={buttonPressed == 5 ? styles.btnPress : styles.btnNormal}>
              Online Session Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setbuttonPressed(10);
            }}>
            <Text
              style={buttonPressed == 10 ? styles.btnPress : styles.btnNormal}>
              CPE Information
            </Text>
          </TouchableOpacity>
         
          {/* <TouchableOpacity
            onPress={() => {
              setbuttonPressed(6);
              showAppInstruction();
            }}>
            <Text
              style={buttonPressed == 6 ? styles.btnPress : styles.btnNormal}>
              Invoices
            </Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            onPress={() => {
              setbuttonPressed(7);
              showAppInstruction();
            }}>
            <Text
              style={buttonPressed == 7 ? styles.btnPress : styles.btnNormal}>
              Documents
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              setbuttonPressed(8);
            }}>
            <Text
              style={buttonPressed == 8 ? styles.btnPress : styles.btnNormal}>
              Radius Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setbuttonPressed(11);
            }}>
            <Text
              style={buttonPressed == 11 ? styles.btnPress : styles.btnNormal}>
              Network Info
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              setbuttonPressed(9);
              showAppInstruction();
            }}>
            <Text
              style={buttonPressed == 9 ? styles.btnPress : styles.btnNormal}>
              CPE Info
            </Text>
          </TouchableOpacity> */}
        </ScrollView>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            marginTop: -430,
          }}>
          {buttonPressed == 1 ? (
            <UserInfo
              userInfoData={userInfoData}
              customerFun={getCustomerInfo}
            />
          ) : null}
          {buttonPressed == 2 ? (
            <BasicInfo basicData={customerData} customerFun={getCustomerInfo} />
          ) : null}
          {buttonPressed == 3 ? (
            <ComplaintInfo
              complaintsData={customerData?.tickets}
              overall_rating={customerData?.overall_rating}
            />
          ) : null}
          {buttonPressed == 4 ? (
            <WalletInfo
              basicData={customerData}
              userInfoData={props.userInfo}
              extra={customerData}
              customerFun={getCustomerInfo}
            />
          ) : null}
          {buttonPressed == 5 ? (
            <SessionInfo sessionData={sessionData} />
          ) : null}
          {buttonPressed == 8 ? (
            <RadiusInfo radiusData={customerData?.radius_info} />
          ) : null}
          {buttonPressed == 9 ? (
            <Installation
              basicData={customerData}
              address={permanetAddress}
              customerFun={getCustomerInfo}
            />
          ) : null}
          {buttonPressed == 10 ? (
            <CpeInformation
              basicData={customerData}
            />
          ) : null}
           {buttonPressed == 11 ? (
            <NetworkInfo networkData={networkData} />
          ) : null}
        </View>
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
    </SafeAreaView>
  );
};

function mapStateToProps(state, props) {
  return {
    customer: state.mainReducers.main.customer,
    userInfo: state.mainReducers.main.userInfo,
  };
}

export default connect(mapStateToProps)(Customer360Info);
