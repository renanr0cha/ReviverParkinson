import { registerRootComponent } from 'expo';
import 'expo-asset';
import Constants from 'expo-constants';
import App from './App';
console.log(Constants.systemFonts);
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
