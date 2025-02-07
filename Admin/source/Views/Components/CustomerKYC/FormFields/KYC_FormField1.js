import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Colors} from '../../../Common/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TextInput} from 'react-native-paper';

const FormField = props => {
  const [selection, setSelection] = useState({start: 0});
  const handleFocus = () => {
    setSelection(null);
  };
  const handleBlur = () => {
    //setSelection({start: 0});
  };
  const fieldsWithNumberValidation = [
    'pincode',
    'aadhar_no',
    'mobile_no',
    'installationCharge',
    'securityDeposit',
  ];

  if (props.showInput) {
    const borderStyle =
      props.isEnabled == true ? styles.textvalid : styles.textinvalid;
    return (
      <View style={{margin: 7, marginHorizontal: 15}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.isMandatory == true ? (
            <AntDesign name={'star'} size={10} color={Colors.red_FF0000} />
          ) : null}
          <Text style={styles.title_style}>{props.title}</Text>
        </View>
        <TextInput
          onChange={event =>
            props?.handleFormValueChange(props.formKey, event.nativeEvent.text)
          }
          value={props.value}
          multiline={true}
          maxLength={props.length}
          underlineColorAndroid="transparent"
          // autoCapitalize="none"
          editable={props.isEnabled}
          keyboardType={props.keyboardType}
          style={[styles.textinput_style, borderStyle]}
          {...props.textInputProps}
        />
      </View>
    );
  } else if (props.showInputField) {
    const borderStyle =
      props.isEnabled == true ? styles.textvalid : styles.textinvalid;
    return (
      <View style={{margin: 8, marginHorizontal: 15}}>
        <TextInput
          mode="outlined"
          autoCapitalize={props.autoCapitalize ? 'characters' : 'sentences'}
          onBlur={handleBlur}
          onFocus={handleFocus}
          selection={selection}
          label={props.title}
          value={props.value}
          maxLength={props.length}
          editable={props.isEnabled}
          keyboardType={props.keyboardType}
          placeholderStyle={{fontSize: 20}}
          secureTextEntry={props.isPasswordField}
          underlineColorAndroid="transparent"
          style={{
            fontSize: 15,
            fontFamily: 'Titillium-Semibold',
            fontWeight: 'normal',
            backgroundColor: Colors.white,
            paddingBottom: 0,
          }}
          onChangeText={text => {
            if (fieldsWithNumberValidation.includes(props.formKey)) {
              if (/^[0-9]+$|^$/.test(text)) {
                return props?.handleFormValueChange(props.formKey, text);
              } else {
                return;
              }
            } else if (
              props.formKey === 'state' ||
              props.formKey === 'district' ||
              props.formKey === 'country'
            ) {
              if (/^[a-zA-Z ]*$/.test(text)) {
                return props?.handleFormValueChange(props.formKey, text);
              } else {
                return;
              }
            } else {
              return props?.handleFormValueChange(props.formKey, text);
            }
          }}
          theme={{
            colors: {
              placeholder: 'grey',
              text: 'black',
              primary: 'grey',
              underlineColor: 'transparent',
              backgroundColor: 'white',
            },
            fonts: {
              regular: {
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
              },
            },
          }}
        />
      </View>
    );
  } else if (props.showInputFieldEmail) {
    const borderStyle =
      props.isEnabled == true ? styles.textvalid : styles.textinvalid;
    return (
      <View style={{margin: 8, marginHorizontal: 15}}>
        <TextInput
          mode="outlined"
          autoCapitalize="none"
          label={props.title}
          value={props.value.toLowerCase()}
          maxLength={props.length}
          editable={props.isEnabled}
          keyboardType={props.keyboardType}
          placeholderStyle={{fontSize: 20}}
          secureTextEntry={props.isPasswordField}
          underlineColorAndroid="transparent"
          style={{
            fontSize: 15,
            fontFamily: 'Titillium-Semibold',
            fontWeight: 'normal',
            backgroundColor: Colors.white,
            paddingBottom: 0,
          }}
          onChangeText={text =>
            props?.handleFormValueChange(props.formKey, text.toLowerCase())
          }
          theme={{
            colors: {
              placeholder: 'grey',
              text: 'black',
              primary: 'grey',
              underlineColor: 'transparent',
              backgroundColor: 'white',
            },
            fonts: {
              regular: {
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
              },
            },
          }}
        />
      </View>
    );
  } else if (props.showInputFieldAdd) {
    const borderStyle =
      props.isEnabled == true ? styles.textvalid : styles.textinvalid;
    return (
      <View style={{margin: 8, marginHorizontal: 15}}>
        <TextInput
          mode="outlined"
          label={props.title}
          value={props.value}
          maxLength={props.length}
          editable={props.isEnabled}
          keyboardType={props.keyboardType}
          placeholderStyle={{fontSize: 20}}
          secureTextEntry={props.isPasswordField}
          underlineColorAndroid="transparent"
          // autoCapitalize="none"
          style={{
            fontSize: 15,
            fontFamily: 'Titillium-Semibold',
            fontWeight: 'normal',
            backgroundColor: Colors.grey_E8E8E8,
            paddingBottom: 0,
          }}
          onChangeText={text =>
            props?.handleFormValueChange(props.formKey, text)
          }
          theme={{
            colors: {
              placeholder: 'grey',
              text: 'black',
              primary: 'grey',
              underlineColor: 'transparent',
              backgroundColor: 'red',
            },
            fonts: {
              regular: {
                fontFamily: 'Titillium-Semibold',
                fontWeight: 'normal',
              },
            },
          }}
        />
      </View>
    );
  } else if (props.showDropDown) {
    const borderStyle =
      props.isEnabled == true ? styles.textvalid : styles.textinvalid;
    return (
      <View style={{margin: 8, marginHorizontal: 15}}>
        <TouchableOpacity onPress={() => props.onDropDownClick()}>
          <TextInput
            mode="outlined"
            label={props.title}
            value={props.value}
            maxLength={props.length}
            editable={props.isEnabled}
            keyboardType={props.keyboardType}
            placeholderStyle={{fontSize: 20}}
            underlineColorAndroid="transparent"
            // autoCapitalize="none"
            right={
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => props.onDropDownClick()}>
                    <Ionicons
                      name={'caret-down-outline'}
                      size={25}
                      color={Colors.grey_A9A9A9}
                      style={{marginTop: 7}}
                    />
                  </TouchableOpacity>
                )}
              />
            }
            style={{
              fontSize: 15,
              fontFamily: 'Titillium-Semibold',
              fontWeight: 'normal',
              height: 50,
              backgroundColor: Colors.white,
            }}
            onChangeText={text =>
              props?.handleFormValueChange(props.formKey, text)
            }
            theme={{
              colors: {
                placeholder: 'grey',
                text: 'black',
                primary: 'grey',
                underlineColor: 'transparent',
                backgroundColor: 'white',
              },
              fonts: {
                regular: {
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        </TouchableOpacity>
      </View>
    );
  } else if (props.showDatePicker) {
    const borderStyle =
      props.isEnabled == true ? styles.textvalid : styles.textinvalid;
    return (
      <View style={{margin: 7, marginHorizontal: 15}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.isMandatory == true ? (
            <AntDesign name={'star'} size={10} color={Colors.red_FF0000} />
          ) : null}
          <Text style={styles.title_style}>{props.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.dropdown_style}
          onPress={() => props.onDatePickerClick()}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              //onChange={(event) => props.handleFormValueChange(props.formKey, event.nativeEvent.text)}
              value={props.value}
              multiline={true}
              maxLength={props.length}
              underlineColorAndroid="transparent"
              // autoCapitalize="none"
              editable={false}
              keyboardType={props.keyboardType}
              style={styles.dropdowntext_style}
              {...props.textInputProps}
            />
            <Ionicons
              name={'calendar-outline'}
              size={30}
              color={Colors.grey_444444}
              style={{width: '10%', textAlign: 'right', marginLeft: -15}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  } else if (props.showCapture) {
    const borderStyle =
      props.isEnabled == true ? styles.textvalid : styles.textinvalid;
    return (
      <View style={{margin: 7, marginHorizontal: 15}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.isMandatory == true ? (
            <AntDesign name={'star'} size={10} color={Colors.red_FF0000} />
          ) : null}
          <Text style={styles.title_style}>{props.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.dropdown_style}
          onPress={() => props.onCaptureClick()}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
            <View style={{width: '90%'}}>
              <Image
                source={{uri: props.value}}
                style={{width: 70, height: 70, marginLeft: 15, borderRadius: 5}}
              />
            </View>
            <Ionicons
              name={'scan-circle-outline'}
              size={33}
              color={Colors.grey_444444}
              style={{width: '10%', textAlign: 'right', marginLeft: -12}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  } else if (props.showSignature) {
    const borderStyle =
      props.isEnabled == true ? styles.textvalid : styles.textinvalid;
    return (
      <View style={{margin: 7, marginHorizontal: 15}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.isMandatory == true ? (
            <AntDesign name={'star'} size={10} color={Colors.red_FF0000} />
          ) : null}
          <Text style={styles.title_style}>{props.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.dropdown_style}
          onPress={() => props.onSignatureCaptureClick()}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              //onChange={(event) => props.handleFormValueChange(props.formKey, event.nativeEvent.text)}
              value={props.value}
              multiline={true}
              maxLength={props.length}
              underlineColorAndroid="transparent"
              // autoCapitalize="none"
              editable={false}
              keyboardType={props.keyboardType}
              style={styles.dropdowntext_style}
              {...props.textInputProps}
            />
            <MaterialCommunityIcons
              name={'pencil-outline'}
              size={30}
              color={Colors.grey_444444}
              style={{width: '10%', textAlign: 'right', marginLeft: -12}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  dropdown_style: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    textAlignVertical: 'top',
    borderStyle: 'solid',
    elevation: 5,
    borderColor: Colors.grey_D0D0D0,
    borderWidth: 1,
  },
  dropdowntext_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'normal',
    width: '90%',
    padding: 8,
  },
  textinput_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 15,
    fontWeight: 'normal',
    backgroundColor: Colors.white,
    borderRadius: 10,
    textAlignVertical: 'top',
    paddingVertical: 7,
    paddingHorizontal: 10,
    textAlignVertical: 'center',
  },
  title_style: {
    color: Colors.color_5E0F8B,
    fontSize: 15,
    fontFamily: 'Titillium-Semibold',
    marginLeft: 5,
  },
  textvalid: {
    borderStyle: 'solid',
    elevation: 5,
    borderColor: Colors.grey_D0D0D0,
    borderWidth: 1,
  },
  textinvalid: {
    borderStyle: 'dashed',
    borderColor: Colors.grey_888888,
    borderWidth: 1.7,
  },
});

export default FormField;
