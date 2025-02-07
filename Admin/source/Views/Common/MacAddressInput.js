import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Colors } from './Colors';
import {Dropdown} from 'react-native-element-dropdown';

  const MacAddressInput = ({onChangeMacIDInput, value}) => {
  const [macAddressParts, setMacAddressParts] = useState(value !== '' ? value.split(':') : ['', '', '', '', '', '']);
  const [isValid, setIsValid] = useState(true);
  const inputMacRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [selectedSeparator, setSelectedSeparator] = useState(':');
  
  const seperator = [
    {name: "colon", value: ":"},
    {name: "dash", value: "-"}
  ]

  const handlePartChange = (value, index) => {
    if (/^[0-9A-Fa-f]{0,2}$/.test(value)) {
      const newParts = [...macAddressParts];
      newParts[index] = value.toUpperCase(); 
      setMacAddressParts(newParts);
      onChangeMacIDInput(newParts.join(selectedSeparator));

      if (value.length === 2 && index < 5) {
        inputMacRefs[index+1].current.focus();
      }
      else if (value === '' && index > 0) {
        inputMacRefs[index-1].current.focus();
      }
    }
  };

  return (
    <View>
      <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={seperator}
        labelField="name"
        valueField="value"
        placeholder="Separator"
        value={selectedSeparator}
        onChange={(item) => setSelectedSeparator(item.value)}
      />
      <View style={styles.macAddressInputContainer}>
        {macAddressParts.map((part, index) => (
          <>
            <TextInput
              placeholderTextColor={Colors.grey_888888}
              key={index}
              ref={inputMacRefs[index]}
              style={styles.macAddressInput}
              placeholder="XX"
              maxLength={2}
              value={part}
              onChangeText={(text) => handlePartChange(text, index)}
            />
            {
              index < 5 && 
              <Text style={{fontSize: 25, padding: 3, color: Colors.grey_888888}}>
                {selectedSeparator}
              </Text>
            }
        </>
        ))}
      </View>
      {isValid ? null : (
        <Text style={styles.errorText}>
          Invalid MAC Address. Please enter a valid MAC address in the format xx:xx:xx:xx:xx:xx
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  macAddressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  macAddressInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    width: 45,
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#FAFAFA',
    color: Colors.black,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  dropdown: {
    marginTop: 5,
    borderColor: Colors.grey_C0C0C0,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FAFAFA',
    width: 120,
    padding: 5
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
});

export default MacAddressInput;
