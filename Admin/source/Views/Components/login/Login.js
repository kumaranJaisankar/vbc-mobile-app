import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Text, Button, TextInput} from 'react-native-paper';
import {Colors} from '../../Common/Colors';
import {strings} from '../../../strings/i18n';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DialogView from '../../Common/DialogView';
import {postLogin} from '../../services/MainService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './styles';
import {operations} from '../../../redux/Main';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import locationServices from '../../services/api/index';
import config from '../../services/api/config';

const LoginScreen = props => {
  const [username, setUsername] = useState({
    value: '',
    error: '',
  });
  const [password, setPassword] = useState({value: '', error: ''});
  const [showPassword, setShowpassword] = useState(false);
  const navigation = useNavigation();
  const [isAlertDialogShow, setAlertDialogShow] = useState(false);
  const [isAlertMessage, setAlertMessage] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState({spinner: false, spinnerText: ''});
  const netInfo = useNetInfo();

  const onLoginPressed = () => {
    if (username.value.length > 0 && password.value.length > 0) {
      sendLogin();
    } else {
      Toast.show({
        type: 'warning',
        text1: 'Wrong Username or Password!',
      });
    }
  };
  const sendLogin = async () => {
    let data = {
      username: username.value,
      password: password.value,
    };
    setLoading({spinner: true, spinnerText: 'Loading'});
    try {
      const response = await postLogin(data);
      if (response.isSuccess) {
        console.log(response, 'login response');
        AsyncStorage.setItem('token', response.result.access);
        AsyncStorage.setItem('refreshtoken', response.result.refresh);
        props.updateAuthentication(true);
        props.updatedUserInformation(response.result);
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
        setLoading({spinner: false, spinnerText: ''});
        locationServices.localDisplayNotification();
      } else {
        const errorresponse = response;
        setLoading({spinner: false, spinnerText: ''});
        Toast.show({
          type: 'error',
          text1: 'Wrong Username or Password!',
        });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setLoading({spinner: false, spinnerText: ''});
      Toast.show({
        type: 'error',
        text1: 'Something went wrong! Please try again later.',
      });
    }
  };

  useEffect(() => {
    if (netInfo?.isConnected === false) {
      navigation.navigate('LandingPage');
      Toast.show({
        type: 'error',
        text1: 'Check Your Network Connection!',
      });
    }
  }, [netInfo]);
  // password hide and show
  const handleShowPassword = () => {
    setShowpassword(!showPassword);
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1, justifyContent: 'center', padding: 10}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={config.Logo_Image}
              style={{marginBottom: 60}}></Image>
            <View style={styles.searchSection}>
              <AntDesign
                name={'user'}
                size={30}
                color={Colors.black}
                style={{
                  marginTop: 6,
                  padding: 11,
                  backgroundColor: Colors.grey_C0C0C0,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
              />
              <TextInput
                mode="outlined"
                label={strings('Login.Username')}
                value={username.value}
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="default"
                placeholderStyle={{fontSize: 20}}
                underlineColorAndroid="transparent"
                style={{
                  fontSize: 15,
                  width: 250,
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                  paddingBottom: 0,
                  backgroundColor: Colors.white,
                  marginLeft: -2,
                }}
                onChangeText={text => setUsername({value: text, error: ''})}
                theme={{
                  colors: {
                    placeholder: Colors.grey_888888,
                    text: Colors.black,
                    primary: Colors.grey_C0C0C0,
                    underlineColor: 'transparent',
                    backgroundColor: Colors.white,
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
            <View style={[styles.searchSection1]}>
              <Ionicons
                name={'key-outline'}
                size={30}
                color={Colors.black}
                style={{
                  marginTop: 6,
                  padding: 11,
                  backgroundColor: Colors.grey_C0C0C0,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
              />
              <TextInput
                mode="outlined"
                label={strings('Login.Password')}
                value={password.value}
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="default"
                secureTextEntry={showPassword ? false : true}
                placeholderStyle={{fontSize: 20}}
                underlineColorAndroid="transparent"
                style={{
                  fontSize: 15,
                  width: 250,
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                  paddingBottom: 0,
                  backgroundColor: Colors.white,
                  marginLeft: -2,
                }}
                onChangeText={text => setPassword({value: text, error: ''})}
                theme={{
                  colors: {
                    placeholder: Colors.grey_888888,
                    text: Colors.black,
                    primary: Colors.grey_C0C0C0,
                    underlineColor: 'transparent',
                    backgroundColor: Colors.white,
                  },
                  fonts: {
                    regular: {
                      fontFamily: 'Titillium-Semibold',
                      fontWeight: 'normal',
                    },
                  },
                }}
              />
              <TouchableOpacity
                onPress={handleShowPassword}
                style={{
                  marginTop: 2,
                  position: 'absolute',
                  alignItems: 'flex-end',
                  right: 10,
                }}>
                {showPassword ? (
                  <Ionicons name={'eye'} size={18} color={'#0000ff'} />
                ) : (
                  <Ionicons name={'eye-off'} size={18} color={'#0000ff'} />
                )}
              </TouchableOpacity>
            </View>
            <Button
              mode="contained"
              onPress={onLoginPressed}
              uppercase={false}
              style={{
                backgroundColor: Colors.orange_295CBF,
                width: 300,
                marginTop: 30,
              }}>
              <Text
                style={{
                  autoCapitalize: 'none',
                  fontSize: 18,
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                  color: Colors.white,
                }}>
                {strings('Login.Login')}
              </Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
      <Spinner
        animation={'fade'}
        overlayColor={Colors.orange_295CBF}
        indicatorStyle={styles.loader}
        visible={isLoading.spinner}
        textContent={isLoading.spinnerText}
        textStyle={styles.spinnerTextStyle}
      />
    </View>
  );
};

function mapStateToProps(state, props) {
  return {
    updatedUserInformation: state.mainReducers.main.updatedUserInformation,
    userInfo: state.mainReducers.main.userInfo,
    updateAuthentication: state.mainReducers.main.updateAuthentication,
    isAuthenticated: state.mainReducers.main.isAuthenticated,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(operations, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
