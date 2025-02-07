import React from 'react';
import {StyleSheet, View, SafeAreaView, StatusBar, Image} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {Colors} from '../../Common/Colors';
import {strings} from '../../../strings/i18n';
import config from '../../services/api/config';

export default function LoginScreen({navigation}) {
  const onLoginPressed = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1, justifyContent: 'center', padding: 10}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.grey_E5E5E5,
            }}>
            <Image source={config.Logo_Image}></Image>
            <Image
              source={require('../../../assets/images/landingImage.png')}
              style={{width: 420, height: 250}}></Image>
          </View>
          <View
            style={{flex: 0.5, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.welcomeStyle}>
              {strings('landingPage.Welcome')}
            </Text>
            <Text style={styles.messageStyle}>
              {`Login to ${config.REACT_APP_CLIENT_NAME} Mobile App and get unlimited benefits`}
            </Text>
            <Button
              mode="contained"
              onPress={onLoginPressed}
              uppercase={false}
              style={styles.loginButtonStyle}>
              <Text style={styles.loginButtonTextStyle}>
                {strings('landingPage.Login')}
              </Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  welcomeStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 25,
    textAlign: 'center',
  },
  messageStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 18,
    textAlign: 'center',
    width: 280,
    marginTop: 20,
  },
  loginButtonStyle: {
    backgroundColor: Colors.orange_295CBF,
    width: 280,
    marginVertical: 20,
  },
  loginButtonTextStyle: {
    fontSize: 20,
    fontFamily: 'Titillium-Semibold',
    fontWeight: 'normal',
    color: Colors.white,
  },
});
