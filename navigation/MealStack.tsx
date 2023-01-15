import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react'

import MealBuilder from '../components/MealBuilder';
import MealInfo from '../components/MealInfo';
import Meals from '../components/Meals';
import { MealListContext } from '../context/MealList';
import { IMeal } from '../interfaces/Interfaces'

const MealStackNavigator = createNativeStackNavigator();

export default function MealStack() {

    const [mealList, setMealList] = useState<IMeal[]>([])

    return (
        <MealListContext.Provider value={{mealList, setMealList}}>

        <MealStackNavigator.Navigator>
          <MealStackNavigator.Group>
            <MealStackNavigator.Screen name="Home" component={Meals} options={{headerShown: false}}/>
          </MealStackNavigator.Group>
          <MealStackNavigator.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
            <MealStackNavigator.Screen options={{title:'New Meal'}} name="MealBuilder" component={MealBuilder} />
            <MealStackNavigator.Screen options={{title: 'Meal Info'}} name="MealInfo" component={MealInfo} />
          </MealStackNavigator.Group>
        </MealStackNavigator.Navigator>

        </MealListContext.Provider>         
      );
}