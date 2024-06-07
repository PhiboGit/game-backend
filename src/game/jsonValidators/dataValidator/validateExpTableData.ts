import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import ExpTableDataJSON from "../../data/gameDataJSON/expTableData.json";

const schemaExpTable = {
  "properties": {
    "exp": {"values": { "type": "uint32" }},
  },

  "optionalProperties": {},
  "additionalProperties": false
 
} as const

export type ExpTableData = JTDDataType<typeof schemaExpTable>
const validate = ajv.compile<ExpTableData>(schemaExpTable)

function validateExpTableData (data: any): ExpTableData {

  if (validate(data)) {
    console.log("ExpTableData is valid")
    return data as ExpTableData
  } else{
    console.error("Error validating ExpTableData: ", validate.errors);
    throw new Error("Error validating ExpTableData");
  }
}

export const expTableData = validateExpTableData(ExpTableDataJSON)
