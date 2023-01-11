import React from 'react'

import { useEffect, useState } from "react";
import {  View, TextInput, StyleSheet, Keyboard } from "react-native";
import { Button } from "react-native-paper";
import { Feather, Entypo } from "@expo/vector-icons";

const slogans: string[] = [
    "Watcha feeling?",
    "Ex: Potato",
    "Search for anything!"
]

export function SearchBar() {

    const [searchString, setSearchString] = useState("");
    const [pressed, setPressed] = useState(false);
    const [slogan, setSlogan] = useState("")

    useEffect(() => {
        setSlogan(slogans[(Math.floor(Math.random()*slogans.length))])
    }, [])

    return(
        <View>
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
                //value={searchString}
                //onChangeText={setSearchString}
                placeholder={slogan}
                returnKeyType="search"
                //onEndEditing={beginSearch}
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
    )
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