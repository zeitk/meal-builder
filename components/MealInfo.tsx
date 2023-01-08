import React, { useRef } from "react";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button, Portal } from "react-native-paper";

import MealListContext from "../context/MealList";
import FoodCard from "./FoodCard";
import CostTable from "./Tables/CostTable";
import FlavonoidsTable from "./Tables/FlavonoidsTable";
import NutritionTable from "./Tables/NutritionTable";
import FoodModal from "./FoodModal";


export default function MealInfo({ navigation, route }: any, props: any) {

    // states
    const [page, setPage] = useState<number>(1);
    const [multiplier, setMultiplier] = useState<number>(1);
    const [isNameEditing, setIsNameEditing] = useState<Boolean>(false)
    const [mealList, setMealList] = useContext(MealListContext);
    const [newName, setNewName] = useState<String>("")

    // modal related states
    const [viewedFoodId, setViewedFoodId] = useState<number>()
    const [viewedFoodName, setViewedFoodName] = useState<String>()
    const [viewedFoodImage, setViewedFoodImage] = useState<String>()
    const [viewedFoodNutrition, setViewedFoodNutrition] = useState<any>({});
    const [foodModalVisible, setFoodModalVisible] = useState<Boolean>(false);
    const [viewedFoodServings, setViewedFoodServings] = useState<any>({})

    // non-state constants
    var mealIndex = 0;
    mealList.forEach((meal: any, index: number) => {
        if (meal["id"]===route.params["id"]) {
            mealIndex = index;
            return
        }
    })
    const nutrients = mealList[mealIndex]["data"]["nutrients"]
    const cost = mealList[mealIndex]["data"]["cost"]
    const flavonoids = mealList[mealIndex]["data"]["flavonoids"]
    const name = mealList[mealIndex]["name"]
    const foods = mealList[mealIndex]["foods"]
    const ref = useRef<any>(null)

    // set page and meal multiplier to 1
    useEffect(() => {
        setPage(1)
        setMultiplier(1);
        setIsNameEditing(false)
        setNewName("")
        setFoodModalVisible(false)
    }, [])

    function closeModal(mode: number) {
        //close modal
        navigation.goBack()
    }

    function toggleFoodModal() {
        if (!foodModalVisible) setFoodModalVisible(true)
        else setFoodModalVisible(false)
    }

    function nextPage() {
        if (page < 3) setPage(page + 1)
    }

    function prevPage() {
        if (page > 1) setPage(page - 1)
    }

    // set new serving size
    function newServingQuantity(multiplier: String) {
            setMultiplier(Number(multiplier))
    }

    async function editName() {
        if (isNameEditing) setIsNameEditing(false)
        else {
            // async to allow input to appear before we give it focus
            let x = await setIsNameEditing(true)
            ref.current?.focus();
        }
    }

    function setName(newName: String) {
        setNewName(newName)
        setIsNameEditing(false)

        // transform only the meal of interest in mealList
        const updatedMealList = mealList.map((meal: any, index: number) => {
            if (index===mealIndex) {
                return({
                    ...meal,
                    name: newName
                })
            }
            else return meal
        })
        setMealList(updatedMealList)
    }

    function moreFoodInfo(foodId: number, foodName: String, foodImage: String) {
        foods.forEach((food: any) => {
            if (food["id"]===foodId) {
                setViewedFoodId(food["id"])
                setViewedFoodName(food["name"])
                setViewedFoodImage(food["image"])
                setViewedFoodServings({
                    quantity: food["quantity"],
                    multiplier: food["multiplier"]
                })
                setViewedFoodNutrition({
                    caloricBreakdown: food["caloricBreakdown"],
                    flavonoids: food["flavonoids"],
                    nutrients: food["nutrients"],
                    properties: food["properties"],
                    weightPerServing: food["weightPerServing"]
                })
                setFoodModalVisible(true)
            }
        })
    }

    function editMealFoods(newMultiplier: number) {
        
        // this tag is used to either remove a food or to update a quantity

        // have flag for if we remove only food in list
        let haveRemovedLast = false;
        const updatedMealList = mealList.map((meal: any, index: number) => {
            if (index===mealIndex) {

                let updatedFoods;

                // if we're updating the quantity of the food, update only quantity and multiplier of the new food
                if (newMultiplier>0) {
                    updatedFoods = meal["foods"].map((food: any) => {
                        if (food["id"] === viewedFoodId) {
                            const newQuantity = (food["weightPerServing"]["amount"]*newMultiplier).toFixed(2);
                            return({
                                ...food,
                                quantity: newQuantity,
                                multiplier: newMultiplier
                            })
                        }
                        else return food 
                    })
                }

                // if we're removing a food, filter it out from the meal
                else {
                    updatedFoods = meal["foods"].filter((food: any) => food["id"] != viewedFoodId )
                    if (updatedFoods.length===0) {
                        // return early to avoid updating all nutritional data
                        haveRemovedLast = true
                        return {}
                    }
                }

                // update the nutritional data of the meal
                const updatedData = updateMealData(updatedFoods);

                return({
                    ...meal,
                    data: updatedData,
                    foods: updatedFoods
                })
            }
            else return meal
        })

        setFoodModalVisible(false);

        // delete meal if last food removed, update mealList otherwise
        if (haveRemovedLast) {
            setMealList( mealList.filter((meal:any) => meal["id"] !== route.params["id"]) ); 
            navigation.goBack();
        }
        else  setMealList(updatedMealList)


    }

    function updateMealData(updatedFoods: any) {
        // this tag combines the nutritional data from each food into a single object

        let foods = updatedFoods

        let overallNutrients: any = {}, overallCost: any = {}, overallFlavonoids: any = {}
        let currentFoodNutrients, currentFoodCost;

        let multiplier: number;
        let amount: number;
        let percentOfDailyNeeds: number;
        let tempPercentOfDailyNeeds: number;
        let flavonoid: any;

        foods.forEach((foodItem: any, i: number) => {

            multiplier = foodItem["multiplier"]

            // use the first foods data as a template
            if (i == 0) {
                
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

            // for subsequent foods either modify an existing value, or create a new one
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

        // convert to arrays since our tables parse arrays
        const overallNutrientsArray = Object.values(overallNutrients)
        const overallFlavonoidsArray = Object.values(overallFlavonoids)

        // return updated data to replace old data in meal
        const newData = {
            nutrients: overallNutrientsArray,
            cost: overallCost,
            flavonoids: overallFlavonoidsArray
        }

        return newData;
    }

    return (
        <View >
            
            <View style={styles.topView}>
                { (isNameEditing) ?
                    <View style={styles.headerView}>
                        <TextInput
                            ref={ref}
                            style={styles.mealNameTextInput}
                            placeholder={(newName==="") ? name:newName}
                            placeholderTextColor="#adadad"
                            returnKeyType="done" 
                            onSubmitEditing={(value) => setName(value.nativeEvent.text) } 
                        ></TextInput>
                        <Button children="Cancel" textColor="#c5050c" onPress={editName} labelStyle={styles.nameEditButtonText} style={styles.nameEditButton}></Button>
                    </View>
                    :
                    <View style={styles.headerView}>
                        <Text style={styles.mealName}>{(newName==="") ? name:newName}</Text>
                        <Button children="Edit Name" textColor="black" onPress={editName} labelStyle={styles.nameEditButtonText} style={styles.nameEditButton}></Button>
                    </View>
                }
            </View>
            { (page === 1) &&
                <View style={styles.upperView}>
                    <View style={styles.foodsLabelView}>
                        <Text style={styles.foodsLabel}>Items : </Text>
                    </View>
                    <ScrollView style={styles.foodsScrollView}>
                    {
                        foods.map((food: any, i: number) => {
                            return <FoodCard key={i} id={food["id"]} image={food["image"]} callback={moreFoodInfo} name={food["name"]} quantity={food["quantity"]} mode={2}></FoodCard>
                        })
                    }
                    </ScrollView>
                </View>

            }
            {
                (page === 2) &&
                (
                    <View style={styles.upperView}>
                        <View style={styles.textInputView}>
                            <Text style={{fontSize: 12, color: '#757577', fontWeight: '500', paddingRight: 10}}>Number of servings: </Text>
                            <TextInput  style={styles.textInput}
                                        selectionColor="#f7f7f7"  
                                        keyboardType={"numeric"} 
                                        returnKeyType="done" 
                                        onSubmitEditing={(value) => newServingQuantity(value.nativeEvent.text) } 
                                        placeholder={multiplier.toString()}
                                        placeholderTextColor="#adadad"></TextInput>
                        </View>
                        <View style={styles.nutritionView}>
                            <NutritionTable nutrition={nutrients} isMealView={true} multiplier={multiplier}></NutritionTable>
                        </View>
                    </View>
                )
            }
            {
                (page == 3) &&
                (
                    <View style={styles.upperView}>
                        <View style={styles.costView}>
                            <CostTable cost={cost} multiplier={multiplier}></CostTable>
                        </View>
                        <View style={styles.flavonoidsView}>
                            <FlavonoidsTable flavonoidsProps={flavonoids} multiplier={multiplier} isMealView={true}></FlavonoidsTable>
                        </View>
                    </View>
                )
            }

            <View style={styles.lowerView}>           
                <Button children={(page===3) ? "Overview":"Foods"} textColor="#2774AE" labelStyle={styles.buttonText} style={styles.leftButton} onPress={()=> prevPage()} disabled={(page<2)}></Button>
                <Text style={styles.pageText}>{page}</Text>
                <Button children={(page===1) ? "Overview":"More info"} textColor="#2774AE" labelStyle={styles.buttonText} style={styles.rightButton} onPress={()=> nextPage()} disabled={(page>2)}></Button>          
                <Button children={"Close"} textColor="#c5050c" labelStyle={styles.buttonText} style={styles.closeButton} onPress={()=> closeModal(1)}></Button>
            </View>

            <Portal.Host>
                <FoodModal 
                        nutrition={viewedFoodNutrition} name={viewedFoodName} cost={cost} id={viewedFoodId} image={viewedFoodImage} servings={viewedFoodServings} 
                        toggle={toggleFoodModal} editMealFoods={editMealFoods} 
                        context={"MealInfo"} modalVisible={foodModalVisible}></FoodModal>
            </Portal.Host>

        </View>
    )
}

const styles = StyleSheet.create({
    topView: {
        height: '10%',
        justifyContent: 'center',
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
   },
   mealName: {
        fontSize: 24,
        fontWeight: '300',
        position: 'absolute',
        left: '37.5%',
        width: '35%',
        padding: 7.5,
        paddingLeft: 15,
    },
    mealNameTextInput: {
        fontSize: 24,
        fontWeight: '300',
        position: 'absolute',
        left: '37.5%',
        width: '35%',
        padding: 7.5,
        paddingLeft: 15,
        borderWidth: 1,
        borderColor: '#646569'
    },
    nameEditButton: {
        position: 'absolute',
        left: '74%',
        alignSelf: 'center'
    },
    nameEditButtonText: {
        fontSize: 12
    },
    upperView: {
        height: '75%',
    },
   lowerView: {
        height: '13%',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#dadfe1'
    },
    closeSaveButtons: {
        flexDirection: 'row',
    },
    buttons: {

    },
    leftButton: {
        position: 'absolute',
        left: '5%'
    },
    pageText: {
        position: 'absolute',
        left: '35%'
    },
    rightButton: {
        position: 'absolute',
        left: '42.5%'
    },
    closeButton: {
        position: 'absolute',
        left: '72.5%'
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '300'
    },
    nutritionView: {
        height: '81%',
        padding: 7.5
    },
    textInputView: {
        height: '10%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        marginHorizontal: 10,
        padding: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#dadfe1',
        width: '95%'
    },
    textInput: {
        width: '12.5%',
        height: '75%',
        padding: 5,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#dadfe1'
    },
    costView: {
        height: '25%',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#dadfe1',
    },
    flavonoidsView: {
        height: '64%',
        alignItems: 'center'
    },
    foodsLabelView: {
        height: '5%',
        padding: 5,
        marginBottom: 5,
        borderTopWidth: 1,
        borderColor: '#dadfe1'
    },
    foodsLabel: {
        fontSize: 20,
        fontWeight: '300',
        paddingLeft: 20
    },
    foodsScrollView: {
        height: '85%'
    }
})