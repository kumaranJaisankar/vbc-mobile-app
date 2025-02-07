import {format} from 'date-fns';
import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {RadioButton, TextInput, Button} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import {strings} from '../../../../../strings/i18n';
import Camera from '../../../../Common/Camera';
import {Colors} from '../../../../Common/Colors';
import {checkAmount, walletReloadOff} from '../../../../services/MainService';
import styles from '../styles';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import DialogView from '../../../../Common/DialogView';

const WalletInfo = props => {
  const navigation = useNavigation();
  console.log('🚀 ~ file: WalletInfo.js:13 ~ WalletInfo ~ props', props);
  const [checked, setChecked] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [receipt, setReceipt] = React.useState('');
  const profilePicRBSheet = React.useRef();
  const [isCameraClick, setCamerClick] = React.useState('');
  const [amountAllowed, setAmountAllowed] = React.useState(true);
  const [isEditLoading, setIsEditLoading] = React.useState(false);
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });
  const profilePicclicked = () => {
    setCamerClick('receipt');
    profilePicRBSheet.current.open();
  };
  const onCameraClicked = async () => {
    await Camera.openCameraPanel(
      isCameraClick,
      imageResponse => {
        profilePicRBSheet.current.close();
        setReceipt('data:image/png;base64,' + imageResponse.imageData.data);
      },
      error => {
        const errorresponse = error.ToString();
      },
    );
  };

  const onGalleryClicked = async () => {
    await Camera.openGallery(
      isCameraClick,
      imageResponse => {
        profilePicRBSheet.current.close();
        setReceipt('data:image/png;base64,' + imageResponse.imageData.data);
      },
      error => {
        const errorresponse = error.ToString();
      },
    );
  };

  const onSubmitPressed = async () => {
    setIsEditLoading(true);
    let data = {
      amount: amount ? parseInt(amount) : 0,
      customer_id: props?.extra?.id,
      paid_to: props?.userInfoData?.id,
      payment_date: format(new Date(), 'yyyy-MM-dd'),
    };
    if (receipt) {
      data.receipt = receipt;
    }
    console.log('🚀 ~ file: WalletInfo.js:18 ~ onSubmitPressed ~ data', data);
    const res = await walletReloadOff(data);
    if (res?.isSuccess) {
      setIsEditLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Wallet Updated Successfully!!',
        position: 'top',
      });
      setAmount('');
      props.customerFun();
      setTimeout(() => {
        setChecked('');
      }, 1000);
    }
    console.log('🚀 ~ file: WalletInfo.js:19 ~ onSubmitPressed ~ res', res);
    setIsEditLoading(false);
  };

  const checkWalletAmtInput = async value => {
    console.log('walletAmount here', value);
    const data = {
      wallet_amount: value ? Number(value) : 0,
    };
    console.log('walletAmount data', data);
    try {
      const res = await checkAmount(props?.extra?.id, data);
      if (res.result.check) {
        setAmountAllowed(true);
      } else {
        setAmountAllowed(false);
        setRenewRecent({
          text: `Wallet amount of max ${res.result.remaining_wallet_amount} RS. is allowed.`,
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: `Wallet amount of max ${res.result.remaining_wallet_amount} RS. is allowed.`,
        // });
      }

      console.log('response for check', res);
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            style={{
              fontFamily: 'Titillium-Semibold',
              color: Colors.grey_888888,
              fontSize: 16,
              marginLeft: 10,
            }}>
            Wallet Balance: {props?.extra?.wallet_info}{' '}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => props.customerFun()}>
            <Feather
              name={'refresh-ccw'}
              size={25}
              color={Colors.orange_295CBF}
              style={{padding: 5}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <RadioButton
          value="online"
          status={checked === 'online' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('online')}
        />
        <Text
          style={{
            fontFamily: 'Titillium-Semibold',
            color: Colors.grey_888888,
            fontSize: 16,
            marginRight: 10,
            marginTop: 6,
          }}>
          Online
        </Text>
        <RadioButton
          value="offline"
          status={checked === 'offline' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('offline')}
        />
        <Text
          style={{
            fontFamily: 'Titillium-Semibold',
            color: Colors.grey_888888,
            fontSize: 16,
            marginTop: 6,
          }}>
          Offline
        </Text>
      </View>

      {checked == 'offline' && (
        <ScrollView>
          <View>
            <TextInput
              mode="outlined"
              label={'Customer ID'}
              value={props?.basicData?.user?.username}
              maxLength={20}
              returnKeyType="next"
              keyboardType="default"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              disabled={true}
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                fontSize: 15,
                width: '95%',
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
                paddingBottom: 0,
                backgroundColor: '#FAFAFA',
              }}
              theme={{
                colors: {
                  placeholder: Colors.grey_888888,
                  text: Colors.black,
                  primary: Colors.grey_C0C0C0,
                  underlineColor: 'transparent',
                  backgroundColor: Colors.white,
                },
                fonts: {
                  regular: {
                    fontFamily: 'Titillium-Semibold',
                    fontWeight: 'normal',
                  },
                },
              }}
            />
            <TextInput
              mode="outlined"
              label={'Collected By *'}
              value={props?.userInfoData?.username}
              maxLength={20}
              returnKeyType="next"
              keyboardType="default"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              disabled={true}
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                fontSize: 15,
                width: '95%',
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
                paddingBottom: 0,
                backgroundColor: '#FAFAFA',
              }}
              theme={{
                colors: {
                  placeholder: Colors.grey_888888,
                  text: Colors.black,
                  primary: Colors.grey_C0C0C0,
                  underlineColor: 'transparent',
                  backgroundColor: Colors.white,
                },
                fonts: {
                  regular: {
                    fontFamily: 'Titillium-Semibold',
                    fontWeight: 'normal',
                  },
                },
              }}
            />
            <TextInput
              mode="outlined"
              label={'Paid Amount *'}
              value={amount}
              maxLength={20}
              returnKeyType="next"
              keyboardType="default"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              onChangeText={text => {
                setAmount(text);
                checkWalletAmtInput(text);
              }}
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                fontSize: 15,
                width: '95%',
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
                paddingBottom: 0,
                backgroundColor: '#FAFAFA',
              }}
              theme={{
                colors: {
                  placeholder: Colors.grey_888888,
                  text: Colors.black,
                  primary: Colors.grey_C0C0C0,
                  underlineColor: 'transparent',
                  backgroundColor: Colors.white,
                },
                fonts: {
                  regular: {
                    fontFamily: 'Titillium-Semibold',
                    fontWeight: 'normal',
                  },
                },
              }}
            />
            <TextInput
              mode="outlined"
              label={'Date'}
              value={format(new Date(), 'MM-dd-yyyy')}
              maxLength={20}
              returnKeyType="next"
              keyboardType="default"
              placeholderStyle={{fontSize: 20}}
              underlineColorAndroid="transparent"
              disabled={true}
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                fontSize: 15,
                width: '95%',
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
                paddingBottom: 0,
                backgroundColor: '#FAFAFA',
              }}
              theme={{
                colors: {
                  placeholder: Colors.grey_888888,
                  text: Colors.black,
                  primary: Colors.grey_C0C0C0,
                  underlineColor: 'transparent',
                  backgroundColor: Colors.white,
                },
                fonts: {
                  regular: {
                    fontFamily: 'Titillium-Semibold',
                    fontWeight: 'normal',
                  },
                },
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: Colors.white,
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 200,
                  width: '50%',
                  margin: 10,
                  borderStyle: 'dashed',
                  borderRadius: 2,
                  borderWidth: 3,
                  borderColor: Colors.grey_D0D0D0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                {receipt.length <= 0 && (
                  <View style={{alignItems: 'center'}}>
                    <Image
                      source={require('../../../../../assets/images/docicon1.png')}></Image>
                  </View>
                )}
                {receipt.length > 0 && (
                  <Image
                    source={{uri: receipt}}
                    style={{width: 200, height: 200, borderRadius: 5}}
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={profilePicclicked}
                style={{
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '50%',
                  backgroundColor: '#FFCAAD',
                  padding: 5,
                  borderRadius: 5,
                  height: 40,
                  padding: 5,
                }}>
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 16,
                    fontFamily: 'Titillium-Semibold',
                  }}>
                  Upload Receipt
                </Text>
              </TouchableOpacity>
            </View>

            <RBSheet
              ref={profilePicRBSheet}
              height={180}
              closeOnDragDown={true}
              closeOnPressMask={false}
              customStyles={{
                wrapper: {
                  backgroundColor: 'transparent',
                },
                draggableIcon: {
                  backgroundColor: '#000',
                },
              }}>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'column',
                  backgroundColor: Colors.grey_D0D0D0,
                }}>
                <TouchableOpacity
                  style={{alignItems: 'flex-end'}}
                  onPress={() => profilePicRBSheet.current.close()}>
                  <Text style={styles.textStyle_close_attachment}>
                    {strings('KYC_Form.Close')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={onCameraClicked}>
                  <Image
                    source={require('../../../../../assets/images/camera_icon.png')}
                    style={{width: 30, height: 30}}></Image>
                  <Text style={[styles.textStyle_attachment, {marginLeft: 10}]}>
                    {strings('KYC_Form.Camera')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                  onPress={onGalleryClicked}>
                  <Image
                    source={require('../../../../../assets/images/gallery_icon1.png')}
                    style={{width: 30, height: 30}}></Image>
                  <Text style={[styles.textStyle_attachment, {marginLeft: 10}]}>
                    {strings('KYC_Form.Gallery')}
                  </Text>
                </TouchableOpacity>
              </View>
            </RBSheet>
            <View>
              <View>
                <TouchableOpacity disabled={!amountAllowed}>
                  <Button
                    disabled={!amountAllowed}
                    mode="contained"
                    onPress={() => {
                      onSubmitPressed();
                    }}
                    uppercase={false}
                    style={{
                      backgroundColor: '#476DFC',
                      marginTop: 20,
                      marginBottom: 100,
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Titillium-Semibold',
                        fontWeight: 'normal',
                        color: Colors.white,
                      }}>
                      Submit
                    </Text>
                  </Button>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      <DialogView
        showAlertDialog
        visible={isRenewRecent.visible}
        text={isRenewRecent.text}
        onConfirm={() => {
          setRenewRecent({text: '', visible: false});
        }}
        textConfirm={'Okay'}></DialogView>
      <DialogView
        showLoadingDialog
        visible={isEditLoading}
        text={'Upgrading Wallet...'}></DialogView>
    </View>
  );
};

export default WalletInfo;
