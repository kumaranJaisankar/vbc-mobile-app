import React, {useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Colors} from '../../../../../../Common/Colors';
import PlanDetailsBottomSheet from '../PlanDetails/PlanDetailsBottomSheet';

const CurrentPlanTable = props => {
  var currentPlanData = props?.data;
  var paymentType = props?.paymentType;
  const sheetRef = useRef();
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <View
          style={{
            flex: 0.5,
            height: 50,
            flexDirection: 'row',
            marginTop: -10,
            justifyContent: 'center',
            borderColor: Colors.grey_A9A9A9,
            borderWidth: 1,
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              padding: 5,
              marginTop: 7,
            }}>
            {currentPlanData?.plan_name}
          </Text>
        </View>
        <View
          style={{
            flex: 0.3,
            height: 50,
            flexDirection: 'row',
            marginTop: -10,
            justifyContent: 'center',
            borderColor: Colors.grey_A9A9A9,
            borderWidth: 1,
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              padding: 5,
              marginTop: 7,
            }}>
            {parseFloat(currentPlanData?.plan_cost)}
          </Text>
        </View>
        <View
          style={{
            flex: 0.4,
            height: 50,
            flexDirection: 'row',
            marginTop: -10,
            justifyContent: 'center',
            borderColor: Colors.grey_A9A9A9,
            borderWidth: 1,
          }}>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: '#000000',
              fontSize: 12,
              padding: 5,
              marginTop: 7,
            }}>
            {currentPlanData?.plan_time_unit +
              ' ' +
              currentPlanData?.plan_unit_type}
          </Text>
        </View>
        <View
          style={{
            flex: 0.5,
            height: 50,
            flexDirection: 'row',
            marginTop: -10,
            justifyContent: 'center',
            borderColor: Colors.grey_A9A9A9,
            borderWidth: 1,
          }}>
          <TouchableOpacity
            onPress={() => {
              sheetRef.current.open();
            }}
            style={{
              backgroundColor: Colors.orange_295CBF,
              borderRadius: 10,
              height: 30,
              marginTop: 7,
            }}>
            <View
              style={{
                flexDirection: 'column',
                padding: 5,
                width: 80,
              }}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#ffffff',
                  fontSize: 12,
                  alignSelf: 'center',
                }}>
                Renew
              </Text>
            </View>
          </TouchableOpacity>
          <PlanDetailsBottomSheet
            sheetRef={sheetRef}
            isAllPlan={false}
            data={currentPlanData}
            paymentType={paymentType}
            onClose={() => {
              sheetRef.current.close();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default CurrentPlanTable;
