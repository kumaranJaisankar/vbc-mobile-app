if (__DEV__) {
  require('./ReactotronConfig');
}
import React from 'react';

import {LogBox} from 'react-native';
import {store, persistor} from './source/redux/Store/Store';
import {connect, Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import 'react-native-gesture-handler';

import AppProvider from './source/providers/AppProvider';

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

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppProvider />
      </PersistGate>
    </Provider>
  );
};

export default App;
