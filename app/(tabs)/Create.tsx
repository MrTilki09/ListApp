import {View, Text, TextInput, Button, Pressable} from 'react-native'
import React, {useState} from 'react'
import {useSQLiteContext} from "expo-sqlite";
import {drizzle} from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";
import {tasks} from "@/db/schema";
import {router} from "expo-router";

const Create = () => {

    const [Name, setName] = useState('');
    const [Cost, setCost] = useState(0);
    const [Description, setDescription] = useState('');

    const [dbResult, setDbResult] = useState<any[]>([]);
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });


    const handleCreate = async () => {
        const drizzleDb = drizzle(db, { schema });
        try {
            await drizzleDb.insert(tasks).values({
                name: Name,
                description: Description,
                cost: Cost,
            });
        } catch (error) {
            console.error('Insert error:', error);
        }

        router.push('/');
    }

    return (
        <View className={'bg-white mt-10 flex-1'}>
            <View>
                <Text className={'text-3xl font-bold text-center text-blue-900'}>Create</Text>
            </View>

            <View className={'flex justify-center items-center mt-10'}>
                <TextInput
                    value={Name}
                    onChangeText={(e)=>{setName(e)}}
                    className={'w-[80%] h-10 border-2 rounded border-blue-600'}
                    placeholder={'Name'}
                />
                <TextInput
                    value={Description}
                    onChangeText={(e)=>{setDescription(e)}}
                    className={'w-[80%] h-10 border-2 my-4 rounded border-blue-600'}
                    placeholder={'Description'}
                />
                <TextInput
                    value={Cost.toString()}
                    onChangeText={(e)=>{setCost(Number(e))}}
                    className={'w-[80%] h-10 border-2 rounded border-blue-600'}
                    placeholder={'Cost'}
                />


                <Pressable onPress={handleCreate} className={'w-[80%] h-10 bg-blue-600 rounded justify-center items-center mt-4'}>
                  <Text className={'text-white'}>Create</Text>
                </Pressable>

            </View>


        </View>
    )
}
export default Create
