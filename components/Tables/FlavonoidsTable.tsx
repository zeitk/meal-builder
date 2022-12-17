import { DataTable } from "react-native-paper";
import { ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import React from "react";

export default function FlavonoidsTable(flavonoidsProps: any) {

    // flavonoid states
    const [flavonoids, setFlavonoids] = useState<any>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {

        let paramHeaders: string[] = [];
        let index = "";
        
        for (const i in flavonoidsProps) {

            index = i;

            // save header titles
            for (let header in flavonoidsProps[i][0]) {
                paramHeaders.push(header);
            }

        }
        if (index!=="") {

            // sort by name of nutrient
            flavonoidsProps[index].sort((a: any, b: any) => a.name.localeCompare(b.name));
            setFlavonoids(flavonoidsProps[index]);
            setTotal(flavonoidsProps[index].length);
            setHeaders(paramHeaders);
        }

    }, [flavonoids])

    return <>
        <DataTable>
            <DataTable.Header>
                {
                    headers.map((header: string, i) => {
                        return <DataTable.Title textStyle={styles.header} key={i} numeric={ header==="name" ? false : true }>{ header==="name" ? "Flavonoid": header}</DataTable.Title>
                    })
                }
            </DataTable.Header>
            
            {/* the rows should scroll*/}
            <ScrollView style={styles.view}>
            {
                // go through the array of nutrients, headers used as indexes to find values
                flavonoids.map((flavonoid: any, i: number) => {
                    return(
                        <DataTable.Row key={i}>
                            {
                                // have non-name items populate right side of cell to give more space to name
                                headers.map((header: string, j: number) => {
                                    return <DataTable.Cell key={j} textStyle={styles.text} numeric={ header==="name" ? false : true }>{flavonoid[header]}</DataTable.Cell>
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