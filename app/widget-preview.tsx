import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';

import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitWidget } from '../widget/habitwidget';


export default function HelloWidgetPreviewScreen() {
    const [habits, setHabits] = React.useState([]);

    const loadHabits = React.useCallback(async () => {
        try {
            const stored = await AsyncStorage.getItem('habits');
            setHabits(stored ? JSON.parse(stored) : []);
        } catch (error) {
            console.error('Failed to load habits', error);
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadHabits();
        }, [loadHabits]),
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.navbar}>
                <Link href="/option">
                    <Ionicons name="close-outline" size={32} color="#1F1F1F" />
                </Link>
            </View>
            <ScrollView>
                <View style={styles.container}>
                    {/* <WidgetPreview
                        renderWidget={() => <HelloWidget />}
                        width={320}
                        height={200}
                    /> */}
                    <WidgetPreview
                        renderWidget={() => <HabitWidget habits={habits} />}
                        width={320}
                        height={200}
                    />
                    {/* <WidgetPreview
                        renderWidget={() => <HabitWidgetFixed habits={habits} />}
                        width={320}
                        height={200}
                    /> */}
                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#EFF4FB',
    },
    navbar: {
        height: 80,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container: {
        paddingHorizontal: 120,
        paddingVertical: 40,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
