import React from "react";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";
import MealListContext from "../context/MealList";
import FoodCard from "./FoodCard";
import CaloricBreakdownTable from "./Tables/CaloricBreakdownTable";
import CostTable from "./Tables/CostTable";
import FlavonoidsTable from "./Tables/FlavonoidsTable";
import NutritionTable from "./Tables/NutritionTable";
import PropertiesTable from "./Tables/PropertiesTable";
import ServingSizeTable from "./Tables/ServingSizeTable";


export default function MealInfo({ navigation, route }: any, props: any) {

    // states
    const [page, setPage] = useState<number>(1);
    const [multiplier, setMultiplier] = useState<number>(1);
    const [mealList, setMealList] = useContext(MealListContext)

    // non-state constants
    let mealIndex = 0;
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

    // set page and meal multiplier to 1
    useEffect(() => {
        setPage(1)
        setMultiplier(1);
    }, [])

    function closeModal(mode: number) {
        //close modal
        navigation.goBack()
    }

    function nextPage() {
        if (page < 3) setPage(page + 1)
    }

    function prevPage() {
        if (page > 1) setPage(page - 1)
    }

    // set new serving size
    function newServingQuantity(multiplier: String) {
        
    }

    return (
        <View >
            
            {/* {
                (page === 1) &&
                (
                    <ServingSizeTable servingSizeProps={props.nutrition["weightPerServing"]} newMultiplier={newMultiplier} multiplier={multiplier}></ServingSizeTable>
                )
            } */}
            { (page === 1) &&
                <View style={styles.upperView}>
                    <View style={styles.mealNameView}>
                        <Text style={styles.mealName}>{name}</Text>
                    </View>
                    <View style={styles.foodsLabelView}>
                        <Text style={styles.foodsLabel}>Items : </Text>
                    </View>
                    <ScrollView style={styles.foodsScrollView}>
                    {
                        foods.map((food: any, i: number) => {
                            return <FoodCard key={i} id={food["id"]} image={food["image"]} callback={()=>{}} name={food["name"]} mode={0}></FoodCard>
                        })
                    }
                    </ScrollView>
                </View>

            }
            {
                (page === 2) &&
                (
                    <View style={styles.upperView}>
                        <View style={styles.mealNameView}>
                            <Text style={styles.mealName}>{name}</Text>
                        </View>
                        <View style={styles.textInputView}>
                            <Text style={{fontSize: 12, color: '#757577', fontWeight: '500', paddingRight: 10}}>Number of servings: </Text>
                            <TextInput  style={styles.textInput}
                                        selectionColor="#f7f7f7"  
                                        keyboardType={"numeric"} 
                                        returnKeyType="done" 
                                        onSubmitEditing={(value) => newServingQuantity(value.nativeEvent.text) } 
                                        placeholder={"1"}
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
                        <View style={styles.mealNameView}>
                            <Text style={styles.mealName}>{name}</Text>
                        </View>
                        <View style={styles.costView}>
                            <CostTable cost={cost} multiplier={multiplier}></CostTable>
                        </View>
                        <View style={styles.flavonoidsView}>
                            <FlavonoidsTable flavonoidsProps={flavonoids} multiplier={multiplier} isMealView={true}></FlavonoidsTable>
                        </View>
                    </View>
                )
            }

            <View style={styles.bottomButtonsView}>           
                <Button children={(page===3) ? "Overview":"Foods"} textColor="#2774AE" labelStyle={styles.buttonText} style={styles.buttons} onPress={()=> prevPage()} disabled={(page<2)}></Button>
                <Text>{page}</Text>
                <Button children={(page===1) ? "Overview":"More info"} textColor="#2774AE" labelStyle={styles.buttonText} style={styles.buttons} onPress={()=> nextPage()} disabled={(page>2)}></Button>          
                <Button children={"Close"} textColor="#c5050c" labelStyle={styles.buttonText} style={styles.buttons} onPress={()=> closeModal(1)}></Button>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
   header: {
        fontSize: 18
   },
   mainView: {
        height: '85%'
   },
   upperView: {
        height: '85%'
   },
   bottomButtonsView: {
        height: '12.5%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#dadfe1'
    },
    closeSaveButtons: {
        flexDirection: 'row',
    },
    buttons: {

    },
    buttonText: {
        fontSize: 20,
        fontWeight: '300'
    },
    mealName: {
        fontSize: 24,
        fontWeight: '300',
        alignSelf: 'center',
    },
    mealNameView: {
        height: '10%',
        justifyContent: 'center'
    },
    nutritionView: {
        height: '74%',
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
        height: '17.5%',
        alignItems: 'center'
    },
    flavonoidsView: {
        height: '59%',
        alignItems: 'center'
    },
    foodsLabelView: {
        height: '5%'
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