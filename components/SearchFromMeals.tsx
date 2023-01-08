import React, { useContext } from 'react'

import { useEffect, useState } from "react";
import {  View, TextInput, StyleSheet, SafeAreaView, ScrollView, Keyboard, Text } from "react-native";
import { Button, Portal } from "react-native-paper";
import { Feather, Entypo } from "@expo/vector-icons";

import FoodCard from "./FoodCard";
import FoodModal from "./FoodModal";
import CurrentMealContext from '../context/CurrentMeal';

interface Food {
    [key: string]: any,
    aisle: string,
    id: number,
    image: string,
    name: string,
    possibleUnits: Array<string>
}

const slogans: string[] = [
    "Watcha feeling?",
    "Ex: Potato",
    "Search for anything!"
]

const examples: string[] = [
    "Potato",
    "Beans",
    "Bread"
]

export default function SearchFromMeals(props: any) {

    // search related states
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(-1);
    const [searchString, setSearchString] = useState("");
    const [pressed, setPressed] = useState(false);
    const [slogan, setSlogan] = useState("")

    // modal and table related states
    const [exampleBanner, setExampleBanner] = useState<String>("")
    const [nutrition, setNutrition] = useState<any>({})
    const [modalVisible, setModalVisible] = useState(false);
    const [cost, setCost] = useState([]);
    const [currentId, setCurrentId] = useState("");
    const [currentName, setCurrentName] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [currentIsInMeal, setCurrentIsInMeal] = useState<Boolean>(false);

    // meal related context
    const [currentMeal, setCurrentMeal] = useContext(CurrentMealContext)

    useEffect(() => {

        //reset total items
        setTotalItems(-1)

        // have example search 
        const searchExample = examples[Math.floor(Math.random()*examples.length)]
        searchItems(searchExample)
        setExampleBanner(searchExample)
        
        // set searchbar text placeholder
        setSlogan(slogans[(Math.floor(Math.random()*slogans.length))])
    },[])

    function editMealFoods(multiplier: number) {

        // deep copy current food to prevent pointer issues
        let foodObject = JSON.parse(JSON.stringify(nutrition))
        foodObject["cost"] = cost;
        foodObject["name"] = currentName;
        foodObject["image"] = currentImage
        foodObject["id"] = currentId;

        // deep copy to prevent pointer issues
        let selectedFood = JSON.parse(JSON.stringify(foodObject))
        selectedFood["multiplier"] = multiplier;
        selectedFood["quantity"]= selectedFood["weightPerServing"]["amount"]*multiplier

        if (multiplier > 0) {
            setCurrentMeal({
                ...currentMeal,
                foods: [
                ...currentMeal["foods"],
                selectedFood
            ]})
            setCurrentIsInMeal(true)
        }

        else if (multiplier === -1) {
            setCurrentMeal({
                ...currentMeal,
                foods: currentMeal["foods"].filter((food:any) => food["name"] !== selectedFood["name"])
            });
            setCurrentIsInMeal(false)
        }
    }

    const beginSearch = () => {
        // don't search if there's nothing to search for, or if we just pressed cancel
        if (searchString==="") return

        // get rid of example banner and begin search
        setExampleBanner("")
        searchItems(searchString)
    }

    const searchItems = ((input: any) => {

        // change our placeholder
        setSlogan(slogans[(Math.floor(Math.random()*slogans.length))])

        const params = {
            query: input,
            addChildre: 'true',
            metaInformation: 'true',
            sort: 'calories',
            sortDirection: 'asc',
            number: '25',
            apiKey: '206c039ac4b7451fb2947d93c4a1f8d4'
        };

        let url = "https://api.spoonacular.com/food/ingredients/search?";
        url += (new URLSearchParams(params)).toString()

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(json => {
                sortItems(json.results)
                setTotalItems(json.totalResults);
            })
        setSearchString("");
        setPressed(false);
    })

    function sortItems(items: any) {
        // sort foods by category before storing
        items.sort((a: any, b: any) => a["aisle"].localeCompare(b["aisle"]))
        setItems(items)
    }

    function moreInfo(id: number, name: string, image: string) {

        // don't fetch if we already have the info
        if (id.toString()!==currentId) {

            const params = {
                amount: '150',
                unit: 'grams',
                apiKey: '206c039ac4b7451fb2947d93c4a1f8d4'
            };

            let url = "https://api.spoonacular.com/food/ingredients/"
            url += id.toString() + "/information?" + (new URLSearchParams(params)).toString()

            fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => res.json())
                .then(json => {
                    setNutrition(json.nutrition)
                    setCost(json.estimatedCost);
            })

            // info is retrieved, show modal. Store ID of food to prevent additional API calls
            setCurrentId(id.toString())
            isCurrentInMeal(id.toString())
            setCurrentName(name);
            setCurrentImage(image)
            setModalVisible(true);
            props.toggleButtons()
        }

        // we already have the info, just show it
        else {
            setModalVisible(true);
            props.toggleButtons()
        }
    }

    function isCurrentInMeal(id: String) {
        currentMeal["foods"].forEach((food: any) => {
            if (food["id"] === id) setCurrentIsInMeal(true)
        })
        setCurrentIsInMeal(false);
    }

    function toggleModal() {
        if (!modalVisible) {
            setModalVisible(true)
            props.toggleButtons()
        }
        else {
            setModalVisible(false)
            props.toggleButtons()
        }
    }

    return <>
        <SafeAreaView style={styles.safeView}>
            <View style={styles.container}>
                <View style={
                    pressed
                        ? styles.searchbar_pressed
                        : styles.searchbar_unpressed
                }>
                    <Feather
                        name="search"
                        size={20}
                        color="black"
                        style={styles.feather}
                    ></Feather>
                    <TextInput
                        style={styles.input}
                        value={searchString}
                        onChangeText={setSearchString}
                        placeholder={slogan}
                        placeholderTextColor={'#646569'}
                        returnKeyType="search"
                        onEndEditing={beginSearch}
                        onFocus={() => { setPressed(true) }} >
                    </TextInput>
                    {pressed && (
                        <Entypo
                            name="cross" size={20} color="black" style={styles.entypo}
                            onPress={() => { setSearchString("") }}>
                        </Entypo>
                    )}
                </View>
                {/* show cancel button if searchbar is pressed */}
                {pressed && (
                    <View>
                        <Button children="Cancel" textColor="#c5050c" onPress={() => {
                            setSearchString("")
                            Keyboard.dismiss();
                            setPressed(false);
                        }}></Button>
                    </View>
                )}
            </View>
            { (totalItems<1) &&
                <View style={styles.messageTextView}>
                    { (totalItems===0) ?
                        <Text style={styles.exampleBannerText}>Your search returned no items</Text>:
                        <Text style={styles.exampleBannerText}>Loading...</Text>
                    }
                   
                </View>
            }
            <ScrollView style={styles.scrollView}>
                {/* if this is an example search, display a banner */}
                {exampleBanner!=="" && (
                    <View style={styles.exampleBanner}>
                        <Text style={styles.exampleBannerText}>Example Search - {exampleBanner}</Text>
                    </View> 
                )}
                {
                    items.map((item: Food, i) => {
                        if (i === 0 || (i > 0 && items[i-1]["aisle"]!==items[i]["aisle"])) {
                            // if a new category is beginning, display category name
                            return(
                                <View key={i} >
                                    <View style={styles.exampleBanner}>
                                        <Text style={styles.foodCateogoryText}>{item["aisle"]}</Text>
                                    </View>
                                    <FoodCard id={item.id} image={item.image} name={item.name} callback={moreInfo} mode={0}></FoodCard>
                                </View>
                            )
                        }
                        else return <FoodCard key={i} id={item.id} image={item.image} name={item.name} callback={moreInfo} mode={0}></FoodCard>
                    })
                }
            </ScrollView>

            <Portal.Host>
                <FoodModal nutrition={nutrition} name={currentName} cost={cost} id={currentId} image={currentImage} editMealFoods={editMealFoods} toggle={toggleModal} modalVisible={modalVisible} isInMeal={currentIsInMeal} context={"MealBuilder"}></FoodModal>
            </Portal.Host>

        </SafeAreaView>
    </>
}

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: 'white'
    },
    scrollView: {
        backgroundColor: 'white',
        height: '100%',
        paddingTop: 5
    },
    container: {
        margin: 15,
        width: '90%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        height: 60,
    },
    input: {
        fontSize: 20,
        fontWeight: '300',
        width: '90%',
        marginLeft: 10,
    },
    exampleBanner: {
        padding: 12
    },
    exampleBannerText: {
        fontSize: 20,
        fontWeight: '300'
    },
    messageTextView: {
        backgroundColor: '#dadfe1',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    foodCateogoryText: {
        fontSize: 16,
        fontWeight: '300'
    },
    feather: {
        marginLeft: 1
    },
    entypo: {
        padding: 1,
        marginLeft: -25
    },
    searchbar_pressed: {
        padding: 10,
        flexDirection: 'row',
        borderRadius: 15,
        width: '80%',
        alignItems: 'center',
        backgroundColor: "#dadfe1",
        borderColor: '#646569',
        borderWidth: 1
    },
    searchbar_unpressed: {
        padding: 10,
        flexDirection: 'row',
        borderRadius: 15,
        width: '95%',
        backgroundColor: '#dadfe1',
        alignItems: 'center',
        borderColor: '#646569',
        borderWidth: 1
    }
})