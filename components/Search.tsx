import React from 'react'

import { useEffect, useState } from "react";
import {  View, TextInput, StyleSheet, SafeAreaView, ScrollView, Keyboard, Text } from "react-native";
import { Button, Portal } from "react-native-paper";
import { Feather, Entypo } from "@expo/vector-icons";


import FoodCard from "./FoodCard";
import FoodModal from "./FoodModal";

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
    "Broccoli",
    "Bread"
]

export default function Search({ navigation }: any) {

    // search related states
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
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

    useEffect(() => {
        // have example search 
        const searchExample = examples[Math.floor(Math.random()*examples.length)]
        searchItems(searchExample)
        setExampleBanner(searchExample)

        // close modal if it's open
        navigation.addListener('tabPress', () => {
            setModalVisible(false)
          });

        // set search placeholder
        setSlogan(slogans[(Math.floor(Math.random()*slogans.length))])
    },[navigation])

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
                setItems(json.results)
                setTotalItems(json.number);
            })
        setSearchString("");
        setPressed(false);
    })

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
            setCurrentName(name);
            setCurrentImage(image)
            setModalVisible(true);
        }

        // we already have the info, just show it
        else {
            setModalVisible(true);
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

            <ScrollView style={styles.scrollView}>
                {exampleBanner!=="" && (
                    <View style={styles.exampleBanner}>
                        <Text style={styles.exampleBannerText}>Example Search - {exampleBanner}</Text>
                    </View> 
                )}
                {
                    items.map((item: Food, i) => {
                        return <FoodCard key={i} id={item.id} image={item.image} name={item.name} callback={moreInfo} mode={0}></FoodCard>
                    })
                }
            </ScrollView>

            <Portal.Host>
                <FoodModal nutrition={nutrition} name={currentName} cost={cost} id={currentId} image={currentImage} toggle={toggleModal} modalVisible={modalVisible} context={"Search"}></FoodModal>
            </Portal.Host>

        </SafeAreaView>
    </>
}

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    },
    scrollView: {
        backgroundColor: '#dadfe1',
        height: '100%',
        paddingTop: 5
    },
    container: {
        margin: 15,
        width: '90%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        height: 60
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