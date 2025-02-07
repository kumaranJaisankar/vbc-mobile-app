import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {Text} from 'react-native-paper';
import HeaderView1 from '../../Common/HeaderView1';
import {Colors} from '../../Common/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const Reports = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View>
          <HeaderView1
            showHeader1
            username={'Reports'}
            onMenuClick={() => {
              setModalVisible(true);
            }}
            showRefreshIcon
            onRefreshClicked={() => {
              //   billingData();
            }}
          />
          <View>
            <View style={{marginTop: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  width: 400,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('CustomersReport');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.white,
                      paddingLeft: 15,
                      paddingRight: 15,
                      width: 190,
                    }}>
                    <Ionicons
                      name={'md-people-outline'}
                      size={20}
                      color={Colors.orange_295CBF}
                      style={{padding: 10}}
                    />
                    <Text>Customer Reports</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('HelpdeskReport');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.white,
                      paddingLeft: 15,
                      paddingRight: 15,
                      width: 190,
                      marginLeft: 10,
                    }}>
                    <Ionicons
                      name={'shield-checkmark-outline'}
                      size={20}
                      color={Colors.orange_295CBF}
                      style={{padding: 10}}
                    />
                    <Text>Helpdesk Reports</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  width: 400,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('LedgerReport');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.white,
                      paddingLeft: 15,
                      paddingRight: 15,
                      width: 190,
                    }}>
                    <Ionicons
                      name={'server-outline'}
                      size={20}
                      color={Colors.orange_295CBF}
                      style={{padding: 10}}
                    />
                    <Text>Ledger Reports</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('RevenueReport');
                  }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.white,
                    paddingLeft: 15,
                    paddingRight: 15,
                    width: 190,
                    marginLeft: 10,
                  }}>
                  <Ionicons
                    name={'swap-vertical'}
                    size={20}
                    color={Colors.orange_295CBF}
                    style={{padding: 10}}
                  />
                  <Text>Revenue Reports</Text>
                </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  width: 400,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('InvoiceReports');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.white,
                      paddingLeft: 15,
                      paddingRight: 15,
                      width: 190,
                    }}>
                    <Ionicons
                      name={'file-tray-full-outline'}
                      size={20}
                      color={Colors.orange_295CBF}
                      style={{padding: 10}}
                    />
                    <Text>Invoice Reports</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('GSTReports');
                  }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.white,
                    paddingLeft: 15,
                    paddingRight: 15,
                    width: 190,
                    marginLeft: 10,
                  }}>
                  <Ionicons
                    name={'document-text-outline'}
                    size={20}
                    color={Colors.orange_295CBF}
                    style={{padding: 10}}
                  />
                  <Text>GST Reports</Text>
                </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  width: 400,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('FranchiseReport');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.white,
                      paddingLeft: 15,
                      paddingRight: 15,
                      width: 190,
                    }}>
                    <Ionicons
                      name={'document-attach-outline'}
                      size={20}
                      color={Colors.orange_295CBF}
                      style={{padding: 10}}
                    />
                    <Text>Franchise Reports</Text>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.white,
                    paddingLeft: 15,
                    paddingRight: 15,
                    width: 190,
                    marginLeft: 10,
                  }}>
                  <Ionicons
                    name={'cash-outline'}
                    size={20}
                    color={Colors.orange_295CBF}
                    style={{padding: 10}}
                  />
                  <Text>Wallet Reports</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  width: 400,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.white,
                    paddingLeft: 15,
                    paddingRight: 15,
                    width: 190,
                  }}>
                  <Ionicons
                    name={'logo-buffer'}
                    size={20}
                    color={Colors.orange_295CBF}
                    style={{padding: 10}}
                  />
                  <Text>Discount Reports</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SecurityGroupReport');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.white,
                      paddingLeft: 15,
                      paddingRight: 15,
                      width: 200,
                      marginLeft: 10,
                    }}>
                    <Ionicons
                      name={'lock-closed-outline'}
                      size={20}
                      color={Colors.orange_295CBF}
                      style={{padding: 10}}
                    />
                    <Text style={{fontSize: 12}}>Security Group Reports</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  width: 400,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.white,
                    paddingLeft: 15,
                    paddingRight: 15,
                    width: 190,
                  }}>
                  <Ionicons
                    name={'cellular'}
                    size={20}
                    color={Colors.orange_295CBF}
                    style={{padding: 10}}
                  />
                  <Text>Network Reports</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('LeadsReports');
                  }}
                  >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.white,
                      paddingLeft: 15,
                      paddingRight: 15,
                      width: 200,
                      marginLeft: 10,
                    }}>
                    <Ionicons
                      name={'person-outline'}
                      size={20}
                      color={Colors.orange_295CBF}
                      style={{padding: 10}}
                    />
                    <Text style={{fontSize: 12}}>Lead Reports</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {modalVisible && (
        <HeaderView1
          showSideMenu
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Reports;
