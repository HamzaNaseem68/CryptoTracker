import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from './supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user
        checkUser();
        
        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: userData, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();
                
                if (!error && userData) {
                    setUser(userData);
                    await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
                }
            } else {
                setUser(null);
                await AsyncStorage.removeItem('currentUser');
            }
            setLoading(false);
        });

        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []);

    const checkUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('currentUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error checking stored user:', error);
        }
        setLoading(false);
    };

    const value = {
        user,
        loading,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 