import {useEffect, useRef} from 'react';
import {PanResponder, Keyboard} from 'react-native';

const IDLE_TIMEOUT_DURATION = 300000; // 5 minutes in milliseconds

const IdleTimeout = ({onTimeout, children}) => {
  const timeoutIdRef = useRef(null);
  const panResponderRef = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: handleUserActivity,
    }),
  );

  const handleUserActivity = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      onTimeout();
    }, IDLE_TIMEOUT_DURATION);
  };

  useEffect(() => {
    handleUserActivity();

    const keyboardEventListeners = [
      Keyboard.addListener('keydown', handleUserActivity),
      Keyboard.addListener('keyboardDidShow', handleUserActivity),
      Keyboard.addListener('keyboardDidHide', handleUserActivity),
    ];

    return () => {
      clearTimeout(timeoutIdRef.current);
      keyboardEventListeners.forEach(listener => listener.remove());
    };
  }, [onTimeout]);

  return (
    <PanResponder {...panResponderRef.current.panHandlers}>
      {children}
    </PanResponder>
  );
};

export default IdleTimeout;
