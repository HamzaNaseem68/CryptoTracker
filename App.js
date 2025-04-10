import React, { useState, useRef } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator,
    RefreshControl, StyleSheet, Switch
} from 'react-native';
import useFetchCrypto from './useFetchCrypto';
import CoinDetails from './CoinDetails';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [page, setPage] = useState(1);
    const [showPrice, setShowPrice] = useState(true); 
    const flatListRef = useRef(null);
    const { data, loading, refreshing, refreshData } = useFetchCrypto(page);

    const loadMore = () => setPage(prevPage => prevPage + 1);

    const scrollToIndex = (index) => {
        if (data.length === 0) return;
        try {
            flatListRef.current?.scrollToIndex({ index, animated: true });
        } catch (error) {
            console.warn("scrollToIndex error:", error);
        }
    };

    const getItemLayout = (_, index) => ({
        length: 70,
        offset: 70 * index,
        index,
    });

    return (
        <View style={styles.container}>
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Show Coin Price</Text>
                <Switch
                    value={showPrice}
                    onValueChange={setShowPrice}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={showPrice ? '#f5dd4b' : '#f4f3f4'}
                />
            </View>

            <FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('CoinDetails', { coin: item })}>
                        <View style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.textContainer}>
                                <Text style={styles.name}>{item.name}</Text>
                                {showPrice && <Text style={styles.price}>${item.current_price.toFixed(2)}</Text>}
                                <Text style={[styles.change, item.price_change_percentage_24h >= 0 ? styles.positive : styles.negative]}>
                                    {item.price_change_percentage_24h.toFixed(2)}%
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                getItemLayout={getItemLayout}
                ListFooterComponent={() => loading && <ActivityIndicator size="large" />}
            />

            <TouchableOpacity onPress={() => scrollToIndex(5)} style={styles.button}>
                <Text style={styles.buttonText}>Go to Coin #5</Text>
            </TouchableOpacity>
        </View>
    );
};

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="CoinDetails" component={CoinDetails} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#121212' },
    toggleContainer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#1E1E1E',
        borderRadius: 10, marginBottom: 10,
    },
    toggleLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
    card: { flexDirection: 'row', padding: 15, marginVertical: 5, backgroundColor: '#1E1E1E', borderRadius: 10 },
    image: { width: 40, height: 40, marginRight: 10 },
    textContainer: { flex: 1 },
    name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    price: { color: '#ccc', fontSize: 16 },
    change: { fontSize: 14, fontWeight: 'bold' },
    positive: { color: '#4CAF50' },
    negative: { color: '#F44336' },
    button: { padding: 10, backgroundColor: 'blue', marginTop: 10, borderRadius: 5 },
    buttonText: { color: 'white', textAlign: 'center', fontSize: 16 }
});

export default App;
