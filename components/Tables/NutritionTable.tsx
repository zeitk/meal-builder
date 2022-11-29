import { DataTable } from "react-native-paper";
import { ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

export default function NutritionTable(nutrition: any) {

    // nutrition states
    const [nutrients, setNutrients] = useState<any>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {

        let paramHeaders: string[] = [];
        let index = "";

        for (const i in nutrition) {

            index = i;

            // save header titles
            for (let header in nutrition[i][0]) {
                paramHeaders.push(header);
            }

        }
        if (index!=="") {

            // sort by name of nutrient
            nutrition[index].sort((a: any, b: any) => {

                    // have major macros go first
                    if (a.name==="Calories") return(-1)
                    else if (b.name==="Calories") return(1)
                    else if (a.name==="Protein") return(-1)
                    else if (b.name==="Protein") return(1)
                    else if (a.name==="Fat") return(-1)
                    else if (b.name==="Fat") return(1)
                    else if (a.name==="Carbohydrates") return(-1)
                    else if (b.name==="Carbohydrates") return(1)
                    
                    else return(a.name.localeCompare(b.name))
                });

            setNutrients(nutrition[index]);
            setTotal(nutrition[index].length);
            setHeaders(paramHeaders);
        }

    }, [nutrition])

    return <>
        <DataTable>
            <DataTable.Header>
                {
                    headers.map((header: string, i) => {
                        if (header==="percentOfDailyNeeds") header="Daily %"
                        return <DataTable.Title textStyle={styles.header} key={i} numeric={ header==="name" ? false : true}>{ header==="name" ? "Nutrient" : header}</DataTable.Title>
                    })
                }
            </DataTable.Header>
            
            {/* the rows should scroll*/}
            <ScrollView style={styles.view}>
            {
                // go through the array of nutrients, headers used as indexes to find values
                nutrients.map((nutrient: any, i: number) => {
                    return(
                        <DataTable.Row key={i}>
                            {
                                // have non-name items populate right side of cell to give more space to name
                                headers.map((header: string, j: number) => {
                                    return <DataTable.Cell key={j} textStyle={styles.text} numeric={ header==="name" ? false : true}>{nutrient[header]}</DataTable.Cell>
                                })
                            }
                        </DataTable.Row>
                    )
                })
            }
            </ScrollView>
        </DataTable>
    </>
}

const styles = StyleSheet.create({
    header: {
        fontSize: 12,
        textTransform: 'capitalize'
    },
    view: {
        height: 300
    },
    text: {
        fontSize: 12
    }
})