
import React from 'react';
import {LogBox, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './Route/StackNavigation';
import {Provider, connect} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './redux/Store/Store';
import FlashMessage from 'react-native-flash-message';
import Toast from 'react-native-toast-message';
import {toastConfig} from './toast.config';

LogBox.ignoreLogs(['Remote debugger']);
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['componentWillReceiveProps has']);
LogBox.ignoreLogs(['VirtualizedLists should']);
LogBox.ignoreLogs(['Failed prop type:']);
LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);
LogBox.ignoreLogs(['Require cycle']);
LogBox.ignoreLogs([
  `Can't perform a React state update on an unmounted component`,
]);
LogBox.ignoreLogs(['`new NativeEventEmitter()`']);
LogBox.ignoreLogs([
  'The action `NAVIGATE` with payload {`name`:`Login`} was not handled by any navigator.',
]);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
        <Toast config={toastConfig} />
      </PersistGate>
    </Provider>
  );
}
