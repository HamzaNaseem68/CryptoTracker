import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ensure Buffer is available globally
global.Buffer = Buffer;

const supabaseUrl = 'https://aqfvqnwqxzxnfzlrqwzm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnZxbndxeHp4bmZ6bHJxd3ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NTQxNzAsImV4cCI6MjAyNTIzMDE3MH0.Wd_byPQHHYUOBVvPYjgXuTI4OJo0J2QlTqAVlXJFGZE';

class CustomStorage {
  async getItem(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  async setItem(key, value) {
    try {
      return await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }

  async removeItem(key) {
    try {
      return await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new CustomStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

export { supabase }; 