import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import CaloricBreakdownTable from "./Tables/CaloricBreakdownTable";
import CostTable from "./Tables/CostTable";
import FlavonoidsTable from "./Tables/FlavonoidsTable";
import NutritionTable from "./Tables/NutritionTable";
import PropertiesTable from "./Tables/PropertiesTable";
import ServingSizeTable from "./Tables/ServingSizeTable";


export default function FoodModal(props: any) {

    const [page, setPage] = useState<number>(1)
    const [multiplier, setMultiplier] = useState<number>(1)

    function toggleModal() {
        props.toggle();
    }

    function nextPage() {
        if (page < 3) setPage(page + 1)
    }

    function prevPage() {
        if (page > 1) setPage(page - 1)
    }

    function newMultiplier(multiplier: number) {
        console.log(multiplier)
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
                            <ServingSizeTable servingSizeProps={props.servingSize} newMultiplier={newMultiplier} multiplier={multiplier}></ServingSizeTable>
                        )
                    }
                    {
                        (page === 1) &&
                        (
                            <NutritionTable nutrition={props.nutrients} multiplier={multiplier}></NutritionTable>
                        )
                    }
                    {
                        (page == 2) &&
                        (
                            <CaloricBreakdownTable caloricBreakdownProps={props.caloricBreakdown}></CaloricBreakdownTable>
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
                            <PropertiesTable propertiesProps={props.properties}></PropertiesTable>
                        )
                    }
                    {
                        (page === 3) && 
                        (
                            <FlavonoidsTable flavonoidsProps={props.flavonoids} multiplier={multiplier}></FlavonoidsTable>
                        )
                    }

                    <View style={styles.bottom}>
                        <Button children="Add to Quicklist" onPress={toggleModal}></Button>
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