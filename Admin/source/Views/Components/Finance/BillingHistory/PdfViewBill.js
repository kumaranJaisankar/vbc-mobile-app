import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native';
import {View} from 'react-native';
import PDFView from 'react-native-view-pdf';
import {Colors} from '../../../Common/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PdfViewBill = props => {
  const route = useRoute();
  const navigation = useNavigation();
  const paramTxt = route?.params?.data;
  console.log('props', paramTxt);

  return (
    <View style={{width: '100%', height: '100%', padding: 10}}>
      <View style={{marginTop: 10}}>
        <TouchableOpacity onPress={() => navigation.navigate('BillingHistory')}>
          <View
            style={{
              width: 100,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text>
              <Ionicons
                name={'ios-close-circle-outline'}
                size={15}
                color={Colors.grey_888888}
              />
            </Text>
            <Text style={{marginLeft: 2}}>Close</Text>
          </View>
        </TouchableOpacity>
      </View>

      <PDFView
        style={{width: '100%', height: '100%'}}
        onError={error => console.log('onError', error)}
        onLoad={() => console.log('PDF rendered from url')}
        resource={paramTxt}
        resourceType="url"
      />
    </View>
  );
};

export default PdfViewBill;
