import React from 'react';
import Toast, {
  BaseToast,
  ErrorToast,
  SuccessToast,
  InfoToast,
} from 'react-native-toast-message';

export const toastConfig = {
  success: props => (
    <SuccessToast
      {...props}
      position="top"
      visibilityTime={5000}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      position="top"
      visibilityTime={5000}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  warning: props => (
    <InfoToast
      {...props}
      style={{borderLeftColor: 'yellow'}}
      position="top"
      visibilityTime={5000}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};
