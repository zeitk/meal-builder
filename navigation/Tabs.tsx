import React from 'react'

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Quicklist from '../components/Quicklist';
import Home from '../components/Home';
import Search from "../components/Search";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { useState } from 'react';
import QuicklistContext from '../context/QuicklistContext';
import MealStack from './MealStack';

const TabNavigator = createBottomTabNavigator();

export default function Tabs() {
    
    const [quicklist, setQuicklist] = useState<any[]>([])
    // TODO add login capabilities 

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