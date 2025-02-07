import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from './config';
import _ from 'lodash';
import GetLocation from 'react-native-get-location';
import MapmyIndiaGL from 'mapmyindia-map-react-native-beta';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import Toast from 'react-native-toast-message';
import notifee from '@notifee/react-native';
import config from './config';

MapmyIndiaGL.setMapSDKKey('f7f45dfbed02afe98e83d034955a78d3'); //place your mapsdkKey
MapmyIndiaGL.setRestAPIKey('f7f45dfbed02afe98e83d034955a78d3'); //your restApiKey
MapmyIndiaGL.setAtlasClientId(
  '33OkryzDZsL-pz7DbYV4UU5IL-eNqPxypZfE4pVzxqc1wx-OW4W_tePLUcYmngRVqPvAiYqsNREEQDUsMkC6eA==',
); //your atlasClientId key
MapmyIndiaGL.setAtlasClientSecret(
  'lrFxI-iSEg8T101oVBL6uHUHpajOR6cNJYJW1JoUVqZC9xxI8U1Ep7H8uVmmqjpMpVGq74iM-5-H7VC-H2qVARqYrw3dksOb',
); //your atlasClientSecret key

export const getAPI = async (action, headers = {}, isPortNumber) => {
  try {
    const userToken = await AsyncStorage.getItem('token');
    let requestHeaders = _.pickBy(
      {
        ...{
          Authorization: `Bearer ${userToken}`,
        },
        ...headers,
        ...{
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
      item => !_.isEmpty(item),
    );
    let response = await axios.get(
      `${isPortNumber ? '' : apiConfig.REACT_APP_API_URL}${action}`,
      {
        headers: requestHeaders,
        timeout: 120000,
      },
    );
    return {
      result: response.data,
      isSuccess: response.status ? response.status : false,
      status: response.status,
    };
  } catch (error) {
    console.log('here', error);
    return {result: null, isSuccess: false, message: error};
  }
};

export const postAPI = async (action, headers = {}, body, isPortNumber) => {
  try {
    const userToken = await AsyncStorage.getItem('token');
    let requestHeaders = _.pickBy(
      {
        ...{
          Authorization: `Bearer ${userToken}`,
        },
        ...headers,
        ...{
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
      item => !_.isEmpty(item),
    );
    let response = await axios.post(
      `${isPortNumber ? '' : apiConfig.REACT_APP_API_URL}${action}`,
      body ? JSON.stringify(body) : null,
      {
        headers: requestHeaders,
        timeout: 120000,
      },
    );
    console.log('api response', response);
    return {
      result: response.data,
      isSuccess: response.status ? response.status : false,
      status: response.status,
    };
  } catch (error) {
    return {
      result: null,
      isSuccess: false,
      message: error,
    };
  }
};

export const patchAPI = async (action, headers = {}, body, isPortNumber) => {
  try {
    const userToken = await AsyncStorage.getItem('token');
    let requestHeaders = _.pickBy(
      {
        ...{
          Authorization: `Bearer ${userToken}`,
        },
        ...headers,
        ...{
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
      item => !_.isEmpty(item),
    );
    let response = await axios.patch(
      `${isPortNumber ? '' : apiConfig.REACT_APP_API_URL}${action}`,
      body ? JSON.stringify(body) : null,
      {
        headers: requestHeaders,
        timeout: 120000,
      },
    );
    return {
      result: response.data,
      isSuccess: response.status ? response.status : false,
      status: response.status,
    };
  } catch (error) {
    return {result: null, isSuccess: false, message: error};
  }
};

export const putAPI = async (action, headers = {}, body, isPortNumber) => {
  try {
    const userToken = await AsyncStorage.getItem('token');
    let requestHeaders = _.pickBy(
      {
        ...{
          Authorization: `Bearer ${userToken}`,
        },
        ...headers,
        ...{
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
      item => !_.isEmpty(item),
    );
    let response = await axios.put(
      `${isPortNumber ? '' : apiConfig.REACT_APP_API_URL}${action}`,
      body ? JSON.stringify(body) : null,
      {
        headers: requestHeaders,
        timeout: 120000,
      },
    );
    return {
      result: response.data,
      isSuccess: response.status ? response.status : false,
      status: response.status,
    };
  } catch (error) {
    return {result: null, isSuccess: false, message: error};
  }
};

const locationServices = {getGeoLocation, localDisplayNotification};
async function getGeoLocation(successCallback, errorCallBack) {
  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 20000,
  })
    .then(location => {
      MapmyIndiaGL.RestApi.reverseGeocode({
        latitude: location.latitude, //17.385,
        longitude: location.longitude, //78.4867,
        // latitude: 17.385,
        // longitude: 78.4867,
      })
        .then(response => {
          successCallback(response);
        })
        .catch(error => {
          const errorresponse = error.toString();
          errorCallBack(errorresponse);
        });
    })
    .catch(error => {
      const errorresponse = error.toString();
      errorCallBack(errorresponse);
    });
}
export default locationServices;

const geoCodeService = {};

export const openWSConnection = (payment_id, navigation) => {
  var client = new W3CWebSocket(
    `${apiConfig.REACT_APP_API_URL_BILLING}/ws/${payment_id}/listen/payment/status`,
  );
  client.onopen = () => {};
  client.onmessage = message => {
    const dataFromServer = JSON.parse(message.data);
    if (dataFromServer.status === 1) {
      setTimeout(() => {
        navigation.goBack();
      }, 5000);
      Toast.show({
        type: 'success',
        text1: 'Payment Successful!',
      });
    } else if (dataFromServer.status === 2) {
      setTimeout(() => {
        navigation.goBack();
      }, 5000);
      Toast.show({
        type: 'error',
        text1: 'Payment Unsuccessful! Please try again later.',
      });
    } else {
      setTimeout(() => {
        navigation.goBack();
      }, 5000);
      Toast.show({
        type: 'error',
        text1: 'Payment Unsuccessful! Please try again later.',
      });
    }
  };
  client.onclose = () => {};
};

async function localDisplayNotification() {
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  notifee.displayNotification({
    title: `<p style="color: #DC631F;"><b>${config.Notication_Display_Name}</span></p></b></p>`,
    subtitle: ' ',
    body: 'This is a notification',
    android: {
      channelId,
      color: '#DC631F',
      largeIcon: config.Logo_Image,
      actions: [
        {
          title: '<b>View</b> 📄',
          pressAction: {id: 'default', mainComponent: 'notificationList'},
        },
        {
          title: '<p style="color: #f44336;"><b>Clear</b> 🗑</p>',
          pressAction: {id: 'cry'},
        },
      ],
    },
  });
}
