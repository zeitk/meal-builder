import React, { useContext, useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import QuicklistContext from "../context/QuicklistContext";
import FoodCard from "./FoodCard";

export default function Quicklist({ navigation }: any) {

    const [quicklist, setQuicklist] = useContext(QuicklistContext)

    useEffect(() => {

    },[])

    return<>
        <SafeAreaView>
            { (quicklist.length>0) ?
                <ScrollView style={styles.scrollview}>
                {
                    quicklist.map((food: any, i: number) => {
                        return <FoodCard key={i} id={food["id"]} image={food["image"]} callback={()=>{}} name={food["name"]} mode={0}></FoodCard>
                    })
                }
                </ScrollView>
                :
                <View style={styles.emptyQuicklist}>
                    <Text style={styles.text}>Add items to your Quicklist in Search</Text>
                    <Button children="Search" textColor="#2774AE" labelStyle={styles.buttonText} style={styles.buttonView} onPress={()=>{navigation.navigate('Search')}}></Button>
                </View>
            }
            
        </SafeAreaView>
    </>
}

const styles = StyleSheet.create({
    scrollview: {
        height: '100%'
    },
    text: {
        fontSize: 20,
        fontWeight: '300'
    },
    emptyQuicklist: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonView: {
        paddingTop: 15,
        width: 300
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '300'
    }
})