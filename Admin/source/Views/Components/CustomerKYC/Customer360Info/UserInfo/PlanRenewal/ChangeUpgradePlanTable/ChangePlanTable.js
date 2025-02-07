// import React from 'react'

// function ChangePlanTable() {
//   return (
//     <div>ChangePlanTable</div>
//   )
// }

// export default ChangePlanTable
import React, {useRef} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../../../../../Common/Colors';
import PlanDetailsBottomSheet from '../PlanDetails/PlanDetailsBottomSheet';

const ChangePlanTable = props => {
  console.log('here');
  var data = props.data;
  var ext = props.extraData;
  var upgradeType = props?.upgradeType;
  console.log(
    '🚀 ~ file: ChangePlanTable.js ~ line 16 ~ ChangePlanTable ~ extraData',
    props.extraData,
  );

  console.log('chnage props', props.data);

  var walletInfo = props.walletInfo;
  var paymentType = props.paymentType;
  const sheetRef = useRef();
  return (
    <View>
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
            {data.package_name}
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
            {parseFloat(data.total_plan_cost)}
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
            {data.time_unit + ' ' + 'MBPS'}
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
            {data.unit_type}
          </Text>
        </View>
        <View
          style={{
            flex: 0.5,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              sheetRef.current.open();
            }}
            style={{
              backgroundColor: Colors.orange_295CBF,
              borderRadius: 10,
              height: 28,
              marginTop: 5,
            }}>
            <View
              style={{
                flexDirection: 'column',
                padding: 5,
                width: 50,
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#ffffff',
                  fontSize: 12,
                  alignSelf: 'center',
                }}>
                Select
              </Text>
            </View>
          </TouchableOpacity>
          <PlanDetailsBottomSheet
            sheetRef={sheetRef}
            isAllPlan={true}
            data={data}
            extraData={ext}
            upgradeType={upgradeType}
            walletInfo={walletInfo}
            paymentType={paymentType}
            onClose={() => {
              sheetRef.current.close();
            }}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.grey_F8F7FD,
          height: 2,
          marginTop: 5,
        }}></View>
    </View>
  );
};
export default ChangePlanTable;
