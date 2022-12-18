import { useEffect, useState } from "react";
import {  View, TextInput, StyleSheet, SafeAreaView, ScrollView, Keyboard } from "react-native";
import { Button, Portal } from "react-native-paper";
import { Feather, Entypo } from "@expo/vector-icons";

import { QuicklistContext } from "../context/QuicklistContext";
import FoodItem from "./FoodItem";
import FoodModal from "./FoodModal";

interface Food {
    [key: string]: any,
    aisle: string,
    id: number,
    image: string,
    name: string,
    possibleUnits: Array<string>
}

interface Nutrition {
    [key: string]: any
}

const slogans: string[] = [
    "Watcha feeling?",
    "Ex: Potato",
    "Search for anything!"
]

export default function Search() {

    // search related states
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [searchString, setSearchString] = useState("");
    const [pressed, setPressed] = useState(false);
    const [slogan, setSlogan] = useState("")

    // modal and table related states
    const [modalVisible, setModalVisible] = useState(false);
    const [nutrients, setNutrients] = useState<any>([]);
    const [caloricBreakdown, setCaloricBreakdown] = useState<any>([]);
    const [flavonoids, setFlavonoids] = useState<any>([]);
    const [properties, setProperties] = useState<any>([]);
    const [servingSize, setServingSize] = useState<any>([]);
    const [cost, setCost] = useState([]);
    const [currentId, setCurrentId] = useState("");
    const [currentName, setCurrentName] = useState("");

    useEffect(() => {
        // set TextInput placeholder
        setSlogan(slogans[(Math.floor(Math.random()*3))])
    }, [])

    const searchItems = (() => {

        // don't search if there's nothing to search for, or if we just pressed cancel
        if (searchString==="") return

        // change our placeholder
        setSlogan(slogans[(Math.floor(Math.random()*3))])

        const params = {
            query: searchString,
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
                setItems(json.results)
                setTotalItems(json.number);
            })
        setSearchString("");
        setPressed(false);
    })

    function moreInfo(id: number, name: string) {

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
                    parseNutrition(json.nutrition);
                    setCost(json.estimatedCost);
            })

            // info is retrieved so show modal. Store ID of food to prevent additional API calls
            setModalVisible(true);
            setCurrentId(id.toString())
            setCurrentName(name);
        }

        // we already have the info, just show it
        else {
            setModalVisible(true);
        }
    }

    const parseNutrition = (nutrition: any) => {
        
        // nutrition has many sections that we'll need in individual tables, let's split them up here
        for (const index in nutrition) {
            if (index==="caloricBreakdown") setCaloricBreakdown(nutrition[index]);
            else if (index==="nutrients") setNutrients(nutrition[index]);
            else if (index==="flavonoids") setFlavonoids(nutrition[index]);
            else if (index==="properties") setProperties(nutrition[index]);
            else if (index==="weightPerServing") setServingSize(nutrition[index]);
        }
    }

    function toggleModal() {
        if (!modalVisible) setModalVisible(true)
        else setModalVisible(false)
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
                        returnKeyType="search"
                        onEndEditing={searchItems}
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
                        <Button children="Cancel" onPress={() => {
                            setSearchString("")
                            Keyboard.dismiss();
                            setPressed(false);
                        }}></Button>
                    </View>
                )}
            </View>

            <ScrollView style={styles.scrollView}>
                {
                    items.map((item: Food, i) => {
                        return <FoodItem key={i} aisle={item.aisle} id={item.id} image={item.image} name={item.name} possibleUnits={item.possibleUnits} callback={moreInfo}></FoodItem>
                    })
                }
            </ScrollView>

            <Portal.Host>
                <FoodModal name={currentName} nutrients={nutrients} cost={cost} caloricBreakdown={caloricBreakdown} servingSize={servingSize} properties={properties} flavonoids={flavonoids} toggle={toggleModal} modalVisible={modalVisible}></FoodModal>
            </Portal.Host>

        </SafeAreaView>
    </>
}

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    scrollView: {
        backgroundColor: '#dadfe1',
        marginTop: 0,
        marginBottom: 0
    },
    container: {
        margin: 15,
        width: '90%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        
    },
    input: {
        fontSize: 20,
        width: '90%',
        marginLeft: 10,
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
        backgroundColor: "#dadfe1"
    },
    searchbar_unpressed: {
        padding: 10,
        flexDirection: 'row',
        borderRadius: 15,
        width: '95%',
        backgroundColor: '#dadfe1',
        alignItems: 'center',
    }
})