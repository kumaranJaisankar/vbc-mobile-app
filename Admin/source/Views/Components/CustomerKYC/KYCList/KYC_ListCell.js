import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Colors} from '../../../Common/Colors';
import {strings} from '../../../../strings/i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import {connect} from 'react-redux';

const UserLogListCell = props => {
  var itemData = props.itemdata;
  console.log(
    '🚀 ~ file: KYC_ListCell.js:11 ~ UserLogListCell ~ itemData',
    itemData,
  );
  const permission = props.userInfo.permissions;

  return (
    <View>
      {permission.find(code => code === 12) ? (
        <View>
          <TouchableOpacity
            onPress={() => props.onItemClick()}
            style={{
              flexDirection: 'column',
              shadowOffset: {height: 1, width: 1},
              elevation: 5,
              padding: 7,
              borderRadius: 10,
              shadowRadius: 2,
              shadowOpacity: 0.8,
              shadowColor: Colors.black,
              backgroundColor: Colors.white,
              flex: 1,
              marginVertical: 8,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Name
                </Text>
              </View>
              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                  }}>
                  :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text style={styles.text_style}>
                  {itemData.first_name + ' ' + itemData.last_name}
                </Text>
              </View>
              {permission.find(code => code === 12) && (
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 0.1,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity onPress={() => props.onItemClick()}>
                    <Ionicons
                      name={'chevron-forward-outline'}
                      size={30}
                      color={Colors.grey_444444}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  User ID
                </Text>
              </View>

              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                  }}>
                  :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  {itemData?.user?.username}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.1,
                  justifyContent: 'center',
                }}></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Plan
                </Text>
              </View>

              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                  }}>
                  :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  {itemData?.service_plan?.package_name}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.1,
                  justifyContent: 'center',
                }}></View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Email
                </Text>
              </View>

              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                  }}>
                  :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  {itemData.registered_email}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.1,
                  justifyContent: 'center',
                }}></View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Mobile
                </Text>
              </View>

              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                  }}>
                  :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  {itemData.register_mobile}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.1,
                  justifyContent: 'center',
                }}></View>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              shadowOffset: {height: 1, width: 1},
              elevation: 5,
              padding: 7,
              borderRadius: 10,
              shadowRadius: 2,
              shadowOpacity: 0.8,
              shadowColor: Colors.black,
              backgroundColor: Colors.white,
              flex: 1,
              marginVertical: 8,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Name
                </Text>
              </View>
              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                  }}>
                  :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text style={styles.text_style}>
                  {itemData.first_name + ' ' + itemData.last_name}
                </Text>
              </View>
              {permission.find(code => code === 12) && (
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 0.1,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity onPress={() => props.onItemClick()}>
                    <Ionicons
                      name={'chevron-forward-outline'}
                      size={30}
                      color={Colors.grey_444444}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  User ID
                </Text>
              </View>

              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                  }}>
                  :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  {itemData?.user?.username}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.1,
                  justifyContent: 'center',
                }}></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Plan
                </Text>
              </View>

              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                  }}>
                  :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  {itemData?.service_plan?.package_name}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.1,
                  justifyContent: 'center',
                }}></View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Email
                </Text>
              </View>

              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                  }}>
                  :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  {itemData.registered_email}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.1,
                  justifyContent: 'center',
                }}></View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Mobile
                </Text>
              </View>

              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#808080',
                    fontSize: 15,
                  }}>
                  :
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  {itemData.register_mobile}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.1,
                  justifyContent: 'center',
                }}></View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

function mapStateToProps(state, props) {
  return {
    userInfo: state.mainReducers.main.userInfo,
  };
}
export default connect(mapStateToProps)(UserLogListCell);
