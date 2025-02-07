import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Colors} from '../../../../Common/Colors';
import {formatDate, formatDateV3} from '../../../../Common/utility';
import DetailsInfo from '../../../../Common/DetailsInfo';

const SessionInfoTable = props => {
  var sessionData = props?.data;
  console.log("its the seesion data", sessionData);
  return (
    <View style={{padding: 5}}>
      <View style={{flexDirection: 'column'}}>
        <DetailsInfo showDetails title={'Session Id'} value={sessionData?.id} />
        <DetailsInfo
          showDetails
          title={'Running Invoice Number'}
          value={sessionData?.last_invoice_id}
        />
        <DetailsInfo
          showDetails
          title={'Online Since'}
          value={sessionData?.created ? formatDate(sessionData?.created) : ''}
        />
        <DetailsInfo
          showDetails
          title={'Service Plan'}
          value={sessionData?.package_name}
        />
        <DetailsInfo
          showDetails
          title={'Current Plan'}
          value={sessionData?.current_plan}
        />
        <DetailsInfo
          showDetails
          title={'Upload Speed'}
          value={sessionData?.upload_speed}
        />
        <DetailsInfo
          showDetails
          title={'Download Speed'}
          value={sessionData?.download_speed}
        />
        <DetailsInfo
          showDetails
          title={'Account Status'}
          // value={sessionData?.account_status}
          value={
            sessionData?.account_status
              ? sessionData?.account_status === 'KYC'
                ? 'Kyc confirmed'
                : sessionData?.account_status === 'EXP'
                ? 'Expired'
                : sessionData?.account_status === 'ACT'
                ? 'Active'
                : sessionData?.account_status === 'DCT'
                ? 'Deactive'
                : sessionData?.account_status === 'SPD'
                ? 'Suspended'
                : sessionData?.account_status === 'HLD'
                ? 'Hold'
                : sessionData?.account_status === 'INS'
                ? 'Installation'
                : sessionData?.account_status === 'PROV'
                ? 'Provisioning'
                : ''
              : ''
          }
        />
        <DetailsInfo
          showDetails
          title={'Account Type'}
          value={sessionData?.account_type}
        />
        <DetailsInfo
          showDetails
          title={'Next date of data addition'}
          value={formatDate(sessionData?.next_date_of_data_addition)}
        />
      </View>
    </View>
  );
};

export default SessionInfoTable;
