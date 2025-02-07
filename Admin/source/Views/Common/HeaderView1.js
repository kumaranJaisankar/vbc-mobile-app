import React, {useRef, useState} from 'react';
import {Colors} from './Colors';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {Dialog, DialogContent} from 'react-native-popup-dialog';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {TextInput} from 'react-native-paper';
import AddLead from '../Components/Leads/AddLead';
import {showAppInstruction} from './Common';
import {connect} from 'react-redux';
import {operations} from '../../redux/Main';
import {bindActionCreators} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Search from './Search';
import {useRoute} from '@react-navigation/native';

const HeaderView = props => {
  const route = useRoute();
  const windowHeight = Dimensions.get('window').height;
  const refRBSheet = useRef();
  const addLeadRBSheet = useRef();
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const permission = props.userInfo.permissions;
  console.log('384', permission);

  const onLogOutPress = () => {
    setLogoutVisible(false);
    props.onRequestClose(false);
    props.updateAuthentication(false);
    AsyncStorage.clear();
    navigation.navigate('Login');
  };

  const openAddLeads = () => {
    refRBSheet.current.close();
    addLeadRBSheet.current.open();
  };

  const openAddNetwork = () => {
    refRBSheet.current.close();
    navigation.navigate('AddNetwork');
  };

  const openAddComplaints = () => {
    refRBSheet.current.close();
    navigation.navigate('Add_Complaints');
  };

  const openAddCustomers = () => {
    refRBSheet.current.close();
    navigation.navigate('KYC_List');
  };

  const notificationList = () => {
    navigation.navigate('notificationList');
  };

  if (props.showDashboardHeader) {
    return (
      <View style={{flexDirection: 'column', height: 50, marginTop: 30}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 0.2, flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity onPress={() => props.onMenuClick()}>
              <Image
                source={require('../../assets/images/menuicon2.png')}
                style={{alignSelf: 'center', marginLeft: 10}}></Image>
            </TouchableOpacity>
          </View>
          <View
            style={{flex: 1.5, flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 18,
                }}>
                {props.username}
              </Text>
            </View>
          </View>
          <View style={{flex: 0.4, flexDirection: 'column', marginTop: 6}}>
            <TouchableOpacity
              onPress={() => {
                showAppInstruction();
              }}>
              <SimpleLineIcons
                name={'bell'}
                size={22}
                color={route.name == 'notificationList' ? '#DC631F' : '#777777'}
                style={{padding: 5, alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  } else if (props.showHeader) {
    return (
      <View
        style={{
          flexDirection: 'column',
          height: 50,
          marginTop: 30,
          backgroundColor: Colors.white,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 0.2, flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity onPress={() => props.onMenuClick()}>
              <Image
                source={require('../../assets/images/menuicon2.png')}
                style={{alignSelf: 'center', marginLeft: 10}}></Image>
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.6, flexDirection: 'row'}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 18,
                }}>
                {props.username}
              </Text>
            </View>
          </View>
          <View
            style={{flex: 0.2, flexDirection: 'row', justifyContent: 'center'}}>
            {props.showAddIcon ? (
              <TouchableOpacity onPress={() => props.onAddClicked()}>
                <Feather
                  name={'plus-square'}
                  size={26}
                  color={Colors.orange_295CBF}
                  style={{
                    marginTop: 20,
                    padding: 5,
                    marginLeft: 10,
                    marginRight: -10,
                  }}
                />
              </TouchableOpacity>
            ) : null}
            {props.showRefreshIcon ? (
              <TouchableOpacity onPress={() => props.onRefreshClicked()}>
                <Feather
                  name={'refresh-ccw'}
                  size={25}
                  color={Colors.orange_295CBF}
                  style={{padding: 5}}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  } else if (props.showHeaderWithSearch) {
    return (
      <View
        style={{
          flexDirection: 'column',
          height: 50,
          marginTop: 30,
          backgroundColor: Colors.white,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 0.2, flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity onPress={() => props.onMenuClick()}>
              <Image
                source={require('../../assets/images/menuicon2.png')}
                style={{alignSelf: 'center', marginLeft: 10}}></Image>
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.6, flexDirection: 'row'}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 18,
                }}>
                {props.username}
              </Text>
            </View>
          </View>
          <View
            style={{flex: 0.2, flexDirection: 'row', justifyContent: 'center'}}>
            {props.showAddIcon ? (
              <TouchableOpacity onPress={() => props.onAddClicked()}>
                <Feather
                  name={'plus-square'}
                  size={26}
                  color={Colors.orange_295CBF}
                  style={{
                    marginTop: 20,
                    padding: 5,
                    marginLeft: 10,
                    marginRight: -10,
                  }}
                />
              </TouchableOpacity>
            ) : null}
            {props.showRefreshIcon ? (
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                  props.onRefreshClicked();
                }}>
                <Feather
                  name={'refresh-ccw'}
                  size={25}
                  color={Colors.orange_295CBF}
                  style={{padding: 5}}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 25,
          }}>
          <Search
            value={search}
            placeholderText={props.placeholderText}
            onChangeText={text => setSearch(text)}
            onClearText={() => setSearch('')}
            onSearchPressed={() => props.onSearchClicked(search)}
          />
        </View>
      </View>
    );
  } else if (props.showHeader1) {
    return (
      <View
        style={{
          flexDirection: 'column',
          height: 50,
          marginTop: 30,
          backgroundColor: Colors.white,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 0.2, flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity onPress={() => props.onMenuClick()}>
              <Image
                source={require('../../assets/images/menuicon2.png')}
                style={{alignSelf: 'center', marginLeft: 10}}></Image>
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.6, flexDirection: 'row'}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 16,
                }}>
                {props.username}
              </Text>
            </View>
          </View>
          <View
            style={{flex: 0.2, flexDirection: 'row', justifyContent: 'center'}}>
            {props.showAddIcon ? (
              <TouchableOpacity onPress={() => props.onAddClicked()}>
                <Feather
                  name={'plus-square'}
                  size={26}
                  color={Colors.orange_295CBF}
                  style={{
                    marginTop: 10,
                    padding: 5,
                    marginLeft: 10,
                  }}
                />
              </TouchableOpacity>
            ) : null}
            {props.showRefreshIcon ? (
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                  props.onRefreshClicked();
                }}>
                <Feather
                  name={'refresh-ccw'}
                  size={25}
                  color={Colors.orange_295CBF}
                  style={{marginTop: 10, padding: 5, marginRight: 10}}
                />
              </TouchableOpacity>
            ) : null}

            {/* <TouchableOpacity
            style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}
            onPress={() => props.getComplaintsListOnPageLoad()}>
            <Feather
              name={'refresh-ccw'}
              size={25}
              color={Colors.orange_295CBF}
              style={{padding: 5,
                    marginRight: 10,
                }}
            />
          </TouchableOpacity> */}
          </View>
        </View>
      </View>
    );
  } else if (props.showHeaderBack) {
    return (
      <View
        style={{
          flexDirection: 'column',
          height: 50,
          marginTop: 30,
          backgroundColor: Colors.white,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => props.onBackClick()}>
              <Ionicons
                name={'md-arrow-back-sharp'}
                size={30}
                color={'#DC631F'}
                style={{padding: 5}}
              />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 18,
                }}>
                {props.username}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              justifyContent: 'center',
            }}></View>
        </View>
      </View>
    );
  } else if (props.showSideMenu) {
    return (
      <Modal
        animationType="slideInLeft"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
          props.onRequestClose(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => props.onRequestClose(false)}
                style={{flex: 1}}>
                <Text
                  style={{
                    textAlign: 'right',
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.red_FF0000,
                    fontSize: 16,
                  }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1.5, flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/dashboard_user_icon.png')}
                  style={{
                    alignSelf: 'center',
                    marginLeft: 10,
                    height: 55,
                    width: 55,
                  }}></Image>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.black,
                    fontSize: 18,
                    textAlignVertical: 'center',
                    marginLeft: 10,
                  }}>
                  {'Hello ' + props.userInfo.username}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    showAppInstruction();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      margin: 10,
                      alignContent: 'center',
                    }}>
                    <MaterialIcons
                      name={'edit'}
                      size={20}
                      color={Colors.black}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: Colors.grey_A9A9A9,
                marginVertical: 10,
              }}></View>
            <View style={{flex: 1}}>
              <ScrollView>
                <TouchableOpacity
                  onPress={() => {
                    props.onRequestClose(false);
                    navigation.navigate('Dashboard');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      margin: 10,
                      alignContent: 'center',
                    }}>
                    <Ionicons name={'home'} size={20} color={Colors.black} />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        textAlignVertical: 'center',
                        marginLeft: 10,
                      }}>
                      Home
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => {
                    // props.onRequestClose(false);
                    // navigation.navigate('Payments');
                    showAppInstruction();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      margin: 10,
                      alignContent: 'center',
                    }}>
                    <MaterialIcons
                      name={'payment'}
                      size={22}
                      color={Colors.black}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        textAlignVertical: 'center',
                        marginLeft: 10,
                      }}>
                      Payments
                    </Text>
                  </View>
                </TouchableOpacity> */}

                {permission.find(code => code === 363) &&
                  permission.find(code => code === 365) && (
                    <TouchableOpacity
                      onPress={() => {
                        props.onRequestClose(false);
                        navigation.navigate('KYC_List');
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          margin: 10,
                          alignContent: 'center',
                        }}>
                        <Feather
                          name={'user-plus'}
                          size={22}
                          color={Colors.black}
                        />
                        <Text
                          style={{
                            fontFamily: 'Titillium-Semibold',
                            color: Colors.black,
                            fontSize: 16,
                            textAlignVertical: 'center',
                            marginLeft: 10,
                          }}>
                          Customer
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                {/* <TouchableOpacity
                  onPress={() => {
                    // props.onRequestClose(false);
                    // navigation.navigate('EmployeeStatus');
                    showAppInstruction();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      margin: 10,
                      alignContent: 'center',
                    }}>
                    <Feather
                      name={'user-check'}
                      size={24}
                      color={Colors.black}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        textAlignVertical: 'center',
                        marginLeft: 10,
                      }}>
                      Employee Status
                    </Text>
                  </View>
                </TouchableOpacity> */}
                {permission.find(code => code === 374) && (
                  <TouchableOpacity
                    onPress={() => {
                      props.onRequestClose(false);
                      navigation.navigate('Add_Complaints');
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        margin: 10,
                        alignContent: 'center',
                      }}>
                      <FontAwesome
                        name={'ticket'}
                        size={23}
                        color={Colors.black}
                      />
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 16,
                          textAlignVertical: 'center',
                          marginLeft: 10,
                        }}>
                        Helpdesk
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {permission.find(code => code === 329) && (
                  <TouchableOpacity
                    onPress={() => {
                      props.onRequestClose(false);
                      navigation.navigate('AddNetwork');
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        margin: 10,
                        alignContent: 'center',
                      }}>
                      <FontAwesome5
                        name={'network-wired'}
                        size={20}
                        color={Colors.black}
                      />
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 16,
                          textAlignVertical: 'center',
                          marginLeft: 10,
                        }}>
                        Network
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {/* <TouchableOpacity
                  onPress={() => {
                    // props.onRequestClose(false);
                    // navigation.navigate('Complaints');
                    showAppInstruction();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      margin: 10,
                      alignContent: 'center',
                    }}>
                    <FontAwesome
                      name={'ticket'}
                      size={23}
                      color={Colors.black}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        textAlignVertical: 'center',
                        marginLeft: 10,
                      }}>
                      Complaints DashBoard
                    </Text>
                  </View>
                </TouchableOpacity> */}
                {permission.find(code => code === 399) && (
                  <TouchableOpacity
                    onPress={() => {
                      props.onRequestClose(false);
                      navigation.navigate('Leads');
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        margin: 10,
                        alignContent: 'center',
                      }}>
                      <Feather name={'users'} size={23} color={Colors.black} />
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 16,
                          textAlignVertical: 'center',
                          marginLeft: 10,
                        }}>
                        Leads
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {permission.find(code => code === 380) && (
                  <TouchableOpacity
                    onPress={() => {
                      props.onRequestClose(false);
                      navigation.navigate('BillingHistory');
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        margin: 10,
                        alignContent: 'center',
                      }}>
                      <MaterialCommunityIcons
                        name={'cash-multiple'}
                        size={25}
                        color={Colors.black}
                      />
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 16,
                          textAlignVertical: 'center',
                          marginLeft: 10,
                        }}>
                        Billing History
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    // props.onRequestClose(false);
                    // navigation.navigate('Pickups_List');
                    showAppInstruction();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      margin: 10,
                      alignContent: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name={'car-pickup'}
                      size={25}
                      color={Colors.black}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        textAlignVertical: 'center',
                        marginLeft: 10,
                      }}>
                      Pickups
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    props.onRequestClose(false);
                    navigation.navigate('Reports');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      margin: 10,
                      alignContent: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name={'text-box-multiple-outline'}
                      size={25}
                      color={Colors.black}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        textAlignVertical: 'center',
                        marginLeft: 10,
                      }}>
                      Reports
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  onPress={() => {
                    //props.onRequestClose(false);
                    showAppInstruction();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      margin: 10,
                      alignContent: 'center',
                    }}>
                    <Feather name={'settings'} size={23} color={Colors.black} />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        textAlignVertical: 'center',
                        marginLeft: 10,
                      }}>
                      Settings
                    </Text>
                  </View>
                </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={() => {
                    setLogoutVisible(true);
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      margin: 10,
                      alignContent: 'center',
                    }}>
                    <MaterialIcons
                      name={'logout'}
                      size={23}
                      color={Colors.black}
                    />
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: Colors.black,
                        fontSize: 16,
                        textAlignVertical: 'center',
                        marginLeft: 10,
                      }}>
                      Logout
                    </Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>

        <Dialog visible={logoutVisible} width={0.9}>
          <DialogContent
            style={{padding: 10, backgroundColor: Colors.color_e0e0e0}}>
            <View style={{flexDirection: 'column'}}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 18,
                  }}>
                  Do you want to logout?
                </Text>
              </View>

              <View
                style={{
                  alignSelf: 'center',
                  marginTop: 20,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => setLogoutVisible(false)}
                  style={{
                    backgroundColor: Colors.orange_295CBF,
                    borderRadius: 20,
                  }}>
                  <View
                    style={{flexDirection: 'column', padding: 7, width: 120}}>
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 16,
                        alignSelf: 'center',
                      }}>
                      No
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    onLogOutPress();
                  }}
                  style={{
                    backgroundColor: Colors.orange_295CBF,
                    borderRadius: 20,
                    marginLeft: 20,
                  }}>
                  <View
                    style={{flexDirection: 'column', padding: 7, width: 120}}>
                    <Text
                      style={{
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 16,
                        alignSelf: 'center',
                      }}>
                      Yes
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </DialogContent>
        </Dialog>
      </Modal>
    );
  } else if (props.showTermsHeader) {
    return (
      <LinearGradient
        colors={[Colors.colorgradient1, Colors.colorgradient3]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        useAngle={true}
        angle={45}
        angleCenter={{x: 0.5, y: 0.5}}
        style={{
          height: 160,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}>
        <View
          style={{
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 0.6, flexDirection: 'row', marginTop: -35}}>
              <TouchableOpacity onPress={() => props.onBackClicked()}>
                <Ionicons
                  name={'arrow-back'}
                  size={25}
                  color={Colors.white}
                  style={{alignSelf: 'center', marginLeft: 15}}
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column', marginLeft: 15}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#FFFFFF',
                    fontSize: 18,
                    textAlign: 'center',
                  }}>
                  {props.title}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 0.4,
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {props.showRefreshIcon ? (
                <TouchableOpacity
                  onPress={() => props.onRefreshClicked()}
                  style={{marginTop: -30, marginHorizontal: 20}}>
                  <Feather
                    name={'refresh-ccw'}
                    size={25}
                    color={Colors.white}
                    style={{padding: 5}}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  } else if (props.showFooter) {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
        <View style={{flex: 0.5, flexDirection: 'column'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Dashboard');
            }}>
            <SimpleLineIcons
              name={'home'}
              size={22}
              color={route.name == 'Dashboard' ? '#DC631F' : '#777777'}
              style={
                route.name == 'Dashboard'
                  ? {
                      padding: 5,
                      alignSelf: 'center',
                      borderTopWidth: 3,
                      borderTopColor: '#ff0000',
                    }
                  : {
                      padding: 5,
                      alignSelf: 'center',
                    }
              }
            />
          </TouchableOpacity>
        </View>
        {/* <View style={{flex: 0.5, flexDirection: 'column'}}>
          <TouchableOpacity
            onPress={() => {
              showAppInstruction();
            }}>
            <SimpleLineIcons
              name={'bell'}
              size={22}
              color={'#777777'}
              style={{padding: 5, alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </View> */}
        <View style={{flex: 0.5, flexDirection: 'column'}}>
          <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            <MaterialCommunityIcons
              name={'plus-box'}
              size={33}
              color={'#DC631F'}
              style={{padding: 5, alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </View>
        {/* <View style={{flex: 0.5, flexDirection: 'column'}}>
          <TouchableOpacity
            onPress={() => {
              showAppInstruction();
            }}>
            <SimpleLineIcons
              name={'settings'}
              size={22}
              color={'#777777'}
              style={{padding: 5, alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </View> */}
        <View style={{flex: 0.5, flexDirection: 'column'}}>
          <TouchableOpacity
            onPress={() => {
              showAppInstruction();
            }}>
            <Image
              source={require('../../assets/images/usericon.png')}
              style={{alignSelf: 'center', height: 35, width: 35}}></Image>
          </TouchableOpacity>
        </View>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={350}
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
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 20,
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <View style={{padding: 20}}>
            {permission.find(code => code === 1) && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  alignItems: 'center',
                }}
                onPress={() => {
                  openAddLeads();
                }}>
                <Feather
                  name={'users'}
                  size={25}
                  color={Colors.black}
                  style={{padding: 5, alignSelf: 'center'}}
                />
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  Lead
                </Text>
              </TouchableOpacity>
            )}

            {permission.find(code => code === 374) && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  alignItems: 'center',
                }}
                onPress={openAddComplaints}>
                <FontAwesome
                  name={'ticket'}
                  size={23}
                  color={Colors.black}
                  style={{padding: 5, alignSelf: 'center'}}
                />
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  Helpdesk
                </Text>
              </TouchableOpacity>
            )}
            {permission.find(code => code === 329) && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  alignItems: 'center',
                }}
                onPress={openAddNetwork}>
                <FontAwesome5
                  name={'network-wired'}
                  size={20}
                  color={Colors.black}
                  style={{padding: 5, alignSelf: 'center'}}
                />
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  Network
                </Text>
              </TouchableOpacity>
            )}

            {permission.find(code => code === 363) &&
              permission.find(code => code === 365) && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    alignItems: 'center',
                  }}
                  onPress={openAddCustomers}>
                  <Feather
                    name={'user-plus'}
                    size={25}
                    color={Colors.black}
                    style={{padding: 5, alignSelf: 'center'}}
                  />
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 18,
                      marginLeft: 15,
                    }}>
                    Customer
                  </Text>
                </TouchableOpacity>
              )}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => refRBSheet.current.close()}>
              <Ionicons
                name={'ios-close-circle-outline'}
                size={45}
                color={Colors.grey_888888}
              />
              {/* <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 18,
                  marginLeft: 15,
                  padding: 10,
                  backgroundColor: '#F4F4F4',
                  width: 111,
                  textAlign: 'center',
                  borderRadius: 8,
                }}>
                Close
              </Text> */}
            </TouchableOpacity>
          </View>
        </RBSheet>
        <AddLead Ref={addLeadRBSheet} />
      </View>
    );
  } else if (props.showKYCHeader) {
    return (
      <View style={styles.container}>
        <View
          style={{flexDirection: 'row', height: '100%', alignItems: 'center'}}>
          <View style={{flex: 0.3, alignItems: 'center'}}>
            {props.showBackButton ? (
              <TouchableOpacity onPress={() => props.onBackClicked()}>
                <Ionicons
                  name={'md-arrow-back-sharp'}
                  size={30}
                  color={Colors.orange_295CBF}
                  style={{marginTop: 22, padding: 5}}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={{flex: 1.3}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.orange_295CBF,
                alignSelf: 'center',
                fontSize: 18,
                marginTop: 25,
              }}>
              {props.title}
            </Text>
          </View>

          <View
            style={{
              flex: 0.4,
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row',
              marginRight: 15,
            }}>
            {props.showSaveIcon ? (
              <TouchableOpacity onPress={() => props.onSaveClicked()}>
                <Ionicons
                  name={'checkmark-sharp'}
                  size={33}
                  color={Colors.white}
                  style={{marginTop: 22, padding: 5}}
                />
              </TouchableOpacity>
            ) : null}
            {props.showRefreshIcon ? (
              <TouchableOpacity onPress={() => props.onRefreshClicked()}>
                <Feather
                  name={'refresh-ccw'}
                  size={26}
                  color={Colors.white}
                  style={{marginTop: 22, padding: 5}}
                />
              </TouchableOpacity>
            ) : null}
            {props.showSendIcon ? (
              <TouchableOpacity onPress={() => props.onSendClicked()}>
                <Ionicons
                  name={'send-sharp'}
                  size={30}
                  color={Colors.white}
                  style={{marginTop: 22, padding: 5}}
                />
              </TouchableOpacity>
            ) : null}
            {props.showAddIcon ? (
              <TouchableOpacity onPress={() => props.onAddClicked()}>
                <Feather
                  name={'plus-square'}
                  size={26}
                  color={Colors.orange_295CBF}
                  style={{
                    marginTop: 22,
                    padding: 5,
                    marginLeft: 10,
                    marginRight: -10,
                  }}
                />
              </TouchableOpacity>
            ) : null}
            {props.showFilterIcon ? (
              <TouchableOpacity onPress={() => props.onFilterClicked()}>
                <Feather
                  name={'filter'}
                  size={26}
                  color={Colors.white}
                  style={{
                    marginTop: 22,
                    padding: 5,
                    marginLeft: 10,
                    marginRight: -10,
                  }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
};

function mapStateToProps(state, props) {
  return {
    userInfo: state.mainReducers.main.userInfo,
    updateAuthentication: state.mainReducers.main.updateAuthentication,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(operations, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderView);

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
  dashboard_header_container: {
    height: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100%',
  },
  modalView: {
    backgroundColor: Colors.grey_F8F8F8,
    padding: 10,
    height: '100%',
    width: '80%',
  },
  textStyle: {
    fontSize: 25,
    color: 'white',
    flex: 1,
  },
  dropdown: {
    marginTop: 5,
    borderColor: Colors.grey_C0C0C0,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FAFAFA',
    padding: 5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.grey_888888,
    fontSize: 15,
  },
  selectedTextStyle: {
    fontFamily: 'Titillium-Semibold',
    color: '#000000',
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
