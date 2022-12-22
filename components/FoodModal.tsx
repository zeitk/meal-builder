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
        let foodObject = JSON.parse(JSON.stringify(props.nutrition))
        foodObject["cost"] = props.cost;
        foodObject["name"] = props.name;
        foodObject["id"] = props.id;

        // don't store the same item twice
        let found = false;
        quicklist.forEach((foodItem: any) => {
            if (foodItem["id"]===foodObject["id"])  {
                found = true;
                return
            }
        });
        if (found) return

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
                        (page == 2) &&
                        (
                            <CostTable cost={props.cost}></CostTable>
                        )
                    }
                    {
                        (page === 2) &&
                        (
                            <PropertiesTable propertiesProps={props.nutrition["properties"]}></PropertiesTable>
                        )
                    }
                    {
                        (page === 3) && 
                        (
                            <FlavonoidsTable flavonoidsProps={props.nutrition["flavonoids"]} multiplier={multiplier}></FlavonoidsTable>
                        )
                    }

                    <View style={styles.bottom}>
                        <Button children="Add to Quicklist" onPress={addToQuicklist}></Button>
                        <Button children="Prev" onPress={prevPage} disabled={page===1}></Button>
                        <Button children="Next" onPress={nextPage} disabled={page===3}></Button>
                        <Button children="Close" onPress={toggleModal}></Button>
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
    bottom: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        position: 'absolute',
        left: 17,
        bottom: 20
    },
    header: {
        textTransform: 'capitalize',
        fontSize: 24
    }
})