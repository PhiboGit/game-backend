import { JTDSchemaType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { ProfessionId, professionIds } from "../../models/character/profession.js";

export type RequestProfessionStatsMsg = {
  type: 'request_professionStats',
  profession: ProfessionId,
}

const schemaEquipItem: JTDSchemaType<RequestProfessionStatsMsg> = {
  properties: {
    type: {enum: ['request_professionStats']},
    profession: {enum: [...professionIds]},
  }
} as const



const validate = ajv.compile<RequestProfessionStatsMsg>(schemaEquipItem)
export function validateRequestProfessionStatsMsg(data: any): RequestProfessionStatsMsg | null{
  if(validate(data)) {
    console.log("RequestProfessionStatsMsg is valid")
    return data as RequestProfessionStatsMsg
  }else{
    console.log("RequestProfessionStatsMsg not valid: ", validate.errors);
    return null
  }
}