import React, {createRef} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from './Colors';
import {strings} from '../../strings/i18n';
import {Dialog, DialogContent, SlideAnimation} from 'react-native-popup-dialog';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Headerview from './HeaderView1';
import SignatureCapture from 'react-native-signature-capture';
import crossIcon from '../../assets/images/cross_icon.png';
import {Checkbox, RadioButton} from 'react-native-paper';

const DialogView = props => {
  const sign = createRef();
  const [isChecked, setIsChecked] = React.useState(false);
  const [checked, setChecked] = React.useState('');

  const saveSign = () => {
    sign.current.saveImage();
  };

  const onSignatureReset = () => {
    sign.current.resetImage();
  };

  const _onSaveEvent = result => {
    setTimeout(() => {
      props.onSignatureCapture(result.encoded);
    }, 300);
  };

  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    //console.log('dragged');
  };

  const Dialogg = () => {
    if (props.showAlertDialog) {
      return (
        <Dialog visible={props.visible} width={0.75} overlayOpacity={0.5}>
          <DialogContent
            style={{padding: 10, backgroundColor: Colors.color_e0e0e0}}>
            <Image
              style={[
                styles.dialogIcon,
                {width: 45, height: 45, alignSelf: 'center', marginBottom: 20},
              ]}
              source={require('../../assets/images/alert_icon.png')}
            />

            <Text style={styles.textStyle}>{props.text}</Text>

            <View style={{alignSelf: 'center', marginTop: 20}}>
              <TouchableOpacity
                onPress={() => props.onConfirm()}
                style={{
                  backgroundColor: Colors.color_5E0F8B,
                  borderRadius: 20,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 120}}>
                  <Text style={styles.button_text_style}>Ok</Text>
                </View>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
      );
    } else if (props.showLoadingDialog) {
      return (
        <Dialog visible={props.visible} width={0.75}>
          <DialogContent
            style={{padding: 10, backgroundColor: Colors.color_e0e0e0}}>
            <ActivityIndicator
              size={60}
              color={Colors.orange_295CBF}
              marginTop={10}
            />
            <Text style={[styles.textStyle, {marginTop: 15}]}>
              {props.text}
            </Text>
          </DialogContent>
        </Dialog>
      );
    } else if (props.showDecisionDialog) {
      return (
        <Dialog visible={props.visible} width={0.9}>
          <DialogContent
            style={{padding: 10, backgroundColor: Colors.color_e0e0e0}}>
            <Image
              style={[
                styles.dialogIcon,
                {width: 60, height: 60, alignSelf: 'center', marginBottom: 10},
              ]}
              source={require('../../assets/images/alert_icon.png')}
            />

            <Text style={styles.textStyle}>{props.text}</Text>

            <View
              style={{
                alignSelf: 'center',
                marginTop: 20,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => props.onCancel()}
                style={{
                  backgroundColor: Colors.orange_295CBF,
                  borderRadius: 20,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 100}}>
                  <Text style={styles.button_text_style}>
                    {props.textCancel}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => props.onConfirm()}
                style={{
                  backgroundColor: Colors.orange_295CBF,
                  borderRadius: 20,
                  marginLeft: 10,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 100}}>
                  <Text style={styles.button_text_style}>
                    {props.textConfirm}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
      );
    } else if (props.showSignatureDialog) {
      return (
        <Dialog visible={props.visible} width={0.9}>
          <DialogContent
            style={{padding: 5, backgroundColor: Colors.grey_D0D0D0}}>
            <SignatureCapture
              style={styles.signature}
              ref={sign}
              onSaveEvent={_onSaveEvent}
              onDragEvent={_onDragEvent}
              showNativeButtons={false}
              showTitleLabel={false}
              backgroundColor={Colors.white}
              strokeColor={Colors.black}
              minStrokeWidth={10}
              maxStrokeWidth={10}
              viewMode={'portrait'}
            />
            <View
              style={{
                alignSelf: 'center',
                marginTop: 20,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => props.onCancel()}
                style={{
                  backgroundColor: Colors.color_5E0F8B,
                  borderRadius: 20,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 100}}>
                  <Text style={styles.button_text_style}>Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSignatureReset()}
                style={{
                  backgroundColor: Colors.color_5E0F8B,
                  borderRadius: 20,
                  marginLeft: 10,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 100}}>
                  <Text style={styles.button_text_style}>Reset</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => saveSign()}
                style={{
                  backgroundColor: Colors.color_5E0F8B,
                  borderRadius: 20,
                  marginLeft: 10,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 100}}>
                  <Text style={styles.button_text_style}>Ok</Text>
                </View>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
      );
    } else if (props.showSuccessfulAlert) {
      return (
        <Dialog
          visible={props.visible}
          width={0.75}
          containerStyle={{marginTop: props.customMargin}}
          overlayOpacity={0.5}>
          <DialogContent
            style={{padding: 10, backgroundColor: Colors.color_e0e0e0}}>
            <Image
              style={[
                styles.dialogIcon,
                {
                  width: 45,
                  height: 45,
                  alignSelf: 'center',
                  marginBottom: 20,
                },
              ]}
              source={require('../../assets/images/tick_icon.png')}
            />

            <Text style={styles.textStyle}>{props.text}</Text>

            <View style={{alignSelf: 'center', marginTop: 20}}>
              <TouchableOpacity
                onPress={() => props.onConfirm()}
                style={{
                  backgroundColor: Colors.orange_295CBF,
                  borderRadius: 20,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 120}}>
                  <Text style={styles.button_text_style}>Ok</Text>
                </View>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
      );
    } else if (props.showDeviceNotAvailableAlert) {
      return (
        <Dialog
          visible={props.visible}
          width={0.75}
          containerStyle={{marginTop: props.customMargin}}
          overlayOpacity={0.5}>
          <DialogContent
            style={{padding: 10, backgroundColor: Colors.color_e0e0e0}}>
            <Image
              style={[
                styles.dialogIcon,
                {
                  width: 45,
                  height: 45,
                  alignSelf: 'center',
                  marginBottom: 20,
                },
              ]}
              source={require('../../assets/images/cross_icon.png')}
            />

            <Text style={styles.textStyle}>{props.text}</Text>

            <View style={{alignSelf: 'center', marginTop: 20}}>
              <TouchableOpacity
                onPress={() => props.onConfirm()}
                style={{
                  backgroundColor: Colors.orange_295CBF,
                  borderRadius: 20,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 120}}>
                  <Text style={styles.button_text_style}>Ok</Text>
                </View>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
      );
    } else if (props.showUnSuccessfulAlert) {
      return (
        <Dialog
          visible={props.visible}
          width={0.75}
          overlayOpacity={0.5}
          containerStyle={{marginTop: props.customMargin}}>
          <DialogContent
            style={{padding: 10, backgroundColor: Colors.color_e0e0e0}}>
            <Image
              style={[
                styles.dialogIcon,
                {
                  width: 45,
                  height: 45,
                  alignSelf: 'center',
                  marginBottom: 20,
                },
              ]}
              source={require('../../assets/images/cross_icon.png')}
            />

            <Text style={styles.textStyle}>{props.text}</Text>

            <View style={{alignSelf: 'center', marginTop: 20}}>
              <TouchableOpacity
                onPress={() => props.onConfirm()}
                style={{
                  backgroundColor: Colors.orange_295CBF,
                  borderRadius: 20,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 120}}>
                  <Text style={styles.button_text_style}>Ok</Text>
                </View>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
      );
    } else if (props.showWarningAlert) {
      return (
        <Dialog
          visible={props.visible}
          width={0.75}
          overlayOpacity={0.5}
          containerStyle={{marginTop: props.customMargin}}>
          <DialogContent
            style={{padding: 10, backgroundColor: Colors.color_e0e0e0}}>
            <Image
              style={[
                styles.dialogIcon,
                {
                  width: 45,
                  height: 45,
                  alignSelf: 'center',
                  marginBottom: 20,
                },
              ]}
              source={require('../../assets/images/alert_icon.png')}
            />

            <Text style={styles.textStyle}>{props.text}</Text>

            <View style={{alignSelf: 'center', marginTop: 20}}>
              <TouchableOpacity
                onPress={() => props.onConfirm()}
                style={{
                  backgroundColor: Colors.orange_295CBF,
                  borderRadius: 20,
                }}>
                <View style={{flexDirection: 'column', padding: 7, width: 120}}>
                  <Text style={styles.button_text_style}>Ok</Text>
                </View>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
      );
    } else if (props.showSignTerms) {
      return (
        <Dialog visible={props.visible} width={0.9}>
          <ScrollView>
            <DialogContent
              style={{padding: 10, backgroundColor: Colors.color_e0e0e0}}>
              <View>
                <Text
                  style={[
                    styles.textStyle,
                    {marginTop: 10},
                    {fontWeight: 'bold'},
                  ]}>
                  By accessing or using the Service you agree to be bound by
                  these Terms. If you disagree with any part of the terms then
                  you may not access the Service.
                </Text>
                <Text
                  style={[
                    styles.textStyle,
                    {marginTop: 10},
                    {fontWeight: 'bold'},
                  ]}>
                  1. Changes
                </Text>
                <Text style={[styles.normalTextStyle, {marginTop: 5}]}>
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. If a revision is material we
                  will try to provide at least 30 (change this)​ day's notice
                  prior to any new terms taking effect. What constitutes a
                  material change will be determined at our sole discretion.
                </Text>
                <Text
                  style={[
                    styles.textStyle,
                    {marginTop: 10},
                    {fontWeight: 'bold'},
                  ]}>
                  2.Purchases
                </Text>
                <Text style={[styles.normalTextStyle, {marginTop: 5}]}>
                  If you wish to purchase any product or service made available
                  through the Service ("Purchase"), you may be asked to supply
                  certain information relevant to your Purchase including,
                  without limitation
                </Text>
                <Text
                  style={[
                    styles.textStyle,
                    {marginTop: 10},
                    {fontWeight: 'bold'},
                  ]}>
                  3.Contact Us
                </Text>
                <Text style={[styles.normalTextStyle, {marginTop: 5}]}>
                  If you have any questions about these Terms, please contact
                  us.
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Checkbox
                  color={Colors.black}
                  status={isChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setIsChecked(!isChecked);
                  }}
                />
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 15,
                    fontFamily: 'Titillium-Semibold',
                  }}>
                  I have read and agree to the Terms and Conditions
                </Text>
              </View>
              <View style={{alignSelf: 'center', marginTop: 15}}>
                <TouchableOpacity
                  onPress={() => {
                    if (isChecked) {
                      props.onConfirm();
                    }
                  }}
                  style={{
                    backgroundColor: Colors.orange_295CBF,
                    borderRadius: 20,
                  }}>
                  <View
                    style={{flexDirection: 'column', padding: 7, width: 120}}>
                    <Text style={styles.button_text_style}>Accept</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </DialogContent>
          </ScrollView>
        </Dialog>
      );
    } else if (props.showPaymentDialog) {
      return (
        <Dialog visible={props.visible} width={0.9}>
          <ScrollView>
            <DialogContent
              style={{
                padding: 10,
                backgroundColor: Colors.color_e0e0e0,
              }}>
              <Text
                style={[
                  styles.textStyle,
                  {marginTop: 10},
                  {fontWeight: 'bold'},
                ]}>
                Select Payment Method
              </Text>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginTop: 15,
                  marginLeft: 5,
                }}>
                {props.paymentMethodData.map(val => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <RadioButton
                        value={val.gateway.name}
                        status={
                          checked === val.gateway.name ? 'checked' : 'unchecked'
                        }
                        onPress={() => setChecked(val.gateway.name)}
                      />
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: Colors.black,
                          fontSize: 16,
                          marginRight: 10,
                          marginTop: 5,
                        }}>
                        {val.gateway.name}
                      </Text>
                    </View>
                  );
                })}
                <View
                  style={{
                    height: 60,
                    backgroundColor: Colors.white,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{flex: 1.5}}>
                    <TouchableOpacity
                      onPress={() => {
                        props.closeDialog();
                      }}
                      style={{
                        backgroundColor: Colors.grey_A9A9A9,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 100,
                        padding: 5,
                        borderRadius: 5,
                        flexDirection: 'row',
                        height: 40,
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 16,
                          fontFamily: 'Titillium-Semibold',
                        }}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      //onPress={}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 130,
                        backgroundColor: Colors.orange_295CBF,
                        padding: 5,
                        borderRadius: 5,
                        flexDirection: 'row',
                        height: 40,
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: 16,
                          fontFamily: 'Titillium-Semibold',
                          textAlign: 'center',
                        }}>
                        Proceed To Pay
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </DialogContent>
          </ScrollView>
        </Dialog>
      );
    } else if (props.showConfirmDialog) {
      return (
        <Dialog visible={props.visible} width={0.9}>
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
                  {props.text}
                </Text>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: 20,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => props.onCancel()}
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
                    props.onConfirm();
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
      );
    }
  };

  return <Dialogg />;
};

export default DialogView;

const styles = StyleSheet.create({
  counter_text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.colorgradient3,
    fontSize: 50,
  },
  audio_controls_text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 20,
  },
  titletextStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.white,
    alignSelf: 'center',
    fontSize: 18,
    textAlign: 'center',
  },
  textStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    alignSelf: 'center',
    fontSize: 18,
    textAlign: 'center',
  },
  normalTextStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    alignSelf: 'center',
    fontSize: 15,
    textAlign: 'left',
  },
  button_text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.white,
    alignSelf: 'center',
    fontSize: 18,
  },
  messag_text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 16,
  },
  text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 16,
    marginTop: 5,
  },
  status_dialog_style: {
    padding: 7,
    backgroundColor: Colors.white,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: Colors.black,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    elevation: 3,
    shadowOffset: {height: 1, width: 1},
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  signature: {
    height: 400,
    marginTop: 10,
  },
});
