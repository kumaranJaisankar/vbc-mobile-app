import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {Colors} from '../../../../../Common/Colors';
import DialogView from '../../../../../Common/DialogView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import NoData from '../../../../../Common/NoData';
import FormFieldInput from '../../../FormFields/KYC_FormField1';
import {TextInput} from 'react-native-paper';
import {
  extendDaysUpdate,
  getCustomerBasicInfo,
  getIpPoolData,
  getReaminingIPs,
  updateBasicInfo,
} from '../../../../../services/MainService';
import RBSheet from 'react-native-raw-bottom-sheet';
import {formData} from '../../../../../Common/formData';
import styles from '../../styles';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {formatDate} from '../../../../../Common/utility';
//redux
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import {Checkbox} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation, useRoute} from '@react-navigation/native';
import format from 'date-fns/format';
import {addDays} from 'date-fns';
import globalStyles from '../../../../../Common/globalStyles';

const Extend = props => {
  const route = useRoute();
  const customerData = route?.params?.data;
  const customerInfo = route?.params?.userInfo;
  const navigation = useNavigation();
  const [extendDays, setExtendDays] = useState({});
  const [newExpiryDate, setNewExpiryDate] = useState();
  const [selection, setSelection] = useState({start: 0});
  const handleFocus = () => {
      setSelection(null);
  };
  const handleBlur = () => {
      //setSelection({start: 0});
  };
  console.log('customerData =>', props);

  const [isLoading, setLoading] = useState({
    spinner: false,
    spinnerText: '',
  });
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });
  const [isDataLoading, setIsDataLoading] = useState(false);

  console.log('iop', props);

  const handleChange = (value) => {
    if(value && value <=30){
    setExtendDays(prev => ({
      ...prev,
      'days': value,
    }));
    // setNewExpiryDate(
    //   format(
    //     add(new Date(props?.profileDetails?.expiry_date), {
    //       days: value,
    //     }),
    //     'dd MMM yyyy',
    //   ),
    // );
    // const daysToAdd = parseInt(value);

    setNewExpiryDate(
      format(
        addDays(new Date(customerData?.expiry_date), value),
        'dd MMM yyyy',
      ),
    );
}else{
    setExtendDays({});
    // You may also want to clear the newExpiryDate state
    setNewExpiryDate('');
}
  };
  const isEmpty = obj => {
    return Object.keys(obj).length === 0;
  };
  const daysExtending = async () => {
    if (isEmpty(extendDays)) {
      setRenewRecent({
        text: 'No Of Days Field Should not be Empty',
        visible: true,
      });
      return;
    }
    setLoading({
      spinner: true,
      spinnerText: 'Extending Plan...',
    });
    console.log(extendDays);
    try {
      const response = await extendDaysUpdate(customerInfo?.id, extendDays);
      console.log(response, 'response');
      if (response.isSuccess) {
        setLoading({
          spinner: false,
          spinnerText: '',
        });
        const responseMsg = response;
        // onResetClick();
        navigation.navigate('Customer360Info', {
          param1: 'update',
        });
        setLoading({spinner: false, spinnerText: ''});
        Toast.show({
          type: 'success',
          text1: 'Plan is Extended Successfully!',
        });
      } else {
        const errorresponse = response;
        console.log(errorresponse, 'errorresponse1');
        // setLoading({spinner: false, spinnerText: ''});
        // setRenewRecent({
        //   text: 'Request not Successful! Please try later.',
        //   visible: true,
        // });
        setLoading({
          spinner: false,
          spinnerText: '',
        });
        Toast.show({
          type: 'error',
          text1: 'Request not Successful! Please try later.',
        });
      }
    } catch (error) {
      const errorresponse = error.toString();
      console.log(errorresponse, 'errorresponse2');
      //   setLoading({spinner: false, spinnerText: ''});
      //   setRenewRecent({
      //     text: 'Request not Successful! Please try later.',
      //     visible: true,
      //   });
      setLoading({
        spinner: false,
        spinnerText: '',
      });
      Toast.show({
        type: 'error',
        text1: 'Request not Successful! Please try later.',
      });
    }
  };
  return (
    <View>
      <ScrollView>
        <View style={{backgroundColor: Colors.white}}>
          <View style={styles.title1}>
            <View>
              <Ionicons
                name={'person'}
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
                Extend
              </Text>
            </View>
          </View>
          <View style={{backgroundColor: Colors.white}}>
            <View style={{flex: 1}}>
              <FormFieldInput
                title={'Current Expiry Date'}
                formKey={'currentExpiry'}
                isMandatory={true}
                length={12}
                showInputField
                isEnabled={false}
                value={format(
                  new Date(customerData?.expiry_date),
                  'dd MMM, yyyy',
                )}
              />
            </View>
            <View style={{flex: 1}}>
              {/* <FormFieldInput
                title={'No Of days *'}
                formKey={'days'}
                isMandatory={true}
                showInputField
                handleFormValueChange={handleChange}
                keyboardType="number-pad"
              /> */}
              <View style={{margin: 8, marginHorizontal: 15}}>
        <TextInput
          mode="outlined"
           autoCapitalize="none"
          onBlur={handleBlur}
          onFocus={handleFocus}
          selection={selection}
          label={'No Of days *'}
          value={extendDays}
          keyboardType="number-pad"
          placeholderStyle={{fontSize: 20}}
          underlineColorAndroid="transparent"
          style={{
            fontSize: 15,
            fontFamily: 'Titillium-Semibold',
            fontWeight: 'normal',
            backgroundColor: Colors.white,
            paddingBottom: 0,
          }}
          onChangeText={text => {
            if (text !== '') {
                // Parse the input value as a number
                const isNumeric = /^\d+$/.test(text);
               
                console.log(isNumeric,"numericValue1")
                const numericValue = text.replace(/[^0-9]/g, '');
          
                // Check if the numeric value is less than or equal to 30
                if (!isNaN(numericValue) && numericValue <= 30 && isNumeric) {
                  // If valid, trigger the handleChange function with the numeric value
                  handleChange(numericValue);
                } else {
                  // If invalid, you may choose to show an error message or handle it differently
                  console.log('Please enter a value between 1 and 30');
                  setExtendDays('');
                }
              } else {
                // Handle empty input if needed
              }
          }}
          theme={{
            colors: {
              placeholder: 'grey',
              text: 'black',
              primary: 'grey',
              underlineColor: 'transparent',
              backgroundColor: 'white',
            },
            fonts: {
              regular: {
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
              },
            },
          }}
        />
      </View>
            </View>

            <View style={{flex: 1}}>
              <FormFieldInput
                title={'New Expiry Date'}
                formKey={'newExpiry'}
                isMandatory={true}
                showInputField
                isEnabled={false}
                value={newExpiryDate}
              />
            </View>
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                marginTop: 10,
                margin: 8,
                marginHorizontal: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{height: 40}}
                  onPress={() => {
                    navigation.navigate('Customer360Info');
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 16,
                      textAlign: 'center',
                      backgroundColor: '#ffffff',
                      borderRadius: 10,
                      padding: 10,
                      borderColor: '#DC631F',
                      borderWidth: 1,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{height: 40}}
                  onPress={() => {
                    daysExtending();
                  }}>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: 'Titillium-Semibold',
                      color: '#ffffff',
                      fontSize: 16,
                      textAlign: 'center',
                      backgroundColor: '#DC631F',
                      borderRadius: 10,
                      padding: 10,
                      borderColor: '#DC631F',
                      borderWidth: 1,
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <DialogView
        showAlertDialog
        visible={isRenewRecent.visible}
        text={isRenewRecent.text}
        // onCancel={() => {
        //   setRenewRecent({text: '', visible: false});
        // }}
        // textCancel={'No'}
        onConfirm={() => {
          setRenewRecent({text: '', visible: false});
        }}
        textConfirm={'Okay'}></DialogView>
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

export default Extend;
