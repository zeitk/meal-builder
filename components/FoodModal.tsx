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

    // callback to hide modal
    function toggleModal() {
        props.toggle();
    }

    // add this item to the quicklist
    function addToQuicklist() {

        // deep copy current food
        let foodObject = JSON.parse(JSON.stringify(props.nutrition))
        foodObject["cost"] = props.cost;
        foodObject["name"] = props.name;
        foodObject["image"] = props.image
        foodObject["id"] = props.id;

        // don't store the same item twice
        let found = false;
        quicklist.forEach((foodItem: any) => {
            if (foodItem["id"]===foodObject["id"])  {
                found = true;
                return
            }
        });
        if (found) {
            Alert.alert("Already Added", capitalize(foodObject["name"])+" is already in your Quicklist")
            return
        }

        setQuicklist([
            ...quicklist,
            foodObject
        ])

        Alert.alert("Added", capitalize(foodObject["name"])+" has been added to your Quicklist")
    }

    function capitalize(input: string) {
        let str = input;
        str=str.slice(0,1).toUpperCase()+str.slice(1,99);

        for (let i=0; i < str.length; i++) {
             if (str[i-1]===' ') str=str.slice(0,i)+str.slice(i,i+1).toUpperCase()+str.slice(i+1,99)
        }
        
        return(str)
    }

    function nextPage() {
        if (page < 3) setPage(page + 1)
    }

    function prevPage() {
        if (page > 1) setPage(page - 1)
    }

    // set new serving size
    function newMultiplier(multiplier: number) {
        setMultiplier(multiplier);
    }

    // re-render when new food is selected
    useEffect(() => {
        setPage(1)
        setMultiplier(1);
    }, [props.name])

    return (
        <Portal>
            <Modal visible={props.modalVisible} onDismiss={toggleModal}>
                <View style={styles.modal}>
                    {
                        (page === 1) &&
                        (
                            <Text style={styles.header}>{props.name}</Text>
                        )
                    }
                    
                    {
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
                    }
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
                        <Button textColor="#2774AE" children="Add to Quicklist" onPress={addToQuicklist} labelStyle={styles.buttonText}></Button>
                        <Button textColor='#c5050c' style={{paddingLeft: 115}} children="Close" onPress={toggleModal} labelStyle={styles.buttonText}></Button>
                    </View>
                </View>
            </Modal>      
        </Portal>
    )
}

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center',
        height: 600,
        padding: 15,
        margin: 15,
        paddingTop: 20,
        backgroundColor: '#f7f7f7',
        borderColor: '#282728',
        borderWidth: 3,
        borderRadius: 15
    },
    bottomButtons: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        position: 'absolute',
        left: 15,
        bottom: 8
    },
    buttonText: {
        fontSize: 16
    }, 
    pageButtonText: {
        fontSize: 16
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