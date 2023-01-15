import { ScrollView, Text, View } from "react-native";
import React from 'react'
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function Home({ navigation }:any) {

    return(
        <ScrollView style={styles.view}>
            <Text style={styles.header}>Overview</Text>
            <Text style={styles.bodyText}>Welcome to my meal tracking app. In this app I use the spooonacular API to access data on different foods. </Text>
            <Text style={styles.bodyText}>   https://spoonacular.com/food-api/docs</Text>
            <Text style={styles.bodyText}>This app allows you to search for foods and view their information, and combine foods into meals and view the combined nutritional information.</Text>

            <Text style={styles.subHeader}>Search</Text>
            <Text style={styles.bodyText}>In the 'Search' tab you can search for foods and view their nutritional information. When viewing a specific food, you can add that food to your Quicklist, which acts as a favorites list of foods</Text>
            <Text style={styles.bodyText}>'Search' will automatically load with an example search to show what a typical query will return</Text>
            <Button mode="text" textColor="#2774AE" children={"Go to 'Search'"} style={styles.button} labelStyle={styles.buttonText} onPress={()=>(navigation.navigate("Search"))}></Button>
            <Text style={styles.subHeader}>Quicklist</Text>
            <Text style={styles.bodyText}>The 'Quicklist' tab shows your favorited items. From here, you can view their nutritional information or remove them from the Quicklist. The Quicklist allows you to more quickly add foods to meals in the 'Meals' tab</Text>
            <Button mode="text" textColor="#2774AE" children={"Go to 'Quicklist'"} style={styles.button} labelStyle={styles.buttonText} onPress={()=>(navigation.navigate("Quicklist"))}></Button>
            <Text style={styles.subHeader}>Meals</Text>
            <Text style={styles.bodyText}>In 'Meals' you can create new meals or view previously made ones. To create a new meal press the 'Add Meal' button. You may select a name for your meal near the top.</Text>
            <Text style={styles.bodyText}>By default, foods in the Quicklist will show. Selected foods will be highlighted green. Once selected, you may enter in a custom quantity (in grams) for the food.</Text>
            <Text style={styles.bodyText}>Press 'Search all foods', to search over the entire database. Here, selected foods will show a pop-up. You may use the 'Amount' textbox to enter in a custom quantity (in grams) for a food. Add the food by pressing 'Add to Meal'</Text>
            <Text style={styles.bodyText}>Save the meal with the 'Save' button. The 'Close' button will close the builder without saving</Text>
            <Text style={styles.bodyText}>Press on a Meal card to view a created meal. Here, you may view a meal's overall nutritional information and cost.</Text>
            <Text style={styles.bodyText}>You may remove foods from the meal by selecting them and pressing 'Remove from Meal'. On the second page, you may specify the servings of the meal, which will update the nutritional info</Text>
            <Button mode="text" textColor="#2774AE" children={"Go to 'Meals'"} style={styles.button} labelStyle={styles.buttonText} onPress={()=>(navigation.navigate("Meals"))}></Button>
            <View style={styles.buttonView}>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    subHeader: {
        fontSize: 15,
        fontWeight: '500',
        paddingBottom: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: '500',
        paddingBottom: 10,
    },
    view: {
        width: '98%',
        paddingTop: 20,
        padding: 10,
    },
    bodyText: {
        fontSize: 14,
        paddingBottom: 10,
        fontWeight: '300',
    },
    button: {
        width: 300,
        alignSelf: 'center',
        padding: 10
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
        fontSize: 15
    }
})