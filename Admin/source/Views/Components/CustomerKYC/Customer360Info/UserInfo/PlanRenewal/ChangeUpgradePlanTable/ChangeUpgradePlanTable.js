import React, {useRef, useState} from 'react';
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

const ChangeUpgradePlanTable = props => {
  let data = props.data;
  let ext = props.extraData;
  let upgradeType = props?.upgradeType;
  let additionalData = props?.additionalData;
  console.log('abutoljf', additionalData);
  console.log('datasassss', props);

  let walletInfo = props.walletInfo;
  let paymentType = props.paymentType;
  const sheetRef = useRef();
  const [isClicked, setIsClicked] = useState(false);
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
              setIsClicked(true);
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
            additionalData={additionalData}
            extraData={ext}
            upgradeType={upgradeType}
            walletInfo={walletInfo}
            paymentType={paymentType}
            onClose={() => {
              sheetRef.current.close();
            }}
            extraProps={isClicked ? true : null}
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
export default ChangeUpgradePlanTable;
