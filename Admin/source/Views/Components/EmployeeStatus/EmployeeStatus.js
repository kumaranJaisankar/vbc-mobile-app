import React, {useRef} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RBSheet from 'react-native-raw-bottom-sheet';

const DashBoard = ({navigation}) => {
  const refRBSheet = useRef();

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
          username={'Employee Status'}
          showHeader
          onMenuClick={() => {
            setModalVisible(true);
          }}
        />

        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', padding: 10}}>
            <View style={{flex: 1}}></View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <MaterialCommunityIcons
                name={'filter'}
                size={20}
                color={'#777777'}
                style={{marginLeft: 20}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Titillium-Semibold',
                  color: '#555555',
                  fontSize: 15,
                }}>
                Sort by: All
              </Text>
              <AntDesign
                name={'caretdown'}
                size={18}
                color={'#cccccc'}
                style={{marginLeft: 5}}
              />
            </View>
          </View>

          <View style={{flex: 1, margin: 10}}>
            <ScrollView
              style={{}}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View style={{flexDirection: 'column', padding: 10}}>
                <View style={{flexDirection: 'row', flex: 1}}>
                  <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      padding: 10,
                      backgroundColor: '#f8f8f8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{fjustifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={require('../../../assets/images/userlogo1.png')}
                        style={{alignSelf: 'center'}}></Image>
                      <View
                        style={{
                          backgroundColor: '#ff0000',
                          padding: 5,
                          borderRadius: 30,
                          marginTop: -20,
                          width: 42,
                          height: 42,
                        }}>
                        <Ionicons name={'star'} size={30} color={'yellow'} />
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 15,
                        }}>
                        Employee Name
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Status :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: 'blue',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Active
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Level :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Icon
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={{
                      marginLeft: 20,
                      flexDirection: 'column',
                      flex: 1,
                      padding: 10,
                      backgroundColor: '#f8f8f8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={require('../../../assets/images/userlogo1.png')}
                        style={{alignSelf: 'center'}}></Image>
                      <View
                        style={{
                          backgroundColor: '#36B0F4',
                          padding: 5,
                          borderRadius: 30,
                          marginTop: -20,
                          width: 42,
                          height: 42,
                        }}>
                        <Ionicons name={'star'} size={30} color={'red'} />
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 15,
                        }}>
                        Employee Name
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Status :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: 'red',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Offline
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Level :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Icon
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', flex: 1, marginTop: 20}}>
                  <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      padding: 10,
                      backgroundColor: '#f8f8f8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{fjustifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={require('../../../assets/images/userlogo1.png')}
                        style={{alignSelf: 'center'}}></Image>
                      <View
                        style={{
                          backgroundColor: '#ff0000',
                          padding: 5,
                          borderRadius: 30,
                          marginTop: -20,
                          width: 42,
                          height: 42,
                        }}>
                        <Ionicons name={'star'} size={30} color={'yellow'} />
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 15,
                        }}>
                        Employee Name
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Status :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: 'blue',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Active
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Level :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Icon
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={{
                      marginLeft: 20,
                      flexDirection: 'column',
                      flex: 1,
                      padding: 10,
                      backgroundColor: '#f8f8f8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={require('../../../assets/images/userlogo1.png')}
                        style={{alignSelf: 'center'}}></Image>
                      <View
                        style={{
                          backgroundColor: '#36B0F4',
                          padding: 5,
                          borderRadius: 30,
                          marginTop: -20,
                          width: 42,
                          height: 42,
                        }}>
                        <Ionicons name={'star'} size={30} color={'red'} />
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 15,
                        }}>
                        Employee Name
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Status :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: 'red',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Offline
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Level :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Icon
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', flex: 1, marginTop: 20}}>
                  <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      padding: 10,
                      backgroundColor: '#f8f8f8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{fjustifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={require('../../../assets/images/userlogo1.png')}
                        style={{alignSelf: 'center'}}></Image>
                      <View
                        style={{
                          backgroundColor: '#ff0000',
                          padding: 5,
                          borderRadius: 30,
                          marginTop: -20,
                          width: 42,
                          height: 42,
                        }}>
                        <Ionicons name={'star'} size={30} color={'yellow'} />
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 15,
                        }}>
                        Employee Name
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Status :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: 'blue',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Active
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Level :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Icon
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={{
                      marginLeft: 20,
                      flexDirection: 'column',
                      flex: 1,
                      padding: 10,
                      backgroundColor: '#f8f8f8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={require('../../../assets/images/userlogo1.png')}
                        style={{alignSelf: 'center'}}></Image>
                      <View
                        style={{
                          backgroundColor: '#36B0F4',
                          padding: 5,
                          borderRadius: 30,
                          marginTop: -20,
                          width: 42,
                          height: 42,
                        }}>
                        <Ionicons name={'star'} size={30} color={'red'} />
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 15,
                        }}>
                        Employee Name
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Status :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: 'red',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Offline
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Level :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Icon
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', flex: 1, marginTop: 20}}>
                  <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      padding: 10,
                      backgroundColor: '#f8f8f8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{fjustifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={require('../../../assets/images/userlogo1.png')}
                        style={{alignSelf: 'center'}}></Image>
                      <View
                        style={{
                          backgroundColor: '#ff0000',
                          padding: 5,
                          borderRadius: 30,
                          marginTop: -20,
                          width: 42,
                          height: 42,
                        }}>
                        <Ionicons name={'star'} size={30} color={'yellow'} />
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 15,
                        }}>
                        Employee Name
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Status :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: 'blue',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Active
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Level :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Icon
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={{
                      marginLeft: 20,
                      flexDirection: 'column',
                      flex: 1,
                      padding: 10,
                      backgroundColor: '#f8f8f8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={require('../../../assets/images/userlogo1.png')}
                        style={{alignSelf: 'center'}}></Image>
                      <View
                        style={{
                          backgroundColor: '#36B0F4',
                          padding: 5,
                          borderRadius: 30,
                          marginTop: -20,
                          width: 42,
                          height: 42,
                        }}>
                        <Ionicons name={'star'} size={30} color={'red'} />
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 15,
                        }}>
                        Employee Name
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Status :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: 'red',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Offline
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                          }}>
                          Level :{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: '#000000',
                            fontSize: 14,
                            marginLeft: 5,
                          }}>
                          Icon
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
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

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={700}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            borderRadius: 20,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -20,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 20,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <ScrollView
          style={{}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Image
            source={require('../../../assets/images/userlogo2.png')}
            style={{alignSelf: 'center'}}></Image>

          <View style={{flexDirection: 'row', padding: 10}}>
            <View style={{flex: 1}}></View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  backgroundColor: '#36B0F4',
                  padding: 5,
                  borderRadius: 30,
                  marginTop: -30,
                  width: 42,
                  height: 42,
                  marginLeft: 100,
                }}>
                <Ionicons name={'star'} size={30} color={'red'} />
              </View>
            </View>
            <View></View>
          </View>

          <View style={{padding: 20}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 18,
              }}>
              Employee Name
            </Text>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                }}>
                Status :{' '}
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: 'blue',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Active
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                }}>
                Level :{' '}
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#777777',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                Icon
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                }}>
                Location :{' '}
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#777777',
                  fontSize: 15,
                  marginLeft: 5,
                }}>
                At Kakinada Railway Station
              </Text>
            </View>

            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 16,
                marginTop: 20,
              }}>
              Today's Timeline
            </Text>

            <Image
              source={require('../../../assets/images/mapp.png')}
              style={{alignSelf: 'center', width: '100%'}}></Image>

            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 16,
                marginTop: 20,
              }}>
              Performance
            </Text>

            <Image
              source={require('../../../assets/images/graph12345.png')}
              style={{alignSelf: 'center', width: 350, height: 300}}></Image>
          </View>
        </ScrollView>
      </RBSheet>

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
