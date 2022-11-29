import { DataTable } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";

export default function ServingSizeTable(servingSizeProps: any) {

    // states
    const [servingSize, setServingSize] = useState<any>([]);
    const [headers, setHeaders] = useState<string[]>([]);

    useEffect(() => {

        let paramHeaders: string[] = [];
        let index = "";
        for (const i in servingSizeProps) {

            index = i;

            // save header titles
            for (let header in servingSizeProps[i]) {
                paramHeaders.push(header);
            }

        }
        if (index !== "") {
            setServingSize(servingSizeProps[index]);
            setHeaders(paramHeaders);
        }

    }, [servingSize])

    return <>
        <DataTable>
            <DataTable.Header>
                {
                    headers.map((header: string, i) => {
                        return <DataTable.Title textStyle={styles.header} key={i} numeric={true}>{header}</DataTable.Title>
                    })
                }
            </DataTable.Header>

            <DataTable.Row>
                {
                    headers.map((header: string, j: number) => {
                        return <DataTable.Cell key={j} textStyle={styles.text} numeric={true}>{servingSize[header]}</DataTable.Cell>
                    })
                }
            </DataTable.Row>

        </DataTable>
    </>
}

const styles = StyleSheet.create({
    header: {
        fontSize: 12,
        textTransform: 'capitalize'
    },
    text: {
        fontSize: 12
    }
})