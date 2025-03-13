import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CoinDetails = ({ route }) => {
    const { coin } = route.params;

    return (
        <View style={styles.container}>
            <Image source={{ uri: coin.image }} style={styles.image} />
            <Text style={styles.name}>{coin.name}</Text>
            <Text style={styles.price}>Current Price: ${coin.current_price.toFixed(2)}</Text>
            <Text style={styles.marketCap}>Market Cap: ${coin.market_cap.toLocaleString()}</Text>
            <Text style={styles.change}>
                Price Change (24h): <Text style={coin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#121212' },
    image: { width: 100, height: 100, marginBottom: 20 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    price: { fontSize: 18, color: '#ccc', marginVertical: 10 },
    marketCap: { fontSize: 18, color: '#bbb', marginVertical: 10 },
    change: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
    positive: { color: '#4CAF50' },
    negative: { color: '#F44336' }
});

export default CoinDetails;
