import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import {Colors} from '../../../../Common/Colors';
import DialogView from '../../../../Common/DialogView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NoData from '../../../../Common/NoData';
import styles from './styles';
import {formatDate} from '../../../../Common/utility';

const InvoiceInfo = props => {
  const [invoiceData, setTicketsData] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  return (
    <View>
      <ScrollView>
        <View>
          <View style={styles.title1}>
            <View>
              <Ionicons
                name={'file-invoice'}
                size={25}
                color={Colors.orange_295CBF}
                style={{padding: 10}}
              />
            </View>
            <View style={styles.title1_child1}>
              <Text
                style={{
                  color: Colors.orange_295CBF,
                  fontSize: 16,
                  fontFamily: 'Titillium-Semibold',
                  marginTop: 12,
                }}>
                Invoice
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default InvoiceInfo;
