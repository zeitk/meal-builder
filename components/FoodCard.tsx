import React, { useState } from 'react'

import { StyleSheet, Text, View, Image, Pressable, TextInput } from "react-native";
import { Card } from "react-native-paper";

interface Food {
    [key: string]: any,
    id: number,
    image: string,
    name: string
}

const imageSize = "100x100";
const imageUrl = "https://spoonacular.com/cdn/ingredients_"

export default function FoodCard(props: Food) {

    const [isPressed, setIsPressed] = useState<Boolean>(false)

    function showMoreInfo(quantity: any) {

        // if food is being added to meal 
        if (props.mode===1) {
            // location in the quicklist
            const index = props.arrayIndex

            // if item is pressed we're either removing the item or updating its quantity
            if (isPressed) {
                if ((typeof quantity)==="string") props.callback(2, index, quantity)
                else {                
                    setIsPressed(false)
                    props.callback(1, index, -1)
                }
            }
            
            // if item is not pressed we are adding the item
            else {
                setIsPressed(true);
                props.callback(2, index, -1)
            }
        }

        // if nutritional value is being viewed
        else {
            props.callback(props.id, props.name, props.image);
        }
    }

    return <>
        <View style={{width: '100%'}}>
            <Pressable onPress={showMoreInfo}>

                <Card style={(isPressed) ? styles.card_pressed:styles.card_unpressed}>
                    <Card.Content style={styles.content}>
                        <View style={styles.imageView}>
                            <Image source={{ uri: imageUrl + imageSize + "/" + props.image }} style={styles.image}></Image>
                        </View>
                        <View style={(isPressed || props.mode===2) ? styles.pressedTitleView:styles.unpressedTitleView}>
                            <Text style={styles.title}>{props.name}</Text>
                        </View>
                        { (isPressed || props.mode===2) && 
                            <View style={styles.quantityView}>
                                <Text style={styles.quantityText}>Quantity: </Text>
                                { (props.mode===2) &&
                                    <Text>
                                        {(Number(props.quantity)).toFixed(0)}g
                                    </Text>
                                }
                                { (props.mode===1) &&
                                    <TextInput  
                                        style={styles.quantityTextInput}
                                        selectionColor="#f7f7f7"  
                                        placeholderTextColor="#adadad"
                                        keyboardType={"numeric"} 
                                        returnKeyType="done" 
                                        onSubmitEditing={(value) => showMoreInfo(value.nativeEvent.text) } 
                                        placeholder={"150g"}>
                                    </TextInput>
                                }

                            </View>
                        }
                    </Card.Content>
                </Card>

            </Pressable>
        </View>
    </>
}

const styles = StyleSheet.create({
    card_unpressed: {
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
    card_pressed: {
        borderColor: '#22a811',
        borderWidth: 2.5,
        borderRadius: 5,
        backgroundColor: 'white',
        margin: 5,
        marginLeft: 15,
        marginRight: 15,
        height: 125,
        width: '92.5%'
    },
    image: {
        height: 100,
        resizeMode: 'contain',
        marginLeft: 1,
    },
    imageView: {
        width: '27.5%',
        height: '100%',
        backgroundColor: 'white'
    },
    unpressedTitleView: {
        width: '72.5%'
    },
    pressedTitleView: {
        width: '37.5%'
    },
    title: {
        textTransform: 'capitalize',
        fontWeight: '300',
        textAlign: 'left',
        fontSize: 21,
        padding: 20
    },
    content: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center'
    },
    quantityView: {
        width: '35%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    quantityText: {
        paddingBottom: 5,
        fontSize: 16,
        fontWeight: '300'
    },
    quantityTextInput: {
        width: '90%',
        padding: 5,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#dadfe1'
    }
})