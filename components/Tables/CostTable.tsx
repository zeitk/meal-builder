import React from "react";
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
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Cost</DataTable.Title>
                <DataTable.Title>Unit</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
                <DataTable.Cell>{val}</DataTable.Cell>
                <DataTable.Cell>{units}</DataTable.Cell>
            </DataTable.Row>
        </DataTable>
    </>
}