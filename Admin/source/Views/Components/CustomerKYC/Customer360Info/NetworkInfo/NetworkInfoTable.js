import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Colors} from '../../../../Common/Colors';
import {formatDate, formatDateV3} from '../../../../Common/utility';
import DetailsInfo from '../../../../Common/DetailsInfo';

const NetworkInfoTable = props => {
  var networkData = props?.data;
  console.log("its the network data", networkData);
  return (
    <View style={{padding: 5}}>
      <View style={{flexDirection: 'column'}}>
        <DetailsInfo showDetails title={'OLT Serial No'} value={networkData?.olt_serial_no} />
        <DetailsInfo
          showDetails
          title={'Parent DP Serial No'}
          value={networkData?.parentdp_serial_no}
        />
        <DetailsInfo
          showDetails
          title={'Child DP Serial No'}
          value={networkData?.childp_serial_no}
        />
        <DetailsInfo
          showDetails
          title={'CPE Serial No'}
          value={networkData?.cpe_serial_no}
        />
       
      </View>
    </View>
  );
};

export default NetworkInfoTable;
