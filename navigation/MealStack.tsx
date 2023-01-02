import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react'

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, Portal } from 'react-native-paper';
import MealModal from '../components/MealModal';
import MealInfo from '../components/MealInfo';
import Meals from '../components/Meals';
import MealListContext from '../context/MealList';
import { Meal } from '../interfaces/Interfaces'

const MealStackNavigator = createNativeStackNavigator();

export default function MealStack() {

    const [mealList, setMealList] = useState<any[]>([])

    return (
        <MealListContext.Provider value={[mealList, setMealList]}>

        <MealStackNavigator.Navigator>
          <MealStackNavigator.Group>
            <MealStackNavigator.Screen name="Home" component={Meals} options={{headerShown: false}}/>
          </MealStackNavigator.Group>
          <MealStackNavigator.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
            <MealStackNavigator.Screen options={{title:'New Meal'}} name="MealModal" component={MealModal} />
            <MealStackNavigator.Screen options={{title: 'Meal Info'}} name="MealInfo" component={MealInfo} />
          </MealStackNavigator.Group>
        </MealStackNavigator.Navigator>

        </MealListContext.Provider>         
      );
}