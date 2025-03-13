import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { createTable } from './localDatabase';

createTable(); // Initialize Database

AppRegistry.registerComponent(appName, () => App);
