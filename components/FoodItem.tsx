import { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Card } from "react-native-paper";

interface Food {
    [key: string]: any,
    aisle: string,
    id: number,
    image: string,
    name: string,
    possibleUnits: Array<string>
}

const imageSize = "100x100";
const imageUrl = "https://spoonacular.com/cdn/ingredients_"

export default function FoodItem(props: Food) {

    const [isVisible, setIsVisible] = useState(false)

    function toggleModal() {
        if (!isVisible) setIsVisible(true);
        else {
            setIsVisible(false)
        }
    }

    function foodImage() {
        return(
            <Image source={{ uri: imageUrl + imageSize + "/" + props.image }}
                        style={styles.image}></Image>
        )
    }

    function showMoreInfo() {
        props.callback(props.id, props.name);
    }

    return <>
        <View>
            <Pressable onPress={showMoreInfo}>

                <Card style={styles.card}>
                    <Card.Title 
                        title={props.name} 
                        titleStyle={styles.title}
                        titleNumberOfLines={3} 
                        left={foodImage} 
                        leftStyle={styles.image}>
                    </Card.Title>
                    {/* <Image source={{ uri: imageUrl + imageSize + "/" + props.image }}
                        style={styles.image}></Image> */}
                </Card>

            </Pressable>
        </View>
    </>
}

const styles = StyleSheet.create({
    card: {
        borderColor: '#646569',
        borderWidth: 4,
        borderRadius: 15,
        backgroundColor: 'white',
        margin: 5,
        marginLeft: 15,
        marginRight: 15,
        height: 125,
    },
    image: {
        height: 100,
        width: 100,
        resizeMode: 'contain',
        marginLeft: 1,
        marginTop: 5,
        
    },
    title: {
        textTransform: 'capitalize',
        fontWeight: '500',
        textAlign: 'left',
        marginLeft: 10,
        fontSize: 20,
        color: '#494949'
    }
})