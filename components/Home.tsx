import { Text, View } from "react-native";
import React from 'react'
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function Home({ navigation }:any) {

    return(
        <View style={styles.view}>
            <Text style={styles.header}>Hello!</Text>
            <Text style={styles.text}>Welcome to my meal tracking app. This is a work in progress, so please bear with me while I iron out some kinks. In this app I use the spooonacular API</Text>
            <Text style={styles.text}>   https://spoonacular.com/food-api/docs</Text>
            <Text style={styles.text}>to access data on different foods. You can search for foods in the 'Search' tab, and see more information on specific foods by pressing on a displayed food Card.</Text>
            <Text style={styles.text}>When a food is selected, a screen with the quantity, nutritional information, cost, and more, will appear. You can edit the quantity of the food and the nutritional info will adjust to match the new value.</Text>
            <Text style={styles.text}>Pressing 'Add to Quicklist' will add this food to your shortlist of items. These can then be used in the 'Meals' tab to combine into different meals.</Text>
            <View style={styles.buttonView}>
                <Button mode="text" textColor="#2774AE" children={"Let's begin"} style={styles.button} labelStyle={styles.buttonText} onPress={()=>(navigation.navigate("Search"))}></Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        paddingTop: 20,
        padding: 10,
    },
    header: {
        fontSize: 14,
        fontWeight: '500',
        paddingBottom: 10
    },
    text: {
        fontSize: 14,
        paddingBottom: 10
    },
    button: {
        //borderColor: '#2774AE',
        //borderWidth: 2,
        width: 300,
    },
    buttonView: {
        alignItems: 'center',
        marginTop: 5,
        paddingTop: 20,
        height: '100%',
        width: '100%',
        borderTopColor: '#dadfe1',
        borderTopWidth: 1,
    },
    buttonText: {
        fontSize: 17
    }
})