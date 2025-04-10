import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://api.coingecko.com/api/v3/coins/markets";

const useFetchCrypto = (page) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCryptoData = async () => {
        try {
            const url = `${API_URL}?vs_currency=usd&page=${page}&per_page=20&order=market_cap_desc`;
            console.log("Fetching from:", url);

            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");

            const jsonData = await response.json();
            console.log("Fetched Data:", jsonData);

            const prevStoredData = await AsyncStorage.getItem('cryptoData');
            const updatedData = prevStoredData ? [...JSON.parse(prevStoredData), ...jsonData] : jsonData;

            setData(updatedData);
            await AsyncStorage.setItem('cryptoData', JSON.stringify(updatedData));
        } catch (error) {
            console.error("API Fetch Error:", error);
            const cachedData = await AsyncStorage.getItem('cryptoData');
            if (cachedData) {
                setData(JSON.parse(cachedData));
            }
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setRefreshing(true);
        setData([]); // Clear data before refresh
        await fetchCryptoData();
        setRefreshing(false);
    };

    useEffect(() => {
        setData([]); // Reset data on new page
        fetchCryptoData();
    }, [page]);

    return { data, loading, refreshing, refreshData };
};

export default useFetchCrypto;
