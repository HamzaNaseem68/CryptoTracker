import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { createTable } from './localDatabase';

// Initialize network state tracking
import NetInfo from '@react-native-community/netinfo';
NetInfo.configure({
  reachabilityUrl: 'https://aqfvqnwqxzxnfzlrqwzm.supabase.co',
  reachabilityTest: async (response) => response.status === 200,
  reachabilityLongTimeout: 60 * 1000, // 60s
  reachabilityShortTimeout: 5 * 1000, // 5s
  reachabilityRequestTimeout: 15 * 1000, // 15s
});

createTable(); // Ensure DB is initialized

AppRegistry.registerComponent(appName, () => App);
