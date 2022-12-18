
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useEffect, useState } from "react";

export default function ServingSizeTable(props: any) {

    // states
    const [baseServingSize, setBaseServingSize] = useState<any>([]);
    const [unit, setUnit] = useState<string>("");

    function newServingSize(servingSize: any) {

        if (servingSize==="") servingSize=baseServingSize;

        const multiplier = servingSize/baseServingSize;
        props.newMultiplier(multiplier)
    }

    useEffect(() => {

        let servingSizeProps = props.servingSizeProps;  
        let paramHeaders: string[] = [];

        // save header titles
        for (let header in servingSizeProps) {
            paramHeaders.push(header);
        }

        // store the unit and the serving size
        paramHeaders.forEach((header) => {
            header === "amount" ? setBaseServingSize(servingSizeProps[header]) : setUnit(servingSizeProps[header])
        })
        
    }, [props])

    return <>
        <View style={{marginTop: 15}}>
            <Text>
                Serving Size
            </Text>
        </View>

        <View style={styles.view}>
            <Text style={{fontSize: 12, color: '#757577', fontWeight: '500', paddingRight: 10}}>Amount: </Text>
            <TextInput  style={styles.textInput}
                        selectionColor="#f7f7f7"  
                        keyboardType={"numeric"} 
                        returnKeyType="done" 
                        onSubmitEditing={(value) => newServingSize(value.nativeEvent.text) } 
                        placeholder={(baseServingSize*props.multiplier).toString()}></TextInput>
            <Text> {unit}</Text>
        </View>

    </>
}

const styles = StyleSheet.create({
    header: {
        fontSize: 12,
        textTransform: 'capitalize'
    },
    text: {
        fontSize: 12
    },
    textInput: {
        width: '15%',
        padding: 5,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#dadfe1'
    },
    view: {
        flexDirection: 'row',
        width: '98%',
        padding: 8,
        paddingLeft: 12,
        marginTop: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#dadfe1',
        alignItems: 'center'
    }
})