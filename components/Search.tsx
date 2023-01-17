import React from 'react'

import { useEffect, useState, useRef } from "react";
import {  View, StyleSheet, SafeAreaView, ScrollView, Text } from "react-native";
import { Portal } from "react-native-paper";

import FoodCard from "./FoodCard";
import FoodModal from "./FoodModal";
import { SearchBar } from './SearchBar';

interface Food {
    [key: string]: any,
    aisle: string,
    id: number,
    image: string,
    name: string,
    possibleUnits: Array<string>
}

const examples: string[] = [
    "Potato",
    "Broccoli",
    "Bread"
]

export default function Search({ navigation }: any) {

    // search related states
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(-1);
    const scrollRef = useRef<ScrollView | null>(null);

    // modal and table related states
    const [exampleBanner, setExampleBanner] = useState<String>("")
    const [nutrition, setNutrition] = useState<any>({})
    const [modalVisible, setModalVisible] = useState(false);
    const [cost, setCost] = useState([]);
    const [currentId, setCurrentId] = useState("");
    const [currentName, setCurrentName] = useState("");
    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {

        //reset total items
        setTotalItems(-1)

        // have example search 
        const searchExample = examples[Math.floor(Math.random()*examples.length)]
        searchItems(searchExample)
        setExampleBanner(searchExample)

        // close modal if it's open
        navigation.addListener('tabPress', () => {
            setModalVisible(false)
        });
    },[navigation])

    const beginSearch = (input: string) => {
        // don't search if there's nothing to search for, or if we just pressed cancel
        if (input==="") return

        // get rid of example banner and begin search
        setExampleBanner("")
        searchItems(input)
    }

    const searchItems = ((input: any) => {

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
        scrollRef.current?.scrollTo({
            y: 0,
            animated: false
        });
    })

    function sortItems(items: any) {
        // sort foods by category before storing
        items.sort((a: any, b: any) => a["aisle"].localeCompare(b["aisle"]))
        setItems(items)
    }

    function moreInfo(id: number, name: string, image: string) {


        // don't fetch if we already have the info
        if (id.toString()!==currentId) {

            setNutrition([]);

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
            <SearchBar callback={beginSearch} placeholderTextColor={"#646569"}></SearchBar>
            { (totalItems<1) &&
                <View style={styles.messageTextView}>
                    { (totalItems===0) ?
                        <Text style={styles.exampleBannerText}>Your search returned no items</Text>:
                        <Text style={styles.exampleBannerText}>Loading...</Text>
                    }
                   
                </View>
            }
            <ScrollView ref={scrollRef} style={styles.scrollView}>
                {exampleBanner!=="" && (
                    <View style={styles.exampleBanner}>
                        <Text style={styles.exampleBannerText}>Example Search - {exampleBanner}</Text>
                    </View> 
                )}
                {
                    items.map((item: Food, i) => {
                        if (i === 0 || (i > 0 && items[i-1]["aisle"]!==items[i]["aisle"])) {
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