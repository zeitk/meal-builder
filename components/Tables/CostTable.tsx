import React from 'react'
import { StyleSheet, Text, View } from "react-native";
import { DataTable } from "react-native-paper";

export default function CostTable(cost: any) {
    let units = "N/A", val = "N/A";

    for (const i in cost) {
        for (const index in cost[i]) {
            if (index==="value") {  val = cost[i][index]; }
            else if (index==="unit") { units = cost[i][index]}
        }
    }

    return<>
        <View style={{marginTop: 20, marginBottom: 5}}>
            <Text>
                Cost
            </Text>
        </View>
        <DataTable>
            <DataTable.Header>
                <DataTable.Title textStyle={styles.text}>Cost</DataTable.Title>
                <DataTable.Title textStyle={styles.text}>Unit</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
                <DataTable.Cell textStyle={styles.text}>{val}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.text}>{units}</DataTable.Cell>
            </DataTable.Row>
        </DataTable>
    </>
}

const styles = StyleSheet.create({
    text: {
        fontSize: 12
    }
})