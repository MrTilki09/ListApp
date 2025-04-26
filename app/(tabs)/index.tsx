import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {useSQLiteContext} from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import {tasks} from '@/db/schema';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {eq} from "drizzle-orm";
import {router} from "expo-router";



export default function ExpensesScreen() {
    // Calculate total expenses
    const [dbResult, setDbResult] = useState<any[]>([]);
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const son30gun = 0;

        useFocusEffect(
            React.useCallback(() => {
                const fetchData = async () => {

                    const result = await drizzleDb.select().from(tasks);
                    setDbResult(result);
                    console.log(result);
                };
                fetchData();
                return () => {
                    // Do something when the screen is unfocused
                    // Useful for cleanup functions
                };
            }, [])
        );

    const monthlyExpenses = dbResult.filter((expense) => {
        const expenseDate = new Date(expense.timestamp);
        const currentDate = new Date();
        return (
            expenseDate.getMonth() === currentDate.getMonth() &&
            expenseDate.getFullYear() === currentDate.getFullYear()
        );
    });

    const totalMonthlyExpense = monthlyExpenses.reduce((sum, expense) => sum + expense.cost, 0);


    const totalExpenses = dbResult.reduce((sum, expense) => sum + expense.cost, 0);
    const handleDelete = async (id: number) => {
        try {
            await drizzleDb.delete(tasks).where(eq(tasks.id, id));
            setDbResult(dbResult.filter(item => item.id !== id));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // Simple expense card component
    const renderExpenseItem = ({ item }: any) => (
        <GestureHandlerRootView style={{ flex: 1 }}>

        <Swipeable
            renderRightActions={() => (
                <TouchableOpacity
                    className="bg-red-500 justify-center items-center w-20 h-full"
                    onPress={() => handleDelete(item.id)}
                >
                    <Text className="text-white">Delete</Text>
                </TouchableOpacity>
            )}
        >
            <View className="bg-white p-4 mb-3 rounded-lg shadow">
                <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
                    <Text className="text-lg font-bold text-blue-900">{item.cost.toFixed(2)} TL</Text>
                </View>
                <View className={'flex flex-row  justify-between  mt-2'}>
                    <Text className="text-gray-600 mt-1">{item.description}</Text>
                    <Text className="text-gray-600 mt-1">{item.timestamp}</Text>
                </View>
            </View>
        </Swipeable>
        </GestureHandlerRootView>

    );

    return (
        <SafeAreaView className="flex-1 bg-blue-900">
            {/* Header */}
            <View className="p-4">
                <Text className="text-2xl font-bold text-white">My Expenses</Text>
                <Text className="text-white text-lg mt-1 ">Total: <Text className={'text-green-500'}>{totalExpenses.toFixed(2)}</Text> TL</Text>
            </View>

            {/* Expense List */}
            <View className="flex-1 bg-gray-100 rounded-t-lg px-4 pt-4">
                <FlatList
                    data={dbResult}
                    renderItem={renderExpenseItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            </View>
    <View className="absolute bottom-0 left-0 right-0 justify-center items-center">
            <View className={'w-[70%] bg-amber-100 m-5 p-2'}>
                <Text className={'text-center'}>U Spent <Text className={'text-red-600'}>{totalMonthlyExpense}</Text> TL in the Last 30 Days</Text>
            </View>
    </View>
            {/* Add Expense Button */}
            <TouchableOpacity onPress={()=>{router.push('/(tabs)/Create')}}
                className="absolute right-6 bottom-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
            >
                <Text className="text-white text-3xl">+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}