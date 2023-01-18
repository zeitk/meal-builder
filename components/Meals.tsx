import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-paper';
import { useMealList } from '../context/MealList';
import MealCard from './MealCard';

export default function Meals({ navigation }: any) {

    const { mealList, setMealList } = useMealList();

    useEffect(() => {
        getMealList(); 
    },[])

    // utility function in case memory needs to be wiped
    async function clearMemory() {
        try {
            await AsyncStorage.clear()
        } catch(e) {
            console.error("Error 0", "Memory clear failure")
        }
    }

    // grab the user's meal list if it exists
    async function getMealList() {
        try {
            const priorMealList = await AsyncStorage.getItem("@meallist") 
            if (priorMealList !== null)  {
                setMealList(JSON.parse(priorMealList))
            }
        }
        catch(e) {
            console.error("Error 2", "Error retrieving meals in Meals.tsx") 
        }
    }

    return<>
        <SafeAreaView style={styles.safeView}>
            { (mealList !== null && mealList.length>0) ?
                <ScrollView style={styles.scrollView}>
                    {
                        mealList.map((meal: any, i: number) => {
                            return<MealCard key={i} id={meal["id"]} name={meal["name"]} foods={meal["foods"]} navigation={navigation}></MealCard>
                        })
                    }
                </ScrollView>
                :
                <View style={styles.noMealsBannerView}>
                    <Text style={styles.noMealsBannerText}>No saved meals currently</Text>
                </View>
            }
            <View style={styles.buttonView}>
                    <Button mode="text" children="Add Meal" textColor="#2774AE" labelStyle={styles.buttonText} style={styles.button} onPress={()=>{ navigation.navigate('MealBuilder')}}></Button>
            </View>
        </SafeAreaView>
    </>
}

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    scrollView: {
        height: '90%',
        backgroundColor:'white'
    },
    button: {
        width: 300,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '300'
    },
    buttonView: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '10%',
        paddingBottom: 15
    },
    noMealsBannerView: {
        height: '90%',
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noMealsBannerText: {
        fontSize: 17,
        fontWeight: '300'
    }
})