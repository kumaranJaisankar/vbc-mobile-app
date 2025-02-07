import React, {useRef} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {formatDate, formatDateV3} from '../../../../../Common/utility';

const AuthTableData = props => {
  var data = props.data;
  console.log('🚀 ~ file: TableData.js:15 ~ TableData ~ data', data);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
      }}>
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
            }}>
            {data?.id}
          </Text>
        </View>
      </View>
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
              paddingLeft: 20,
              paddingRight: 20,
            }}>
            {data?.username}
          </Text>
        </View>
      </View>
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
              paddingLeft: 20,
              paddingRight: 20,
            }}>
            {data?.reply}
          </Text>
        </View>
      </View>
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
            }}>
            {data?.authdate ? formatDate(data?.authdate) : 'Not Found'}
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 2,
          marginTop: 5,
        }}></View>
    </View>
  );
};
export default AuthTableData;
