import React from 'react';

const SearchSelectField = () => {
  return (
    <div>
      <SearchableDropdown
        onItemSelect={item => {
          props.handleFormValueChange(props.formKey, text);
        }}
        containerStyle={{padding: 5}}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: '#ddd',
          borderColor: '#bbb',
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemTextStyle={{color: '#222'}}
        itemsContainerStyle={{maxHeight: 140}}
        items={items}
        defaultIndex={2}
        resetValue={false}
        textInputProps={{
          placeholder: 'placeholder',
          underlineColorAndroid: 'transparent',
          style: {
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
          },
          onTextChange: text => alert(text),
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
    </div>
  );
};

export default SearchSelectField;
