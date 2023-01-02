import React, { useContext } from 'react'
import { useEffect, useState } from "react";
import { Alert, ScrollView, TextInput } from 'react-native';
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import CurrentMealContext from '../context/CurrentMeal';
import MealListContext from '../context/MealList';
import QuicklistContext from '../context/QuicklistContext';
import FoodCard from './FoodCard';
import MealCard from './MealCard';
import { Meal } from '../interfaces/Interfaces'

export default function MealModal({ navigation, route }: any,props: any) {

    // states
    const [quicklist, setQuicklist] = useContext(QuicklistContext);
    const [currentMeal, setCurrentMeal] = useState<any>({});
    const [mealList, setMealList] = useContext(MealListContext);
    
    useEffect(() =>{
        // if list is empty set Id to 1
        // else set id to the last id in array plus 1, in the case of deletion
        let mealId;
        const mealArrayLength = mealList.length;
        if (mealArrayLength===0) mealId=1
        else {
            mealId = mealList[mealArrayLength-1]["id"]+1;
        }
        setCurrentMeal({
            id: mealId,
            name:"Meal "+mealId,
            foods: [],
            data: {}
        })
    },[])

    function editMeal(mode: number, index: number, quantity: any) {
        
        // deep copy to prevent editing other meals
        const selectedFood = JSON.parse(JSON.stringify(quicklist[index]))

        // removing a food
        if (mode === 1) {
            setCurrentMeal({
                ...currentMeal,
                foods: currentMeal["foods"].filter((food:any) => food["name"] !== selectedFood["name"])
            });
        }

        // adding a food
        else if (mode === 2 && quantity === -1) {
            selectedFood["multiplier"]=1
            selectedFood["quantity"]=selectedFood["weightPerServing"]["amount"]
            setCurrentMeal({
                ...currentMeal,
                foods: [
                ...currentMeal["foods"],
                selectedFood
            ]})
        }

        // update quantity
        else if (mode===2 && quantity >= 0) {
            currentMeal["foods"].map((foodItem: any) => {
                if (selectedFood["name"]===foodItem["name"]) {
                    // set new quantity and multiplier 
                    const multiplier = quantity/selectedFood["weightPerServing"]["amount"]

                    foodItem["multiplier"]=multiplier;
                    foodItem["quantity"]=quantity
                    return foodItem
                    } else {
                    // Other foods haven't changed
                    return foodItem;
                }
            })
        }


    }

    function saveMealData() {
        // this tag combines the nutritional data from each food into a single object

        let foods = currentMeal["foods"]

        let overallNutrients: any = {}, overallCost: any = {}, overallFlavonoids: any = {}
        let currentFoodNutrients, currentFoodCost;

        let multiplier: number;
        let amount: number;
        let percentOfDailyNeeds: number;
        let tempPercentOfDailyNeeds: number;
        let flavonoid: any;

        foods.forEach((foodItem: any, i: number) => {

            multiplier = foodItem["multiplier"]
            if (i == 0) {

                // use the first foods data as a template
                foodItem["nutrients"].forEach((nutrient: any) => {
                    overallNutrients[nutrient["name"]] = {
                        name: nutrient["name"],
                        amount: Number((nutrient["amount"]*multiplier).toFixed(2)),
                        percentOfDailyNeeds: Number((nutrient["percentOfDailyNeeds"]*multiplier).toFixed(2)),
                        unit: nutrient["unit"]
                    }
                })

                foodItem["flavonoids"].forEach((flavonoid: any) => {

                    tempPercentOfDailyNeeds = flavonoid["percentOfDailyNeeds"]*multiplier;
                    if (isNaN(percentOfDailyNeeds)) tempPercentOfDailyNeeds=0;

                    overallFlavonoids[flavonoid["name"]] = {
                        name: flavonoid["name"],
                        amount: flavonoid["amount"]*multiplier,
                        percentOfDailyNeeds: tempPercentOfDailyNeeds,
                        unit: flavonoid["unit"]
                    }
                })

                overallCost = JSON.parse(JSON.stringify(foodItem["cost"]))
            }

            else {

                currentFoodNutrients = foodItem["nutrients"];
                currentFoodCost = foodItem["cost"];

                // sum up cost
                if (overallCost["unit"]===currentFoodCost["unit"]) overallCost["value"] += Number((currentFoodCost["value"]*multiplier).toFixed(2))

                // remove this later
                else {
                    console.error("Mismatching cost units")
                }

                // sum up nutrients
                currentFoodNutrients.map((nutrient: any) => {

                    if (overallNutrients[nutrient["name"]]===undefined) {
                        overallNutrients[nutrient["name"]] = {
                            name: nutrient["name"],
                            amount: Number((nutrient["amount"]*multiplier).toFixed(2)),
                            percentOfDailyNeeds: Number((nutrient["percentOfDailyNeeds"]*multiplier).toFixed(2)),
                            unit: nutrient["unit"]
                        }
                    }
                    else {
                        amount = overallNutrients[nutrient["name"]]["amount"] +  Number((nutrient["amount"]*multiplier).toFixed(2))
                        percentOfDailyNeeds = overallNutrients[nutrient["name"]]["percentOfDailyNeeds"] + Number((nutrient["percentOfDailyNeeds"]*multiplier).toFixed(2))
                        overallNutrients[nutrient["name"]] = {
                            ...overallNutrients[nutrient["name"]],
                            amount: amount,
                            percentOfDailyNeeds: percentOfDailyNeeds 
                        }
                    }
                })
                
                // sum up flavonoids
                for (let index in overallFlavonoids) {

                    flavonoid = overallFlavonoids[index]

                    tempPercentOfDailyNeeds = flavonoid["percentOfDailyNeeds"]*multiplier;
                    if (isNaN(percentOfDailyNeeds)) tempPercentOfDailyNeeds=0;

                    if (overallFlavonoids[flavonoid["name"]]===undefined) {
                        overallFlavonoids[flavonoid["name"]] = {
                            name: flavonoid["name"],
                            amount: flavonoid["amount"]*multiplier,
                            percentOfDailyNeeds: tempPercentOfDailyNeeds,
                            unit: flavonoid["unit"]
                        }
                    }
                    else {
                        amount = overallFlavonoids[flavonoid["name"]]["amount"]
                        percentOfDailyNeeds = overallFlavonoids[flavonoid["name"]]["percentOfDailyNeeds"]
                        overallFlavonoids[flavonoid["name"]] = {
                            ...overallFlavonoids[flavonoid["name"]],
                            amount: amount + flavonoid["amount"]*multiplier,
                            percentOfDailyNeeds: percentOfDailyNeeds + tempPercentOfDailyNeeds
                        }
                    }
                }


            }
        })

        // convert to arrays so tables can parse data
        const overallNutrientsArray = Object.values(overallNutrients)
        const overallFlavonoidsArray = Object.values(overallFlavonoids)

        // return a modified meal with the new data to store in the meal list
        const tempMeal = {
            ...currentMeal,
            data: {
                nutrients: overallNutrientsArray,
                cost: overallCost,
                flavonoids: overallFlavonoidsArray
            }
        }

        return tempMeal;
    }

    function closeModal(mode: number) {

        // save meal if user pressed 'Save'
        if (mode===2) {

            if (currentMeal["foods"].length === 0) {
                Alert.alert("Error", "Meals must contain 1 or more foods")
                return
            }

            const newMeal = saveMealData()

            setMealList([
                ...mealList,
                newMeal
            ])
        }  

        //close modal
        navigation.goBack()
    }
    
    function newMealName(newName: any) {

        // only change name if String passed in
        if (typeof newName==="string") {
            // don't allow blank name
            if (newName==="") return

            setCurrentMeal({
                ...currentMeal,
                name: newName
            })
        }
    }

    return (
        <View style={styles.modal}>
            { (quicklist.length>0) ?
                <View style={styles.inputScrollView}>
                    <View style={styles.textInputView}>
                        <TextInput 
                                selectionColor="#f7f7f7" 
                                placeholderTextColor="#adadad"
                                style={styles.textInput} 
                                returnKeyType="done"  
                                placeholder={"New Meal"}
                                
                                onSubmitEditing={(value) => newMealName(value.nativeEvent.text) }>
                        </TextInput>
                    </View>
                    <ScrollView style={styles.scrollview}>
                    <View style={styles.exampleBanner}>
                        <Text style={styles.exampleBannerText}>My Quicklist</Text>
                    </View> 
                    {
                        quicklist.map((food: any, i: number) => {
                            return <FoodCard key={i} arrayIndex={i} id={food["id"]} image={food["image"]} name={food["name"]} callback={editMeal} mode={1}></FoodCard>
                        })
                    }
                    </ScrollView>
                </View>
                :
                <View style={styles.emptyQuicklist}>
                    <Text style={styles.text}>Add items to your Quicklist in Search</Text>
                    <Button children="Search" textColor="#2774AE" labelStyle={styles.buttonText} onPress={()=>{
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Search' }],
                          });
                        }}></Button>
                </View>
            }
            
            <View style={styles.bottomButtonsView}>
                { (quicklist.length>0) ?
                    <View style={styles.closeSaveButtons}>
                        <Button children="Close" textColor="#c5050c" labelStyle={styles.buttonText} style={styles.dualButtons} onPress={()=> closeModal(1)}></Button>
                        <Button children="Save" textColor="#22a811" labelStyle={styles.buttonText} style={styles.dualButtons} onPress={()=> closeModal(2)}></Button>
                    </View>
                    :
                    <Button children="Close" textColor="#2774AE" labelStyle={styles.buttonText} style={styles.singleButton} onPress={() => navigation.goBack()}></Button>
                }        
            </View>
        </View>     
    )
}

const styles = StyleSheet.create({
    scrollview: {
        height: '90%'
    },
    modal: {
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
    inputScrollView:{
        height: '85%'
    },
    bottomButtonsView: {
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    closeSaveButtons: {
        flexDirection: 'row',
    },
    header: {
        textTransform: 'capitalize',
        fontSize: 24
    },
    emptyQuicklist: {
        height: '82%',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: '300',
        paddingBottom: 10
    },
    singleButton: {
        width: 300
    },
    dualButtons: {
        width: 170
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '300'
    },
    textInputView: {
        height: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#646569',
        width: '50%',
        height: 40,
        padding: 7.5,
        fontSize: 18,
        fontWeight: '300'
    },
    exampleBanner: {
        padding: 12
    },
    exampleBannerText: {
        fontSize: 20,
        fontWeight: '300',
        paddingLeft: 10
    }
})