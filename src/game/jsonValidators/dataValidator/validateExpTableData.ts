import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";

const schemaExpTable = {
  "properties": {
    "exp": {"values": { "type": "int32" }},
  },

  "optionalProperties": {},
  "additionalProperties": false
 
} as const

export type ExpTableData = JTDDataType<typeof schemaExpTable>
const validate = ajv.compile<ExpTableData>(schemaExpTable)

export function validateExpTableData (data: any): ExpTableData {

  if (validate(data)) {
    console.log("ExpTableData is valid")
    return data as ExpTableData
  } else{
    console.error("Error validating ExpTableData: ", validate.errors);
    throw new Error("Error validating ExpTableData");
  }
}
