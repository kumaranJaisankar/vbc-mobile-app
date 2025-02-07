import React from 'react';
import {View, Text, Image} from 'react-native';
import {Colors} from '../commoncomponents/Colors';
import {strings} from '../strings/i18n';
import Feather from 'react-native-vector-icons/Feather';
import {Button} from 'react-native-paper';

const NoData = props => {
  const NoDataView = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Image
          source={require('../assets/images/no_data_icon.png')}
          style={{width: 80, height: 80, alignSelf: 'center'}}
        />
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Titillium-Semibold',
            color: Colors.red_FF0000,
            fontSize: 17,
          }}>
          {strings('NoData.no_data')}
        </Text>
        {props.refreshData && (
          <Button
            style={{marginTop: 10}}
            icon="refresh"
            mode="contained"
            onPress={() => props.refreshData()}>
            Reload
          </Button>
        )}
      </View>
    );
  };

  return <NoDataView />;
};

export default NoData;
