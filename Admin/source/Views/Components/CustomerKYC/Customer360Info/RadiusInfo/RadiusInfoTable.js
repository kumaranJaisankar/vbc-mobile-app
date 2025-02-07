import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Colors} from '../../../../Common/Colors';
import {formatDate} from '../../../../Common/utility';
import DetailsInfo from '../../../../Common/DetailsInfo';

const RadiusInfoTable = props => {
  var radiusData = props.data;
  return (
    <View style={{padding: 5}}>
      <View style={{flexDirection: 'column'}}>
        <DetailsInfo
          showDetails
          title={'Authentication Protocol'}
          value={radiusData.authentication_protocol}
        />
        <DetailsInfo
          showDetails
          title={'Mac Bind'}
          value={radiusData.mac_bind}
        />
        <DetailsInfo showDetails title={'IP Mode'} value={radiusData.ip_mode} />
        <DetailsInfo
          showDetails
          title={'Static IP Bind'}
          value={
            radiusData.static_ip_bind != null
              ? radiusData.static_ip_bind
              : 'N/A'
          }
        />
      </View>
    </View>
  );
};

export default RadiusInfoTable;
