import React from 'react'

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Quicklist from '../components/Quicklist';
import Home from '../components/Home';
import Search from "../components/Search";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { useState, useEffect } from 'react';
import QuicklistContext from '../context/QuicklistContext';
import MealStack from './MealStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabNavigator = createBottomTabNavigator();

export default function Tabs() {
    
    const [quicklist, setQuicklist] = useState<any[]>([])
    
    useEffect(() => {
        getQuicklist();
    }, [])

    async function getQuicklist() {
        try {
            const priorQuicklist = await AsyncStorage.getItem('@quicklist')
            if (priorQuicklist !== null) {
                setQuicklist( JSON.parse(priorQuicklist) )
            }
        }
        catch(e) {
            console.error("Error 8", "Retrieval failure in Tabs.tsx")
        }
    }

    return<>
        <QuicklistContext.Provider value={[quicklist,setQuicklist]}>
        <TabNavigator.Navigator>
            <TabNavigator.Screen name="Home" component={Home} options={{headerShown: true, tabBarIcon() {
                return<>
                    <Feather name="home" size={20} color="black"></Feather>
                    </>
                },}}></TabNavigator.Screen>
            <TabNavigator.Screen name="Search" component={Search}  options={{headerShown: true, tabBarIcon() {
                return<> 
                    <Feather name="search" size={20} color="black"> </Feather>
                </>
                },}}></TabNavigator.Screen>
            <TabNavigator.Screen name="Quicklist" component={Quicklist} options={{tabBarIcon() {
                return<>
                    <Feather name="list" size={24} color="black" />
                </>
                }}}></TabNavigator.Screen>
            <TabNavigator.Screen name="Meals" component={MealStack} options={{headerShown: true, tabBarIcon() {
                return<>
                    <MaterialCommunityIcons name="silverware" size={20} color="black"></MaterialCommunityIcons>
                </>
                },}}></TabNavigator.Screen>
        </TabNavigator.Navigator>
        </QuicklistContext.Provider>
    </>
}