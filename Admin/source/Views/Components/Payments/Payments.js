import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../Common/Colors';
import Headerview from '../../Common/HeaderView1';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DashBoard = ({navigation}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const [isLoading, setLoading] = React.useState(true);

  const [isData, setData] = React.useState([]);

  const [isExpDate, setExpDate] = React.useState('');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //getDashboardData();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      {/*   */}

      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <Headerview
          username={'Payments'}
          showHeader
          onMenuClick={() => {
            setModalVisible(true);
          }}
        />

        <View style={{flex: 1}}>
          <View style={{flex: 1, marginTop: 10}}>
            <ScrollView
              style={{}}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  justifyContent: 'center',
                  flex: 1,
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    padding: 1,
                    borderRadius: 10,
                    borderColor: '#CACACA',
                    borderWidth: 2,
                    width: 300,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity>
                    <View
                      style={{
                        width: 150,
                        backgroundColor: '#35CD9D',
                        borderRadius: 7,
                      }}>
                      <Text
                        style={{
                          padding: 10,
                          textAlign: 'center',
                          fontFamily: 'Titillium-Semibold',
                          color: '#ffffff',
                          fontSize: 16,
                        }}>
                        Paid
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={{width: 150}}>
                      <Text
                        style={{
                          padding: 10,
                          textAlign: 'center',
                          fontFamily: 'Titillium-Semibold',
                          color: '#777777',
                          fontSize: 16,
                        }}>
                        Unpaid
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <Text
                style={{
                  marginTop: 20,
                  textAlign: 'center',
                  fontFamily: 'Titillium-Semibold',
                  color: '#777777',
                  fontSize: 16,
                }}>
                Total users paid
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome5 name={'users'} size={20} color={'#1DCD9D'} />
                <Text
                  style={{
                    padding: 5,
                    textAlign: 'center',
                    fontFamily: 'Titillium-Semibold',
                    color: '#1DCD9D',
                    fontSize: 30,
                    marginLeft: 7,
                  }}>
                  5236
                </Text>
              </View>

              <View style={{flex: 1, flexDirection: 'row', margin: 10}}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#555555',
                      fontSize: 16,
                    }}>
                    Payments Statistics
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <MaterialCommunityIcons
                    name={'google-maps'}
                    size={20}
                    color={'#777777'}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#555555',
                      fontSize: 15,
                    }}>
                    Kakinada
                  </Text>
                  <AntDesign
                    name={'caretdown'}
                    size={18}
                    color={'#cccccc'}
                    style={{marginLeft: 5}}
                  />
                </View>
              </View>

              <Image
                source={require('../../../assets/images/graph123.png')}
                style={{alignSelf: 'center'}}></Image>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  margin: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: '#2C66B0',
                    borderRadius: 10,
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Titillium-Semibold',
                    color: '#555555',
                    fontSize: 14,
                    marginLeft: 5,
                  }}>
                  Paid
                </Text>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: '#94C0F8',
                    borderRadius: 10,
                    marginLeft: 20,
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Titillium-Semibold',
                    color: '#555555',
                    fontSize: 14,
                    marginLeft: 5,
                  }}>
                  Users
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>

        <View
          style={{
            height: 50,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowRadius: 2,
            margin: 1,
            shadowOffset: {
              width: 0,
              height: -1,
            },
            shadowColor: '#000000',
            elevation: 4,
          }}>
          <Headerview showFooter />
        </View>
      </View>

      {modalVisible && (
        <Headerview
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

export default DashBoard;

const styles = StyleSheet.create({});
