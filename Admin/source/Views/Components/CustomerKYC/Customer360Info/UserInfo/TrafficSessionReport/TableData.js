import React, {useRef} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  displayTotaltime,
  formatDateV3,
  formatDateV5,
} from '../../../../../Common/utility';

const TableData = props => {
  var data = props.data;
  console.log('🚀 ~ file: TableData.js:15 ~ TableData ~ data', data);

  const convertTime = async value => {
    const seconds = value;
    console.log('seconds', seconds);
    return seconds;
  };
  return (
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
            }}>
            {data?.radacctid}
          </Text>
        </View>
        <View
          style={{
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
            {data?.username.slice(0, 8) + '...'}
          </Text>
        </View>
        <View style={{}}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              paddingRight: 10,
            }}>
            {data?.acctstarttime
              ? formatDateV5(data?.acctstarttime)
              : 'Not Found Data'.slice(0, 14) + '...............'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,

              paddingRight: 10,
            }}>
            {data?.acctstoptime
              ? formatDateV5(data?.acctstoptime)
              : 'Not Found Data'.slice(0, 14) + '...............'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              paddingRight: 45,
            }}>
            {displayTotaltime(data?.acctsessiontime)}
            {/* {new Date.setSeconds(
              data?.acctsessiontime ? data?.acctsessiontime : 1,
            )
              .toISOString()
              .substr(11, 8)} */}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              paddingRight: 45,
              paddingLeft: 30,
            }}>
            {(data?.acctoutputoctets / (1024 * 1024 * 1024)).toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              paddingRight: 45,
              paddingLeft: 30,
            }}>
            {(data?.acctinputoctets / (1024 * 1024 * 1024)).toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              paddingRight: 10,
              paddingRight: 45,
              paddingLeft: 30,
            }}>
            {(
              data?.acctoutputoctets / (1024 * 1024 * 1024) +
              data?.acctinputoctets / (1024 * 1024 * 1024)
            ).toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              paddingRight: 10,
            }}>
            {data?.framedipaddress}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              paddingRight: 10,
            }}>
            {(data?.nasipaddress).slice(0, 9) + '..'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              paddingRight: 10,
            }}>
            {(data?.callingstationid).slice(0, 9) + '..'}
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
export default TableData;
