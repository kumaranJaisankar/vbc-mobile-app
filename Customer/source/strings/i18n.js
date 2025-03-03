import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en: require('./en.json'),
  // 'en-GB': require('./en-GB.json')
};

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL =
  currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  return I18n.t(name, params);
}

export default I18n;
