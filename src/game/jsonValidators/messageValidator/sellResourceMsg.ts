import { JTDDataType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { resourceIds } from "../dataValidator/validateResourceData.js";

const schemaSellResource = {
  properties: {
    type: {enum: ['sell_resource']},
    resource: {enum: resourceIds},
    amount: {type: 'uint32'}
  }
} as const

export type SellResourceMsg = JTDDataType<typeof schemaSellResource>

const validate = ajv.compile<SellResourceMsg>(schemaSellResource)
// type inference is not supported for JTDDataType yet
export function validateSellResourceMsg(data: any): SellResourceMsg | null{
  if(validate(data)) {
    console.log("SellResourceMsg is valid")
    return data as SellResourceMsg
  }else{
    console.log("SellResourceMsg not valid: ", validate.errors);
    return null
  }
}