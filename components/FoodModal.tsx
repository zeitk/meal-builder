import React, { useContext } from 'react'
import { useEffect, useState } from "react";
import { Alert } from 'react-native';
import { StyleSheet, Text, View } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import QuicklistContext from '../context/QuicklistContext';
import CaloricBreakdownTable from "./Tables/CaloricBreakdownTable";
import CostTable from "./Tables/CostTable";
import FlavonoidsTable from "./Tables/FlavonoidsTable";
import NutritionTable from "./Tables/NutritionTable";
import PropertiesTable from "./Tables/PropertiesTable";
import ServingSizeTable from "./Tables/ServingSizeTable";


export default function FoodModal(props: any) {

    // states
    const [page, setPage] = useState<number>(1);
    const [quicklist, setQuicklist] = useContext(QuicklistContext);
    const [multiplier, setMultiplier] = useState<number>(1);
    const [isInQuicklist, setIsInQuicklist] = useState<Boolean>(false);

    // re-render when new food is selected
    useEffect(() => {
        isFoodInQuicklist(props.id);
        setPage(1);
        (props.context==="MealInfo") ? setMultiplier(props.servings["multiplier"]):setMultiplier(1);
    }, [props.name])

    // callback to hide modal
    function toggleModal() {
        props.toggle();
    }

    function nextPage() {
        if (page < 3) setPage(page + 1)
    }

    function prevPage() {
        if (page > 1) setPage(page - 1)
    }

    function isFoodInQuicklist(foodId: number) {
        quicklist.forEach((food: any) => {
            if (food["id"]===foodId) {
                setIsInQuicklist(true)
                return
            }
        })
    }

    // add this item to the quicklist
    function addToQuicklist() {

        // deep copy current food to prevent pointer issues
        let foodObject = JSON.parse(JSON.stringify(props.nutrition))
        foodObject["cost"] = props.cost;
        foodObject["name"] = props.name;
        foodObject["image"] = props.image
        foodObject["id"] = props.id;

        // don't store the same item twice
        quicklist.forEach((foodItem: any) => {
            if (foodItem["id"]===foodObject["id"])  {
                return
            }
        });
        
        setQuicklist([
            ...quicklist,
            foodObject
        ])
        setIsInQuicklist(true);

        Alert.alert("Added", capitalize(foodObject["name"])+" has been added to your Quicklist")
    }

    function removeFromQuicklist() {
        const updatedQuicklist = quicklist.filter((food: any) => food["id"] !== props.id)
        setQuicklist(updatedQuicklist)

        // in Search the buttons should switch, in Quicklist the modal should close
        if (props.context==="Search") setIsInQuicklist(false)
        if (props.context==="Quicklist") toggleModal()
    }

    function removeFromMeal() {
        props.editMealFoods(-1)
    }

    function capitalize(input: string) {
        let editedString = input;
        const stringLength = input.length;
        editedString=editedString.slice(0,1).toUpperCase()+editedString.slice(1,stringLength);

        for (let i=1; i < editedString.length; i++) {
             if (editedString[i-1]===' ') editedString=editedString.slice(0,i)+editedString.slice(i,i+1).toUpperCase()+editedString.slice(i+1,stringLength)
        }
        
        return(editedString)
    }

    // set new serving size
    function newMultiplier(multiplier: number) {

        setMultiplier(multiplier);

        // MealInfo needs to send to callback function to update the meal, otherwise only update locally
        if (props.context==="MealInfo") {
            props.editMealFoods(multiplier)
        }
    }

    return (
        <Portal>
            <Modal visible={props.modalVisible} onDismiss={toggleModal}>
                <View style={styles.modal}>
                    {
                        (page === 1) &&
                        (
                            <View style={styles.upperView}>
                                <Text style={styles.header}>{props.name}</Text>
                                <ServingSizeTable servingSizeProps={props.nutrition["weightPerServing"]} newMultiplier={newMultiplier} multiplier={multiplier}></ServingSizeTable>
                                <NutritionTable nutrition={props.nutrition["nutrients"]} multiplier={multiplier}></NutritionTable>
                            </View>
                        ) 
                    }
                    {/* {
                        (page === 1) &&
                        (
                            <ServingSizeTable servingSizeProps={props.nutrition["weightPerServing"]} newMultiplier={newMultiplier} multiplier={multiplier}></ServingSizeTable>
                        )
                    }
                    {
                        (page === 1) &&
                        (
                            <NutritionTable nutrition={props.nutrition["nutrients"]} multiplier={multiplier}></NutritionTable>
                        )
                    } */}
                    {
                        (page == 2) &&
                        (
                            <CaloricBreakdownTable caloricBreakdownProps={props.nutrition["caloricBreakdown"]}></CaloricBreakdownTable>
                        )
                    }
                    {
                        (page === 2) &&
                        (
                            <PropertiesTable propertiesProps={props.nutrition["properties"]}></PropertiesTable>
                        )
                    }
                    {
                        (page == 3) &&
                        (
                            <CostTable cost={props.cost} multiplier={multiplier}></CostTable>
                        )
                    }
                    {
                        (page === 3) && 
                        (
                            <FlavonoidsTable flavonoidsProps={props.nutrition["flavonoids"]} multiplier={multiplier}></FlavonoidsTable>
                        )
                    }

                    <View style={styles.pageButtons}>
                        <Button textColor="#2774AE" children="Prev" onPress={prevPage} disabled={page===1} labelStyle={styles.pageButtonText}></Button>
                        <View style={styles.pageText}>
                            <Text style={styles.text}>{page} of 3</Text>
                        </View>
                        <Button textColor="#2774AE" children="Next" onPress={nextPage} disabled={page===3} labelStyle={styles.pageButtonText}></Button>
                    </View>
                    <View style={styles.bottomButtons}>
                        { (props.context==="Search" && isInQuicklist) &&
                            <Button textColor="#c5050c" children="Remove from Quicklist" onPress={removeFromQuicklist} labelStyle={styles.buttonText}></Button>
                        }
                        { (props.context==="Search" && !isInQuicklist) &&
                            <Button textColor="#2774AE" children="Add to Quicklist" onPress={addToQuicklist} labelStyle={styles.buttonText}></Button>
                        }
                        { (props.context==="MealInfo") &&
                            <Button textColor="#c5050c" children="Remove from Meal" onPress={removeFromMeal} labelStyle={styles.buttonText}></Button>
                        }
                        { (props.context==="Quicklist") &&
                            <Button textColor="#c5050c" style={styles.multipurposeButton} children="Remove from Quicklist" onPress={removeFromQuicklist} labelStyle={styles.buttonText}></Button>
                        }
                        <Button textColor='#c5050c' style={styles.closeButton} children="Close" onPress={toggleModal} labelStyle={styles.buttonText}></Button>
                    </View>
                </View>
            </Modal>      
        </Portal>
    )
}

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center',
        height: '100%',
        padding: 10,
        marginHorizontal: 15,
        paddingTop: 15,
        backgroundColor: '#f7f7f7',
        borderColor: '#282728',
        borderWidth: 3,
        borderRadius: 15
    },
    bottomButtons: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        position: 'absolute',
        //left: 15,
        bottom: 8
    },
    pageButtons: {
        flexDirection: 'row',
        alignSelf: 'center',
        position: 'absolute',
        paddingLeft: 95,
        bottom: 50,
        width: '100%',
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#dadfe1',
    },
    closeButton: {
        //position: 'absolute',
        left: '220%'
    },
    multipurposeButton: {
        //position: 'absolute',
        left: '25%'
    },
    upperView: {
        height: '60%',
        width: '100%',
        alignItems: 'center'
    },
    // modal: {
    //     alignItems: 'center',
    //     height: 600,
    //     padding: 10,
    //     margin: 15,
    //     paddingTop: 15,
    //     backgroundColor: '#f7f7f7',
    //     borderColor: '#282728',
    //     borderWidth: 3,
    //     borderRadius: 15
    // },
    // bottomButtons: {
    //     flexDirection: 'row',
    //     alignSelf: 'flex-start',
    //     position: 'absolute',
    //     //left: 15,
    //     bottom: 8
    // },
    // pageButtons: {
    //     flexDirection: 'row',
    //     alignSelf: 'center',
    //     position: 'absolute',
    //     paddingLeft: 95,
    //     bottom: 50,
    //     width: '100%',
    //     paddingTop: 10,
    //     borderTopWidth: 1,
    //     borderColor: '#dadfe1',
    // },
    // closeButton: {
    //     //position: 'absolute',
    //     left: '220%'
    // },
    // multipurposeButton: {
    //     //position: 'absolute',
    //     left: '25%'
    // },
    buttonText: {
        fontSize: 16
    }, 
    pageButtonText: {
        fontSize: 16
    },   
    header: {
        textTransform: 'capitalize',
        fontSize: 24
    },
    text: {
        lineHeight: 38
    },
    pageText: {
        width: 40
    }
})