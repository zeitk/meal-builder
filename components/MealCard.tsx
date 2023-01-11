import React, { useContext, useEffect } from 'react'
import { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable, Button, Alert } from "react-native";
import { Card } from "react-native-paper";
import { Feather } from '@expo/vector-icons'; 
import MealListContext from '../context/MealList';

const imageSize = "100x100";
const imageUrl = "https://spoonacular.com/cdn/ingredients_"

export default function MealCard(props: any, { navigation }: any ) {

    const [images, setImages] = useState<String[]>([])
    const [mealList, setMeallist] = useContext(MealListContext)

    useEffect(() => {
        const foods = props["foods"]
        let newImages:String[] = [];
        foods.forEach((food: any) => {
            newImages.push(food["image"])
        })
        setImages(newImages)
    },[mealList])

    function showMoreInfo() {
        props.navigation.navigate('MealInfo', { id: props["id"] })
    }

    function deleteMeal() {
        setMeallist(
            mealList.filter((meal:any) => meal["id"] !== props["id"])
        );
    }

    function deleteButton() {
        
        // give prompt before deleting meal
        Alert.alert(
            'Delete Meal',
            'Are you sure you want to delete this meal?',[
                { text: 'Cancel', onPress: () => {}, style: 'cancel'},
                { text: 'Yes', onPress: () => deleteMeal() },
            ],
            { cancelable: false }
          );
    }

    return <>
        <View>
            <Pressable onPress={showMoreInfo}>

            <Card style={styles.card}>
                    <Card.Content style={styles.content}>

                        <View style={styles.imageView}>
                            <View style={styles.imageViewRow}>
                                {
                                    images.map((image: any, i: number) => {
                                        if (i < 2) return<Image key={i} source={{uri: imageUrl + imageSize + "/" + image}} style={styles.image}></Image>
                                    })
                                }
                            </View>
                            <View style={styles.imageViewRow}>
                                {
                                    images.map((image: any, i: number) => {
                                        if (i > 1 && i < 4) return<Image key={i} source={{uri: imageUrl + imageSize + "/" + image}} style={styles.image}></Image>
                                    })
                                }
                            </View>
                        </View>

                        <View style={styles.titleView}>
                            <Text numberOfLines={2} style={styles.title}>{props.name}</Text>
                        </View>

                        <View style={styles.deleteButtonView}>
                            <Pressable hitSlop={{ bottom: 30, left: 30, right: 30, top: 30 }} onPress={deleteButton}>
                                <Feather style={styles.deleteButton} name="trash-2" size={18} color="#c5050c"/>
                            </Pressable>
                        </View>
                    </Card.Content>
                </Card>

            </Pressable>
        </View>
    </>
}

const styles = StyleSheet.create({
    card: {
        borderColor: '#646569',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        margin: 5,
        marginLeft: 15,
        marginRight: 15,
        height: 125,
        width: '92.5%'
    },
    image: {
        height: 45,
        width: 50,
        resizeMode: 'contain',
        marginLeft: 1,
    },
    imageView: {
        width: '33%',
        height: '100%',
        backgroundColor: 'white'
    },
    imageViewRow: {
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    titleView: {
        width: '57%',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    title: {
        textTransform: 'capitalize',
        fontWeight: '300',
        textAlign: 'left',
        fontSize: 21,
        paddingLeft: 20,
    },
    deleteButtonView: {
        width: '10%',
        alignItems: 'center'
    },
    deleteButton: {
        lineHeight: 100,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})