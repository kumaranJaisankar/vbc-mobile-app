import React from 'react';
import {Colors} from './Colors';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {strings} from '../../strings/i18n';

const Search = props => {
  return (
    <View
      style={{
        height: 38,
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: Colors.grey_F8F8F8,
        alignItems: 'center',
      }}>
      <TextInput
        style={styles.text_style}
        underlineColorAndroid="transparent"
        placeholder={'Search With ' + props.placeholderText}
        value={props.value}
        onChangeText={text => props.onChangeText(text)}
      />
      <TouchableOpacity
        onPress={() => {
          props.onSearchPressed();
        }}>
        <Ionicons
          name={'ios-search-sharp'}
          size={26}
          color={Colors.grey_444444}
        />
      </TouchableOpacity>
      <View style={{flex: 0.1}}>
        {props.value ? (
          <TouchableOpacity onPress={() => props.onClearText()}>
            <Ionicons
              name={'close-circle'}
              size={26}
              color={Colors.grey_444444}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 16,
    height: 40,
    flex: 0.9,
    fontWeight: 'normal',
  },
});
