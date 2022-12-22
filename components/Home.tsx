import { Text, View } from "react-native";
import React from 'react'
import { StyleSheet } from "react-native";

export default function Home() {

    return(
        <View style={styles.view}>
            <Text style={styles.header}>Hello!</Text>
            <Text style={styles.text}>Welcome to my meal tracking app. This is a work in progress, so please bear with me while I iron out some kinks. In this app I use the spooonacular API</Text>
            <Text style={styles.text}>   https://spoonacular.com/food-api/docs</Text>
            <Text style={styles.text}>to access data on different foods. You can search for foods in the 'Search' tab, and see more information on specific foods by pressing on a displayed food Card.</Text>
            <Text style={styles.text}>When a food is selected, a screen with the quantity, nutritional information, cost, and more, will appear. You can edit the quantity of the food and the nutritional info will adjust to match the new value.</Text>
            <Text style={styles.text}>Pressing 'Add to Quicklist' will add this food to your shortlist of items. These can then be used in the 'Meals' tab to combine into different meals.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        padding: 10
    },
    header: {
        fontSize: 14,
        fontWeight: '500',
        paddingBottom: 10
    },
    text: {
        fontSize: 14,
        paddingBottom: 10
    }
})