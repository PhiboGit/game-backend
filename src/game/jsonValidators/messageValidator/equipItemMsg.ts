import { JTDSchemaType } from "ajv/dist/jtd.js";
import { ajv } from "../ajvInstance.js";
import { EquipmentSlot, ProfessionId, equipmentSlots, professionIds } from "../../models/character/profession.js";

export type EquipItemMsg = {
  type: 'equip_item',
  itemId: string | null,
  profession: ProfessionId,
  equipmentSlot: EquipmentSlot
}

const schemaEquipItem: JTDSchemaType<EquipItemMsg> = {
  properties: {
    type: {enum: ['equip_item']},
    itemId: {type: 'string', nullable: true},
    profession: {enum: [...professionIds]},
    equipmentSlot: {enum: [...equipmentSlots]},
  }
} as const



const validate = ajv.compile<EquipItemMsg>(schemaEquipItem)
export function validateEquipItemMsg(data: any): EquipItemMsg | null{
  if(validate(data)) {
    console.log("EquipItemMsg is valid")
    return data as EquipItemMsg
  }else{
    console.log("EquipItemMsg not valid: ", validate.errors);
    return null
  }
}